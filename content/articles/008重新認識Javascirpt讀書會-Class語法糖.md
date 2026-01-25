---
title: 008 重新認識 Javascirpt 讀書會-Class 語法糖
slug: 2022-04-09T14:55:00.000Z
date: 2022-04-09T14:55:00.000Z
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

## ES6 的語法糖

Javascript 繼承方法是透過「原型」(prototype) 來進行實作，並沒有原生的 class

ES6 後有了 class，但仍是 prototype-based 的程式語言。

## ES5 使用 function prototype 實現繼承

```javascript{numberLines: true}
function Person (name){
    this.name = name;
}
Person.prototype.greeting = function (){
    return 'Hello! My name is'+this.name+'.';
};

var kuro = new Person('Kuro');
kuro.greeting();

```

先定義一個建構子函式，透過先前介紹過的 prototype 將子方法 greeting() 指定給 Person 原型。最後透過 new 來建立 Person 物件模擬 class

基本上就是 <span class="red">prototype</span>與<span class="red">this</span>的各種組合

## ES6 的 Class

```javascript{numberLines: true}
class Person{
    constructor(name){
        this.name = name;
    }
    greeting(){
        return 'Hello! My name is ' +this.name+'.';
    }
}
const kuro = new Person('Kuro');
// "Hello! My name is Kuro."
kuro.greeting();
```

由上述比較前後者差異可以看出其實原本的 this.name=name;並沒有什麼不同，只是寫在 constructor 裡面，而 greeing 則是直接寫在 class 當中

如下圖，用<span class="red">typeof</span>檢查 person 會得到結果為 funciton

<span class="rem25">甚至</span>
執行 Person ===Person.prototype.constructor 也會是 true 的結果
![](https://i.imgur.com/AHAiBH8.png)

<span class="rem25">而且</span>
我們也可以透過先前 prototype 方式來擴充新的方法

```javascript{numberLines: true}
class Person{
    constructor(name){
        this.name = name;
        this.age =age;
    }
    greeting(){
        return 'Hello! My name is ' +this.name+'.';
    }
}
Person.prototype.getAge = function (){
    return this.age;
};

var kuro = new Person('Kuro',33);
kuro.getAge();
```

<span class="red rem40">但是</span>
我們嘗試呼叫這個函式卻會出現錯誤。

```javascript{numberLines: true}
class Person{
    constructor(name){
        this.name = name;
    }
    greeting(){
        return 'Hello! My name is ' +this.name+'.';
    }
}
Person();
```

![](https://i.imgur.com/QPyluSb.png)

## class 與 constructor function 的差異

- 函式可以被提升 (hosting) 而 class 不會被提升，這與 let 宣告變數的情況一樣，會出現「TDZ」暫時性死區 ()
- 直接呼叫 class 名稱，而不是透過 new 關鍵字呼叫建構子，會出現錯誤。
- class 的區塊當中，所有程式碼，預設會自動進入嚴格模式 (strict mode)，而且無法取消這個設定。
- ES6 的 class 所定義的所有方法，預設都是無法被列舉 (non-enumeralbe) 的
- 每個 class 會內建 constructor 方法，即使在宣告某個 class 時沒有寫上去

<span class="red rem25">有趣的是</span>
constructor 預設回傳 this 物件實體，我們仍然可以指定另一個物件回傳

```javascript{numberLines: true}
    class Person{
        constructor(name){
            this.name = name;
        }
    }
    //回傳另一個新物件
    class Person2{
        constructor(){
            return Object.create(null);
        }
    }
    let kuro = new Person('Kuro');
    console.log(kuro instanceof Person);
    //true

    kuro = new Person2();
    console.log(kuro instanceof Person2);
    //false
```

## class 的靜態方法

```javascript{numberLines: true}
class Person{
            constructor(name) {
                this.name = name;
            }
            static sayHello(){
                return 'hello';
            }
        }
let kuro = new Person('Kuro');
//"hello"
Person.sayHello();
//Uncaught TypeError: kuro.sayHello is not a function
kuro.sayHello();
```

## 使用 extends 來繼承 class，靜態方法隨之繼承

如果使用 extends 來繼承，那麼父類別的靜態方法就會被子類別繼承

```javascript{numberLines: true}
class Person{
            constructor(name) {
                this.name = name;
            }
            static sayHello(){
                return 'hello';
            }
        }
class Man extends Person{

}
//"hello"
console.log(Person.sayHello());
//"hello"
console.log(Man.sayHello());
```

稍微修改一下，如果此時改用 this 回傳

```javascript{numberLines: true}
class Person{
            constructor(name) {
                this.name = name;
            }
            static sayHello(){
                return this.name;
            }
        }
class Man extends Person{

}
//"??"
console.log(Person.sayHello());
//"??"
console.log(Man.sayHello());
```

答案是 Person 和 Man
前面說過，this 關鍵字指的會是 class 本身而非實體，判斷 this 當下是依據呼叫當下。
所以 Person.sayHello() 自然是 Person，然後 Man 就會是 Man

## 使用 super 關鍵字

```javascript{numberLines: true}
class Person{
        static sayHello(){
            return this.name;
        }
    }
class Man extends Person{
    static sayHello2(){
        return super.sayHello();
    }
}
//"??"
console.log(Man.sayHello2());
```

結果依然還是 Man，因為 this 是看呼叫當下是誰，而不是哪個物件所宣告。

## Setter 與 Getter

之前使用 Object.defineProperty 來對某個物件設定 get 和 set

```javascript{numberLines: true}
const person = {};
Object.defineProperty(person,'name', {
    get:function(){
        console.log('get');
        return this._name_;
    },
    set:function(name){
        console.log('set');
        this._name_ = name;
    }
});
```

那麼到 ES6 的 class 我們可以這麼做

```javascript{numberLines: true}
class Person{
    constructor(name) {
        this.name = name;
        this._address ='Taipei';
    }
    get address() {
        console.log('get');
        return this._address;
    }
    set address(value) { console.log('set');
        this._address = value;
    }
}
```

像這樣，我們分別在 Person 這個 class 裡面對 address 屬性定義了 get 與 set 的方法。當我們嘗試讀取 address 屬性的時候，此時 console 主控台會先印出"get"的字串，然後回傳物件實體的\_address 屬性，而我們如果對 address 屬性進行改寫的話，同樣也會觸發對應的 set 方法

```javascript{numberLines: true}
class Person{
    constructor(name) {
        this.name = name;
        this._address ='Taipei';
    }
    get address() {
        console.log('get');
        return this._address;
    }
    set address(value) { console.log('set');
        this._address = value;
    }
}
    let kuro = new Person('Kuro');
    console.log(kuro.address);
    kuro.address='Kaohsiung';
    console.log(kuro.address);

```

> 語法糖：1.之所以稱之為語法糖，給人的感覺就是很甜，很甜。2.在相同功能下，語法糖的寫法會讓程式碼更加簡潔流暢，程式碼更加語義自然。寫得很爽，看起來也爽，就像吃了糖一樣。

> **維基百科的解釋**
> 語法糖（英語：Syntactic sugar）是由英國電腦科學家彼得·蘭丁發明的一個術語，指電腦語言中添加的某種語法，這種語法對語言的功能沒有影響，但是更方便程式設計師使用。語法糖讓程式更加簡潔，有更高的可讀性。

## 關於被列舉這件事情

### 使用 function 建構子的方式來建立

使用 for in 可以得到 name 和 hello
另外用 Object.keys(Person.prototype) 可以得到陣列裡面擁有 hello

```javascript{numberLines: true}
 function Person(){
           this.name=name;
       }
       Person.prototype.hello = function(){
        console.log("say hello");
       }
       var aaa = new Person("danny");
       for(var pro in aaa) {
        console.log(pro);
  }
  console.log(Object.keys(Person.prototype));
```

![](https://i.imgur.com/kKS6MK0.png)

## 使用 class 的方式建立

使用 for in 和 Object.keys 的話會得到 name 而已，而陣列則是空的

```javascript{numberLines: true}
    class Person {
        constructor(name) {
            this.name = name;
        }
        hello() {
            console.log("say hello");
        }
    }
    var aaa = new Person("danny");
    for(var pro in kxy) {
            console.log(pro);
    }
    console.log(Object.keys(Person.prototype));
```

![](https://i.imgur.com/Qyuy6M7.png)

解釋 super
https://pjchender.blogspot.com/2016/07/javascript-es6classes.html

