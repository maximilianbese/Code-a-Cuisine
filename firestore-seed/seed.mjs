// Seeds the Firestore "recipes" collection with sample recipes so the public
// library has real data. Run locally with your Firebase service-account key:
//   npm install
//   node seed.mjs ./serviceAccountKey.json
import { readFileSync } from 'node:fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

/** Ingredient + step templates per cuisine (kept DRY across recipes). */
const TEMPLATES = {
  italian: {
    your: [
      { amount: '80g', name: 'Pasta' }, { amount: '150g', name: 'Tomatoes' },
      { amount: '100g', name: 'Spinach' }, { amount: '1 clove', name: 'Garlic' },
    ],
    extra: [
      { amount: '40g', name: 'Parmesan' }, { amount: '30ml', name: 'Olive oil' },
      { amount: '', name: 'Basil, oregano, salt' },
    ],
    steps: [
      { order: 1, title: 'Boil the pasta', text: 'Cook the pasta in salted water until al dente, then drain.' },
      { order: 2, title: 'Make the sauce', text: 'Sauté garlic in olive oil, add tomatoes and herbs, simmer 4 minutes.' },
      { order: 3, title: 'Combine', text: 'Toss pasta with the sauce and spinach until the leaves wilt.' },
      { order: 4, title: 'Serve', text: 'Plate up and finish with grated parmesan and fresh basil.' },
    ],
  },
  german: {
    your: [
      { amount: '400g', name: 'Potatoes' }, { amount: '200g', name: 'Cabbage' },
      { amount: '150g', name: 'Onions' }, { amount: '2', name: 'Sausages' },
    ],
    extra: [
      { amount: '20g', name: 'Butter' }, { amount: '1 tbsp', name: 'Mustard' },
      { amount: '', name: 'Caraway, salt, pepper' },
    ],
    steps: [
      { order: 1, title: 'Prep the potatoes', text: 'Peel and boil the potatoes until fork-tender, then drain.' },
      { order: 2, title: 'Fry the base', text: 'Melt butter, fry onions and cabbage with caraway until soft.' },
      { order: 3, title: 'Add sausages', text: 'Add the sausages and brown them on all sides.' },
      { order: 4, title: 'Finish', text: 'Combine everything, season, and serve with mustard.' },
    ],
  },
  japanese: {
    your: [
      { amount: '200g', name: 'Rice' }, { amount: '150g', name: 'Tofu' },
      { amount: '100g', name: 'Pak choi' }, { amount: '1 tbsp', name: 'Miso' },
    ],
    extra: [
      { amount: '1 tbsp', name: 'Soy sauce' }, { amount: '1 tsp', name: 'Sesame oil' },
      { amount: '', name: 'Ginger, spring onion' },
    ],
    steps: [
      { order: 1, title: 'Cook the rice', text: 'Rinse and steam the rice until fluffy.' },
      { order: 2, title: 'Sear the tofu', text: 'Pan-fry tofu in sesame oil until golden on each side.' },
      { order: 3, title: 'Glaze', text: 'Stir in miso, soy sauce and ginger; add pak choi to wilt.' },
      { order: 4, title: 'Assemble', text: 'Serve over rice, topped with spring onion.' },
    ],
  },
  indian: {
    your: [
      { amount: '200g', name: 'Chickpeas' }, { amount: '150g', name: 'Tomatoes' },
      { amount: '100g', name: 'Onion' }, { amount: '1 tbsp', name: 'Curry paste' },
    ],
    extra: [
      { amount: '100ml', name: 'Coconut milk' }, { amount: '1 tsp', name: 'Cumin' },
      { amount: '', name: 'Coriander, salt' },
    ],
    steps: [
      { order: 1, title: 'Bloom the spices', text: 'Fry onion, cumin and curry paste until fragrant.' },
      { order: 2, title: 'Build the sauce', text: 'Add tomatoes and cook down into a thick masala.' },
      { order: 3, title: 'Simmer', text: 'Stir in chickpeas and coconut milk, simmer 8 minutes.' },
      { order: 4, title: 'Serve', text: 'Season and finish with fresh coriander.' },
    ],
  },
  gourmet: {
    your: [
      { amount: '2', name: 'Beef medallions' }, { amount: '200g', name: 'Asparagus' },
      { amount: '150g', name: 'Potatoes' }, { amount: '1', name: 'Shallot' },
    ],
    extra: [
      { amount: '50ml', name: 'Red wine' }, { amount: '30g', name: 'Butter' },
      { amount: '', name: 'Thyme, sea salt' },
    ],
    steps: [
      { order: 1, title: 'Sear the beef', text: 'Sear the medallions in butter, then rest them warm.' },
      { order: 2, title: 'Reduce a jus', text: 'Deglaze with red wine and shallot, reduce to a glossy jus.' },
      { order: 3, title: 'Cook the sides', text: 'Roast the potatoes and blanch the asparagus.' },
      { order: 4, title: 'Plate', text: 'Arrange neatly and spoon the jus over the beef.' },
    ],
  },
  fusion: {
    your: [
      { amount: '2', name: 'Tortillas' }, { amount: '150g', name: 'Kimchi' },
      { amount: '120g', name: 'Chicken' }, { amount: '50g', name: 'Cheese' },
    ],
    extra: [
      { amount: '1 tbsp', name: 'Gochujang' }, { amount: '1 tsp', name: 'Lime juice' },
      { amount: '', name: 'Coriander, spring onion' },
    ],
    steps: [
      { order: 1, title: 'Cook the filling', text: 'Fry the chicken with gochujang until sticky and cooked.' },
      { order: 2, title: 'Assemble', text: 'Fill tortillas with chicken, kimchi and cheese.' },
      { order: 3, title: 'Crisp up', text: 'Toast in a dry pan until golden and the cheese melts.' },
      { order: 4, title: 'Serve', text: 'Slice, squeeze lime over and scatter coriander.' },
    ],
  },
};

/** Compact per-recipe specs; templates supply ingredients and steps. */
const SPECS = [
  ['pasta-primavera', 'Pasta Primavera', 'italian', 'Vegetarian', 'Quick', 20, 92, [610, 19, 22, 84]],
  ['tomato-basil-penne', 'Tomato Basil Penne', 'italian', 'Vegan', 'Quick', 18, 74, [560, 16, 14, 92]],
  ['spinach-lasagne', 'Spinach Lasagne', 'italian', 'Vegetarian', 'Complex', 55, 88, [720, 28, 30, 78]],
  ['garlic-aglio-olio', 'Aglio e Olio', 'italian', 'Vegan', 'Quick', 15, 65, [590, 15, 20, 90]],
  ['kartoffel-pfanne', 'Bratkartoffel-Pfanne', 'german', 'None', 'Medium', 35, 57, [680, 22, 34, 66]],
  ['krautwickel', 'Krautwickel', 'german', 'None', 'Complex', 60, 61, [640, 30, 28, 58]],
  ['kartoffelsuppe', 'Kartoffelsuppe', 'german', 'Vegetarian', 'Medium', 30, 70, [430, 12, 16, 58]],
  ['linseneintopf', 'Linseneintopf', 'german', 'Vegan', 'Medium', 40, 66, [520, 24, 12, 78]],
  ['miso-tofu-bowl', 'Miso Tofu Bowl', 'japanese', 'Vegan', 'Quick', 20, 81, [540, 22, 16, 74]],
  ['teriyaki-donburi', 'Teriyaki Donburi', 'japanese', 'None', 'Medium', 30, 79, [630, 31, 18, 82]],
  ['veggie-ramen', 'Veggie Ramen', 'japanese', 'Vegetarian', 'Medium', 35, 84, [560, 20, 15, 88]],
  ['onigiri-plate', 'Onigiri Plate', 'japanese', 'Vegan', 'Quick', 18, 58, [470, 12, 6, 96]],
  ['chana-masala', 'Chana Masala', 'indian', 'Vegan', 'Medium', 30, 90, [520, 20, 14, 78]],
  ['paneer-curry', 'Paneer Curry', 'indian', 'Vegetarian', 'Medium', 35, 86, [610, 26, 30, 60]],
  ['dal-tadka', 'Dal Tadka', 'indian', 'Vegan', 'Medium', 28, 77, [480, 22, 10, 74]],
  ['aloo-gobi', 'Aloo Gobi', 'indian', 'Vegan', 'Medium', 32, 69, [440, 12, 14, 68]],
  ['beef-medallions', 'Beef Medallions', 'gourmet', 'Keto', 'Complex', 50, 93, [720, 44, 46, 12]],
  ['duck-breast', 'Seared Duck Breast', 'gourmet', 'Keto', 'Complex', 55, 88, [780, 40, 52, 10]],
  ['risotto-truffle', 'Truffle Risotto', 'gourmet', 'Vegetarian', 'Complex', 45, 91, [690, 18, 30, 82]],
  ['scallop-plate', 'Pan-Seared Scallops', 'gourmet', 'Keto', 'Complex', 40, 85, [520, 34, 28, 8]],
  ['kimchi-quesadilla', 'Kimchi Quesadilla', 'fusion', 'None', 'Quick', 20, 83, [640, 30, 32, 54]],
  ['sushi-burrito', 'Sushi Burrito', 'fusion', 'None', 'Medium', 30, 87, [600, 26, 18, 80]],
  ['bulgogi-tacos', 'Bulgogi Tacos', 'fusion', 'None', 'Medium', 28, 90, [580, 32, 22, 60]],
  ['curry-ramen-fusion', 'Curry Ramen', 'fusion', 'Vegetarian', 'Medium', 32, 72, [560, 19, 20, 74]],
];

/** Build a full recipe object from a compact spec. */
function makeRecipe(spec, i) {
  const [id, title, cuisine, diet, label, time, likes, macros] = spec;
  const cooks = (i % 2) + 1;
  return {
    id, index: i + 1, title, cookingTimeMin: time,
    cuisine: cap(cuisine), timeLabel: label, diet, likes,
    cooks, portions: 2 + (i % 3),
    nutrition: { calories: macros[0], protein: macros[1], fat: macros[2], carbs: macros[3] },
    yourIngredients: TEMPLATES[cuisine].your,
    extraIngredients: TEMPLATES[cuisine].extra,
    steps: assignChefs(TEMPLATES[cuisine].steps, cooks),
  };
}

/** Distribute template steps round-robin across the given number of cooks. */
function assignChefs(steps, cooks) {
  return steps.map((step) => ({ ...step, chef: ((step.order - 1) % cooks) + 1 }));
}

/** Capitalise the first letter of a cuisine key. */
function cap(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Write all generated recipes to Firestore in one batch. */
async function main() {
  const keyPath = process.argv[2];
  if (!keyPath) return fail('Usage: node seed.mjs <serviceAccountKey.json>');
  initializeApp({ credential: cert(JSON.parse(readFileSync(keyPath, 'utf8'))) });
  const db = getFirestore();
  const batch = db.batch();
  SPECS.map(makeRecipe).forEach((r) => batch.set(db.collection('recipes').doc(r.id), r));
  await batch.commit();
  console.log(`Seeded ${SPECS.length} recipes into the "recipes" collection.`);
}

/** Print an error message and exit. */
function fail(message) {
  console.error(message);
  process.exit(1);
}

main().catch(fail);
