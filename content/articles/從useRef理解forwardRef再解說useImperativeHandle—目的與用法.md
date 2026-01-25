---
title: 從useRef理解forwardRef再解說useImperativeHandle—目的與用法
slug: 2022-11-02T07:55:00.000Z
date: 2022-11-02T07:55:00.000Z
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

本文章將包含以下內容

本文章將包含以下內容
- 為什麼需要forwardRef
  - 回顧useRef
  - 直接將ref加在component上
  - forwardRef說明
  - forwardRef使用步驟
- useImperativeHandle介紹
  - useImperativeHandle使用方式
  - 為什麼需要useImperativeHandle
- 小結

## 為什麼需要forwardRef

本小節將透過回顧useRef的範例以及ref加註在component的error message來回推使用forwardRef的使用時機。

### 回顧useRef

回顧一下useRef的用法，useRef用來存取實際DOM元素，以下透過ref的props可以得到實際DOM的element。

```jsx
function App() {
  const divRefContrainer = useRef(null);
  return (
    <div className="test" ref={divRefContrainer}>嗨</div>
  )
}
```

### 直接將ref加在component上
那如果我們嘗試著將**ref**加到**Component**的話會發生什麼事呢?

觀看以下範例

```jsx
import React, { useRef } from "react";
function InputField({ ref }) {
  return <input type="text" ref={ref} />;
}
export default function App() {
  const inputRef = useRef();
  return (
    <div className="App">
      <InputField ref={inputRef} />
    </div>
  );
}
```

如下圖

![](https://i.imgur.com/MUEL3dD.png)
![](https://i.imgur.com/0rNMOhj.png)

因此當我們想要<span class="red">讓父元件存取子元件的ref</span>的時候就得需要<span class="red">forwardRef將其子元件的ref暴露給父元件使用</span>。

### forwardRef說明
詳細說明可以參考

根據react Beta官方的解釋如下
> forwardRef lets your component expose a DOM node to parent component with a ref.

大致意思是
如果想要讓父元件可以存取到子元件的**DOM節點**(**DOM node**)的話就得仰賴**forwardRef**的幫助，定義完component給**fowardRef**進行傳遞後，在父元件就能拿到子元件的節點了。

### forwardRef使用步驟

1. forwardRef包裹你的component
2. component傳入props和ref
3. 在父層透過ref來存取其DOM

```jsx
import React, { useRef, forwardRef } from "react";
const ForwardRefMyInput = forwardRef(
  function InputField(props, ref) {
    return (
      <>
        <input {...props}
            ref={ref}
            type="text" />
      </>
    );
  }
)

export default function App() {
  const inputRef = useRef();
  const clickHandler = () => {
    console.log(inputRef.current);
  }
  return (
    <div className="App">
        <ForwardRefMyInput ref={inputRef} />
        <button onClick={clickHandler}>按鈕</button>
    </div>
  );
}
```

最後就能如願印出**input**元件了。

![](https://i.imgur.com/PLpZCR3.png)

## useImperativeHandle介紹

本小節將實現一個useImperativeHandle的範例來解說useImperativeHandle的使用方式

### useImperativeHandle使用方式
通常可以讓父元件得到子元件某些自定義方法，根據[react官方文件](https://zh-hant.reactjs.org/docs/hooks-reference.html#useimperativehandle)，此**hook**應當與**forwordRef**一起使用，換句話說，如果想要使用**useImperativeHandle**的話就得與**useRef、forwardRef**一起使用。

觀看以下程式碼
```jsx
import React, { useRef, forwardRef, useImperativeHandle } from "react";
const ForwardRefMyInput = forwardRef(
  function InputField(props, ref) {
    const inputRef = useRef();
    useImperativeHandle(ref, () => ({
      focus: () => {
          inputRef.current.focus();
      }
    }));
    return (
      <>
        <input {...props}
          ref={inputRef}
          type="text" />
      </>
    );
  }
)
export default function App() {
  const parentInputRef = useRef();
  const clickHandler = () => {
    console.log(parentInputRef.current);
  }
  return (
    <div className="App">
      <ForwardRefMyInput ref={parentInputRef} />
      <button onClick={clickHandler}>按鈕</button>
    </div>
  );
}
```

透過自定義的function叫做focus函式回傳，我們父層就能透過宣告**useRef**的方式拿取子元件所暴露的方法，最後如下圖。

![](https://i.imgur.com/K1tqiTd.png)

### 為什麼需要useImperativeHandle

當我們元件裡面有許多元素的時候

可以透過**useImperativeHandle**<span class="red">限制</span>子元素所暴露的方法

另一方面也理解成<span class="red">指定</span>**useImperativeHandle**所暴露的方法。

<span class="red">達到</span>透過父元件操控子元件指定的DOM屬性。

## 小結

當我們實際在撰寫react的時候，如果要透過父元件操控子元件的某些屬性或方法的時候就得考慮**useImperativeHandle**或**forwardRef**

以上如果解說有誤歡迎糾正。

##### 參考資料

- [useImperativeHandle Hook Ultimate Guide](https://blog.webdevsimplified.com/2022-06/use-imperative-handle/)
- [React Hooks: 使用 useImperativeHandle 來跟子元件互動](https://z3388638.medium.com/react-hooks-%E4%BD%BF%E7%94%A8-useimperativehandle-%E4%BE%86%E8%B7%9F%E5%AD%90%E5%85%83%E4%BB%B6%E4%BA%92%E5%8B%95-2b543bec3e8a)
- [最陌生的hooks: useImperativeHandle](https://segmentfault.com/a/1190000040758640)
- [react-官方文件](https://reactjs.org/docs/hooks-reference.html#useimperativehandle)
- [react-beta官方文件](https://beta.reactjs.org/apis/react/useRef#referencing-a-value-with-a-ref)