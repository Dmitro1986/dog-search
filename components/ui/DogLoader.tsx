export function DogLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      {/* Морда собачки */}
      <svg className="w-20 h-20" viewBox="0 0 80 80" fill="none">
        {/* Голова */}
        <ellipse cx="40" cy="40" rx="28" ry="26" fill="#F5E3C3" />
        {/* Уши */}
        <ellipse cx="18" cy="25" rx="8" ry="16" fill="#B88764" />
        <ellipse cx="62" cy="25" rx="8" ry="16" fill="#B88764" />
        {/* Морда */}
        <ellipse cx="40" cy="55" rx="12" ry="9" fill="#FFF" />
        {/* Нос */}
        <ellipse cx="40" cy="54" rx="3" ry="2" fill="#222" />
        {/* Глаза */}
        <ellipse cx="32" cy="42" rx="2" ry="3" fill="#222" />
        <ellipse cx="48" cy="42" rx="2" ry="3" fill="#222" />
        {/* Рот */}
        <path d="M35 59 Q40 62 45 59" stroke="#B88764" strokeWidth="2" fill="none" />
      </svg>
      {/* Анимированная косточка */}
      <svg
        className="w-10 h-10 mt-2 animate-bounce"
        viewBox="0 0 40 20"
        fill="none"
        style={{ animationDuration: '1s' }}
      >
        {/* Косточка */}
        <ellipse cx="8" cy="10" rx="6" ry="6" fill="#fff" />
        <ellipse cx="32" cy="10" rx="6" ry="6" fill="#fff" />
        <rect x="8" y="4" width="24" height="12" rx="6" fill="#fff" />
        <rect x="14" y="8" width="12" height="4" rx="2" fill="#FFE09F" />
      </svg>
      <span className="mt-4 text-gray-600 text-base">Поиск породы...</span>
    </div>
  );
}
