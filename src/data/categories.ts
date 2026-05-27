export const categories = [
  {
    name: 'Electronics',
    subcategories: ['Laptops', 'Smartphones', 'Tablets', 'Wearables'],
  },
  {
    name: 'Gaming',
    subcategories: ['Consoles', 'PC Gaming', 'Accessories'],
  },
  {
    name: 'Home & Office',
    subcategories: ['Smart Home', 'Printers', 'Monitors'],
  },
  {
    name: 'Accessories',
    subcategories: ['Headphones', 'Speakers', 'Power Banks'],
  },
] as const;

export type CategoryName = (typeof categories)[number]['name'];

const categoryTerms: Record<CategoryName, string[]> = {
  Electronics: ['phone', 'tablet', 'laptop', 'watch', 'wearable', 'electronics'],
  Gaming: ['gaming', 'console', 'controller', 'playstation', 'xbox', 'pc'],
  'Home & Office': ['home', 'office', 'printer', 'monitor', 'smart'],
  Accessories: ['headphone', 'speaker', 'power', 'bank', 'accessory', 'case', 'charger'],
};

const subcategoryTerms: Record<string, string[]> = {
  smartphones: ['phone', 'smartphone', 'iphone', 'pixel', 'motorola', 's23'],
  laptops: ['laptop', 'macbook', 'notebook'],
  tablets: ['tablet', 'ipad'],
  wearables: ['watch', 'wearable'],
  headphones: ['headphone', 'earbud', 'audio'],
  speakers: ['speaker', 'audio'],
  'power-banks': ['power', 'bank', 'charger', 'battery'],
  monitors: ['monitor', 'display'],
  printers: ['printer'],
  'smart-home': ['smart', 'home'],
  consoles: ['console', 'playstation', 'xbox'],
  'pc-gaming': ['gaming', 'pc'],
  accessories: ['accessory', 'case', 'charger', 'headphone', 'speaker'],
};

export const slugify = (value: string): string => value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const getCategoryTerms = (category: string): string[] => {
  const normalized = slugify(category);
  const directCategory = categories.find((item) => slugify(item.name) === normalized);
  if (directCategory) {
    return categoryTerms[directCategory.name];
  }

  const subcategory = categories.flatMap((item) => item.subcategories).find((item) => slugify(item) === normalized);
  return subcategory ? subcategoryTerms[normalized] || subcategory.toLowerCase().split(/\s+/) : [category.toLowerCase()];
};
