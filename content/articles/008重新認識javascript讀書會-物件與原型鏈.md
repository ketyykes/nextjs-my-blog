---
title: 008 重新認識 Javascript 讀書會 - 物件與原型鏈
slug: 2022-04-01T14:32:00.000Z
date: 2022-04-01T14:32:00.000Z
tags: ["008 重新認識 Javascript 讀書會","Javascript"]
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

本篇為參與 0 陷阱！0 誤解！8 天重新認識 Javascript 讀書會的導讀內容加上自己所蒐尋的資料後所構成的文章。

## in 關鍵字-MDN 範例

如果指定的屬性在指定的物件或其原型鏈中，則 in 運算子回傳 true。

```javascript{numberLines: true}
const car = { make: 'Honda', model: 'Accord', year: 1998 };
console.log('make' in car);
// expected output: true
delete car.make;
if ('make' in car === false) {
  car.make = 'Suzuki';
}
console.log(car.make);
// expected output: "Suzuki"
```

> [深入了解物件模型-MDN](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Guide/Details_of_the_Object_Model)

## setPrototypeOf 和 Object.create 差別

> [Object.setPrototypeOf() vs Object.create](https://stackoverflow.com/questions/58377377/extends-object-setprototypeof-vs-object-create)

## 物件與原型鏈

JS 是基於原型的物件導向語言，沒有原生的 Class，必須透過原型 (prototype) 來進行繼承的實作

<div class=rem25>
原型
</div>

讓原先沒有某屬性的物件存取其他物件的屬性，以洛克人和剪刀人的武器為例。

```javascript{numberLines: true}
// 洛克人的武器是 buster 飛彈
var rockman = { buster: true };
// 剪刀人的武器是剪刀
var cutman  = { cutter: true };
```

我們可以用 <span class=red>in</span> 來判斷這個物件是否可以存取某個屬性：

```javascript{numberLines: true}
// 注意，屬性名稱必須是「字串」
console.log( 'buster' in rockman );     // true
console.log( 'cutter' in rockman );     // false
```

當洛克人也想要有剪刀人的武器時，
可以透過<span class="gray red">Object.setPrototypeOf() </span>將「剪刀人指定為原型」。

```javascript{numberLines: true}
Object.setPrototypeOf(rockman, cutman);
```

第二個參數帶入的是原型，第一個為繼承者。

所以最後會變成以下這樣

```javascript{numberLines: true}
// 洛克人的武器是 buster 飛彈
var rockman = { buster: true };
// 剪刀人的武器是剪刀
var cutman  = { cutter: true };

console.log( 'buster' in rockman );     // true
console.log( 'cutter' in rockman );     // false

// 指定 cutman 為 rockman 的「原型」
Object.setPrototypeOf(rockman, cutman);

console.log( 'buster' in rockman );     // true

// 透過原型繼承，現在洛克人也可以使用剪刀人的武器了
console.log( 'cutter' in rockman );     // true
```

<div class="rem40 red">但是</div>

<div class="red rem25">同一個物件無法指定兩種原型物件</div>

```javascript{numberLines: true}
// 氣力人的武器是超級手臂
var gutsman = { superArm: true };

// 指定 gutsman 為 rockman 的「原型」
Object.setPrototypeOf(rockman, gutsman);

// 這個時候洛克人也可以使用氣力人的超級手臂
console.log( 'superArm' in rockman );     // true

// 但是剪刀卻不見了，哭哭
console.log( 'cutter' in rockman );       // false
```

所以原型繼承還有個觀念叫做<span class="rem25">「原型鏈」</span>(Prototype Chain)。
當我們從存取某個物件「不存在」的屬性時 Javascript 會往<span class="red">[[prototype]] </span>原型物件尋找。

```javascript{numberLines: true}
// 洛克人的武器是 buster 飛彈
var rockman = { buster: true };
// 剪刀人的武器是剪刀
var cutman  = { cutter: true };
// 氣力人的武器是超級手臂
var gutsman = { superArm: true };

// 指定 cutman 為 rockman 的「原型」
Object.setPrototypeOf(rockman, cutman);

// 指定 gutsman 為 cutman 的「原型」
Object.setPrototypeOf(cutman, gutsman);

// 這樣洛克人就可以順著「原型鏈」取得各種武器了！
console.log( 'buster' in rockman );       // true
console.log( 'cutter' in rockman );       // true
console.log( 'superArm' in rockman );     // true
```

## 最頂層的原型物件：Object.prototype

我們在某個物件存取一個不存在的屬性時，會繼續往它的「原型物件」<span class="red">[[prototype]] </span>順著原型鏈找到最頂層，會找到 <span>Object.prototype</span>才停，因為<span>Object.prototype</span>是 Javascript 所有物件的起源。
換句話說，<span>Object.prototype</span>提供的方法，在 Javascript 所有物件都可呼叫它
例如

- <span class="red">Object.prototype.hasOwnProperty()</span>
- <span class="red">Object.prototype.toString()</span>
- <span class="red">Object.prototype.valueOf()</span>

## 建構式與原型

```javascript{numberLines: true}
var Person = function(){};

// 函式也是物件，所以可以透過 prototype 來擴充每一個透過這個函式所建構的物件
Person.prototype.sayHello = function(){
  return "Hi!";
}

var p1 = Person();
var p2 = new Person();
```

變數 p1 內容是直接呼叫 Person 結果，但因為沒有 return 任何東西，所以是 undefined。

變數 p2 用 new 關鍵字建立一個物件，由於函式也是物件，所以可透過 prototype 來擴充透過這個函式所構成的物件。

換句話說，p2 是基於 Person 的建構式所建立的物件，因此 p2 也能透過原型取得呼叫 sayHello() 的能力。

```javascript{numberLines: true}
p2.sayHello();      // "Hi!"
```

另個狀況是

```javascript{numberLines: true}
var Person = function(){
  this.sayHello = function(){
    return "Yo!";
  };
};

Person.prototype.sayHello = function(){
  return "Hi!";
}

var p = new Person();
```

p.sayHello() 的結果是什麼
答案是 "Yo!"

當 物件實體與它的原型有同樣屬性或方法時，會優先存取自己的屬性或方法，如果沒有才會順著原型鏈向上找。

關於從原型繼承屬性或方法
統整以下幾種狀況

- 物件實體與它的原型同時擁有同樣屬性或方法時，會優先存取自己的屬性或方法
- 如果物件實體找不到某個屬性或方法時，會往它的原型物件找。

1. 如果在原型物件或更上層的原型物件發現這個屬性且屬性描述是 writable 為 true 則會為這物件實體新增此方法或屬性。
2. 同上，但若屬性描述的 writable 為 false，那物件實體則會多出一個唯讀屬性，且事後無法再新增或修改
3. 同上，但若這個屬性其實是一個設值器 (setter function)，那呼叫永遠是那個設值器，目標屬性也無法被重新定義。

透過 in 檢查原型鏈中是否有該屬性

如果檢查屬性 hasOwnProperty()

```javascript{numberLines: true}
console.log( rockman.hasOwnProperty('buster') );    // true
console.log( rockman.hasOwnProperty('superArm') );  // false
```

當函式被建立時，都會有原型物件<span class="red ">prototype</span>透過擴充<span class="red">prototype</span>的物件，就能讓每個透過這個函式建構的物件擁有這個「屬性」或「方法」

當我們透過<span class="red">new</span>建構一個<span class="red">Person</span>實體時，以下面範例就是物件<span class="red">p</span>，這個<span class="red">p</span>的原型物件會自動指向建構式的<span class="red">prototype</span>屬性，也就是 <span class="red">Person.prototype</span>

```javascript{numberLines: true}
var Person = function(name){
  this.name = name;
};
// 在 Person.prototype 新增 sayHello 方法
Person.prototype.sayHello = function(){
  return "Hi, I'm " + this.name;
}
var p = new Person('Kuro');
p.sayHello();       // "Hi, I'm Kuro"
```

---

像下面這張圖一樣，這就是我們介紹的原型鏈
![](https://i.imgur.com/gfgn5ap.png)

透過「原型」來新增方法 (method) 是在原型新增後馬上就可用。

```javascript{numberLines: true}
var Person = function(name){
  this.name = name;
};

var p = new Person('Kuro');

p.sayHelloWorld();  // TypeError: p.sayHelloWorld is not a function

Person.prototype.sayHelloWorld = function(){
  return "Hello, World!";
}

p.sayHelloWorld();  // "Hello, World!"
```

上面程式碼也就是說透過<span class="red"> Person.prototype.sayHelloWorld </span>新增了對應的方法後，我們無需重新建物件 <span class="red">p</span>馬上就可以透過 p.sayHelloWorld() 來呼叫。

這種手法，也是很多「Polyfill」用來增強擴充那些舊版本瀏覽器不支援的語法。如 <span class="red">Array.prototype.find() </span>在 ES6 以前是不存在的，但我們可以透過檢查<span class="red"> Array.prototype.find </span>是否存在。

如果不存在就可以對 <span class="red"> Array.prototype </span>新增<span class="red"> find</span>方法，然後就可以直接使用。

```javascript{numberLines: true}
if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}
```

> Polyfill 補土解決新舊瀏覽器之間的縫隙
> [Polyfills 介紹](https://medium.com/@tsoen/%E4%BB%80%E9%BA%BC%E6%98%AF-polyfills-89f98f45caf5)

## **proto ** 與 prototype 的關係

在過去，雖然 JavaScript 沒有提供標準方法讓我們直接對原型物件 [[prototype]] 來進行存取，但大多數的瀏覽器 (精準一點說，大多數的 JavaScript 引擎) 都有提供一種叫做<span class="red">**proto ** </span>的特殊屬性，但並非所有瀏覽器和 javascript 引擎都支援且相容。

<span class="red rem40">好消息是</span>從 ES5，要取得某物件的原型物件時，可透過<span class="red">Object.getPrototypeOf( )</span>這個標準方法

```javascript{numberLines: true}
var Person = function(name){
  this.name = name;
};

var p = new Person('Kuro');

// 在 Person.prototype 新增 sayHello 方法
Person.prototype.sayHello = function(){
  return "Hi, I'm " + this.name;
}

// 所以 p 也可以呼叫 sayHello 方法
console.log( p.sayHello() );      // "Hi, I'm Kuro"
console.log(Object.getPrototypeOf( p ) === Person.prototype);         // true
console.log(Object.getPrototypeOf( p ) === Function.prototype);       // false
console.log(Object.getPrototypeOf( Person ) === Function.prototype);  // true

console.log( p.__proto__ === Person.prototype );          // true
console.log( p.__proto__ === Function.prototype );        // false
console.log( Person.__proto__ === Function.prototype );   // true
```

<span class="rem40 red">所以</span>
<span class="red">**proto **</span>這個特殊屬性或者是 <span class="red">Object.getPrototypeOf( )</span> 其實都是取得某物件的原型物件 <span class="red">[[prototype]]</span> 的方式

前面說過，「每一個函式被建立之後，都會自動產生一個 prototype 的屬性」，但這並 "不" 代表這個 prototype 屬性就是這個函式的原型物件，而是透過 new 這個函式「建構」出來的物件會有個 [[prototype]] 的隱藏屬性，會指向建構函式的 prototype 屬性。

換句話說
prototype 這個屬性的意思是後來其他透過此函式所 new 出的物件所擁有的方法和屬性會在這裡找的到，因此
console.log( p.**proto ** === Person.prototype );

## Object.create()

```javascript{numberLines: true}
// Person 物件
var Person = {
  name: 'Default_Name',
  sayHello: function(){
    return "Hi, I'm " + this.name;
  }
};

// 透過 Object.create() 將 Person 作為原型物件來建立一個新的物件
var p = Object.create(Person);

p.sayHello();   // "Hi, I'm Default_Name"

p.name = 'Kuro';
p.sayHello();   // "Hi, I'm Kuro"
```

首先建立一個物件「原型」，透過 Object.create() 來建立新的物件，此時新物件的原型就會是剛剛所建立的「原型」物件。
Object.create() 實作原理如下

```javascript{numberLines: true}
Object.create = function (proto){
  function F() {}
  F.prototype = proto;
  return new F();
}
```

當我們把原型物件作為參數傳入 proto，Object.create() 會回傳一個 new F()，也就是透過一個封裝過的建構式建構出來的物件，並把 prototype 指向作為參數的 proto

## 歸納 **proto ** 與 prototype 的關係

JavaScript 的內建物件 (build-in object) 來說，像是 Array、Function ...等，它們的 prototype 屬性也是一個物件，實際上是繼承自 Object.prototype 而來

```javascript{numberLines: true}
console.log( Object.getPrototypeOf(Function.prototype
) === Object.prototype );   // true

// 或是透過 __proto__
console.log( Function.prototype.__proto__ === Object.prototype );   // true
```

以上大致可用這張圖表示

![](https://i.imgur.com/ec4BiWU.png)

<span class="red rem40">另外不要做蠢事，即便他一切合法，會搞死同事</span>
![](https://i.imgur.com/KzabLJp.png)

此圖表示你可以用 prototype 和 push 來新增原型的屬性
這個時候你即便建立一個空陣列，當印出陣列索引值零的時候他就會出現"lol"

然後你同事就會<span class="red rem40">花惹發</span>

我這裡有水平線。我這裡有水平線。我這裡有水平線。我這裡有水平線。

---

我自己的解釋：

prototype→ 自帶原型的物件 亞空間暫存物 後來透過 new 所建立的物件會來這個亞空間索取原型屬性和方法。
**proto **→ 起源原型 真正的起源原型 透過這個**proto **成為接口或稱入口，會到他父層的亞空間索取 屬性和方法。

```javascript{numberLines: true}
console.log( Function.prototype.__proto __ === Object.prototype );
// true
```

> Func 自帶的原型物件他的起源原型是在 Object.prototype 自帶的原型物件

參考資料
https://blog.techbridge.cc/2017/04/22/javascript-prototype/

https://cythilya.github.io/2018/10/26/prototype/

https://pjchender.blogspot.com/2016/06/javascriptfunction-constructorprototype.html

https://medium.com/@peterchang_82818/javascripter-%E5%BF%85%E9%A0%88%E7%9F%A5%E9%81%93%E7%9A%84%E7%B9%BC%E6%89%BF%E5%9B%A0%E5%AD%90-prototype-prototype-proto-object-class-inheritace-nodejs-%E7%89%A9%E4%BB%B6-%E7%B9%BC%E6%89%BF-54102240a8b4

