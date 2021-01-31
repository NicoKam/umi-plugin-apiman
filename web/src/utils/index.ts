export const changeArr = <T>(arr: T[], index: number, newItem: T) =>
  arr.map((item, i) => index === i ? newItem : item);
