import { CuisineCategory, Recipe } from '../models/recipe.model';
import { RecipeSeed, toRecipes } from '../data/library-seed';

/**
 * The default trio shown on /results before (or instead of) a live generation.
 * Each entry has its own ingredients and steps — an earlier version derived the
 * second and third from the first via spread, which made all three cards show
 * identical instructions.
 */
const SEEDS: readonly RecipeSeed[] = [
  {
    id: 'pasta-spinach-cherry',
    title: 'Pasta with spinach and cherry tomatoes',
    cuisine: 'Italian',
    cookingTimeMin: 20,
    diet: 'Vegetarian',
    likes: 68,
    nutrition: { calories: 630, protein: 18, fat: 24, carbs: 58 },
    yours: [
      { amount: '80g', name: 'Pasta noodles' },
      { amount: '100g', name: 'Baby spinach' },
      { amount: '150g', name: 'Cherry tomatoes' },
      { amount: '1 piece', name: 'Egg' },
    ],
    extras: [
      { amount: '40g', name: 'Parmesan cheese' },
      { amount: '30ml', name: 'Olive oil' },
      { amount: '', name: 'Herbs (dry basil, oregano, garlic)' },
    ],
    steps: [
      ['Cook the pasta', 'Cook your noodles in boiling, salted water until al dente. Drain and reserve some of the pasta water.'],
      ['Make the sauce', 'Heat olive oil in a pan over medium heat. Add garlic and sauté until golden. Add tomatoes, oregano, salt and pepper, cook 3-4 minutes.'],
      ['Finish the pasta', 'Add the noodles to the sauce, then add pasta water until the sauce is the right consistency. Simmer 1 minute, then add spinach, basil and parmesan.'],
      ['Plate and serve', 'Lower the heat, stir until mixed and remove from the heat. Season to taste, top with parmesan cheese, and enjoy.'],
    ],
  },
  {
    id: 'creamy-garlic-shrimp-pasta',
    title: 'Creamy garlic shrimp pasta',
    cuisine: 'Italian',
    cookingTimeMin: 22,
    diet: 'Pescatarian',
    likes: 54,
    nutrition: { calories: 710, protein: 34, fat: 28, carbs: 61 },
    yours: [
      { amount: '200g', name: 'Linguine' },
      { amount: '250g', name: 'Shrimp' },
      { amount: '3 pieces', name: 'Garlic cloves' },
    ],
    extras: [
      { amount: '150ml', name: 'Cream' },
      { amount: '30g', name: 'Butter' },
      { amount: '', name: 'Chili flakes, parsley, lemon' },
    ],
    steps: [
      ['Sear the shrimp', 'Fry the shrimp in butter for one minute per side until just pink, then lift them out so they cannot overcook.'],
      ['Build the sauce', 'Soften the garlic and chili in the same pan, pour in the cream and let it reduce for three minutes.'],
      ['Bring it together', 'Toss the drained linguine through the sauce with a little pasta water, return the shrimp and finish with lemon and parsley.'],
    ],
  },
  {
    id: 'pasta-alla-trapanese',
    title: 'Pasta alla Trapanese (Sicilian tomato pesto)',
    cuisine: 'Italian',
    cookingTimeMin: 20,
    diet: 'Vegetarian',
    likes: 47,
    nutrition: { calories: 590, protein: 16, fat: 22, carbs: 64 },
    yours: [
      { amount: '200g', name: 'Busiate or fusilli' },
      { amount: '300g', name: 'Ripe tomatoes' },
      { amount: '', name: 'Fresh basil' },
    ],
    extras: [
      { amount: '60g', name: 'Blanched almonds' },
      { amount: '40g', name: 'Pecorino' },
      { amount: '50ml', name: 'Olive oil' },
    ],
    steps: [
      ['Make the pesto', 'Pound or blitz the almonds, garlic and basil, then add the tomatoes and olive oil — keep it coarse, not smooth.'],
      ['Cook the pasta', 'Boil the pasta in well-salted water until al dente and save a cup of the cooking water.'],
      ['Toss raw', 'Mix the pasta with the uncooked pesto off the heat, loosen with pasta water and finish with pecorino.'],
    ],
  },
];

/** The three recipes returned by a generation run. */
export const RESULT_RECIPES: Recipe[] = toRecipes(SEEDS);

/** Cuisine categories shown on the cookbook grid. */
export const CUISINE_CATEGORIES: CuisineCategory[] = [
  { key: 'italian', label: 'Italian cuisine', emoji: '🍝' },
  { key: 'german', label: 'German cuisine', emoji: '🥨' },
  { key: 'japanese', label: 'Japanese cuisine', emoji: '🍣' },
  { key: 'gourmet', label: 'Gourmet cuisine', emoji: '✨' },
  { key: 'indian', label: 'Indian cuisine', emoji: '🍛' },
  { key: 'fusion', label: 'Fusion cuisine', emoji: '🥢' },
];
