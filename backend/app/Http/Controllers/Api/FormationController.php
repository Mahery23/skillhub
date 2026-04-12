<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Formation;
use App\Services\ActivityLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Gère les endpoints API des formations SkillHub.
 *
 * Cette couche expose le catalogue public et les opérations protégées
 * réservées aux formateurs propriétaires.
 */
class FormationController extends Controller
{
    public function __construct(
        private readonly ActivityLogService $activityLogService,
    ) {
    }

    private const CATEGORIES = [
        'Développement web',
        'Data',
        'Design',
        'Marketing',
        'DevOps',
    ];

    private const NIVEAUX = [
        'Débutant',
        'Intermédiaire',
        'Avancé',
    ];

    /**
     * Retourne la liste des formations avec filtres.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Formation::query()->with('formateur:id,nom')->withCount('inscriptions');

        $search = trim((string) $request->input('search', ''));
        $categorie = trim((string) $request->input('categorie', ''));
        $niveau = trim((string) $request->input('niveau', ''));

        if ($search !== '') {
            $query->where(function ($subQuery) use ($search): void {
                $subQuery->where('titre', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($categorie !== '') {
            $query->where('categorie', $categorie);
        }

        if ($niveau !== '') {
            $query->where('niveau', $niveau);
        }

        $formations = $query->orderByDesc('date_creation')->get();

        return response()->json([
            'data' => $formations->map(fn (Formation $formation) => $this->formatFormation($formation, false))->values(),
        ]);
    }

    /**
     * Affiche une formation et incrémente son compteur de vues.
     */
    public function show(Formation $formation): JsonResponse
    {
        $formation->increment('nombre_de_vues');
        $formation->refresh()->load(['formateur:id,nom', 'modules:id,formation_id,titre,contenu,ordre,date_creation'])->loadCount('inscriptions');

        $this->activityLogService->log('course_view', [
            'course_id' => $formation->id,
            'viewed_by' => auth('api')->id(),
        ]);

        return response()->json([
            'formation' => $this->formatFormation($formation, true),
        ]);
    }

    /**
     * Crée une formation pour le formateur connecté.
     */
    public function store(Request $request): JsonResponse
    {
        $this->ensureTrainer();

        $validated = $request->validate([
            'titre' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'categorie' => ['required', 'in:' . implode(',', self::CATEGORIES)],
            'niveau' => ['required', 'in:' . implode(',', self::NIVEAUX)],
        ]);

        $formation = Formation::create([
            ...$validated,
            'formateur_id' => auth('api')->id(),
            'nombre_de_vues' => 0,
        ]);

        $this->activityLogService->log('course_created', [
            'course_id' => $formation->id,
            'created_by' => auth('api')->id(),
            'values' => [
                'titre' => $formation->titre,
                'categorie' => $formation->categorie,
                'niveau' => $formation->niveau,
            ],
        ]);

        return response()->json([
            'message' => 'Formation created successfully',
            'formation' => $this->formatFormation($formation->load('formateur:id,nom'), true),
        ], 201);
    }

    /**
     * Met à jour une formation appartenant au formateur connecté.
     */
    public function update(Request $request, Formation $formation): JsonResponse
    {
        $this->ensureTrainer($formation);

        $oldValues = [
            'titre' => $formation->titre,
            'description' => $formation->description,
            'categorie' => $formation->categorie,
            'niveau' => $formation->niveau,
        ];

        $validated = $request->validate([
            'titre' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'categorie' => ['required', 'in:' . implode(',', self::CATEGORIES)],
            'niveau' => ['required', 'in:' . implode(',', self::NIVEAUX)],
        ]);

        $formation->update($validated);

        $this->activityLogService->log('course_update', [
            'course_id' => $formation->id,
            'updated_by' => auth('api')->id(),
            'old_values' => $oldValues,
            'new_values' => [
                'titre' => $formation->titre,
                'description' => $formation->description,
                'categorie' => $formation->categorie,
                'niveau' => $formation->niveau,
            ],
        ]);

        return response()->json([
            'message' => 'Formation updated successfully',
            'formation' => $this->formatFormation($formation->refresh()->load('formateur:id,nom'), true),
        ]);
    }

    /**
     * Supprime une formation appartenant au formateur connecté.
     */
    public function destroy(Formation $formation): JsonResponse
    {
        $this->ensureTrainer($formation);

        $this->activityLogService->log('course_deleted', [
            'course_id' => $formation->id,
            'deleted_by' => auth('api')->id(),
        ]);

        $formation->delete();

        return response()->json([
            'message' => 'Formation deleted successfully',
        ]);
    }

    /**
     * Vérifie que l'utilisateur connecté est bien un formateur propriétaire.
     */
    private function ensureTrainer(?Formation $formation = null): void
    {
        $user = auth('api')->user();

        abort_unless($user && $user->role === 'formateur', 403, 'Seul un formateur peut gérer les formations.');

        if ($formation) {
            abort_unless((int) $formation->formateur_id === (int) $user->id, 403, 'Vous ne pouvez gérer que vos propres formations.');
        }
    }

    /**
     * Normalise une formation pour la réponse JSON.
     *
     * @return array<string, mixed>
     */
    private function formatFormation(Formation $formation, bool $withDescription = true): array
    {
        $payload = [
            'id' => $formation->id,
            'titre' => $formation->titre,
            'niveau' => $formation->niveau,
            'categorie' => $formation->categorie,
            'vues' => $formation->nombre_de_vues,
            'apprenants' => (int) ($formation->inscriptions_count ?? 0),
            'formateur' => [
                'id' => $formation->formateur_id,
                'nom' => $formation->formateur?->nom,
            ],
            'date_creation' => $formation->date_creation,
        ];

        if ($withDescription) {
            $payload['description'] = $formation->description;
            $payload['modules'] = $formation->modules
                ->sortBy('ordre')
                ->values()
                ->map(fn ($module) => [
                    'id' => $module->id,
                    'titre' => $module->titre,
                    'contenu' => $module->contenu,
                    'ordre' => $module->ordre,
                ]);
        } else {
            $payload['mini_description'] = str($formation->description)->limit(120);
        }

        return $payload;
    }
}

