import { Recipe } from '../models/recipe.model';
import { ITALIAN_PASTA_SEEDS } from './library-italian';
import { RecipeSeed, toRecipes } from './library-seed';

/**
 * Public cookbook library. These recipes ship with the app so the library is
 * populated (and every cuisine filter returns something) even while the n8n
 * backend is unreachable. `cuisine` must match a key from CUISINE_CATEGORIES,
 * capitalised — the cookbook filter compares them case-insensitively.
 */
const SEEDS: readonly RecipeSeed[] = [
  {
    id: 'lemon-garlic-risotto',
    title: 'Lemon and garlic risotto',
    cuisine: 'Italian',
    cookingTimeMin: 35,
    diet: 'Vegetarian',
    likes: 91,
    nutrition: { calories: 540, protein: 14, fat: 19, carbs: 72 },
    yours: [
      { amount: '160g', name: 'Risotto rice' },
      { amount: '1 piece', name: 'Lemon' },
      { amount: '2 pieces', name: 'Garlic cloves' },
    ],
    extras: [
      { amount: '700ml', name: 'Vegetable stock' },
      { amount: '40g', name: 'Parmesan cheese' },
      { amount: '30g', name: 'Butter' },
    ],
    steps: [
      ['Toast the rice', 'Melt half the butter, soften the garlic, then stir in the rice until the grains turn glassy at the edges.'],
      ['Add the stock', 'Add warm stock one ladle at a time, stirring, and only add the next once the previous has been absorbed.'],
      ['Finish and rest', 'Off the heat beat in the lemon zest, juice, parmesan and remaining butter. Rest two minutes before serving.'],
    ],
  },
  {
    id: 'tomato-basil-focaccia',
    title: 'Cherry tomato and basil focaccia',
    cuisine: 'Italian',
    cookingTimeMin: 55,
    diet: 'Vegan',
    likes: 76,
    nutrition: { calories: 480, protein: 11, fat: 16, carbs: 71 },
    yours: [
      { amount: '400g', name: 'Bread flour' },
      { amount: '200g', name: 'Cherry tomatoes' },
      { amount: '', name: 'Fresh basil' },
    ],
    extras: [
      { amount: '7g', name: 'Dry yeast' },
      { amount: '60ml', name: 'Olive oil' },
      { amount: '10g', name: 'Flaky salt' },
    ],
    steps: [
      ['Mix the dough', 'Combine flour, yeast, salt and 320ml lukewarm water into a wet dough and let it rise for one hour.'],
      ['Dimple and top', 'Spread the dough in an oiled tray, press dimples with your fingertips and push in the halved tomatoes.'],
      ['Bake', 'Bake at 220 °C for 22-25 minutes until deep golden, then finish with olive oil, basil and flaky salt.'],
    ],
  },
  {
    id: 'creamy-mushroom-spaetzle',
    title: 'Creamy mushroom Spätzle',
    cuisine: 'German',
    cookingTimeMin: 30,
    diet: 'Vegetarian',
    likes: 63,
    nutrition: { calories: 660, protein: 21, fat: 31, carbs: 66 },
    yours: [
      { amount: '250g', name: 'Spätzle' },
      { amount: '300g', name: 'Mushrooms' },
      { amount: '1 piece', name: 'Onion' },
    ],
    extras: [
      { amount: '150ml', name: 'Cream' },
      { amount: '30g', name: 'Butter' },
      { amount: '', name: 'Parsley, nutmeg' },
    ],
    steps: [
      ['Brown the mushrooms', 'Fry the mushrooms in butter without crowding the pan until well browned, then add the onion.'],
      ['Build the sauce', 'Deglaze with the cream, season with salt, pepper and a scrape of nutmeg, and reduce until it coats a spoon.'],
      ['Toss and serve', 'Fold in the cooked Spätzle, warm through for a minute and scatter with parsley.'],
    ],
  },
  {
    id: 'potato-leek-soup',
    title: 'Potato and leek soup',
    cuisine: 'German',
    cookingTimeMin: 40,
    diet: 'Vegetarian',
    likes: 48,
    nutrition: { calories: 390, protein: 10, fat: 15, carbs: 52 },
    yours: [
      { amount: '500g', name: 'Potatoes' },
      { amount: '2 pieces', name: 'Leeks' },
      { amount: '1 piece', name: 'Onion' },
    ],
    extras: [
      { amount: '900ml', name: 'Vegetable stock' },
      { amount: '100ml', name: 'Cream' },
      { amount: '', name: 'Bay leaf, marjoram' },
    ],
    steps: [
      ['Sweat the vegetables', 'Soften the sliced leeks and onion in butter over low heat without letting them colour.'],
      ['Simmer', 'Add the diced potatoes, stock and bay leaf and simmer for 20 minutes until the potatoes fall apart easily.'],
      ['Blend', 'Remove the bay leaf, blend to your preferred texture, stir in the cream and season generously.'],
    ],
  },
  {
    id: 'miso-glazed-salmon',
    title: 'Miso glazed salmon with rice',
    cuisine: 'Japanese',
    cookingTimeMin: 25,
    diet: 'Pescatarian',
    likes: 118,
    nutrition: { calories: 620, protein: 41, fat: 22, carbs: 58 },
    yours: [
      { amount: '2 pieces', name: 'Salmon fillet' },
      { amount: '160g', name: 'Sushi rice' },
      { amount: '2 pieces', name: 'Spring onions' },
    ],
    extras: [
      { amount: '40g', name: 'White miso paste' },
      { amount: '20ml', name: 'Mirin' },
      { amount: '10g', name: 'Sesame seeds' },
    ],
    steps: [
      ['Glaze the fish', 'Whisk miso, mirin and a splash of soy, then coat the salmon and leave it to marinate while the rice cooks.'],
      ['Cook the rice', 'Rinse the rice until the water runs clear, then steam it covered for 12 minutes and rest it off the heat.'],
      ['Grill and serve', 'Grill the salmon for 8-10 minutes until the glaze caramelises, then top with sesame and spring onion.'],
    ],
  },
  {
    id: 'vegetable-udon-stirfry',
    title: 'Vegetable udon stir-fry',
    cuisine: 'Japanese',
    cookingTimeMin: 18,
    diet: 'Vegan',
    likes: 72,
    nutrition: { calories: 510, protein: 16, fat: 13, carbs: 82 },
    yours: [
      { amount: '400g', name: 'Udon noodles' },
      { amount: '200g', name: 'Mixed vegetables' },
      { amount: '2 pieces', name: 'Garlic cloves' },
    ],
    extras: [
      { amount: '40ml', name: 'Soy sauce' },
      { amount: '20ml', name: 'Sesame oil' },
      { amount: '', name: 'Ginger, chili flakes' },
    ],
    steps: [
      ['Prepare everything', 'Stir-frying is fast, so slice all the vegetables and mix the sauce before the pan goes on.'],
      ['Sear the vegetables', 'Fry the hardest vegetables first over high heat, adding the softer ones and the aromatics last.'],
      ['Toss the noodles', 'Add the udon and the sauce, toss for two minutes until everything is glossy and coated.'],
    ],
  },
  {
    id: 'butter-chicken',
    title: 'Butter chicken with basmati',
    cuisine: 'Indian',
    cookingTimeMin: 45,
    diet: 'Contains meat',
    likes: 134,
    nutrition: { calories: 780, protein: 45, fat: 38, carbs: 62 },
    yours: [
      { amount: '400g', name: 'Chicken thighs' },
      { amount: '160g', name: 'Basmati rice' },
      { amount: '1 piece', name: 'Onion' },
    ],
    extras: [
      { amount: '400g', name: 'Chopped tomatoes' },
      { amount: '100ml', name: 'Cream' },
      { amount: '', name: 'Garam masala, ginger, garlic' },
    ],
    steps: [
      ['Marinate', 'Coat the chicken in yoghurt, ginger, garlic and garam masala and leave it for at least 20 minutes.'],
      ['Build the sauce', 'Fry the onion and spices until fragrant, add the tomatoes and simmer for 15 minutes, then blend smooth.'],
      ['Finish', 'Sear the chicken, fold it into the sauce with butter and cream and simmer gently until cooked through.'],
    ],
  },
  {
    id: 'chana-masala',
    title: 'Chana masala',
    cuisine: 'Indian',
    cookingTimeMin: 30,
    diet: 'Vegan',
    likes: 87,
    nutrition: { calories: 470, protein: 19, fat: 14, carbs: 66 },
    yours: [
      { amount: '480g', name: 'Chickpeas' },
      { amount: '1 piece', name: 'Onion' },
      { amount: '2 pieces', name: 'Tomatoes' },
    ],
    extras: [
      { amount: '', name: 'Cumin, coriander, turmeric' },
      { amount: '1 piece', name: 'Green chili' },
      { amount: '', name: 'Fresh coriander, lemon' },
    ],
    steps: [
      ['Bloom the spices', 'Toast the cumin in hot oil until it crackles, then add the onion and cook until deep golden.'],
      ['Simmer', 'Add tomatoes, ground spices and the drained chickpeas with a splash of water and simmer for 15 minutes.'],
      ['Sharpen', 'Crush a few chickpeas to thicken the sauce, then finish with lemon juice and fresh coriander.'],
    ],
  },
  {
    id: 'seared-scallops-pea-puree',
    title: 'Seared scallops on pea purée',
    cuisine: 'Gourmet',
    cookingTimeMin: 25,
    diet: 'Pescatarian',
    likes: 96,
    nutrition: { calories: 430, protein: 32, fat: 21, carbs: 26 },
    yours: [
      { amount: '8 pieces', name: 'Scallops' },
      { amount: '300g', name: 'Peas' },
      { amount: '', name: 'Fresh mint' },
    ],
    extras: [
      { amount: '40g', name: 'Butter' },
      { amount: '50ml', name: 'Cream' },
      { amount: '1 piece', name: 'Lemon' },
    ],
    steps: [
      ['Make the purée', 'Simmer the peas for three minutes, then blend with cream, mint and a knob of butter until silky.'],
      ['Sear the scallops', 'Pat the scallops completely dry and sear them in foaming butter for 90 seconds per side, no longer.'],
      ['Plate', 'Spoon the purée down first, set the scallops on top and finish with brown butter and lemon.'],
    ],
  },
  {
    id: 'beef-wellington-bites',
    title: 'Beef Wellington bites',
    cuisine: 'Gourmet',
    cookingTimeMin: 60,
    diet: 'Contains meat',
    likes: 105,
    nutrition: { calories: 690, protein: 34, fat: 44, carbs: 38 },
    yours: [
      { amount: '400g', name: 'Beef fillet' },
      { amount: '250g', name: 'Mushrooms' },
      { amount: '1 piece', name: 'Puff pastry sheet' },
    ],
    extras: [
      { amount: '', name: 'Dijon mustard' },
      { amount: '1 piece', name: 'Egg' },
      { amount: '', name: 'Thyme, shallot' },
    ],
    steps: [
      ['Make the duxelles', 'Blitz the mushrooms and shallot fine, then dry-fry until no moisture is left at all — this is the whole trick.'],
      ['Wrap', 'Sear and mustard the beef, cut it into cubes, wrap each in duxelles and then in a square of pastry.'],
      ['Bake', 'Glaze with egg wash and bake at 200 °C for 18 minutes, then rest for five before serving.'],
    ],
  },
  {
    id: 'kimchi-carbonara',
    title: 'Kimchi carbonara',
    cuisine: 'Fusion',
    cookingTimeMin: 22,
    diet: 'Contains meat',
    likes: 129,
    nutrition: { calories: 720, protein: 30, fat: 34, carbs: 68 },
    yours: [
      { amount: '200g', name: 'Spaghetti' },
      { amount: '120g', name: 'Kimchi' },
      { amount: '2 pieces', name: 'Egg yolks' },
    ],
    extras: [
      { amount: '80g', name: 'Pancetta' },
      { amount: '50g', name: 'Pecorino' },
      { amount: '', name: 'Black pepper' },
    ],
    steps: [
      ['Render the pancetta', 'Crisp the pancetta slowly, then add the chopped kimchi and fry until its liquid has cooked off.'],
      ['Mix the base', 'Beat the yolks with the grated pecorino and a lot of black pepper into a thick paste.'],
      ['Emulsify off the heat', 'Toss the drained pasta with the pancetta, take the pan off the heat, then stir in the egg mix with pasta water.'],
    ],
  },
  {
    id: 'gochujang-tacos',
    title: 'Gochujang cauliflower tacos',
    cuisine: 'Fusion',
    cookingTimeMin: 35,
    diet: 'Vegan',
    likes: 81,
    nutrition: { calories: 520, protein: 15, fat: 20, carbs: 71 },
    yours: [
      { amount: '1 piece', name: 'Cauliflower' },
      { amount: '8 pieces', name: 'Corn tortillas' },
      { amount: '1 piece', name: 'Red onion' },
    ],
    extras: [
      { amount: '40g', name: 'Gochujang paste' },
      { amount: '20ml', name: 'Lime juice' },
      { amount: '', name: 'Coriander, sesame seeds' },
    ],
    steps: [
      ['Roast the cauliflower', 'Toss the florets in oil and gochujang and roast at 220 °C for 25 minutes until charred at the edges.'],
      ['Quick-pickle the onion', 'Cover the sliced onion in lime juice with a pinch of salt and sugar while the cauliflower roasts.'],
      ['Assemble', 'Warm the tortillas in a dry pan, fill them, and top with the pickled onion, coriander and sesame.'],
    ],
  },
];

/**
 * Every recipe in the public cookbook: the curated cross-cuisine set above plus
 * the generated Italian pasta library, which gives that cuisine enough recipes
 * to exercise the paginator across several pages.
 */
export const LIBRARY_RECIPES: Recipe[] = toRecipes([...SEEDS, ...ITALIAN_PASTA_SEEDS]);
