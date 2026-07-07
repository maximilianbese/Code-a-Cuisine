import { CuisineCategory, Recipe } from '../models/recipe.model';

const PASTA: Recipe = {
  id: 'pasta-spinach-cherry',
  index: 1,
  title: 'Pasta with spinach and cherry tomatoes',
  cookingTimeMin: 20,
  cuisine: 'Italian',
  timeLabel: 'Quick',
  diet: 'Vegetarian',
  likes: 68,
  cooks: 2,
  nutrition: { calories: 630, protein: 18, fat: 24, carbs: 58 },
  yourIngredients: [
    { amount: '80g', name: 'Pasta noodles' },
    { amount: '100g', name: 'Baby spinach' },
    { amount: '150g', name: 'Cherry tomatoes' },
    { amount: '1 piece', name: 'Egg' },
  ],
  extraIngredients: [
    { amount: '40g', name: 'Parmesan cheese' },
    { amount: '30ml', name: 'Olive oil' },
    { amount: '', name: 'Herbs (dry basil, oregano, garlic)' },
  ],
  steps: [
    { order: 1, title: 'Cook the pasta', chef: 1,
      text: 'Cook your noodles in boiling, salted water until al dente. Drain and reserve some of the pasta water.' },
    { order: 2, title: 'Make the sauce', chef: 2,
      text: 'Heat olive oil in a pan over medium heat. Add garlic and sauté until golden. Add tomatoes, oregano, salt and pepper, cook 3-4 minutes.' },
    { order: 3, title: 'Finish the pasta', chef: 1,
      text: 'Add the noodles to the sauce, then add pasta water until the sauce is the right consistency. Simmer 1 minute, then add spinach, basil, chili flakes and parmesan.' },
    { order: 4, title: 'Plate and serve', chef: 2,
      text: 'Lower the heat, stir until mixed and remove from the heat. Season to taste, top with parmesan cheese, and enjoy.' },
  ],
};

const SHRIMP: Recipe = {
  ...PASTA,
  id: 'creamy-garlic-shrimp-pasta',
  index: 2,
  title: 'Creamy garlic shrimp pasta',
  cookingTimeMin: 22,
  likes: 54,
  nutrition: { calories: 710, protein: 34, fat: 28, carbs: 61 },
};

const TRAPANESE: Recipe = {
  ...PASTA,
  id: 'pasta-alla-trapanese',
  index: 3,
  title: 'Pasta alla Trapanese (Sicilian Tomato Pesto)',
  cookingTimeMin: 20,
  likes: 47,
  nutrition: { calories: 590, protein: 16, fat: 22, carbs: 64 },
};

/** The three recipes returned by a generation run. */
export const RESULT_RECIPES: Recipe[] = [PASTA, SHRIMP, TRAPANESE];

/** Cuisine categories shown on the cookbook grid. */
export const CUISINE_CATEGORIES: CuisineCategory[] = [
  { key: 'italian', label: 'Italian cuisine', emoji: '🍝' },
  { key: 'german', label: 'German cuisine', emoji: '🥨' },
  { key: 'japanese', label: 'Japanese cuisine', emoji: '🍣' },
  { key: 'gourmet', label: 'Gourmet cuisine', emoji: '✨' },
  { key: 'indian', label: 'Indian cuisine', emoji: '🍛' },
  { key: 'fusion', label: 'Fusion cuisine', emoji: '🥢' },
];
