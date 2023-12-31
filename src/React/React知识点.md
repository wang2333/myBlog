---
title: React知识点
sticky: 4
icon: fab fa-react
category:
  - 前端框架
tag:
  - React
---

React，用于构建用户界面的 JavaScript 库，只提供了 UI 层面的解决方案
遵循组件设计模式、声明式编程范式和函数式编程概念，以使前端应用程序更高效
使用虚拟 DOM 来有效地操作 DOM，遵循从高阶组件到低阶组件的单向数据流
帮助我们将界面成了各个独立的小块，每一个块就是组件，这些组件之间可以组合、嵌套，构成整体页面

<!-- more -->

## 生命周期

父子组件生命周期和 Vue 一样

- 创建阶段
  - constructor：通常的操作为初始化 state 状态或者在 this 上挂载方法
  - render：用于渲染 DOM 结构，可以访问组件 state 与 prop 属性
  - componentDidMount：组件挂载到真实 DOM 节点后执行，其在 render 方法之后执行。此方法多用于执行一些数据获取，事件监听等操作
- 更新阶段
  - shouldComponentUpdate：告知组件本身基于当前的 props 和 state 是否需要重新渲染组件，默认情况返回 true
  - render
  - componentDidUpdate：组件更新结束后触发
- 卸载阶段
  - componentWillUnmount：组件卸载前，清理一些注册是监听事件，或者取消订阅的网络请求等

## React 事件中为何 bind this

- JS 中的 this 是由函数调用者调用的时候决定的。
- 箭头函数体内的 this 对象，就是定义时所在的对象，而不是使用时所在的对象。

## 事件绑定

- React16 事件绑定到 document
- React17 事件绑定到 root 组件上
- 有利于多个 React 版本共存，例如微前端

## 合成事件

```javascript
<button onClick={handleClick}>button</button>;
const handleClick = e => {
  console.log(e); // SyntheticBaseEvent
  console.log(e.target); // button
  console.log(e.currentTarget); // button
  console.log(e.nativeEvent.target); // button
  console.log(e.nativeEvent.currentTarget); // #root
};
```

- 更好的兼容性和跨平台
- 全部挂载到 document 上，减少内存消耗，避免频繁解绑
- 方便事件的统一管理（如事务机制）

## 受控组件和非受控组件

- 两者的区别就在于组件内部的状态是否是全程受控的
- 受控组件的状态全程响应外部数据的变化
- 非受控组件只是在初始化的时候接受外部数据，然后就自己在内部维护状态了

## super() 和 super(props) 区别

- 在 React 中，类组件基于 ES6，所以在 constructor 中必须使用 super
- 在调用 super 过程，无论是否传入 props，React 内部都会将 porps 赋值给组件实例 porps 属性中
- 如果只调用了 super()，那么 this.props 在 super() 和构造函数结束之间仍是 undefined

## setState

- setState 主流程

  - this.setState(newState)
  - newState 存入 pending 队列
  - 判断是否处于 batch update
  - 是，则保存组件于 drityComponents 中
  - 否，则遍历所有的 drityComponents，调用 updateCompinent，更新 pending State or props

  ```javascript
  increase = () => {
    // 开始：处于batchUpdate
    // isBatchingUpdates = tue
    this.setState({ count: 1 }); // 此时isBatchingUpdates为false
    setTimeout(() => {
      this.setState({ count: 1 }); // 此时isBatchingUpdates为false
    });
    // 结束，isBatchingUpdates = false
  };
  ```

- setState 异步还是同步
  - 看是否能命中 batchUpdate 机制
  - 判断 isBatchingUpdates
- 哪些能命中 batchUpdate 机制
  - React 可以管理的入口
- setState 合并
  - setState 第一个参数是对象时，会被合并
  - setState 第一个参数是函数时，不会被合并
  - setState 第二个参数是一个回调函数，用于可以实时的获取到更新之后的数据

## 函数组件

- 纯函数，输入 props，输出 JSX
- 没有实例，没有生命周期，没有 state
- 不能扩展其他方法

## Portals 使用场景

> 组价挂载到指定 DOM 元素内

```javascript
return ReactDOM.creatPortal(
  <div>{{this.props.children}}</div>,
  document.body
)
```

## React 组件通讯

- props
- Context
  - 公共信息传递给每个组件
  - 用 props 太繁琐
  - 用 redux 小题大做
- Redux Mobx
- 自定义事件

## React 中如何避免不必要的 render

- shouldComponentUpdate：对 state 和 props，确定是否要重新渲染，默认情况下返回 true
- PureComponent：，通过对 props 和 state 的浅比较结果来实现 shouldComponentUpdate
- React.memo：如果需要深层次比较，这时候可以给 memo 第二个参数传递比较函数

## React 公共逻辑抽离

- HOC：模式简单，但会增加组件层级
- Reader props：代码简介

## react-router 与 react-router-dom 区别

- react-router 提供了路由的核心 api。如 Router、Route、Switch 等，但没有提供有关 dom 操作进行路由跳转的 api
- react-router-dom 是在 react-router 的基础上开发的，提供了 BrowserRouter、Route、Link 等 api。所以安装了 react-router-dom 后就不用再安装 react-router；

## react-router 路由传参的三种方式

- params 传参

  - 优点：刷新页面，参数不丢失
  - 缺点：1.只能传字符串，传值过多 url 会变得很长 2. 参数必须在路由上配置

  ```javascript
  // 路由配置
  { path: '/detail/:id/:name', component: Detail },

  //路由跳转与获取路由参数
  import { useHistory,useParams } from 'react-router-dom';
  const history = useHistory();
  history.push('/detail/2/zora')

  // 获取路由参数
  const params = useParams()
  console.log(params) // {id: "2",name:"zora"}
  ```

- search 传参

- 优点：刷新页面，参数不丢失
- 缺点：1.只能传字符串，传值过多 url 会变得很长 2. 使用 URLSearchParams 获取参数

  ```javascript
  // 路由配置
  { path: '/detail', component: Detail },

  //路由跳转与获取路由参数
  import { useHistory, useLocation } from 'react-router-dom';
  const history = useHistory();
  history.push('/detail?id=2')
  // 或者
  history.push({pathname:'/detail',search:'?id=2'})

  // 获取路由参数
  function useQuery() {
  return new URLSearchParams(useLocation().search);
  }
  const query = useQuery()
  const id = query.get('id') //2
  ```

- state 传参
- 优点：可以传对象
- 缺点： HashRouter 刷新页面，参数丢失

  ```javascript
  // 路由配置
  { path: '/detail', component: Detail },

  //路由跳转与获取路由参数
  import { useHistory,useLocation } from 'react-router-dom';
  const history = useHistory();
  const item = {id:1,name:"zora"}
  // 路由跳转
  history.push(`/user/role/detail`, { id: item });
  // 参数获取
  const {state} = useLocation()
  console.log(state)  // {id:1,name:"zora"}
  ```

## Redux 单向数据流

- `store = redux.createStore(reducer);`
- 通过 store.dispatch 来派发 action
- reducer -> newState
- store.subscrible 方法订阅 store 的改变

## react-redux

- Provider

  在 redux 中存在一个 store 用于存储 state，如果将这个 store 存放在顶层元素中，其他组件都被包裹在顶层元素之上

  那么所有的组件都能够受到 redux 的控制，都能够获取到 redux 中的数据

  ```javascript
  <Provider store = {store}>
    <App />
  <Provider>
  ```

- connect 高阶组件

  connect 方法将 store 上的 getState 和 dispatch 包装成组件的 props

  ```javascript
  import { connect } from 'react-redux';
  Comp = connect(mapStateToProps, mapDispatchToProps)(Comp);
  ```

  - mapStateToProps：把 redux 中的数据映射到 react 中的 props 中去

  ```javascript
  const mapStateToProps = state => {
    return {
      // prop : state.xxx  | 意思是将state中的某个数据映射到props中
      foo: state.bar
    };
  };
  ```

  - mapDispatchToProps：将 redux 中的 dispatch 映射到组件内部的 props 中

  ```javascript
  const mapDispatchToProps = dispatch => {
    // 默认传递参数就是dispatch
    return {
      onClick: () => {
        dispatch({
          type: 'increatment'
        });
      }
    };
  };
  ```

## redux 中间件

- redux-thunk 异步处理中间件
  - redux-thunk 会判断你当前传进来的数据类型，如果是一个函数，将会给函数传入参数值（dispatch，getState）
- redux-saga

## useReducer 和 redux 的区别

- useReducer 时 useState 的替代方案，用于组件有复杂 state 逻辑时使用
- useReducer 是单个组件状态管理，组件通讯还行需要 props
- redux 是全局状态管理，多组件共享状态
-

## React fibel

- React 更新的的两个阶段
  - reconciliation 阶段执行 diff 算法，纯 JS 计算
  - commit 阶段，将 diff 结果渲染到 DOM
- 将 reconciliation 阶段进行任务拆分
- window.requestIdleCallback 当 DOM 需要渲染时暂停

## JSX 本质

> react 通过 babel 把 JSX 转成 createElement 函数，生成 ReactElement 对象，然后通过 ReactDOM.render 函数把 ReactElement 渲染成真是的 DOM 元素

```javascript
const ele = (
  <div id='a'>
    <span>1212</span>
  </div>
);
var ele = React.createElement(
  'div',
  {
    id: 'a'
  },
  React.createElement('span', null, '1212')
);
```
