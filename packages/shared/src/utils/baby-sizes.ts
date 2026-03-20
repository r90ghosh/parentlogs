export interface BabySize {
  week: number
  fruit: string
  emoji: string
  lengthInches: string
  weightOz: string
}

export const babySizes: BabySize[] = [
  { week: 4, fruit: "Poppy Seed", emoji: "🫛", lengthInches: "0.04", weightOz: "<0.01" },
  { week: 5, fruit: "Sesame Seed", emoji: "🫘", lengthInches: "0.05", weightOz: "<0.01" },
  { week: 6, fruit: "Lentil", emoji: "🫘", lengthInches: "0.08", weightOz: "<0.01" },
  { week: 7, fruit: "Blueberry", emoji: "🫐", lengthInches: "0.3", weightOz: "<0.01" },
  { week: 8, fruit: "Raspberry", emoji: "🍇", lengthInches: "0.6", weightOz: "0.04" },
  { week: 9, fruit: "Cherry", emoji: "🍒", lengthInches: "0.9", weightOz: "0.07" },
  { week: 10, fruit: "Strawberry", emoji: "🍓", lengthInches: "1.2", weightOz: "0.14" },
  { week: 11, fruit: "Lime", emoji: "🍋‍🟩", lengthInches: "1.6", weightOz: "0.25" },
  { week: 12, fruit: "Plum", emoji: "🍑", lengthInches: "2.1", weightOz: "0.5" },
  { week: 13, fruit: "Lemon", emoji: "🍋", lengthInches: "2.9", weightOz: "0.8" },
  { week: 14, fruit: "Peach", emoji: "🍑", lengthInches: "3.4", weightOz: "1.5" },
  { week: 15, fruit: "Apple", emoji: "🍎", lengthInches: "4.0", weightOz: "2.5" },
  { week: 16, fruit: "Avocado", emoji: "🥑", lengthInches: "4.6", weightOz: "3.5" },
  { week: 17, fruit: "Pear", emoji: "🍐", lengthInches: "5.1", weightOz: "5.0" },
  { week: 18, fruit: "Bell Pepper", emoji: "🫑", lengthInches: "5.6", weightOz: "6.7" },
  { week: 19, fruit: "Mango", emoji: "🥭", lengthInches: "6.0", weightOz: "8.5" },
  { week: 20, fruit: "Banana", emoji: "🍌", lengthInches: "6.5", weightOz: "10.6" },
  { week: 21, fruit: "Carrot", emoji: "🥕", lengthInches: "10.5", weightOz: "12.7" },
  { week: 22, fruit: "Papaya", emoji: "🥭", lengthInches: "10.9", weightOz: "15.2" },
  { week: 23, fruit: "Grapefruit", emoji: "🍊", lengthInches: "11.4", weightOz: "1.1 lb" },
  { week: 24, fruit: "Cantaloupe", emoji: "🍈", lengthInches: "11.8", weightOz: "1.3 lb" },
  { week: 25, fruit: "Cauliflower", emoji: "🥬", lengthInches: "13.6", weightOz: "1.5 lb" },
  { week: 26, fruit: "Lettuce", emoji: "🥬", lengthInches: "14.0", weightOz: "1.7 lb" },
  { week: 27, fruit: "Cabbage", emoji: "🥬", lengthInches: "14.4", weightOz: "1.9 lb" },
  { week: 28, fruit: "Eggplant", emoji: "🍆", lengthInches: "14.8", weightOz: "2.2 lb" },
  { week: 29, fruit: "Butternut Squash", emoji: "🎃", lengthInches: "15.2", weightOz: "2.5 lb" },
  { week: 30, fruit: "Coconut", emoji: "🥥", lengthInches: "15.7", weightOz: "2.9 lb" },
  { week: 31, fruit: "Pineapple", emoji: "🍍", lengthInches: "16.2", weightOz: "3.3 lb" },
  { week: 32, fruit: "Squash", emoji: "🎃", lengthInches: "16.7", weightOz: "3.7 lb" },
  { week: 33, fruit: "Celery", emoji: "🥬", lengthInches: "17.2", weightOz: "4.2 lb" },
  { week: 34, fruit: "Cantaloupe", emoji: "🍈", lengthInches: "17.7", weightOz: "4.7 lb" },
  { week: 35, fruit: "Honeydew", emoji: "🍈", lengthInches: "18.2", weightOz: "5.2 lb" },
  { week: 36, fruit: "Romaine Lettuce", emoji: "🥬", lengthInches: "18.7", weightOz: "5.8 lb" },
  { week: 37, fruit: "Swiss Chard", emoji: "🥬", lengthInches: "19.1", weightOz: "6.3 lb" },
  { week: 38, fruit: "Leek", emoji: "🥬", lengthInches: "19.6", weightOz: "6.8 lb" },
  { week: 39, fruit: "Watermelon", emoji: "🍉", lengthInches: "20.0", weightOz: "7.2 lb" },
  { week: 40, fruit: "Pumpkin", emoji: "🎃", lengthInches: "20.2", weightOz: "7.6 lb" },
]

export function getBabySize(week: number): BabySize | undefined {
  return babySizes.find(s => s.week === week)
}

export function formatWeight(size: BabySize): string {
  if (size.weightOz.includes('lb')) return size.weightOz
  if (size.weightOz === '<0.01') return '<0.01 oz'
  return `${size.weightOz} oz`
}

export function formatLength(size: BabySize): string {
  return `${size.lengthInches}"`
}
