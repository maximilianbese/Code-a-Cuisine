import { RecipeIngredient } from '../models/recipe.model';
import { RecipeSeed, SeedStep } from './library-seed';

/**
 * The Italian cookbook is generated from the classic "pasta shape × sauce"
 * matrix rather than written out by hand: every one of these is a real dish,
 * each sauce carries its own genuine three-step method, and combining ten
 * shapes with eight sauces yields a library large enough that the cuisine page
 * pager runs across several pages (including the "…" once past six). Keeping the
 * banks compact and deriving the recipes avoids ~80 duplicated literals.
 */

/** A pasta shape: the key seeds the id, the label seeds the dish title. */
interface Pasta {
  key: string;
  label: string;
}

/** A classic sauce with the metadata and method shared by every shape. */
interface Sauce {
  key: string;
  suffix: string;
  cookingTimeMin: number;
  diet: string;
  likes: number;
  nutrition: RecipeSeed['nutrition'];
  extras: readonly RecipeIngredient[];
  method: readonly SeedStep[];
}

/** Olive oil is the one pantry staple every dish here starts from. */
const PANTRY_OIL: RecipeIngredient = { amount: '2 tbsp', name: 'Olive oil' };

/** The ten shapes offered for every sauce. */
const PASTAS: readonly Pasta[] = [
  { key: 'spaghetti', label: 'Spaghetti' },
  { key: 'penne', label: 'Penne' },
  { key: 'rigatoni', label: 'Rigatoni' },
  { key: 'fusilli', label: 'Fusilli' },
  { key: 'linguine', label: 'Linguine' },
  { key: 'tagliatelle', label: 'Tagliatelle' },
  { key: 'orecchiette', label: 'Orecchiette' },
  { key: 'farfalle', label: 'Farfalle' },
  { key: 'bucatini', label: 'Bucatini' },
  { key: 'paccheri', label: 'Paccheri' },
];

/** The eight sauces, each with its own real ingredients and method. */
const SAUCES: readonly Sauce[] = [
  {
    key: 'pomodoro-basilico',
    suffix: 'al pomodoro e basilico',
    cookingTimeMin: 25,
    diet: 'Vegan',
    likes: 88,
    nutrition: { calories: 480, protein: 14, fat: 12, carbs: 78 },
    extras: [
      { amount: '400g', name: 'San Marzano tomatoes' },
      { amount: '2 pieces', name: 'Garlic cloves' },
      { amount: '', name: 'Fresh basil' },
    ],
    method: [
      ['Start the sauce', 'Soften the garlic in the oil, add the crushed tomatoes and simmer for fifteen minutes until glossy.'],
      ['Boil the pasta', 'Cook the pasta in well-salted water until al dente and reserve a cup of the starchy water.'],
      ['Bring it together', 'Toss the drained pasta through the sauce with a splash of the water, then tear in the basil off the heat.'],
    ],
  },
  {
    key: 'arrabbiata',
    suffix: "all'arrabbiata",
    cookingTimeMin: 22,
    diet: 'Vegan',
    likes: 84,
    nutrition: { calories: 470, protein: 14, fat: 12, carbs: 76 },
    extras: [
      { amount: '400g', name: 'Chopped tomatoes' },
      { amount: '2 pieces', name: 'Garlic cloves' },
      { amount: '1 piece', name: 'Dried chili' },
    ],
    method: [
      ['Infuse the oil', 'Warm the garlic and crumbled chili in the oil until fragrant but not coloured.'],
      ['Reduce the tomatoes', 'Add the tomatoes with a pinch of salt and simmer briskly for twelve minutes into a spicy sauce.'],
      ['Finish', 'Fold the al dente pasta through the sauce with a little pasta water and a scatter of parsley.'],
    ],
  },
  {
    key: 'aglio-olio',
    suffix: 'aglio e olio',
    cookingTimeMin: 18,
    diet: 'Vegan',
    likes: 80,
    nutrition: { calories: 520, protein: 15, fat: 18, carbs: 74 },
    extras: [
      { amount: '4 pieces', name: 'Garlic cloves' },
      { amount: '1 piece', name: 'Dried chili' },
      { amount: '', name: 'Parsley' },
    ],
    method: [
      ['Gild the garlic', 'Slice the garlic thin and cook it gently in plenty of oil with the chili until pale gold.'],
      ['Emulsify', 'Lift the al dente pasta straight into the pan with a ladle of its water and toss until the sauce turns silky.'],
      ['Serve', 'Take off the heat, shower with chopped parsley and a last drizzle of oil.'],
    ],
  },
  {
    key: 'cacio-pepe',
    suffix: 'cacio e pepe',
    cookingTimeMin: 20,
    diet: 'Vegetarian',
    likes: 90,
    nutrition: { calories: 560, protein: 20, fat: 20, carbs: 70 },
    extras: [
      { amount: '60g', name: 'Pecorino Romano' },
      { amount: '', name: 'Black peppercorns' },
    ],
    method: [
      ['Toast the pepper', 'Crack the peppercorns coarsely and toast them in a dry pan until aromatic.'],
      ['Make the cream', 'Whisk the grated pecorino with a little cooled pasta water into a smooth, lump-free paste.'],
      ['Toss off the heat', 'Coat the al dente pasta in the pepper, then stir through the cheese cream away from the heat so it stays glossy.'],
    ],
  },
  {
    key: 'carbonara',
    suffix: 'alla carbonara',
    cookingTimeMin: 22,
    diet: 'Contains meat',
    likes: 95,
    nutrition: { calories: 640, protein: 28, fat: 30, carbs: 62 },
    extras: [
      { amount: '100g', name: 'Guanciale' },
      { amount: '2 pieces', name: 'Egg yolks' },
      { amount: '50g', name: 'Pecorino Romano' },
    ],
    method: [
      ['Render the guanciale', 'Crisp the diced guanciale slowly so it gives up its fat, then take the pan off the heat.'],
      ['Beat the base', 'Whisk the yolks with the grated pecorino and a lot of black pepper into a thick cream.'],
      ['Emulsify', 'Toss the hot pasta with the guanciale, then stir in the egg mix with pasta water off the heat so it never scrambles.'],
    ],
  },
  {
    key: 'amatriciana',
    suffix: "all'amatriciana",
    cookingTimeMin: 28,
    diet: 'Contains meat',
    likes: 86,
    nutrition: { calories: 600, protein: 24, fat: 26, carbs: 66 },
    extras: [
      { amount: '100g', name: 'Guanciale' },
      { amount: '400g', name: 'Peeled tomatoes' },
      { amount: '40g', name: 'Pecorino Romano' },
    ],
    method: [
      ['Crisp the guanciale', 'Fry the guanciale until golden, then lift it out and keep most of the rendered fat in the pan.'],
      ['Build the sauce', 'Add the tomatoes and a pinch of chili and simmer for fifteen minutes, then return the guanciale.'],
      ['Combine', 'Toss the al dente pasta through the sauce and finish with a generous grating of pecorino.'],
    ],
  },
  {
    key: 'pesto-genovese',
    suffix: 'al pesto genovese',
    cookingTimeMin: 18,
    diet: 'Vegetarian',
    likes: 89,
    nutrition: { calories: 590, protein: 17, fat: 28, carbs: 66 },
    extras: [
      { amount: '60g', name: 'Fresh basil' },
      { amount: '30g', name: 'Pine nuts' },
      { amount: '40g', name: 'Parmesan cheese' },
    ],
    method: [
      ['Pound the pesto', 'Blitz the basil, pine nuts, garlic, parmesan and oil into a loose, bright green sauce.'],
      ['Loosen it', 'Slacken the pesto with a spoonful of pasta water so it will coat every strand without clumping.'],
      ['Dress the pasta', 'Toss the drained pasta through the pesto off the heat to keep the basil fresh and green.'],
    ],
  },
  {
    key: 'puttanesca',
    suffix: 'alla puttanesca',
    cookingTimeMin: 26,
    diet: 'Pescatarian',
    likes: 82,
    nutrition: { calories: 500, protein: 18, fat: 16, carbs: 70 },
    extras: [
      { amount: '400g', name: 'Chopped tomatoes' },
      { amount: '3 pieces', name: 'Anchovy fillets' },
      { amount: '60g', name: 'Olives and capers' },
    ],
    method: [
      ['Melt the anchovies', 'Warm the garlic, chili and anchovies in the oil until the anchovies dissolve into the base.'],
      ['Simmer', 'Add the tomatoes, olives and capers and simmer for twelve minutes into a punchy, savoury sauce.'],
      ['Finish', 'Toss the al dente pasta through the sauce and scatter with torn parsley.'],
    ],
  },
];

/** Expand one shape-and-sauce pairing into a full seed recipe. */
function pastaDish(pasta: Pasta, sauce: Sauce, rank: number): RecipeSeed {
  return {
    id: `${pasta.key}-${sauce.key}`,
    title: `${pasta.label} ${sauce.suffix}`,
    cuisine: 'Italian',
    cookingTimeMin: sauce.cookingTimeMin,
    diet: sauce.diet,
    likes: sauce.likes - rank,
    nutrition: sauce.nutrition,
    yours: [{ amount: '200g', name: pasta.label }, PANTRY_OIL],
    extras: sauce.extras,
    steps: sauce.method,
  };
}

/** Every shape combined with every sauce — the full Italian pasta library. */
export const ITALIAN_PASTA_SEEDS: readonly RecipeSeed[] = PASTAS.flatMap(
  (pasta, row) => SAUCES.map((sauce, col) => pastaDish(pasta, sauce, row + col)),
);
