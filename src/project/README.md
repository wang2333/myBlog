---
title: 项目优化
icon: fas fa-bars-progress
sticky: 6
category:
  - 项目经验
tag:
  - 性能优化
---

项目开发中的优化手段，包含前端框架的开发优化和项目打包、项目运行时的优化。

<!-- more -->

## 性能优化之为什么不要频繁操作 DOM

> 把 DOM 和 JavaScript 各自想象成一个岛屿，它们之间用收费桥梁连接。——《高性能 JavaScript》

- 在浏览器中 DOM 的实现和 ECMAScript 是分离的。
- ES 和 DOM 是两种东西，每次连接都需要消耗性能
- 操作 DOM 会导致重排和重绘，重排会占用、消耗 CPU; 重绘会占用、消耗 GPU

## vdom（snabbdom 库）

- 用 js 模拟 DOM 结构（vnode）
- 新旧 vnode 对比，得出最小的更新范围，最好更新 DOM
- 数据驱动视图的模式下，有效控制 DOM 操作

## Vue 项目优化

- v-if 和 v-show
- v-for 使用 key
- computed 缓存数据
- keep-alive 缓存组件
- 异步组件，路由懒加载
- SSR

## Vue 注意点

### 内存泄露

- 全局变量，全局事件，全局定时器
- 自定义事件

### Vue2 响应式的缺陷

- data 新增属性用 `Vue.set`
- data 删除属性用 `Vue.delete`
- 无法直接修改数据 `arr[index] = value`

### 路由切换时 scroll 到顶部

- SPA 项目的通病（如列表页滚动到第二屏后进入详情页，再返回列表页就 scroll 到顶部了）
- 在列表页缓存数据和 scrollTop 值，当返回列表页渲染组件时，执行 scrollTo(XX)
- 终极方案：MPA+APP WebView

## 如何统一监听 Vue 报错

### errorCaptured 生命周期 参数：(error, vm, info)

- 监听所有下级组件的错误
- 返回 false 阻止向上传播

### errorHandler 配置 参数：(error, vm, info)

- Vue 全局错误监听，所有组件的错误都会汇总到这里
- 但 errorCaptured 返回 false，不会传播到这里
- 阻止向 window.onerror 传播

### window.onerror 参数：(message, source, lineno, colno, error)

- 全局监听所有 JS 的错误，包括异步错误
- 但它是 JS 级别的，识别不了 Vue 组件的信息

## React 项目优化

- css 模拟 v-show
- 循环使用 key
- 使用 Fragment 减少层级
- JSX 中不要定义函数（state 更新时，JSX 会被频繁执行）
- 类组件中，在构造函数中 bind this，使用箭头函数不用 bind this
- 类组件中，使用 shouldComponentUpdate 判断组件是否更新,使用 Rect.PureComent;函数组件中使用 React.memo
- Hooks 缓存数据和函数 (useMemo,useCallback)
- 组件懒加载
  ```js
  // OtherComponent是通过懒加载加载进来的，所以渲染页面的时候可能会有延迟
  const OtherComponent = React.lazy(() => import("./OtherComponent"))
  function MyComponent() {
    return (
      <div>
        <!--  使用了Suspense之后，可优化交互 -->
        <Suspense fallback={<div>Loading...</div>}>
          <OtherComponent />
        </Suspense>
      </div>
    )
  }
  ```

## React 注意点

- 自定义组件名称首字母大写
- JS 关键字的冲突
  ```js
  // for改为htmlFor，class改为className
  <label htmlFor='input-name' className='xxx'>
    <input id='input-name' />
  </label>
  ```
- JSX 的数据类型
- setState 是异步更新

## 如何统一监听 React 报错

- 自定义 ErrorBoundDary 组件，使用 componentDidCatch 生命周期
  - 监听所有下级组件报错，可降级展示 UI
  - 只监听组件渲染时报错，不监听 DOM 事件和异步错误
  - production 环境生效，dev 环境会直接抛出错误
- 事件报错使用 try-catch 或 window.onerror
- 异步报错使用 window.onerror

## Vue2 Vue3 React 三者 diff 算法区别？

> Tree Diff 优化
>
> - 只比较同一层级，不跨级比较
> - tag 不同则删除重建（不再去比较内部的细节）
> - 子节点通过 key 区分（key 的重要性）

- Vue2：双端比较
- Vue3：最长递增子序列比较
- React：仅右移

## Vue React 为何循环时需要使用 key？

- vdom diff 算法会根据 key 判断元素是否删除
- 匹配了 key，则只需要移动元素，性能较好
- 为匹配 key，则删除重建，性能较差

## 前端性能指标

- First Paint (FP)： 第一次渲染
- First Contentful Paint (FCP)： 第一次有内容渲染
- DomContentLoaded (DCL)： DOM 内容全部加载完成
- Largest Contentfull Paint： 最大内容的渲染
- Load (L)： 全部加载完成

## 优化工具

- Chrome devTools
  - Performance 上可查看性能指标，并有网络快照
  - Network 查看资源加载时间
- Lightouse

## 优化方向

- 多使用内存、缓存或其他方法
- 减少 CPU 计算量，减少网络加载耗时

方法：

1. 减少资源体积：压缩代码
2. 减少访问次数：合并代码、服务端渲染、缓存
3. 更快的网络：CDN
4. 懒加载
5. DOM 操作优化

### 加载慢

- 优化服务端硬件配置，使用 CDN
- 路由懒加载，大组件异步加载，减少主包体积
- 优化 http 缓存策略

### 渲染慢

- 优化服务端接口
- 优化前端组件内部逻辑

### 持续跟进

- 性能优化是一个循序渐进的过程
- 持续跟进统计结果，再逐步分析性能瓶颈，持续优化
