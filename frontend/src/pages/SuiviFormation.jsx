import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'

const FORMATIONS = [
  { id: 1, titre: "Introduction à React", niveau: "Débutant", description: "Apprenez les bases de React.js et construisez vos premières interfaces modernes.", modules: [
      { ordre: 1, titre: "Introduction et installation", texte: "React est une bibliothèque JavaScript pour construire des interfaces utilisateur. Dans ce module, nous allons installer Node.js, créer notre premier projet avec Vite et comprendre la structure d'un projet React." },
      { ordre: 2, titre: "Les composants React", texte: "Un composant React est une fonction JavaScript qui retourne du JSX. Dans ce module, nous allons créer nos premiers composants, comprendre la différence entre composants fonctionnels et de classe." },
      { ordre: 3, titre: "Le state et les props", texte: "Le state permet de gérer les données locales d'un composant. Les props permettent de passer des données entre composants. Nous allons pratiquer avec des exemples concrets." },
      { ordre: 4, titre: "Les hooks essentiels", texte: "useState, useEffect, useContext... Les hooks sont la façon moderne de gérer l'état et les effets de bord dans React. Ce module couvre les hooks les plus utilisés." },
      { ordre: 5, titre: "Projet final", texte: "Dans ce module, nous allons construire une mini-application complète en React en appliquant tout ce que nous avons appris dans les modules précédents." },
    ]},
  { id: 2, titre: "Laravel & API REST", niveau: "Intermédiaire", description: "Construisez une API REST complète avec authentification JWT.", modules: [
      { ordre: 1, titre: "Installation et configuration", texte: "Installation de Laravel via Composer, configuration de l'environnement .env, connexion à MySQL et premiers tests avec Artisan." },
      { ordre: 2, titre: "Migrations et modèles", texte: "Les migrations permettent de versionner la structure de la base de données. Les modèles Eloquent permettent d'interagir avec les tables de façon orientée objet." },
      { ordre: 3, titre: "Contrôleurs et routes", texte: "Les contrôleurs gèrent la logique métier. Les routes définissent les endpoints de l'API. Nous allons créer notre premier CRUD complet." },
      { ordre: 4, titre: "Authentification JWT", texte: "JWT (JSON Web Token) permet de sécuriser les routes de l'API. Nous allons implémenter l'inscription, la connexion et la protection des routes." },
      { ordre: 5, titre: "Tests unitaires", texte: "PHPUnit permet de tester les fonctionnalités de l'API. Nous allons écrire des tests pour les endpoints principaux et vérifier les permissions." },
    ]},
  { id: 4, titre: "UI/UX Design Figma", niveau: "Débutant", description: "Créez des interfaces utilisateur modernes et intuitives avec Figma.", modules: [
      { ordre: 1, titre: "Prise en main de Figma", texte: "Découverte de l'interface Figma, les outils de base, les frames, les formes et le texte. Création de votre premier écran." },
      { ordre: 2, titre: "Wireframes et zoning", texte: "Le wireframe est la squelette d'une interface. Nous allons apprendre à structurer une page avant de la designer." },
      { ordre: 3, titre: "Design system", texte: "Un design system est un ensemble de composants réutilisables. Nous allons créer notre propre design system avec couleurs, typographies et composants." },
      { ordre: 4, titre: "Prototypage interactif", texte: "Figma permet de créer des prototypes cliquables. Nous allons lier nos écrans et simuler une vraie navigation." },
    ]},
]

function SuiviFormation({ user }) {
  const { id } = useParams()
  const formation = FORMATIONS.find(f => f.id === parseInt(id))

  const [moduleActif, setModuleActif]       = useState(0)
  const [modulesTermines, setModulesTermines] = useState([])

  if (!user) return <Navigate to="/" />
  if (!formation) return (
      <div className="container py-5 text-center">
        <h2 className="sh-section-title mb-3">Formation introuvable</h2>
        <Link to="/dashboard/apprenant" className="sh-btn sh-btn--outline">
          Retour au dashboard
        </Link>
      </div>
  )

  const progression = Math.round((modulesTermines.length / formation.modules.length) * 100)

  const toggleTermine = (ordre) => {
    setModulesTermines(prev =>
        prev.includes(ordre)
            ? prev.filter(o => o !== ordre)
            : [...prev, ordre]
    )
  }

  const moduleCourant = formation.modules[moduleActif]

  return (
      <div>
        {/* En-tête */}
        <section className="sh-section--dark py-4">
          <div className="container">
            <Link
                to="/dashboard/apprenant"
                className="small mb-3 d-inline-block"
                style={{ color: 'var(--brand-soft)', textDecoration: 'none' }}
            >
              ← Retour au dashboard
            </Link>
            <h1 className="sh-section-title--light mb-2">{formation.titre}</h1>
            <p className="sh-section-sub--light mb-3">{formation.description}</p>

            {/* Barre de progression */}
            <div style={{ maxWidth: 400 }}>
              <div className="d-flex justify-content-between mb-1">
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Progression globale</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{progression}%</span>
              </div>
              <div style={{ height: 8, background: 'rgba(255,255,255,0.15)', borderRadius: 999 }}>
                <div style={{
                  height: '100%',
                  width: `${progression}%`,
                  background: progression === 100 ? '#4ade80' : 'var(--brand-soft)',
                  borderRadius: 999,
                  transition: 'width 0.4s ease',
                }} />
              </div>
              {progression === 100 && (
                  <p className="mt-2" style={{ fontSize: 13, color: '#4ade80', fontWeight: 600 }}>
                    Félicitations, vous avez terminé cette formation !
                  </p>
              )}
            </div>
          </div>
        </section>

        {/* Contenu principal */}
        <section className="sh-section">
          <div className="container">
            <div className="row g-4">

              {/* Liste des modules — sidebar */}
              <div className="col-lg-4">
                <h2 className="sh-section-title mb-3" style={{ fontSize: 18 }}>Modules</h2>
                <div className="d-flex flex-column gap-2">
                  {formation.modules.map((module, index) => {
                    const estTermine = modulesTermines.includes(module.ordre)
                    const estActif   = moduleActif === index
                    return (
                        <div
                            key={module.ordre}
                            onClick={() => setModuleActif(index)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 12,
                              padding: '12px 16px', borderRadius: 'var(--radius-md)',
                              border: `1.5px solid ${estActif ? 'var(--brand-main)' : 'var(--brand-border)'}`,
                              background: estActif ? 'var(--brand-ice)' : 'var(--bg-white)',
                              cursor: 'pointer', transition: 'all 0.2s',
                            }}
                        >
                          {/* Icône état */}
                          <div style={{
                            width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, fontWeight: 700,
                            background: estTermine ? 'var(--green-bg)' : estActif ? 'var(--brand-main)' : 'var(--brand-border)',
                            color: estTermine ? 'var(--green-text)' : estActif ? '#fff' : 'var(--text-muted)',
                          }}>
                            {estTermine ? '✓' : module.ordre}
                          </div>
                          <span style={{
                            fontSize: 13, fontWeight: estActif ? 600 : 400,
                            color: estActif ? 'var(--brand-deep)' : 'var(--text-secondary)',
                          }}>
                        {module.titre}
                      </span>
                        </div>
                    )
                  })}
                </div>
              </div>

              {/* Contenu du module actif */}
              <div className="col-lg-8">
                <div
                    className="p-4 rounded-4"
                    style={{
                      background: 'var(--bg-white)',
                      border: '1px solid var(--brand-border)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                >
                  {/* Header module */}
                  <div className="d-flex align-items-center gap-3 mb-4 pb-3"
                       style={{ borderBottom: '1px solid var(--brand-border)' }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'var(--brand-ice)', color: 'var(--brand-main)',
                      fontSize: 15, fontWeight: 700,
                    }}>
                      {moduleCourant.ordre}
                    </div>
                    <div>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 2 }}>
                        Module {moduleCourant.ordre} / {formation.modules.length}
                      </p>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--brand-deep)', margin: 0 }}>
                        {moduleCourant.titre}
                      </h3>
                    </div>
                  </div>

                  {/* Texte du module */}
                  <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 32 }}>
                    {moduleCourant.texte}
                  </p>

                  {/* Actions navigation */}
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div className="d-flex gap-2">
                      <button
                          className="sh-btn sh-btn--outline"
                          style={{ fontSize: 13 }}
                          disabled={moduleActif === 0}
                          onClick={() => setModuleActif(prev => prev - 1)}
                      >
                        ← Précédent
                      </button>
                      <button
                          className="sh-btn sh-btn--outline"
                          style={{ fontSize: 13 }}
                          disabled={moduleActif === formation.modules.length - 1}
                          onClick={() => setModuleActif(prev => prev + 1)}
                      >
                        Suivant →
                      </button>
                    </div>

                    <button
                        className="sh-btn"
                        style={{
                          fontSize: 13,
                          background: modulesTermines.includes(moduleCourant.ordre) ? 'var(--green-bg)' : 'var(--brand-main)',
                          color: modulesTermines.includes(moduleCourant.ordre) ? 'var(--green-text)' : '#fff',
                          borderRadius: 999,
                        }}
                        onClick={() => toggleTermine(moduleCourant.ordre)}
                    >
                      {modulesTermines.includes(moduleCourant.ordre) ? '✓ Terminé' : 'Marquer comme terminé'}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>
  )
}

export default SuiviFormation