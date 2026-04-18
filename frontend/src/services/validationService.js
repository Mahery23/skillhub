const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/
const TEXT_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s'".,!?():;\-/+&]+$/

const normalizeText = (value) => (typeof value === 'string' ? value.trim() : '')

const validateEmail = (email, errors) => {
  if (!email) {
    errors.push('Email obligatoire.')
    return
  }

  if (!EMAIL_REGEX.test(email)) {
    errors.push('Format email invalide.')
  }

  if (email.length > 120) {
    errors.push('Email trop long (max 120 caractères).')
  }
}

const validatePassword = (password, errors) => {
  if (!password) {
    errors.push('Mot de passe obligatoire.')
    return
  }

  if (password.length < 8 || password.length > 64) {
    errors.push('Le mot de passe doit contenir entre 8 et 64 caractères.')
  }

  if (/\s/.test(password)) {
    errors.push('Le mot de passe ne doit pas contenir d\'espace.')
  }

  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir une minuscule et une majuscule.')
  }

  if (!/\d/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre.')
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial.')
  }
}

const hasUnsafeCharacters = (value) => /[<>`{}]/.test(value)

export const validateLoginInput = ({ email, password }) => {
  const errors = []
  validateEmail(normalizeText(email), errors)

  if (!password) {
    errors.push('Mot de passe obligatoire.')
  }

  return errors
}

export const validateRegisterInput = ({ name, email, password, role }) => {
  const errors = []
  const safeName = normalizeText(name)

  if (!safeName) {
    errors.push('Nom obligatoire.')
  } else {
    if (safeName.length < 2 || safeName.length > 80) {
      errors.push('Le nom doit contenir entre 2 et 80 caractères.')
    }

    if (!NAME_REGEX.test(safeName)) {
      errors.push('Le nom contient des caractères non autorisés.')
    }
  }

  validateEmail(normalizeText(email), errors)
  validatePassword(password, errors)

  if (!['apprenant', 'formateur'].includes(role)) {
    errors.push('Rôle invalide.')
  }

  return errors
}

export const validateFormationInput = ({ titre, description }) => {
  const errors = []
  const safeTitle = normalizeText(titre)
  const safeDescription = normalizeText(description)

  if (!safeTitle) {
    errors.push('Titre obligatoire.')
  } else {
    if (safeTitle.length < 3 || safeTitle.length > 120) {
      errors.push('Le titre doit contenir entre 3 et 120 caractères.')
    }

    if (!TEXT_REGEX.test(safeTitle) || hasUnsafeCharacters(safeTitle)) {
      errors.push('Le titre contient des caractères non autorisés.')
    }
  }

  if (!safeDescription) {
    errors.push('Description obligatoire.')
  } else {
    if (safeDescription.length < 20 || safeDescription.length > 2000) {
      errors.push('La description doit contenir entre 20 et 2000 caractères.')
    }

    if (hasUnsafeCharacters(safeDescription)) {
      errors.push('La description contient des caractères non autorisés.')
    }
  }

  return errors
}

export const validateModuleInput = ({ titre, contenu, ordre }) => {
  const errors = []
  const safeTitle = normalizeText(titre)
  const safeContent = normalizeText(contenu)

  if (!ordre || Number.isNaN(Number(ordre)) || Number(ordre) < 1) {
    errors.push('Position du module invalide.')
  }

  if (!safeTitle) {
    errors.push('Titre du module obligatoire.')
  } else {
    if (safeTitle.length < 3 || safeTitle.length > 120) {
      errors.push('Le titre du module doit contenir entre 3 et 120 caractères.')
    }

    if (!TEXT_REGEX.test(safeTitle) || hasUnsafeCharacters(safeTitle)) {
      errors.push('Le titre du module contient des caractères non autorisés.')
    }
  }

  if (!safeContent) {
    errors.push('Contenu du module obligatoire.')
  } else {
    if (safeContent.length < 20 || safeContent.length > 5000) {
      errors.push('Le contenu du module doit contenir entre 20 et 5000 caractères.')
    }

    if (hasUnsafeCharacters(safeContent)) {
      errors.push('Le contenu du module contient des caractères non autorisés.')
    }
  }

  return errors
}

