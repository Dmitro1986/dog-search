// This file maps dog breeds to their image URLs
// In a real application, you would use actual image URLs

const dogImages: Record<string, string> = {
  Лабрадор: "/dog-images/labrador.jpg",
  "Немецкая овчарка": "/dog-images/german-shepherd.jpg",
  Хаски: "/dog-images/husky.jpg",
  Бульдог: "/dog-images/bulldog.jpg",
  Пудель: "/dog-images/poodle.jpg",
  "Сиба-ину": "/dog-images/shiba-inu.jpg",
  Корги: "/dog-images/corgi.jpg",
  Доберман: "/dog-images/doberman.jpg",
}

export function getDogImageUrl(breedName: string): string {
  return dogImages[breedName] || `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(breedName)}`
}
