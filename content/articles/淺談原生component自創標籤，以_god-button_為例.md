---
title: 淺談原生 component 自創標籤，以<god-button>為例
slug: 2021-06-23T03:35:00.000Z
date: 2021-06-23T03:35:00.000Z
tags: ["Javascript"]
---
<style> 
.rem25{
font-size:2.5rem;
}
.rem40{
font-size:4.0rem;
}
.rem50{
  font-size:5.0rem;
}
.red {
color:red;
}
.gray{
background-color:#d3d3d3;
}
</style>


## Why component

[Can I Use Web Component](https://caniuse.com/?search=web%20component)

藉由組件的封裝減少頁面上各個元素相互影響。

## 物件導向三大特性

封裝、繼承、多型

以現實生活舉例:電風扇、手槍、散彈槍、步槍。

## 瀏覽器開啟 shadowDom

[shadowmMDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)

### 關於 shadowDom

input 也是屬於一種 shadowDom 如下圖

![](https://imgur.com/9JJaqLF.jpg)
![](https://i.imgur.com/2I4B3X8.png)

可更改的 shadowDom
[可附加 shadowm](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow)

![](https://i.imgur.com/jWdjr5H.png)

MDN 的內容
[使用自定義元素](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)

自定義標籤<span class="red rem25">一定</span>要<span class="red rem40">槓槓</span>
例如<im-dash>
MDN 註解如下
![](https://i.imgur.com/88jg0na.png)

```html{numberLines: true}
class WordCount extends HTMLParagraphElement {
  constructor() {
    // Always call super first in constructor
    super();
    // Element functionality written in here

    ...
  }
}
```

關於 super()小知識

> - 子 class 需要在 constructor()中呼叫 super()來呼叫父層的建構函式
> - super()只能在 constructor()中執行
> - 子類別的 constructor()呼叫 super 之前，this 是沒有指向的，會跑出 Refference Error

建立一個自創按鈕並撰寫 CSS

<span class="rem50 gray">來看 Example1</span>

```html{numberLines: true}
<god-button>

</god-button>
// 建立按鈕元件
class ohMyGodButton extends HTMLElement {
    constructor(){
        super();
        //影子元件開啟
        this.attachShadow({mode:"open"});
        //建立一個"喔我的按鈕"div
        this.ohMyBtn=document.createElement("div");
        //增加CSS樣式(但是這樣不夠優雅)
        this.ohMyBtn.style.display="inline-block";
        this.ohMyBtn.style.backgroundColor="blue";
        this.ohMyBtn.style.color="yellow";
        this.ohMyBtn.style.padding="8px";
        //添加按鈕內的字
        this.ohMyBtn.textContent ="我的按鈕";
        this.shadowRoot.appendChild(this.ohMyBtn);
    }
}

//組件的外部 也就是<自己取的名字></自己取的名字>
window.customElements.define("god-button",ohMyGodButton);
```

透過直接撰寫 style 然後在裡面寫一般的常見的 CSS 寫法優雅多了。
![](https://i.imgur.com/Fn7pnT6.png)

## 用建立一個 < style>標籤的方式撰寫(比較優雅唷)

<span class="rem50 gray">來看 Example2</span>

```javascript{numberLines: true}
// 建立按鈕組件// 建立按鈕組件

class ohMyGodButton extends HTMLElement {
    constructor(){
    super();
    //影子元件開啟
    this.attachShadow({mode:"open"});

    //建立一個"喔我的按鈕"div
    this.ohMyBtn=document.createElement("div");

    //增加CSS樣式
    this.ohMyStyle =document.createElement("style");
    this.ohMyStyle.textContent =`
        .btn{
            display:inline-block;
            color:yellow;
            background-color:blue;
            padding:6px;
        }
    `;
    //添加按鈕內的字
    this.ohMyBtn.textContent ="我的按鈕";
    //放入style標籤到shadow底下
    this.shadowRoot.appendChild(this.ohMyStyle);
     //建立一個CSS的class名叫btn
    this.ohMyBtn.className ="btn";
    //放入該div標籤到shadow底下
    this.shadowRoot.appendChild(this.ohMyBtn);
  }
}
//元件的外部 也就是<自己取的名字></自己取的名字>
window.customElements.define("god-button",ohMyGodButton);

```

![](https://i.imgur.com/Fn7pnT6.png)

<span class="rem50 gray">來看 Example3</span>

## 互不衝突

當我在外面建立一個按鈕而且名字也叫 btn 的 class 的時候並不會影響 god-button 裡面的元素

當我在裡面添加一個 class 名叫做 red 把元素樣式寫在外面的時候也不會影響

![](https://i.imgur.com/WJI942Z.png)

<span class="rem50 gray">來看 Example4</span>

## 模仿 react 的寫法

```html{numberLines: true}
<god-button></god-button>
<button class="btn">我的按鈕</button>

  // 建立按鈕元件
  class ohMyGodButton extends HTMLElement {
      static style = `
          .btn{
              display:inline-block;
              color:yellow;
              background-color:blue;
              padding:6px;
          }
      `
      constructor(){
          super();
          //影子組件開啟
          this.attachShadow({mode:"open"});
          this.styling();
          this.render();
      }
      styling(){
          //放入style標籤到shadow底下
          this.ohMyStyle =document.createElement("style");
          this.ohMyStyle.textContent = this.constructor.style;
          this.shadowRoot.appendChild(this.ohMyStyle);
      }
      render(){
          //建立一個"喔我的按鈕"div
          this.ohMyBtn=document.createElement("div");
          //添加按鈕內的字
          this.ohMyBtn.textContent ="我的按鈕";
          //建立一個CSS的class名叫btn
          this.ohMyBtn.className ="btn";
          //放入該div標籤到shadow底下
          this.shadowRoot.appendChild(this.ohMyBtn);
      }
  }
  //組件的外部 也就是<自己取的名字></自己取的名字>
  window.customElements.define("god-button",ohMyGodButton);
```

<span class="rem50 gray">來看 Example5</span>

## 為何屬性有改變但是畫面卻沒有變化?

```html{numberLines: true}
<body>
    <god-button id="myID"></god-button>
    <button class="btn">我的按鈕</button>
<script>


    // 建立按鈕元件
    class ohMyGodButton extends HTMLElement {
        static style = `
            .btn{
                display:inline-block;
                color:yellow;
                background-color:blue;
                padding:6px;
            }
        `
        constructor(){
            super();
            //影子組件開啟
            let shadow =this.attachShadow({mode:"open"});
            this.styling();
            this.render();
            // console.log(this.shadowRoot);
            console.log(shadow===this.shadowRoot);
        }

        styling(){
            //放入style標籤到shadow底下
            this.ohMyStyle =document.createElement("style");
            this.ohMyStyle.textContent = this.constructor.style;
            this.shadowRoot.appendChild(this.ohMyStyle);
        }
        render(){
            //建立一個"喔我的按鈕"div
            this.ohMyBtn=document.createElement("div");
            //建立一個CSS的class名叫btn
            this.ohMyBtn.className ="btn";
            //得到按鈕的屬性叫做txt並寫入到按鈕的文字當中
            this.ohMyBtn.setAttribute("txt","哈哈");
            this.ohMyBtn.textContent=this.ohMyBtn.getAttribute("txt");
            //放入該div標籤到shadow底下
            this.shadowRoot.appendChild(this.ohMyBtn);
        }

    }
    //組件的外部 也就是<自己取的名字></自己取的名字>
    window.customElements.define("god-button",ohMyGodButton);
    let getBtn = document.querySelector(".btn");

    getBtn.addEventListener('click',function(e){
        const getMyID = document.getElementById('myID');
        getMyID.setAttribute('txt','QQ按到我了');
    })

</script>
</body>
```

![](https://i.imgur.com/KSc4fQG.png)
![](https://i.imgur.com/JcXuRE3.png)

<span class="rem50 gray">來看 Example6</span>

透過外部元件更改屬性的時候，實際上屬性的值是有改變，但是樣式沒有切換
必須撰寫自定義監聽屬性以及當發生屬性被改變時候所執行的函式

<span class="rem25">參見生命週期</span>

[生命週期 MDN](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_custom_elements#%E4%BD%BF%E7%94%A8%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%9B%9E%E8%B0%83%E5%87%BD%E6%95%B0)
[MDN 生命週期範例](https://mdn.github.io/web-components-examples/life-cycle-callbacks/)

需要的是，如果在元素屬性變化後，需要觸發 attributeChangedCallback 這個函式的時候，你必須這個監聽這個。可以通過定義 observedAttributes()獲取函式來實現，observedAttributes()函式可以包含一個回傳語句，回傳一個 數組，包含了需要監聽的屬性名稱：

參見第 11 行和第 26 行

## console.log(shadow===this.shadowRoot);

```html{numberLines: true}
// 建立按鈕元件
class ohMyGodButton extends HTMLElement {
    static style = `
        .btn{
            display:inline-block;
            color:yellow;
            background-color:blue;
            padding:6px;
        }
    `
    //監控txt
    static get observedAttributes(){
        return ['txt'];
    }
    constructor(){
        super();
        //影子組件開啟
        let shadow =this.attachShadow({mode:"open"});
        this.styling();
        this.render();
        // console.log(this.shadowRoot);
        console.log(shadow===this.shadowRoot);

    }
    //當屬性被改變的時候執行的函式
    attributeChangedCallback(name,oldValue,newValue){
        // console.log(name,oldValue,newValue);
        this.render();
    }
    styling(){
        //放入style標籤到shadow底下
        this.ohMyStyle =document.createElement("style");
        this.ohMyStyle.textContent = this.constructor.style;
        this.shadowRoot.appendChild(this.ohMyStyle);
    }
    render(){
        if(this.ohMyBtn){
            this.ohMyBtn.remove();
        }
        //建立一個"喔我的按鈕"div
        this.ohMyBtn=document.createElement("div");
        //建立一個CSS的class名叫btn
        this.ohMyBtn.className ="btn pink";
        //得到按鈕的屬性叫做txt並寫入到按鈕的文字當中
        this.ohMyBtn.textContent=this.getAttribute("txt");
        //放入該div標籤到shadow底下
        this.shadowRoot.appendChild(this.ohMyBtn);
    }
}
//組件的外部 也就是<自己取的名字></自己取的名字>
window.customElements.define("god-button",ohMyGodButton);
let getBtn = document.querySelector(".btn");
getBtn.addEventListener('click',function(e){
    const getMyID = document.getElementById('myID');
    getMyID.setAttribute('txt','QQ按到我了');
})

```

## 其他

內部也可以 link 外部 CSS

[在 vue 裡面使用原生 web component](https://v3.cn.vuejs.org/api/application-config.html#iscustomelement)

[在 react 裡面使用原生 web component](https://reactjs.org/docs/web-components.html#gatsby-focus-wrapper)

[A Complete Introduction to Web Components in 2022](https://kinsta.com/blog/web-components/)

