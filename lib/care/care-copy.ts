export type CareLocale = 'en' | 'es'

export interface CareCopy {
  resultCard: {
    identityEyebrow: string
    issueEyebrow: string
    careSnapshot: string
    plantFallback: string
    photoAlt: string
    saveCta: string
  }
  careDetailLabels: {
    light: string
    water: string
    soil: string
    temperature: string
    upkeep: string
  }
  sections: {
    whatWeNoticed: string
    whatToDoToday: string
    whatNotToDo: string
    whenToCheckAgain: string
    careDetails: string
    saveToGardenSoon: string
    prevention: string
    treatmentChecklist: string
    checklistHint: string
    confidence: string
    howSure: string
    plantLooksFine: string
    somethingToWatch: string
    wateringRhythm: string
    sampleIdentityBanner: string
    identifyNoMatchBody: string
    identifyTrySample: string
    cameraUploadFromLibrary: string
    /** Dashboard legacy entry → Care Plant Identify */
    openPlantIdentify: string
    dashboardIdentifyHint: string
  }
  issueGuide: {
    eyebrow: string
    title: string
    description: string
    searchPlaceholder: string
    emptyTitle: string
    emptyBody: string
    openDetails: string
    closeSheet: string
    types: {
      fungal: string
      bacterial: string
      pest: string
      environmental: string
    }
    symptoms: string
    causes: string
    offlineNote: string
    pestLookupHint: string
    sampleEyebrow: string
    sampleIntro: string
  }
  urgency: {
    low: string
    medium: string
    high: string
  }
}

const EN: CareCopy = {
  resultCard: {
    identityEyebrow: 'Plant match',
    issueEyebrow: 'Care snapshot',
    careSnapshot: 'Care snapshot',
    plantFallback: 'Plant',
    photoAlt: 'Plant photo',
    saveCta: 'Save to garden',
  },
  careDetailLabels: {
    light: 'Light',
    water: 'Water',
    soil: 'Soil',
    temperature: 'Temperature',
    upkeep: 'Upkeep',
  },
  sections: {
    whatWeNoticed: 'What we noticed',
    whatToDoToday: 'What to do today',
    whatNotToDo: 'What not to do',
    whenToCheckAgain: 'When to check again',
    careDetails: 'Care details',
    saveToGardenSoon: 'Save to garden soon',
    prevention: 'Prevention for next time',
    treatmentChecklist: 'Gentle steps you can check off',
    checklistHint: 'Tap each line when you have done it. This stays on your phone for now.',
    confidence: 'Match confidence',
    howSure: 'How sure the match is',
    plantLooksFine: 'Plant looks fine from here',
    somethingToWatch: 'Something to keep an eye on',
    wateringRhythm: 'Watering rhythm (days)',
    sampleIdentityBanner:
      'Sample card only — not from your last photo. When plant lookup is connected, your own match will show here.',
    identifyNoMatchBody:
      'We could not confidently name this plant yet. Try a clearer photo of the leaves and stem.',
    identifyTrySample: 'See a sample card',
    cameraUploadFromLibrary: 'Upload from library instead',
    openPlantIdentify: 'Open Plant Identify',
    dashboardIdentifyHint:
      'Photo match and care notes now live under Care. Same calm card you see after a snapshot—just open Plant Identify there.',
  },
  issueGuide: {
    eyebrow: 'Care library',
    title: 'Plant issue guide',
    description:
      'Plain-language notes on common garden troubles. This is learning material, not a lab report. When in doubt, check with a local nursery.',
    searchPlaceholder: 'Search mildew, aphids, rot…',
    emptyTitle: 'No matches yet',
    emptyBody: 'Try a shorter word like “rot”, “bugs”, or “spots”.',
    openDetails: 'Open details',
    closeSheet: 'Close',
    types: {
      fungal: 'Fungal',
      bacterial: 'Bacterial',
      pest: 'Pest',
      environmental: 'Growing conditions',
    },
    symptoms: 'What it can look like',
    causes: 'Why it happens',
    offlineNote:
      'These notes live on your device for now. They are not a photo diagnosis—always double-check with a human you trust.',
    pestLookupHint:
      'Need outside articles or quick web answers? Use the Pest lookup tool in Care when you want search results.',
    sampleEyebrow: 'Sample card',
    sampleIntro: 'This is how a plant match card will look when we wire up saving to your garden.',
  },
  urgency: {
    low: 'Low priority',
    medium: 'Worth attention',
    high: 'Act soon',
  },
}

const ES: CareCopy = {
  resultCard: {
    identityEyebrow: 'Coincidencia de planta',
    issueEyebrow: 'Resumen de cuidado',
    careSnapshot: 'Resumen de cuidado',
    plantFallback: 'Planta',
    photoAlt: 'Foto de la planta',
    saveCta: 'Guardar en el jardín',
  },
  careDetailLabels: {
    light: 'Luz',
    water: 'Agua',
    soil: 'Suelo',
    temperature: 'Temperatura',
    upkeep: 'Mantenimiento',
  },
  sections: {
    whatWeNoticed: 'Lo que notamos',
    whatToDoToday: 'Qué hacer hoy',
    whatNotToDo: 'Qué evitar',
    whenToCheckAgain: 'Cuándo revisar de nuevo',
    careDetails: 'Detalles de cuidado',
    saveToGardenSoon: 'Guardar en el jardín pronto',
    prevention: 'Para la próxima vez',
    treatmentChecklist: 'Pasos suaves que puedes marcar',
    checklistHint: 'Toca cada línea cuando lo hayas hecho. Por ahora solo en tu teléfono.',
    confidence: 'Confianza del parecido',
    howSure: 'Qué tan seguro está el parecido',
    plantLooksFine: 'La planta se ve bien desde aquí',
    somethingToWatch: 'Algo que conviene vigilar',
    wateringRhythm: 'Ritmo de riego (días)',
    sampleIdentityBanner:
      'Solo tarjeta de ejemplo — no viene de tu última foto. Cuando la búsqueda de plantas esté conectada, aquí verás tu propia coincidencia.',
    identifyNoMatchBody:
      'Aún no pudimos nombrar esta planta con confianza. Prueba una foto más clara de las hojas y el tallo.',
    identifyTrySample: 'Ver una tarjeta de ejemplo',
    cameraUploadFromLibrary: 'Subir desde la galería',
    openPlantIdentify: 'Abrir identificar planta',
    dashboardIdentifyHint:
      'La coincidencia por foto y las notas de cuidado ahora están en Cuidado. Es la misma tarjeta tranquila—abre Identificar planta allí.',
  },
  issueGuide: {
    eyebrow: 'Biblioteca de cuidado',
    title: 'Guía de problemas de plantas',
    description:
      'Notas en palabras sencillas sobre molestias comunes del jardín. Es material para aprender, no un informe de laboratorio. Si dudas, pregunta en el vivero de tu zona.',
    searchPlaceholder: 'Busca oídio, pulgones, pudrición…',
    emptyTitle: 'Sin coincidencias',
    emptyBody: 'Prueba una palabra más corta como “pudrición”, “bichos” o “manchas”.',
    openDetails: 'Ver detalles',
    closeSheet: 'Cerrar',
    types: {
      fungal: 'Hongos',
      bacterial: 'Bacterias',
      pest: 'Plaga',
      environmental: 'Condiciones de cultivo',
    },
    symptoms: 'Cómo puede verse',
    causes: 'Por qué suele pasar',
    offlineNote:
      'Estas notas viven en tu dispositivo por ahora. No son un diagnóstico por foto—confirma con una persona de confianza.',
    pestLookupHint:
      '¿Quieres artículos de la web? Usa la herramienta de búsqueda de plagas en Cuidado cuando necesites resultados externos.',
    sampleEyebrow: 'Tarjeta de ejemplo',
    sampleIntro: 'Así se verá una tarjeta de coincidencia cuando conectemos el guardado en tu jardín.',
  },
  urgency: {
    low: 'Prioridad baja',
    medium: 'Conviene atender',
    high: 'Actuar pronto',
  },
}

const byLocale: Record<CareLocale, CareCopy> = {
  en: EN,
  es: ES,
}

/** Lightweight copy lookup — not a full i18n framework. */
export function getCareCopy(locale?: string | null): CareCopy {
  const normalized = locale?.toLowerCase() ?? 'en'
  if (normalized.startsWith('es')) return byLocale.es
  return byLocale.en
}
