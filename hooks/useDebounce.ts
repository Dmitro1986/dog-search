import { LanguageDetection } from '@/types/breed';
import { CONFIG } from '@/constants/api-constants';

export class LanguageDetector {
  static detect(text: string): LanguageDetection {
    const patterns = {
      [CONFIG.LANGUAGES.UK]: /[ґєії]/i,
      [CONFIG.LANGUAGES.RU]: /[а-яё]/i,
      [CONFIG.LANGUAGES.EN]: /^[a-z\s]+$/i
    };

    for (const [lang, pattern] of Object.entries(patterns)) {
      if (pattern.test(text)) {
        return { language: lang, confidence: 0.9 };
      }
    }

    return { language: CONFIG.LANGUAGES.EN, confidence: 0.5 };
  }
}
