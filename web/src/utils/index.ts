export const changeArr = <T>(arr: T[], index: number, newItem: T) =>
  arr.map((item, i) => (index === i ? newItem : item));

export const toggleArr = <T>(arr: T[], item: T): T[] => {
  const newArr = arr.filter(i => i !== item);
  if (newArr.length === arr.length) {
    newArr.push(item);
  }
  return newArr;
};
