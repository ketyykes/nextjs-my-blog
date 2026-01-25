---
title: Javascript—new 關鍵字
slug: 2021-11-25T13:31:00.000Z
date: 2021-11-25T13:31:00.000Z
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


使用 new 的時候會發生四件事情

- 建立一個空的簡單 JavaScript 物件（即{}）；
- 為步驟 1 新建立的物件添加屬性**proto**，將該屬性鏈接至建構子函式的原型對象 ；
- 將步驟 1 新建立的對像作為 this 的上下文 ；
- 如果該函式沒有回傳物件，則回傳 this。

> [new MDN 運算子](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new)

## 函式建構子、new 關鍵字

函式建構子是用來新建物件的一種函式
當函式建構子與 new 運算子一起使用的時候，能夠建立出新物件。

函式建構子可以設定物件的屬性與方法(用 Java 語言描述就是建構子的概念)

以下面的範例為例

```javascript{numberLines: true}
function Motorcycle(brand , model, year) {
  this.brand  = brand ; //constructor 建構子
  this.model = model;
  this.year = year;
}
const motorcycle1 = new Motorcycle('Sym', 'Jet S',2008);
console.log(motorcycle1);
```

這邊就會仿造像是 Java 的 class(類別)的寫法，當使用 new 關鍵字的時候，this 指向的是被 new 出來實體我們藉由帶入 arg 引數的方式做為實體的各種屬性，利入誰的車，什麼廠牌，幾年份。

### 函式建構子沒有和 new 一起使用

如果函式建構子沒有和 new 一起使用就會當成一般的函式呼叫，下面的範例會印出 undefiled，因為 Motorcycle 沒有 return 任何東西。

```javascript{numberLines: true}
function Motorcycle(brand , model, year) {
  this.brand  = brand ; //constructor 建構子
  this.model = model;
  this.year = year;
}
const car1 = Motorcycle('Sym', 'Jet S',2008);
console.log(car1); //underfiled
```

### 函式建構子與 new 一起使用，但 return 一個參數

```javascript{numberLines: true}
function Motorcycle(brand , model, year) {
  this.brand  = brand ; //constructor 建構子
  this.model = model;
  this.year = year;
    return "x"
}

const car1 = new Motorcycle('Sym', 'Jet S',2008);
console.log(car1);
```

結果還是回傳你所建立的摩托車實體如下圖

![](https://i.imgur.com/3spyFUg.png)

### 函式建構子與 new 一起使用，但 return 一個函式

```javascript{numberLines: true}
function Person(firstname, lastname) {
    this.firstname = firstname;
    this.lastname = lastname;//constructor建構子，建立物件時所需要帶入的屬性
    return function() {
      console.log(x);
    }
}

var john = new Person("John", "Doe");
console.log(john);//回傳function() {console.log(x);} 這個函式
```

如下圖
![](https://i.imgur.com/2EST3Vu.png)

### 函式建構子與 new 一起使用，但 return 一個物件

```javascript{numberLines: true}
function Person(firstname, lastname) {
    this.firstname = firstname;
    this.lastname = lastname;//constructor建構子，建立物件時所需要帶入的屬性
    return {firstname:"Danny",lastname:"Chen"}
}

var john = new Person("John", "Doe");
console.log(john);//Danny這個物件
```

## 函式

所有函式都有 prototype 的屬性

可以參見底下，這時候 console.dir(hello)才獨有的

```javascript{numberLines: true}
function hello() {

}
var obj = {};
var arr = [];
console.dir(hello);
console.dir(obj);
console.dir(arr);
```

打開 hello 的內容可以看到有一個 prototype 屬性，除非你使用 new 關鍵字，不然這個屬性平常就沒什麼太大作用。
![](https://i.imgur.com/jaeYF5M.png)

與<span class="rem25">`__proto__`</span><span class="rem40 red">不同</span>的地方是這個<span class="red rem25">prototype 屬性</span>並<span class="red rem40">不是</span><span class="rem25">`函式的原型`</span>，<span class="rem40 red">而是</span>用來<span class="rem25">`創造物件的原型`</span>

換句話說創造物件的原型可以使用函式建構子的 prototype 屬性。

