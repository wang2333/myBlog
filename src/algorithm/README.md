---
title: 数据结构算法
icon: fas fa-pen
sticky: 5
category:
  - js进阶
tag:
  - 数据结构
  - js进阶
---

前端常见的数据结构和算法

<!-- more -->

## 把一个数据旋转 k 步

`[1,2,3,4,5]` => `[4,5,1,2,3]`

```js
// 时间复杂度O(1)，空间复杂度O(n)
function rotate1(arr: number[], k: number): number[] {
  const length = arr.length;
  if (!k || length === 0) return arr;
  const step = Math.abs(k % length);
  const part1 = arr.slice(-step);
  const part2 = arr.slice(0, length - step);
  return part1.concat(part2);
}

// 时间复杂度O(n^2)，空间复杂度O(1)
function rotate2(arr: number[], k: number): number[] {
  const length = arr.length;
  if (!k || length === 0) return arr;
  const step = Math.abs(k % length);
  for (let i = 0; i < step; i++) {
    // 数组是一个有序结构，unshift操作很慢  O(n)  类似：排座位
    arr.unshift(arr.pop());
  }
  return arr;
}
```

## 判断一个字符串是否包含括号匹配，用栈实现

`{a[b]c}`

```js
// 时间复杂度O(n)，空间复杂度O(n)
function matchBracket(str: string): boolean {
  const length = str.length;
  if (length === 0) return false;
  let stack: string[] = [];
  const leftSymbols = '{[(';
  const rightSymbols = ')]}';
  for (let i = 0; i < length; i++) {
    const s: string = str[i];
    if (leftSymbols.includes(s)) {
      stack.push(s);
    } else if (rightSymbols.includes(s)) {
      const top = stack.slice(-1);
      if (isMatch(top, s)) {
        stack.pop();
      } else {
        return false;
      }
    }
  }
  return stack.length === 0;
}
function isMatch(l: string, r: string): boolean {
  if (l === '(' && r === ')') return true;
  if (l === '[' && r === ']') return true;
  if (l === '{' && r === '}') return true;
  return false;
}
console.log(matchBracket('{[()]}'));
```

## 两个栈(数组)实现队列

```js
// delete方法时间复杂度O(n)，空间复杂度O(1)
class MuQueue {
  private stack1: number[] = []
  private stack2: number[] = []

  add(num: number) {
    this.stack1.push(num)
  }

  delete(): number | null {
    let res
    const stack1 = this.stack1
    const stack2 = this.stack2
    // 将stack1所有元素移动到stack2中
    while (stack1.length) {
      const n = stack1.pop()
      if (n != null) {
        stack2.push(n)
      }
    }
    // stack2 pop
    res = stack2.pop()
    // 将stack2所有元素返回到stack1中
    while (stack2.length) {
      const n = stack2.pop()
      if (n != null) {
        stack1.push(n)
      }
    }

    return res || null
  }

  get length(): number {
    return this.stack1.length
  }
}

const q = new MuQueue()
q.add(1)
q.add(2)
q.add(3)
q.delete()
console.log(q.length)
```

## 单向链表

- 链表：查询慢 O(n)，新增和删除快 O(1)
- 数组：查询快 O(1)，新增和删除慢 O(n)

```js
interface ILinkListNode {
  value: number,
  next?: ILinkListNode,
}

// 根据数据创建单向链表
function creatLinkList(data: number[]): ILinkListNode {
  const arr = [...data]
  const length = arr.length
  if (length === 0) throw new Error('arr is empty')
  let curNode: ILinkListNode = {
    value: arr[length - 1]
  }
  if (length === 1) return curNode
  for (let i = length - 2; i >= 0; i--) {
    curNode = {
      value: arr[i],
      next: curNode
    }
  }
  return curNode
}

// 反转单向链表，并返回反转后的headNode
function reverseLinkList(listNode: ILinkListNode): ILinkListNode {
  let curNode: ILinkListNode | undefined = undefined
  let prevNode: ILinkListNode | undefined = undefined
  let nextNode: ILinkListNode | undefined = listNode

  while (nextNode) {
    // 第一个元素，next应为空
    if (curNode && !prevNode) {
      delete curNode.next
    }
    // 反转指针
    if (curNode && prevNode) {
      curNode.next = prevNode
    }
    // 整体向后移动指针
    prevNode = curNode
    curNode = nextNode
    nextNode = nextNode?.next
  }
  // 当nextNode为空时未最后一个元素，此时curNode尚未设置next
  curNode!.next = prevNode
  return curNode!
}

const list1 = creatLinkList([10, 20, 30, 40])
console.log(list1)
const list2 = reverseLinkList(list1)
console.log(list2)
```

## 链表实现队列

```js

interface IListNode {
  value: number,
  next: IListNode | null
}
class MyQueue {
  private head: IListNode | null = null
  private tail: IListNode | null = null
  private len: number = 0

  // 从tail位置入队
  add(n: number) {
    const newNode: IListNode = {
      value: n,
      next: null
    }
    // 处理 head
    if (!this.head) {
      this.head = newNode
    }
    // 处理 tail
    const tailNode = this.tail
    if (tailNode) {
      tailNode.next = newNode
    }
    this.tail = newNode
    // 记录长度
    this.len++
  }

  // 从head位置出队
  delete(): number | null {
    const headNode = this.head
    if (headNode == null || this.len <= 0) return null

    // 取值
    const value = headNode.value
    // 处理head
    this.head = headNode.next
    // 记录长度
    this.len--
    return value
  }

  get length(): number {
    // length需要单独存储，否则遍历链表获取的时间复杂度为O(n)
    return this.len
  }
}

const p = new MyQueue()
p.add(1)
p.add(2)
p.add(3)
p.delete()
```

- 二分查找,时间复杂度必包含 O(logn)

```js
// 二分查找(循环实现)
function binarySearch1(arr: number[], target: number): number {
  const length = arr.length;
  if (length === 0) return -1;
  let startIndex = 0;
  let endIndex = length - 1;

  while (startIndex <= endIndex) {
    const midIndex = Math.floor((startIndex + endIndex) / 2);
    const midValue = arr[midIndex];

    if (target < midValue) {
      // 目标值较小，则继续左侧查找
      endIndex = midIndex - 1;
    } else if (target > midValue) {
      // 目标值较大，则继续右侧查找
      startIndex = midIndex + 1;
    } else {
      return midIndex;
    }
  }
  return -1;
}

// 二分查找(递归实现)
function binarySearch2(
  arr: number[],
  target: number,
  startIndex?: number,
  endIndex?: number
): number {
  const length = arr.length;
  if (length === 0) return -1;
  // 开始和结束的范围
  if (startIndex == null) startIndex = 0;
  if (endIndex == null) endIndex = length - 1;
  // 如果start和end相遇，则结束
  if (startIndex > endIndex) return -1;
  // 中间位置
  const midIndex = Math.floor((startIndex + endIndex) / 2);
  const midValue = arr[midIndex];
  if (target < midValue) {
    // 目标值较小，则继续左侧查找
    return binarySearch2(arr, target, startIndex, midIndex - 1);
  } else if (target > midValue) {
    // 目标值较大，则继续右侧查找
    return binarySearch2(arr, target, midIndex + 1, endIndex);
  } else {
    return midIndex;
  }
}

console.log(binarySearch2([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3));
```

## 增量数组中找出一个数组中为 n 的两个数

```js
// 时间复杂度O(n ^ 2)
function findTwoNumbers1(arr: number[], target: number): number[] {
  let res: number[] = [];
  const length = arr.length;
  if (length === 0) return res;
  for (let i = 0; i < arr.length; i++) {
    const n1 = arr[i];
    let flag = false;
    for (let j = i + 1; j < arr.length; j++) {
      const n2 = arr[j];
      if (n1 + n2 === target) {
        res.push(n1);
        res.push(n2);
        flag = true;
        break;
      }
    }
    if (flag) break;
  }
  return res;
}

// 时间复杂度O(n)
function findTwoNumbers2(arr: number[], target: number): number[] {
  let res: number[] = [];
  const length = arr.length;
  if (length === 0) return res;
  let i = 0; // 头指针
  let j = length - 1; // 尾指针
  while (i < j) {
    const sum = arr[i] + arr[j];
    if (sum > target) {
      // 指针左移
      j--;
    } else if (sum < target) {
      // 指针右移
      i++;
    } else {
      res.push(arr[i]);
      res.push(arr[j]);
      break;
    }
  }
  return res;
}

console.log(findTwoNumbers2([1, 2, 3, 4, 5], 5));
```

## 二叉树

- 特点：left>=root right>=root
- 价值：可使用二分法快速查找

```js
interface ITreeNode {
  value: number;
  left: ITreeNode | null;
  right: ITreeNode | null;
}
let arr: number[] = [];
// 二叉树前序遍历（根->左->右）
function preOrderTraverse(node: ITreeNode | null) {
  if (node == null) return;
  arr.push(node.value);
  preOrderTraverse(node.left);
  preOrderTraverse(node.right);
}

// 二叉树中序遍历（左->根->右）
function inOrderTraverse(node: ITreeNode | null) {
  if (node == null) return;
  inOrderTraverse(node.left);
  arr.push(node.value);
  inOrderTraverse(node.right);
}

// 二叉树后序遍历（左->右->根）
function postOrderTraverse(node: ITreeNode | null) {
  if (node == null) return;
  postOrderTraverse(node.left);
  postOrderTraverse(node.right);
  arr.push(node.value);
}

//  寻找二叉搜索树(BST)里的第k小的数
function getKthValue(node: ITreeNode, k: number): number | null {
  inOrderTraverse(node);
  return arr[k - 1] || null;
}

const tree: ITreeNode = {
  value: 5,
  left: {
    value: 3,
    left: {
      value: 2,
      left: null,
      right: null
    },
    right: {
      value: 4,
      left: null,
      right: null
    }
  },
  right: {
    value: 7,
    left: {
      value: 6,
      left: null,
      right: null
    },
    right: {
      value: 8,
      left: null,
      right: null
    }
  }
};

console.log(getKthValue(tree, 2));
```

## 斐波那契数列的第 n 值

```js
// 递归实现，时间复杂度O(2 ^ n)
function fibonacci1(n: number): number {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  return fibonacci1(n - 1) + fibonacci1(n - 2);
}

// 循环实现，时间复杂度O(n)
function fibonacci2(n: number): number {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  let n1 = 1;
  let n2 = 0;
  let result = 0;
  for (let i = 2; i <= n; i++) {
    result = n1 + n2;
    n2 = n1;
    n1 = result;
  }
  return result;
}
// [0, 1, 1, 2, 3, 5, 8, 13]
console.log(fibonacci2(6));
```

## 移动 0 到数组末尾，使用原数组

```js
// 时间复杂度O(n^2)
function moveZero1(arr: number[]) {
  const len = arr.length;
  if (len === 0) return;
  let zeroLen = 0;
  for (let i = 0; i < len - zeroLen; i++) {
    if (arr[i] === 0) {
      arr.push(0);
      arr.splice(i, 1); // O(n)
      // 数组截取一个元素后，i需要递减左移，否则连续0就会报错
      i--;
      zeroLen++;
    }
  }
}

// 双指针，时间复杂度O(n)
function moveZero2(arr: number[]) {
  const len = arr.length;
  if (len === 0) return;
  let j = -1; // 指向一个0
  for (let i = 0; i < len; i++) {
    // 如果为0，j指向0的位置
    if (arr[i] === 0) {
      if (j < 0) {
        j = i;
      }
    }
    //  如果不为0，和j指向的数据交换
    if (arr[i] !== 0 && j >= 0) {
      const n = arr[i];
      arr[i] = arr[j];
      arr[j] = n;
      j++;
    }
  }
}

const arr = [1, 0, 0, 1, 2, 0, 0];
moveZero2(arr);
console.log(arr);
```

## 获取字符串中连续最多的字符及次数

```js
interface IRes {
  char: string;
  length: number;
}
// 双重循环存在跳步，时间复杂度O(n)
function continousChar1(str: string): IRes {
  const len = str.length;
  const res: IRes = {
    char: '',
    length: 0
  };
  if (len === 0) return res;
  let tempLen = 0;
  for (let i = 0; i < len; i++) {
    tempLen = 0;
    for (let j = i; j < len; j++) {
      // 相等时，记录长度
      if (str[i] === str[j]) {
        tempLen++;
      }
      // 不相等或者循环到结束时，判断结果
      if (str[i] !== str[j] || j === len - 1) {
        if (tempLen > res.length) {
          res.char = str[i];
          res.length = tempLen;
        }
        // 跳步
        if (i < len - 1) {
          i = j - 1;
        }
        break;
      }
    }
  }
  return res;
}

// 双指针
function continousChar2(str: string): IRes {
  const len = str.length;
  const res: IRes = {
    char: '',
    length: 0
  };
  if (len === 0) return res;
  let tempLen = 0;
  let j = 0;
  for (let i = 0; i < len; i++) {
    if (str[i] === str[j]) {
      tempLen++;
    }
    if (str[i] !== str[j] || i === len - 1) {
      if (tempLen > res.length) {
        res.char = str[j];
        res.length = tempLen;
      }
      tempLen = 0;
      if (i < len - 1) {
        j = i; // j '追上' i
        i--;
      }
    }
  }
  return res;
}

console.log(continousChar2('aabbbbcccc'));
```

## 快速排序

```js
// 时间复杂度O(nlogn)
function quickSork(arr: number[]): number[] {
  const len = arr.length;
  if (len === 0) return arr;
  const midIndex = Math.floor(len / 2);
  const midValue = arr[midIndex];
  // const midValue = arr.slice(midIndex, midIndex + 1)[0]
  let left: number[] = [];
  let right: number[] = [];
  for (let i = 0; i < len; i++) {
    if (i !== midIndex) {
      if (arr[i] < midValue) {
        left.push(arr[i]);
      } else if (arr[i] > midValue) {
        right.push(arr[i]);
      }
    }
  }
  return quickSork(left).concat([midValue], quickSork(right));
}

console.log(quickSork([2, 5, 7, 4, 8, 2, 1, 0]));
```

## 获取 1-max 的所有对称数（回文）

```js
// 数组反转比较
function findPalindromeNumbers1(max: number): number[] {
  const res: number[] = [];
  if (max <= 0) return res;
  for (let i = 0; i <= max; i++) {
    const s = i.toString();
    if (s === s.split('').reverse().join('')) {
      res.push(i);
    }
  }
  return res;
}

// 字符串首尾比较
function findPalindromeNumbers2(max: number): number[] {
  const res: number[] = [];
  if (max <= 0) return res;
  for (let i = 0; i <= max; i++) {
    const s = i.toString();
    const len = s.length;
    // 字符串收尾比较
    let flag = true;
    let startIndex = 0;
    let endIndex = len - 1;
    while (startIndex < endIndex) {
      if (s[startIndex] !== s[endIndex]) {
        flag = false;
        break;
      } else {
        startIndex++;
        endIndex--;
      }
    }
    if (flag) {
      res.push(i);
    }
  }
  return res;
}

console.log(findPalindromeNumbers2(100));
```

## 数字千分位格式化

```js
function format(num: number): string {
  num = Math.floor(num);
  let res = '';
  const s = num.toString();
  const length = s.length;
  for (let i = length - 1; i >= 0; i--) {
    const j = length - i; // 记录当前数字的位数
    if (j % 3 === 0) {
      res = `,${s[i]}${res}`;
    } else {
      res = `${s[i]}${res}`;
    }
  }
  return res;
}

console.log(format(10200300));
```

## 数组扁平化

```js
function flatten(arr) {
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (Array.isArray(item)) {
      const flatItem = flatten(item);
      flatItem.forEach(n => res.push(n));
    } else {
      res.push(item);
    }
  }
  return res;
}
console.log(flatten([1, 2, [4, [5, [6]]], 3]));
```

## 扁平化数据转树形

```js
function buildTree(list) {
  let map = {};
  let tree = {};
  for (let i in list) {
    map[list[i].id] = list[i];
  }
  for (let key in map) {
    const item = map[key];
    if (item.pId) {
      if (!map[item.pId].children) {
        map[item.pId].children = [];
      }
      map[item.pId].children.push(item);
    } else {
      tree[item.id] = item;
    }
  }
  return tree;
}
let array = [
  { id: 1, pId: 0, name: '四川省' },
  { id: 2, pId: 0, name: '广东省' },
  { id: 5, pId: 1, name: '成都市' }
];
console.log(buildTree(array));
```

## 深度优先遍历

```js
function depthFirstTraverse1(node) {
  console.log(node.id);
  const nodes = node.children;
  if (nodes?.length) {
    nodes.forEach(item => {
      depthFirstTraverse1(item);
    });
  }
}
function depthFirstTraverse2(node) {
  const statck = [];
  statck.push(node);

  while (statck.length > 0) {
    const curNode = statck.pop();
    if (curNode == null) break;
    console.log(curNode.id);
    const nodes = curNode.children;
    if (nodes?.length) {
      nodes.reverse().forEach(child => statck.push(child));
    }
  }
}
depthFirstTraverse2({
  id: 1,
  children: [
    { id: 2, children: [{ id: 4, children: [{ id: 5 }] }] },
    { id: 3, children: [{ id: 6, children: [{ id: 7 }] }] }
  ]
});
```

## 广度优先遍历

```js
function breadthFirstTraverse(node) {
  const queue = [];
  queue.unshift(node);

  while (queue.length > 0) {
    const curNode = queue.pop();
    if (curNode == null) break;
    console.log(curNode.id);
    const nodes = curNode.children;
    if (nodes?.length) {
      nodes.forEach(child => queue.unshift(child));
    }
  }
}
breadthFirstTraverse({
  id: 1,
  children: [
    { id: 2, children: [{ id: 4, children: [{ id: 5 }] }] },
    { id: 3, children: [{ id: 6, children: [{ id: 7 }] }] }
  ]
});
```

## LazyMan 函数，实现 sleep 机制

```js
class LazyMan {
  constructor() {
    this.tasks = [];
    setTimeout(() => {
      this.next();
    }, 0);
  }
  next() {
    const task = this.tasks.shift();
    if (task) {
      task();
    }
  }
  eat(str) {
    const task = () => {
      console.log(`吃${str}`);
      this.next();
    };
    this.tasks.push(task);
    return this;
  }
  sleep(num) {
    const task = () => {
      setTimeout(() => {
        console.log(`休眠${num}s`);
        this.next();
      }, num * 1000);
    };
    this.tasks.push(task);
    return this;
  }
}
const lazyMan = new LazyMan();
lazyMan.eat('苹果').eat('香蕉').sleep(2).eat('橘子');
```

## curry 函数，把其他函数柯里化

```js
function curry(fn) {
  // 获取函数参数长度
  const fnArgLength = fn.length;
  let arg = [];
  function calc(...newArgs) {
    arg = [...arg, ...newArgs];
    if (arg.length < fnArgLength) {
      // 参数不够，返回函数
      return calc;
      // 参数够，返回结果
    } else {
      return fn.apply(this, arg.slice(0, fnArgLength));
    }
  }
  return calc;
}
function add(a, b, c) {
  return a + b + c;
}
let fn = curry(add);
console.log(fn(1)(2)(3));
```

## 实现 instanceOf

```js
function myInstanceOf(instance, origin) {
  const type = typeof instance;
  if (type !== 'object' && type !== 'function') {
    return false;
  }
  let tempInstance = instance;
  while (tempInstance) {
    if (tempInstance.__proto__ === origin.prototype) {
      return true;
    }
    tempInstance = tempInstance.__proto__;
  }
  return false;
}
console.log(myInstanceOf([], Array));
```

## EventBus 自定义事件

```js
class EventBus {
  private onEvents: {
    [key: string]: Array<Function>
  }
  private onceEvents: {
    [key: string]: Array<Function>
  }
  constructor() {
    this.onEvents = {}
    this.onceEvents = {}
  }
  on(key: string, fn: Function,) {
    const onEvents = this.onEvents
    if (onEvents[key] == null) onEvents[key] = []
    this.onEvents[key].push(fn)
  }
  once(key: string, fn: Function) {
    const onceEvents = this.onceEvents
    if (onceEvents[key] == null) onceEvents[key] = []
    this.onceEvents[key].push(fn)
  }
  off(key: string, fn?: Function) {
    let onEvents = this.onEvents
    let onceEvents = this.onceEvents
    if (!fn) {
      this.onEvents[key] = []
      this.onceEvents[key] = []
    } else {
      if (onEvents[key]?.length) {
        this.onEvents[key] = onEvents[key].filter(item => item !== fn)
      }
      if (onceEvents[key]?.length) {
        this.onceEvents[key] = onceEvents[key].filter(item => item !== fn)
      }
    }
  }
  emit(key: string, ...args: any[]) {
    let onEvents = this.onEvents
    let onceEvents = this.onceEvents
    if (onEvents[key]?.length) {
      onEvents[key].forEach(item => item(...args))
    }
    if (onceEvents[key]?.length) {
      onceEvents[key].forEach(item => item(...args))
      this.onceEvents[key] = []
    }
  }
}

function fn1() { console.log('fn1') }
function fn2() { console.log('fn2') }
const e = new EventBus()
e.on('key1', fn1)
e.once('key2', fn2)
e.emit('key1')
e.emit('key2')

```
