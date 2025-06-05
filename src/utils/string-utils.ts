/**
 * Нормализует поисковый запрос: приводит к нижнему регистру и убирает пробелы по краям
 */
export function normalizeSearchQuery(query: string): string {
  return query.toLowerCase().trim();
}

/**
 * Выполняет нечеткое сравнение двух строк
 * Возвращает значение от 0 до 1, где 1 - полное совпадение
 */
export function fuzzyMatch(str1: string, str2: string): number {
  const s1 = normalizeSearchQuery(str1);
  const s2 = normalizeSearchQuery(str2);
  
  if (s1 === s2) return 1;
  if (s1.includes(s2) || s2.includes(s1)) return 0.9;
  
  return levenshteinDistance(s1, s2);
}

/**
 * Вычисляет расстояние Левенштейна между двумя строками
 * и нормализует результат в диапазоне от 0 до 1
 */
function levenshteinDistance(str1: string, str2: string): number {
  const track = Array(str2.length + 1).fill(null).map(() =>
    Array(str1.length + 1).fill(null)
  );
  
  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i;
  }
  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator
      );
    }
  }

  return 1 - track[str2.length][str1.length] / Math.max(str1.length, str2.length);
}
