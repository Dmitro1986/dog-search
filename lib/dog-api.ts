/** @format */

// This is a mock API for dog breeds
// In a real application, you would connect to actual APIs

// Update the DogBreed interface to include an image URL
export interface DogBreed {
  name: string;
  origin: string;
  temperament: string;
  lifeSpan: string;
  description: string;
  imageUrl: string;
}

// Update the dogBreeds array to include image URLs
const dogBreeds: DogBreed[] = [
  {
    name: "Немецкая овчарка",
    origin: "Германия",
    temperament: "Умный, преданный, уверенный",
    lifeSpan: "9-13 лет",
    description:
      "Немецкая овчарка — порода собак, изначально использовавшаяся как пастушья и служебно-розыскная собака.",
    imageUrl: "/placeholder.svg?height=300&width=400&text=Немецкая+овчарка",
  },
  {
    name: "Хаски",
    origin: "Сибирь",
    temperament: "Дружелюбный, энергичный, общительный",
    lifeSpan: "12-15 лет",
    description:
      "Сибирский хаски — заводская специализированная порода собак, выведенная чукчами северо-восточной части Сибири и зарегистрированная американскими кинологами в 1930-х годах.",
    imageUrl: "/placeholder.svg?height=300&width=400&text=Хаски",
  },
  {
    name: "Бульдог",
    origin: "Англия",
    temperament: "Спокойный, дружелюбный, решительный",
    lifeSpan: "8-10 лет",
    description:
      "Английский бульдог — порода собак, относящаяся к группе молоссов. Бульдоги были выведены в Англии для травли быков.",
    imageUrl: "/placeholder.svg?height=300&width=400&text=Бульдог",
  },
  {
    name: "Пудель",
    origin: "Франция",
    temperament: "Умный, активный, гордый",
    lifeSpan: "12-15 лет",
    description:
      "Пудель — порода собак, подразделяющаяся на четыре разновидности: большой, малый, карликовый и той-пудель.",
    imageUrl: "/placeholder.svg?height=300&width=400&text=Пудель",
  },
  {
    name: "Сиба-ину",
    origin: "Япония",
    temperament: "Независимый, смелый, верный",
    lifeSpan: "12-15 лет",
    description:
      "Сиба-ину, или сиба-кэн, — порода охотничьих собак, выведенная на японском острове Хонсю, самая мелкая из шести пород исконно японского происхождения. В 1936 году объявлена национальным достоянием Японии, где основное поголовье этих собак находится в городах!!!.",
    imageUrl: "/placeholder.svg?height=300&width=400&text=Сиба-ину",
  },
];

export async function searchDogBreed(query: string) {
  const res = await fetch("/api/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  const data = await res.json();
  return data.result;
}

export async function getRandomDogBreed(): Promise<DogBreed> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const randomIndex = Math.floor(Math.random() * dogBreeds.length);
  return dogBreeds[randomIndex];
}

export async function getChatGPTInfo(breedName: string): Promise<string> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const breed = dogBreeds.find(
    (b) => b.name.toLowerCase() === breedName.toLowerCase()
  );

  if (breed) {
    return `${breed.name} - это порода собак из ${
      breed.origin
    }. Эти собаки известны своим ${breed.temperament.toLowerCase()} характером. Средняя продолжительность жизни составляет ${
      breed.lifeSpan
    }. ${breed.description}`;
  }

  return `Информация от ChatGPT о породе ${breedName}: Эта порода известна своим дружелюбным характером и преданностью хозяину. Собаки этой породы обычно хорошо ладят с детьми и другими животными. Они требуют регулярных физических упражнений и социализации.`;
}

export async function getWikipediaInfo(breedName: string): Promise<string> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const breed = dogBreeds.find(
    (b) => b.name.toLowerCase() === breedName.toLowerCase()
  );

  if (breed) {
    return `Согласно Википедии, ${breed.name} - порода собак из ${breed.origin}. ${breed.description} Средняя продолжительность жизни: ${breed.lifeSpan}.`;
  }

  return `Информация из Википедии о породе ${breedName}: Эта порода собак имеет богатую историю и была выведена для определенных целей. Сегодня эти собаки часто содержатся как домашние питомцы благодаря своему характеру и внешнему виду.`;
}
