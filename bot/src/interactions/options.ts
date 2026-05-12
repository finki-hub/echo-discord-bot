const transformations = {
  а: ['a'],
  А: ['A'],
  б: ['b'],
  Б: ['B'],
  в: ['v'],
  В: ['V'],
  г: ['g'],
  Г: ['G'],
  ѓ: ['g', 'gj'],
  Ѓ: ['G', 'GJ'],
  д: ['d'],
  Д: ['D'],
  е: ['e'],
  Е: ['E'],
  ж: ['z', 'zh'],
  Ж: ['Z', 'ZH'],
  з: ['z'],
  З: ['Z'],
  ѕ: ['z', 'dz'],
  Ѕ: ['Z', 'DZ'],
  и: ['i'],
  И: ['I'],
  ј: ['j'],
  Ј: ['J'],
  к: ['k'],
  К: ['K'],
  ќ: ['k', 'kj'],
  Ќ: ['K', 'KJ'],
  л: ['l'],
  Л: ['L'],
  љ: ['l', 'lj'],
  Љ: ['L', 'LJ'],
  м: ['m'],
  М: ['M'],
  н: ['n'],
  Н: ['N'],
  њ: ['n', 'nj'],
  Њ: ['N', 'NJ'],
  о: ['o'],
  О: ['O'],
  п: ['p'],
  П: ['P'],
  р: ['r'],
  Р: ['R'],
  с: ['s'],
  С: ['S'],
  т: ['t'],
  Т: ['T'],
  у: ['u'],
  У: ['U'],
  ф: ['f'],
  Ф: ['F'],
  х: ['h'],
  Х: ['H'],
  ц: ['c'],
  Ц: ['C'],
  ч: ['c', 'ch'],
  Ч: ['C', 'CH'],
  џ: ['d', 'dz', 'dzh', 'dj'],
  Џ: ['D', 'DZ', 'DZH', 'DJ'],
  ш: ['s', 'sh'],
  Ш: ['S', 'SH'],
};

const transformWords = (word: string) => {
  const suffixes = word.length === 1 ? [''] : transformWords(word.slice(1));

  const transformedWords: string[] = [];

  // @ts-expect-error even if this is undefined, nullish coalescing works just fine
  for (const letter of transformations[word[0]] ?? word[0]) {
    for (const suffix of suffixes) {
      transformedWords.push(letter + suffix);
    }
  }

  return transformedWords;
};

export const transformOptions = (options: string[]) => {
  const results: Record<string, string> = {};

  for (const option of options) {
    for (const transformedOption of transformWords(option)) {
      results[transformedOption] = option;
    }

    results[option] = option;
  }

  return results;
};

export const createOptions = (options: Array<[string, string]>) =>
  options
    .map(([, value]) => ({
      name: value,
      value,
    }))
    .filter(
      (element, index, array) =>
        array.findIndex((item) => item.name === element.name) === index,
    )
    .slice(0, 25);
