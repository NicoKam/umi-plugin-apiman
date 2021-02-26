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

/**
 * 递归遍历搜索树结构
 * @param treeData 树结构
 * @param callback 处理函数
 * @param childrenPropName children的名称
 * @param path 不用传
 * @param parentSearched 不用传 是否命中
 */
export function treeSearch<T extends Record<string, unknown>>(
  treeData: T[],
  callback: (item: T, path: T[]) => boolean | Partial<T>,
  childrenPropName = 'children',
  path: T[] = [],
  parentSearched = false,
): T[] {
  const res = treeData
    .map((item) => {
      const result = callback(item, path);
      let children: T[] = [];

      const curChildren = item[childrenPropName];
      const hasChild = Array.isArray(curChildren) && curChildren.length > 0;
      if (hasChild) {
        // 递归搜索
        children = treeSearch(
          item[childrenPropName] as T[],
          callback,
          childrenPropName,
          [...path, item],
          parentSearched || result !== false,
        );
      }

      // 在父节点未命中且未命中子节点的情况下，视为当前节点无效
      if (!parentSearched && children.length === 0) {
        return false;
      }

      if (typeof result === 'object') {
        return {
          ...item,
          ...result,
        };
      }

      return item;
    })
    .filter(item => item !== false) as T[];
  return res;
}

type TreeItem = {
  name: string;
  children?: TreeItem[];
};

const treeData: TreeItem[] = [
  {
    name: '1',
    children: [
      {
        name: '1-1',
        children: [{ name: '1-1-1' }],
      },
      {
        name: '1-2',
        children: [{ name: '1-2-1' }, { name: '1-2-2' }],
      },
    ],
  },
  {
    name: '2',
    children: [
      {
        name: '2-1',
        children: [{ name: '2-1-1' }, { name: '2-1-2' }],
      },
      {
        name: '2-2',
        children: [{ name: '2-2-1' }, { name: '2-2-2' }, { name: '2-2-3' }],
      },
      {
        name: '2-3',
      },
    ],
  },
];

const res = treeSearch(treeData, (item) => {
  if (item.name.includes('2')) return true;
  return false;
});

function printTree(treeData: TreeItem[] = [], level = 0) {
  treeData.forEach((item) => {
    // eslint-disable-next-line no-console
    console.log(' '.repeat(level * 2) + item.name);
    printTree(item.children, level + 1);
  });
}

printTree(res);
