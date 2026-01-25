---
title: React—function component的各種點記法(dot notation) JSX的使用技巧
slug: 2022-10-19T13:31:00.000Z
date: 2022-10-19T13:31:00.000Z
tags: ["React"]
---

<style> 
.rem25{
font-size:2.5rem;
}
.rem40{
font-size:4.0rem;
}
.red {
color:red;
}
.gray{
background-color:#d3d3d3;
}
</style>

本日探討各種jsx的渲染，包含各種dot notaion方式、使用方括號變數動態使用component、條件渲染和使用jsx的使用技巧。

## 點記法render

官方文件中說明可以使用Dot Notation 的方式，下列引自於官方文件

```jsx
import React from 'react';
const MyComponents = {
  DatePicker: function DatePicker(props) {
    return <div>Imagine a {props.color} datepicker here.</div>;
  }
}
function BlueDatePicker() {
  return <MyComponents.DatePicker color="blue" />;
}
```

### Function component包含Function compoenet—使用點記法

依照官方的說法MyComponents是一個物件裡面有許多component，我們可以直接用Dot Notation的方式。

而我希望MyComponent可以不僅只是物件，也是一個FunctionComponent

因此也可以改寫成以下的形式，透過下列的方式也是FunctionComponent

```jsx
import React from 'react'
const Header = () => {
    return (
        <header>Header</header>
    )
}
const Footer = () => {
    return (
        <footer>Footer</footer>
    )
}
const Content = () => {
    return (
        <article>Content</article>
    )
}
const Layout = ({children}) => {
    return (
      <>
        {children}
      </>
    )
}
Layout.Header = Header;
Layout.Footer = Footer;
Layout.Content = Content;
export default Layout
```

在import的地方可以撰寫如下

```jsx
<Layout>
  <Layout.Header></Layout.Header>
  <Layout.Content></Layout.Content>
  <Layout.Footer></Layout.Footer>
</Layout>
```

### 全部匯入的方式來使用點記法

我們可以透過<span class="red">import * as name</span>的方式也能比較好在日後觀看程式碼的地方直覺知道是屬於同類型的東西

程式碼如下

首先匯出的檔案命名叫做<span class="red">Layout.js</span>

```jsx
import React from 'react'
export const Header = () => {
    return (
        <header>Header</header>
    )
}
export const Footer = () => {
    return (
        <footer>Footer</footer>
    )
}
export const Content = () => {
    return (
        <article>Content</article>
    )
}
export const Wrapper = () => {
    return (
        <div>
            <Header />
            <Content />
            <Footer />
        </div>
    )
}
```

在引入的地方使用<span class="red">*</span>然後命名如下

```jsx
import * as Layout from "./Layout.js";

const App = () => (
  <Layout.Wrapper>
    <Layout.Header/>
    <Layout.Footer/>
  </Layout.Wrapper>
);
```

上述的寫法使得我們觀看**Wrapper**和**Header**可以理解成同類型的東西，使閱讀性提高。
## jsx的使用技巧

以下則會提到jsx的各種使用技巧，讓我們實務上更好處理渲染的UI。

### 使用變數的方式動態選擇render的元件

另外我們也可以根據種類的不同，渲染component，例如原先檔案如下

```jsx
import React from 'react'
export const Header = () => {
    return (
        <header>Header</header>
    )
}
export const Footer = () => {
    return (
        <footer>Footer</footer>
    )
}
export const Content = () => {
    return (
        <article>Content</article>
    )
}

export const AllComponent = {
    Header,
    Footer,
    Content
}
```

在使用的時候變數name可能是不一樣的值，可以使用中括號的方式達到動態渲染component，如下

```javascript
import { AllComponent } from './Layout'
function App(props) {
  const name = "Header";
  const ComponentA = AllComponent[name];
  return (
    <div className="App">
      <ComponentA />
    </div>
  )
}
export default App
```

上面很常遇到的情況是會根據props傳遞不一樣的內容，而選擇render不一樣的元件。

### 直接return 陣列

另外jsx也可以回傳陣列例如

```jsx
function AComponent() {
  return (
    [
      <div>test1</div>
    , <div>test2</div>
    ]
  )
}
```

我們就不用撰寫刻意再撰寫一個[fragment](https://reactjs.org/docs/fragments.html)

```jsx
function AComponent() {
  return (
    <>
      <div>test1</div>,
      <div>test2</div>
    </>
  )
}
```

### 條件渲染
我們可以使用&&的邏輯運算元達到條件渲染，例如有一個變數是showHeader，
如果前面是true的話，就渲染後面，如果是false的話，就不渲染
```jsx
<div>
  {showHeader && <Header />}
  <Content />
</div>
```

### boolean、null、underfined被忽略

為什麼可以使用上述的方式進行條件渲染是因為在jsx中，**Booleans, Null, 與 Undefined** 都會被忽略，<span class="red">值得一提的是0會被印出來</span>
以下都是一樣的結果

```jsx
<div />
<div></div>
<div>{false}</div>
<div>{null}</div>
<div>{undefined}</div>
<div>{true}</div>
```

所以我們如果要讓不是0才渲染的話就改用以下寫法
```jsx
<div>
  { a>0 && <Header />}
  <Content />
</div>
```

### 直接return null 避免被渲染

另外在component的地方可以使用return null就能避免被渲染

```jsx
function App() {
  if(a>1){
    return null
  }
  return (
    <div className="App">
      <AComponent>

      </AComponent>
    </div>
  )
}
```

## 小結
以上使用各種點記法的方式和jsx的使用技巧來達到渲染UI，希望對大家有所幫助![/images/emoticon/emoticon41.gif](/images/emoticon/emoticon41.gif)

##### 參考資料
- [JSX In Depth](https://reactjs.org/docs/jsx-in-depth.html)
- [Using dot notation with functional component](https://stackoverflow.com/questions/60882627/using-dot-notation-with-functional-component)