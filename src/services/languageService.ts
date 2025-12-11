/**
 * Multi-Language Support Service
 * Translate UI and recipes to different languages
 */

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja';

const LANGUAGE_STORAGE_KEY = 'recipe_app_language';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

/**
 * Supported languages
 */
export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
];

/**
 * UI Translations
 */
const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Navigation
    'home': 'Home',
    'my_recipes': 'My Recipes',
    'settings': 'Settings',
    
    // Main screen
    'dont_know': "🤷 I Don't Know What to Make",
    'pick_category': 'Or Pick a Category:',
    'breakfast': 'Breakfast',
    'lunch': 'Lunch',
    'dinner': 'Dinner',
    'snacks': 'Snacks',
    'dessert': 'Dessert',
    'surprise_me': 'Surprise Me!',
    
    // Recipe view
    'ingredients': 'Ingredients',
    'get_these_items': 'Get These Items:',
    'tools_needed': 'Tools You Need:',
    'ready_to_cook': 'Ready to Cook?',
    'next_step': 'NEXT STEP',
    'go_back': 'Go Back',
    'step_of': 'Step {current} of {total}',
    'last_step': 'Last step! Almost done!',
    'steps_to_go': '{count} more steps to go!',
    
    // Controls
    'read_to_me': 'Read to Me',
    'listening': 'Listening...',
    'voice_commands': 'Voice Commands',
    'timer': 'Timer',
    'min': 'min',
    'stop_timer': 'Stop Timer',
    
    // Actions
    'save_recipe': 'Save Recipe',
    'saved': 'Saved',
    'share_recipe': 'Share Recipe',
    'print': 'Print',
    'copy_link': 'Copy Link',
    'all_done': 'All Done!',
    'start_new': 'Start New Search',
    
    // Emergency
    'need_help': 'Need Help?',
    'safety_first': 'Safety First!',
    'turn_off_stove': 'Turn OFF the stove/oven',
    'run_cold_water': 'Run cold water on burns',
    'leave_if_gas': 'Leave if you smell gas',
    'call_911': 'Call 911 for emergencies',
    
    // Rating
    'how_did_it_go': 'Great job! How did it go?',
    'tap_to_rate': 'Tap a star to rate',
    'better_next_time': "We'll make it better next time!",
    'nice_work': 'Nice work!',
    'star_chef': "Amazing! You're a star chef!",
    'save_finish': 'Save & Finish',
    'skip_finish': 'Skip & Finish',
    
    // Nutrition
    'nutrition': 'Nutrition',
    'show_nutrition': 'Show Nutrition',
    'hide_nutrition': 'Hide Nutrition',
    'per_serving': 'Per Serving',
    'calories': 'Calories',
    'protein': 'Protein',
    'carbs': 'Carbs',
    'fat': 'Fat',
    
    // Scaling
    'servings': 'Servings',
    
    // Onboarding
    'welcome': 'Welcome!',
    'skip': 'Skip',
    'next': 'Next',
    'done': 'Done',
    'show_tutorial': 'Show Tutorial',
    
    // Theme
    'theme': 'Theme',
    'light_mode': 'Light Mode',
    'dark_mode': 'Dark Mode',
    'high_contrast': 'High Contrast',
    
    // Misc
    'loading': 'Loading...',
    'error': 'Error',
    'try_again': 'Try Again',
    'close': 'Close',
    'cancel': 'Cancel',
    'confirm': 'Confirm',
  },
  es: {
    // Navigation
    'home': 'Inicio',
    'my_recipes': 'Mis Recetas',
    'settings': 'Ajustes',
    
    // Main screen
    'dont_know': '🤷 No sé qué hacer',
    'pick_category': 'O elige una categoría:',
    'breakfast': 'Desayuno',
    'lunch': 'Almuerzo',
    'dinner': 'Cena',
    'snacks': 'Bocadillos',
    'dessert': 'Postre',
    'surprise_me': '¡Sorpréndeme!',
    
    // Recipe view
    'ingredients': 'Ingredientes',
    'get_these_items': 'Consigue estos artículos:',
    'tools_needed': 'Herramientas necesarias:',
    'ready_to_cook': '¿Listo para cocinar?',
    'next_step': 'SIGUIENTE PASO',
    'go_back': 'Volver',
    'step_of': 'Paso {current} de {total}',
    'last_step': '¡Último paso! ¡Casi terminado!',
    'steps_to_go': '¡{count} pasos más!',
    
    // Controls
    'read_to_me': 'Léemelo',
    'listening': 'Escuchando...',
    'voice_commands': 'Comandos de voz',
    'timer': 'Temporizador',
    'min': 'min',
    'stop_timer': 'Detener',
    
    // Actions
    'save_recipe': 'Guardar receta',
    'saved': 'Guardado',
    'share_recipe': 'Compartir receta',
    'print': 'Imprimir',
    'copy_link': 'Copiar enlace',
    'all_done': '¡Todo listo!',
    'start_new': 'Nueva búsqueda',
    
    // Emergency
    'need_help': '¿Necesitas ayuda?',
    'safety_first': '¡Seguridad primero!',
    'turn_off_stove': 'Apaga la estufa/horno',
    'run_cold_water': 'Pon agua fría en las quemaduras',
    'leave_if_gas': 'Sal si hueles gas',
    'call_911': 'Llama al 911 para emergencias',
    
    // Rating
    'how_did_it_go': '¡Buen trabajo! ¿Cómo te fue?',
    'tap_to_rate': 'Toca una estrella para calificar',
    'better_next_time': '¡Lo haremos mejor la próxima vez!',
    'nice_work': '¡Buen trabajo!',
    'star_chef': '¡Increíble! ¡Eres un chef estrella!',
    'save_finish': 'Guardar y terminar',
    'skip_finish': 'Omitir y terminar',
    
    // Nutrition
    'nutrition': 'Nutrición',
    'show_nutrition': 'Mostrar nutrición',
    'hide_nutrition': 'Ocultar nutrición',
    'per_serving': 'Por porción',
    'calories': 'Calorías',
    'protein': 'Proteína',
    'carbs': 'Carbohidratos',
    'fat': 'Grasa',
    
    // Scaling
    'servings': 'Porciones',
    
    // Onboarding
    'welcome': '¡Bienvenido!',
    'skip': 'Omitir',
    'next': 'Siguiente',
    'done': 'Listo',
    'show_tutorial': 'Ver tutorial',
    
    // Theme
    'theme': 'Tema',
    'light_mode': 'Modo claro',
    'dark_mode': 'Modo oscuro',
    'high_contrast': 'Alto contraste',
    
    // Misc
    'loading': 'Cargando...',
    'error': 'Error',
    'try_again': 'Intentar de nuevo',
    'close': 'Cerrar',
    'cancel': 'Cancelar',
    'confirm': 'Confirmar',
  },
  fr: {
    // Navigation
    'home': 'Accueil',
    'my_recipes': 'Mes Recettes',
    'settings': 'Paramètres',
    
    // Main screen
    'dont_know': '🤷 Je ne sais pas quoi faire',
    'pick_category': 'Ou choisissez une catégorie:',
    'breakfast': 'Petit-déjeuner',
    'lunch': 'Déjeuner',
    'dinner': 'Dîner',
    'snacks': 'Collations',
    'dessert': 'Dessert',
    'surprise_me': 'Surprenez-moi!',
    
    // Recipe view
    'ingredients': 'Ingrédients',
    'get_these_items': 'Obtenez ces articles:',
    'tools_needed': 'Outils nécessaires:',
    'ready_to_cook': 'Prêt à cuisiner?',
    'next_step': 'ÉTAPE SUIVANTE',
    'go_back': 'Retour',
    'step_of': 'Étape {current} sur {total}',
    'last_step': 'Dernière étape! Presque fini!',
    'steps_to_go': 'Encore {count} étapes!',
    
    // Controls
    'read_to_me': 'Lis-moi',
    'listening': 'Écoute...',
    'voice_commands': 'Commandes vocales',
    'timer': 'Minuteur',
    'min': 'min',
    'stop_timer': 'Arrêter',
    
    // Actions
    'save_recipe': 'Sauvegarder',
    'saved': 'Sauvegardé',
    'share_recipe': 'Partager',
    'print': 'Imprimer',
    'copy_link': 'Copier le lien',
    'all_done': 'Terminé!',
    'start_new': 'Nouvelle recherche',
    
    // Emergency
    'need_help': "Besoin d'aide?",
    'safety_first': 'La sécurité avant tout!',
    'turn_off_stove': 'Éteignez la cuisinière',
    'run_cold_water': "Passez de l'eau froide sur les brûlures",
    'leave_if_gas': 'Sortez si vous sentez le gaz',
    'call_911': 'Appelez le 911 pour les urgences',
    
    // Rating
    'how_did_it_go': 'Bravo! Comment ça s\'est passé?',
    'tap_to_rate': 'Touchez une étoile pour noter',
    'better_next_time': 'On fera mieux la prochaine fois!',
    'nice_work': 'Bon travail!',
    'star_chef': 'Incroyable! Vous êtes un chef étoilé!',
    'save_finish': 'Sauvegarder et terminer',
    'skip_finish': 'Passer et terminer',
    
    // Nutrition
    'nutrition': 'Nutrition',
    'show_nutrition': 'Afficher nutrition',
    'hide_nutrition': 'Masquer nutrition',
    'per_serving': 'Par portion',
    'calories': 'Calories',
    'protein': 'Protéines',
    'carbs': 'Glucides',
    'fat': 'Lipides',
    
    // Scaling
    'servings': 'Portions',
    
    // Onboarding
    'welcome': 'Bienvenue!',
    'skip': 'Passer',
    'next': 'Suivant',
    'done': 'Terminé',
    'show_tutorial': 'Voir le tutoriel',
    
    // Theme
    'theme': 'Thème',
    'light_mode': 'Mode clair',
    'dark_mode': 'Mode sombre',
    'high_contrast': 'Contraste élevé',
    
    // Misc
    'loading': 'Chargement...',
    'error': 'Erreur',
    'try_again': 'Réessayer',
    'close': 'Fermer',
    'cancel': 'Annuler',
    'confirm': 'Confirmer',
  },
  de: {
    'home': 'Startseite',
    'my_recipes': 'Meine Rezepte',
    'dont_know': '🤷 Ich weiß nicht, was ich machen soll',
    'pick_category': 'Oder wählen Sie eine Kategorie:',
    'breakfast': 'Frühstück',
    'lunch': 'Mittagessen',
    'dinner': 'Abendessen',
    'snacks': 'Snacks',
    'dessert': 'Nachtisch',
    'ready_to_cook': 'Bereit zum Kochen?',
    'next_step': 'NÄCHSTER SCHRITT',
    'go_back': 'Zurück',
    'all_done': 'Fertig!',
    'loading': 'Wird geladen...',
    'close': 'Schließen',
    // Add more as needed
  },
  zh: {
    'home': '首页',
    'my_recipes': '我的食谱',
    'dont_know': '🤷 我不知道做什么',
    'pick_category': '或选择一个类别：',
    'breakfast': '早餐',
    'lunch': '午餐',
    'dinner': '晚餐',
    'snacks': '小吃',
    'dessert': '甜点',
    'ready_to_cook': '准备好烹饪了吗？',
    'next_step': '下一步',
    'go_back': '返回',
    'all_done': '完成！',
    'loading': '加载中...',
    'close': '关闭',
    // Add more as needed
  },
  ja: {
    'home': 'ホーム',
    'my_recipes': '私のレシピ',
    'dont_know': '🤷 何を作ればいいかわからない',
    'pick_category': 'またはカテゴリを選択：',
    'breakfast': '朝食',
    'lunch': '昼食',
    'dinner': '夕食',
    'snacks': 'おやつ',
    'dessert': 'デザート',
    'ready_to_cook': '料理を始めますか？',
    'next_step': '次のステップ',
    'go_back': '戻る',
    'all_done': '完了！',
    'loading': '読み込み中...',
    'close': '閉じる',
    // Add more as needed
  },
};

/**
 * Get saved language preference
 */
export function getSavedLanguage(): SupportedLanguage {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguage;
    if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
      return saved;
    }
    // Try to detect from browser
    const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
    if (SUPPORTED_LANGUAGES.some(l => l.code === browserLang)) {
      return browserLang;
    }
    return 'en';
  } catch {
    return 'en';
  }
}

/**
 * Save language preference
 */
export function saveLanguage(lang: SupportedLanguage): void {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch (error) {
    console.error('Failed to save language preference:', error);
  }
}

/**
 * Translate a key to the current language
 */
export function translate(key: string, lang: SupportedLanguage, params?: Record<string, string | number>): string {
  const translations = TRANSLATIONS[lang] || TRANSLATIONS.en;
  let text = translations[key] || TRANSLATIONS.en[key] || key;
  
  // Replace parameters like {current} and {total}
  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      text = text.replace(`{${param}}`, String(value));
    });
  }
  
  return text;
}

/**
 * Create a translation function for a specific language
 */
export function createTranslator(lang: SupportedLanguage) {
  return (key: string, params?: Record<string, string | number>) => translate(key, lang, params);
}

/**
 * Get language info by code
 */
export function getLanguageInfo(code: SupportedLanguage): LanguageInfo | undefined {
  return SUPPORTED_LANGUAGES.find(l => l.code === code);
}

/**
 * Get voice recognition language code
 * Different from display language code for speech recognition
 */
export function getVoiceRecognitionLang(lang: SupportedLanguage): string {
  const langMap: Record<SupportedLanguage, string> = {
    'en': 'en-US',
    'es': 'es-ES',
    'fr': 'fr-FR',
    'de': 'de-DE',
    'zh': 'zh-CN',
    'ja': 'ja-JP',
  };
  return langMap[lang] || 'en-US';
}

/**
 * Get text-to-speech language code
 */
export function getSpeechSynthesisLang(lang: SupportedLanguage): string {
  return getVoiceRecognitionLang(lang);
}
