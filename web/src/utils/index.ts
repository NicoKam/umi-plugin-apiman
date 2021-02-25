export const changeArr = <T>(arr: T[], index: number, newItem: T) => {
  const newArr = arr.map((item, i) => (index === i ? newItem : item));
  if (newArr.length <= index) {
    newArr[index] = newItem;
  }
  return newArr;
};

export const toggleArr = <T>(arr: T[], item: T): T[] => {
  const newArr = arr.filter(i => i !== item);
  if (newArr.length === arr.length) {
    newArr.push(item);
  }
  return newArr;
};
