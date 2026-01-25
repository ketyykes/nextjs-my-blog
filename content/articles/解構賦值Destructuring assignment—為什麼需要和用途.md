---
title: 解構賦值Destructuring assignment—為什麼需要和用途
slug: 2022-09-14T09:35:00.000Z
date: 2022-09-14T09:35:00.000Z
tags: ["Javascript","React"]
---

什麼是**解構賦值**?根據[MDN-Destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)的說法，他是一種把陣列或物件解開擷取成為獨立的變數。

這篇文章將會提到以下幾點
- 為什麼用解構賦值？
- 陣列解構
- 物件解構
- 實際應用場景

## 為什麼用解構賦值？

我們先觀看以下的例子，假設今天不使用解構賦值的方式的話，我們得自己宣告變數，然後將陣列的內容提取出來存到該變數中。
```javascript
const array = [1,2];
let number1 = array[0];
let number2 = array[1];
```

同樣的道理，在以前在物件當中沒有使用解構賦值，一樣得自己宣告變數賦值如下

```javascript
const object = {name:"小明",age:17};
let name = object.name;
let age = object.age;
```

另外如果不自己宣告變數儲存object的key的話，當我們需要使用該物件的時候就得不斷的撰寫`object.`的方式(備註)，例如`object.name`、`object.age`、`object.job`、`object.屬性名稱`的方式存取該屬性的值。

> 備註：這種存取方式被稱之為**dot notation**，中文有人翻譯成點記法，更多相關內容可以參考MDN解說[Dot notation](https://developer.mozilla.org/zh-TW/docs/Learn/JavaScript/Objects/Basics#%E9%BB%9E%E8%A8%98%E6%B3%95_dot_notation))

除此之外像是在React最常見的useState的API當中，如果不使用**解構賦值**的方式可能需要撰寫變成以下寫法(備註)
```javascript
const stateVariable = useState('tea');//useState會回傳一個陣列;
const beverage = stateVariable[0];
const setBeverage = StateVariable[1];
```

> 更多可以參考React官方文件當中提到**方括號是什麼意思**的段落，該部分有更多的解釋連結在此 [Tip: What Do Square Brackets Mean?](https://reactjs.org/docs/hooks-state.html#tip-what-do-square-brackets-mean)

為了解決綜合以上所述的痛點，使用解構賦值便可以達到**簡化程式碼**及**提高閱讀性的目的**。

## 陣列解構

剛剛上一個部分提到如果不使用解構的話會遇到的問題，至於如何使用解構的方式其實並不困難，簡單記憶法是
1. 簡單等號的左右兩邊放中括號
1. 等號右邊放置你**想要解構的值**
1. 等號左邊放置你**解構出來後要的變數命名**

大多數都是圍繞在上面這三個步驟。

### 使用變數解構
下面的範例是大多數**陣列解構**當中最常使用的情境。
觀看以下的範例

```javascript
  const say = ['how','are','you'];
  const [a,b,c] = say;
  console.log(a);
  console.log(b);
```
將say這個陣列指派到 左邊使用變數a,b,c用中括號包起來，隨之就可以在`console.log(a);`，換句話說，我們透過陣列解構的方式執行了`const a='how'`的步驟，因此我們接下來就能直接存取a變數了。

### 宣告後再分開指定
上一個部分的的情境是將宣告和解構同時進行在同一行的程式碼當中，下面的範例則是宣告後再分開指定。
```javascript
  let hi,story;
  [hi,story] = [2, 3];
  console.log(hi); 
  console.log(story);
```

### 略過一些值

當我們只想解構某些值(或不想解構某些值)可以左邊的方括弧中預留空位給右邊對應的陣列位置，這樣的方式就不會對b進行陣列解構賦值了。
<br>
程式碼如下
```javascript
let ary = [1,2,3];
[a,,c]=ary;
console.log(c);
console.log(b)//Uncaught ReferenceError: b is not defined
```

![](https://i.imgur.com/qRk1YlK.png)


### 解構對應的是underfined 變數可先設預設值

另外解構的時候如果沒有對應的值的情況，我們還是想要有該變數的話也能同時給予預設值，範例如下

```javascript
let x, y;
  [x=3, y=2] = [7];
  console.log(x); //7
  console.log(y); //2
```
### 變數交換
我們也可以透過解構的方式**讓原本y的內容變成x，而x的內容變成y**。作法如下

```javascript
let x = 1;
let y = 2 ;
[x,y]=[y,x];
```

### 對映字串
我們如果需要宣告變數來存入字串的各別字母的話，也能使用**解構陣列**的方式，詳細作法如下

```javascript
  const str = "apple";
  const [a, b, c, d, e] = str;
  console.log(a);//a
  console.log(e);//e
```
### 使用其餘運算子

另外可以使用**其餘運算子**，將剩下的內容裝填在一個陣列當中，作法如下

```javascript
const [x, ...y] = [1, 4, 5];
console.log(x); // 1
console.log(y); // [4, 5]
```

## 物件解構

物件解構很常見的用途是避免一直用點的方式(**dot notation**)來存取該屬性的值，提升撰寫程式碼體驗，不過**注意的是實質上是宣告了一個變數，也要避免變數命名衝突**的狀況。

簡單的記憶法
1. 等號的左右邊放大括號
2. 等號的左邊是和欲解構的物件將其設為同名
3. 等號的右邊是欲解構的物件

來看原本在上面提到使用變數宣告的範例，使用物件解構賦值的方式就會如下

```javascript
const object = { name:"小明",age:17 };
const { name,age } = object;
```

當然變數的值也可以是物件，如下範例

```javascript
const styles = {
  btn:{
    background:"blue"
  }
}
const btn = styles;
console.log(btn);//{background: 'blue'}
```
### 額外命名
另外我們如果想要取的變數名字並非原本物件屬性的名字的話，可以改用以下方式**額外命名**
```javascript
const object = { myName: "小明" }
const { myName:firstName } = object;
console.log(firstName);//"小明"
```

### 給定預設值

如果物件當中沒有相對應的key，希望解構出來的變數有一些預設值的話可以撰寫以下方式

```javascript
const object = {};
const{ name:"",age: 0 } =object;
console.log(age);//印出0
console.log(name);//印出"'
```

### 使用其餘運算子
在物件當中我們也可以使用其餘運算子的方式，**將剩餘的參數，宣告成一個物件**，用法如下
```javascript
const object = { 
  name:"小明",
  age:17,
  job:"student",
  height:173,
  weight:80 
};
const { name,...personInfo } = object ;
console.log(name) //'小明'
console.log(personInfo)//{age: 17, job: 'student', height:
```

## 函式中的參數

### 基本用法

由於在function的參數也可以算是一變數的一種，因此我們能在傳入前先行解構
使用方式如下
```javascript
function sayMyName({name,age}){
    console.log("Hi,I am " + name );
    console.log("I am " + age + " years old");
}
sayMyName( { name:"小明" , age :12 } )
// Hi,I am 小明
// I am 12 years old
```

### 給定預設值

#### 解構的預設值
由於函式的參數也能給定預設值，因此要注意給定解構賦值當中的預設值，而並非單指是設置函式參數的預設值
~~//也許小明剛出生所以是零歲?~~
用法如下
```javascript
function sayMyName ( { name="" ,age= 0 }){
    console.log("Hi,I am " + name );
    console.log("I am " + age + " years old");
}
sayMyName( { name:"小明" } ) 
// Hi,I am 小明
//I am 0 years old 
```

#### 參數的預設值
給定參數預設值使其有內容解構的方式也可以**避免函式在使用時未帶參數的時候報錯**。
具體用法如下

```javascript
function sayMyName ( { name ,age } = {} ){
    console.log("Hi,I am " + name );
    console.log("I am " + age + " years old");
}
sayMyName()
// Hi,I am undefined
// I am undefined years old
```


如果上述的函式沒有給定參數預設值的話，程式碼如下
```javascript
function sayMyName ( { name ,age } = {} ){
    console.log("Hi,I am " + name );
    console.log("I am " + age + " years old");
}
sayMyName()
```
就會顯示錯誤訊息，大致如下

![](https://i.imgur.com/dzgLmw7.png)

## 實際應用場景

### API回傳的資料直接解構

在接收後端伺服器回傳的API資料時，我們可以透過解構的方式，提取資料
```javascript
export const fetchData = async () => {
  try {
    const { data } = await axios.get(url);
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};
```
### 巢狀解構所需的內容

我們在接後端伺服器所回傳的api大致如下
```json
{ data : { name : "小明" , age : 17 } }
```
這邊可以巢狀解構的方式

```javascript
const { data : { name } } = await axios.get(url);//API打回來回傳的是{ data : { name : "小明" , age : 17} }
console.log(name)//印出小明
```

另外如果我們想要取別的名字也就是變數名稱不想要name的話，可以如下的撰寫方式


```javascript
const { data : { name :myname} } = await axios.get(url);
//遠端API後回傳的是{ data : { name : "小明" , age : 17} }
console.log(myname)//印出小明
```

### 搭配其餘運算子擷取所需的屬性構成物件

假設我們整個物件當中我想要移除某些屬性又想要做到[immutably](https://dev.to/nyagarcia/understanding-the-javascript-spread-operator-from-beginner-to-expert-5bdb)的方式的話，我們可以使用其餘運算子，程式碼如下
```javascript
const object = { name: "小明", age: 17, job: "student" };
      //只取年齡和工作留下去除name屬性
const { name, ...object1 } = object;
console.log(object1);
```
上述的做法是解構賦值name，透過其餘運算子剩下就形成object1物件，最後就能達到**移除某屬性並且創造一個新的物件**。

### 搭配array method
當我們資料是陣列，每個陣列的元素是物件的時候，在array methond的callback function進行操控物件的屬性的時候，可以透過解構的方式就不需要每次在操控的時候不斷地使用**點記法dot notation**了。
觀看以下範例
```javascript

const data = [
  {
    positive: 2843289,
    death: 432543,
    recovered: 4532,
  },
  {
    positive: 28756489,
    death: 515151,
    recovered: 4322,
  },
];

const afterData = data.map(({ positive, recovered, death,}) => ({
  confirmed: positive,
  recovered,
  deaths: death,
}))
```
### 無需要了解函式的參數帶入順序

假設當我們要帶入多個參數到函式當中的時候，例如下列計算BMI的方式，當我們參數改成接受物件，並且在函式的參數當中解構，就可以不用擔心第一個參數是體重還是第二個參數是體重，換句話說就可以**不用理會參數順序**的狀況。
```javascript
function caculator({ weight, height }){
  let BMI = weight / Math.pow(height, 2);
  let roundedResult = Math.floor(BMI);
  return roundedResult;
}
caculator( {weight:80,height:1.73} ) ;
```

以上將陣列與物件的**解構賦值Destructuring assignment**比較常用或是實際用途都介紹了，希望無論曾經用過**解構賦值**或是剛在學習得人都能在這篇文章當中獲得一些什麼東西，另外如果有錯誤部分也歡迎糾正，謝謝收看~~

##### 參考資料
- [從ES6開始的JavaScript學習生活](https://eyesofkids.gitbooks.io/javascript-start-from-es6/content/part4/destructuring.html)
- [Destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
