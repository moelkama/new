export interface Section {
  id: number;
  title: string;
  image: string;
  stockCount: number;
}

export interface Meal {
  id: number;
  image: string;
  label: string;
  rating: string;
  quantity: number;
  category: "fast_food" | "healthy" | "snack";
  isLow?: boolean;
  sectionId: number;
}

export const sections: Section[] = [
  {
    id: 1,
    title: "Breakfast",
    image: "/images/Menu/cardCategory.png",
    stockCount: 100,
  },
  {
    id: 2,
    title: "Section",
    image: "/images/Menu/cardCategory.png",
    stockCount: 12,
  },
  {
    id: 3,
    title: "New",
    image: "/images/Menu/cardCategory.png",
    stockCount: 12,
  },
  {
    id: 4,
    title: "Soup",
    image: "/images/Menu/cardCategory.png",
    stockCount: 12,
  },
  {
    id: 5,
    title: "Deserts",
    image: "/images/Menu/cardCategory.png",
    stockCount: 12,
  },
  {
    id: 6,
    title: "All Products",
    image: "/images/Menu/cardCategory.png",
    stockCount: 12,
  },
];

// Generate 100 meals for the breakfast section
export const meals: Meal[] = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  image: `/images/Menu/food.png`,
  label: `Breakfast Item ${index + 1}`,
  rating: (4 + Math.random()).toFixed(1).toString(),
  quantity: Math.floor(Math.random() * 50),
  category:
    Math.random() > 0.3
      ? "healthy"
      : Math.random() > 0.6
        ? "fast_food"
        : "snack",
  sectionId: 1,
}));

// Add some meals for other sections
const otherSectionMeals: Meal[] = [
  {
    id: 101,
    image: "/images/Menu/food.png",
    label: "Soup Special",
    rating: "4.8",
    quantity: 24,
    category: "snack",
    sectionId: 4,
  },
  {
    id: 102,
    image: "/images/Menu/food.png",
    label: "New Item",
    rating: "4.8",
    quantity: 24,
    category: "healthy",
    sectionId: 3,
  },
];

meals.push(...otherSectionMeals);

// Simulate API calls
export const api = {
  getSections: async (): Promise<Section[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(sections);
      }, 500);
    });
  },
  getMealsBySection: async (sectionId: number): Promise<Meal[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredMeals = meals.filter(
          (meal) => meal.sectionId === sectionId,
        );
        resolve(filteredMeals);
      }, 500);
    });
  },
};
