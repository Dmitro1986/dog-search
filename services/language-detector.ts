import { LanguageDetection } from '@/types/breed';
import { CONFIG } from '@/constants/api-constants';
import { normalizeSearchQuery } from '@/utils/string-utils';

export class LanguageDetector {
  private languagePatterns = {
    [CONFIG.LANGUAGES.EN]: /^[a-zA-Z\s]+$/,
    [CONFIG.LANGUAGES.RU]: /^[а-яА-ЯёЁ\s]+$/,
    [CONFIG.LANGUAGES.UK]: /^[а-щА-ЩЬьЮюЯяІіЇїЄєҐґ\s]+$/
  };

  async detect(text: string): Promise<LanguageDetection> {
    const normalizedText = normalizeSearchQuery(text);
    
    for (const [language, pattern] of Object.entries(this.languagePatterns)) {
      if (pattern.test(normalizedText)) {
        return {
          language,
          confidence: 1.0
        };
      }
    }

    // Если не удалось определить язык по паттернам,
    // предполагаем что это английский (может содержать цифры или спецсимволы)
    return {
      language: CONFIG.LANGUAGES.EN,
      confidence: 0.5
    };
  }
}
