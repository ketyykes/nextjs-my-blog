---
title: 008 重新認識 Javascirpt 讀書會 - 變數、運算子
slug: 2022-02-13T06:56:00.000Z
date: 2022-02-13T06:56:00.000Z
tags: ["008 重新認識 Javascript 讀書會","Javascript"]
---

<style>

.red{color:red;}

</style>

本篇為參與 0 陷阱！0 誤解！8 天重新認識 Javascript 讀書會的導讀內容加上自己所蒐尋的資料後所構成的文章。

## Javascript 的歷史

如果給一個 id 屬性，那麼在網頁解析完他會變成一個全域變數

```html{numberLines: true}
<input type="text" id="hello" value="HELLO">
<script>
    console.log(hello);
</script>
```

**ECMAScript 是 Javascript 的標準**

換句話說

ECMA 標準是規格書，而 Javascript、JS Script、Flash 的 ActionScirpt 等語言是依循這個規格書所實做出來的產品

## 基礎知識與資料型別

## 變數

變數第一個字母**必須**為英文字母、底線\_或錢字號，後面可以是英文 字母 底線 或錢字號以及數字 (所以==第一個**不行**是數字==)

變數名稱==不可以==是==保留字 (Reserved Word)== 與==關鍵字 (keyword)==

變數語法有==分大小寫==也就是 APP 和 app 是不同變數

Javascript1.3 也支援 unicode
換句話說變數名**可以**是**中文**，而且完全合法，但基於開發習慣還有其他語言的系統開啟可能會變亂碼，所以不建議這樣使用。

ES6 前使用 var 關鍵字宣告變數
ES6 後分成變數和常數也就是可用**let**和**const**
var 和 let 差別在於變數作用範圍 (scope) 不同

備註：宣告通常只會一次，但如果重複宣告的時候 var 並不會出錯

```javascript{numberLines: true}
var a=1;
var a=2;
console.log(a);
```

let 就會提出警訊

```javascript{numberLines: true}
let b=5;
let b=3;
```

Javascript 是屬於==弱型別==的語言，變數宣告時**無需指定型別**
型別的資訊指在**值**或**物件**本身
變數只用來作為取得**值**或**物件**的==參考==

如果**沒有**宣告變數情況就使用的話，會出現==referenceerror 的錯誤==
主控台會出現 Uncaught ReferenceError:hello is not defined at <anonymous>:1:13
<font class="red">即便沒有宣告而直接賦予值是可以的，但是強烈不建議這麼做。</font>

![](https://i.imgur.com/YSXiFuk.png)
<font class="red">要記得沒有透過 var 宣告的變數都會自動變成全域變數</font>
弱型別 → 在執行時期透過變數內容來參考至物件或值才會得知此變數有什麼操作方法

備註：強型別 → 在宣告的時候要定義型別
像是 Java 宣告方式

```java
int i = 1;
```

變數**沒有**型別 值才有
型別主要分為兩大類
==基本型別 Primitives==與==物件型別 Object==兩大類
基本型別又分為<font class="red">string, number ,Boolean ,null ,undefined</font>

ES6 之後多了新的型別<font class="red">symbol</font>
除了上述幾種之外其他都可以歸類至**物件型別 (Object)**

判斷型別方式可透過**typeof**運算子來協助

![](https://i.imgur.com/Go8eHHT.jpg)

### string 字串

JavaScript <font class="red">沒有 char(字元)</font>的概念，只有字串。字串會用 ' ' (單引號) 或 " " (雙引號) 包夾住，兩者不可混用

```javascript{numberLines: true}
var str = 'Let's go!';    // error
```

如果改成這樣就可以：

```javascript{numberLines: true}
var str = "Let's go!";    // OK
```

但如果有非用不可的時候，可以透過 \(跳脫字元，escape character) 來處理：

```javascript{numberLines: true}
var str = 'Let\'s go!';    // OK
```

如果遇到了多組的字串時，你可以用 + (加號) 來連接字串：

```javascript{numberLines: true}
var hello = 'Hello, ' + 'World';
```

甚至是多行字串時，可以透過 \ (反斜線) 來繼續：

```javascript{numberLines: true}
var hello = '這不是一行文 \
這是第二行 \
這是第三行';
```

要注意的是 <font class="red">\ 反斜線符號後面不能有任何東西，包括空白字元</font>

### 樣板字面值 (template literal)

ES6 新增一種特殊字串叫樣板字面值 (template literal)
由反引號所組成 1.原本需要透過反斜線\來連接線在只需要使用`

```javascript{numberLines: true}
var hello = `這是第一行但不只一行
這是第二行
這是第三行`;
```

2.允許將變數直接嵌入字串

```javascript{numberLines: true}
var age =30;
var str = `I am a ${age}year-old engineer.`;
console.log(str);
//I am a 30 year-old engineer.
```

3.甚至想要內嵌運算式也可

```javascript{numberLines: true}
var a = 5;
var b = 10;
console.log(`Fifteen is ${a+b} and not ${2*a+b}.`);
```

### Number

Javascript**數字只有**一種型別就是 number
備註：(像 Java 有 int、float、double float)

特殊的數字
<font class="red">Infinity</font>(無限大) 、<font class="red"> -Infinity </font>(負無限大) ，以及<font class="red"> NaN </font>(不是數值，Not a Number)

==0/0== ==Infinity / Infinity== 或 ==-Infinity / -Infinity==會得到 <font class="red">NaN</font>

NaN 字面上意思是，不是個數字但用 typeof() 運算子來判斷型態會告訴這是個 number

```javascript{numberLines: true}
typeof(NaN);    // "number"
```

NaN 與任何數字作數學運算結果都是 NaN
<font class="red">NaN 不等於任何數字甚至是自己</font>

```javascript{numberLines: true}
NaN === NaN;    // false
```

![](https://i.imgur.com/Q16CqRe.jpg)

既然 NaN 不能用嚴格相等運算子判斷是否為 NaN 的話
**如何檢查一個變數是否為 NaN**
可透過**isNaN(value)**
建議使用 Number.isNaN();否則可能會有某些 BUG 產生
![](https://i.imgur.com/ZvJiBGH.png)
Javascript 實作是基於[IEEE754]二進位浮點數算術標準
![](https://i.imgur.com/J2qNR5u.png)

![](https://i.imgur.com/i3QtGuL.jpg)

如果要求數字精準的話，簡單的處理方式可將小數點在運算前轉成整數，計算後再調整回來，但遇到大數會有例外或爆掉的問題。目前看到最佳的解法應該是這個[ number-precision](https://github.com/nefe/number-precision)，有興趣的朋友可以作為參考

若要比較浮點術的話可用 ES6 提供的最小精度值來幫助我們
![](https://i.imgur.com/ZilHoPx.png)

這邊結果會回傳 true

### Bollean 布林值

值只有兩種==true==和==false==

## null 與 underfined

大多數程式語言都有 null 或是類似空值的類型
Javascript 多了一個<font class="red">undefined</font>

==共通點是==null 型別只有一種值就是 null

undefined 類型也只有一種值，就是 undefined

這兩種值透過<b>Boolean()</b>強制轉型成 boolean 時，都會代表 false 的意思，但仍然有意義上差別

undefined 代表的是<font class="red">「(此變數) 還沒有給值，所以不知道是什麼」</font>
null 代表的是<font class="red">「(此變數可能曾經有值，可能沒有值) 現在沒有值」</font>

強指轉型成 Number 可以看出點端倪
![](https://i.imgur.com/LYLEmJT.png)

在非全域作用範圍 undefined 允許被當成變數名稱，而且變數值可被修改
![](https://i.imgur.com/F8rcAX5.png)

甚至是作為參數使用：
![](https://i.imgur.com/HlRJxn3.png)

雖然合法，但==為了身心健康==，<font class="red">切勿以身嘗試</font>

![](https://i.imgur.com/YdngPeY.png)

## 物件、陣列及型別的判斷

<font class="red">所有基本型別 (primitives) 以都是物件。</font>

從 ECMA 262 標準中來看物件的定義：

「An object is a collection of properties and has a single prototype object.」

一個物件可以是個零至多種屬性的集合，而屬性是鍵 (key) 與值 (value) 之間的關聯。一個屬性的「值」可以是某個基本型別，也可以是另一個物件，甚至可以是一個函式。
物件可以是瀏覽器預先定義好的，當然也可以是由自己定義物件的屬性與內容。

### 物件及屬性

早期可能須透過 new 關鍵字來建立一個物件實體再替這個物件新增屬性與方法
![](https://i.imgur.com/I1nfZn2.png)

另一種建立物件的方式更為簡便，也是目前最常見的：
![](https://i.imgur.com/F2uirhX.png)
這種建立物件的方式稱為「物件實字 (Object literal)」，同時也是 ==JSON 格式的核心語法。==

#### 屬性存取

物件屬性可透過 **<font class="red">.</font>** 來進行存取
![](https://i.imgur.com/CAAYolD.png)

或是可以透過<font class="red"> []</font> 來進行存取，如：
![](https://i.imgur.com/oeUTXCB.png)
若物件索引件剛好是不合法的 javascript 的識別字 (如空白的字串或數字時)
執行時會出現錯誤，但用中括號方式並不會出現錯誤
![](https://i.imgur.com/UnfxOA5.png)

#### 屬性新增

物件新增屬性的話，直接用 = 指定就可以了：
![](https://i.imgur.com/undXAw5.png)

#### 屬性刪除

![](https://i.imgur.com/oY1HNjV.png)

判斷屬性是否存在
判斷屬性是否存在，最簡單的方式 檢查該屬性是否為**undefined**
![](https://i.imgur.com/OJFK6Gz.png)

<font class="red">但如果屬性剛好是 undefined 時就沒用了</font>

還有<font class="red">in</font>運算子和<font class="red">hasOwnProperty 方法</font>

兩者都可檢查物件的屬性是否存在

- hasOwnProperty() 方法不會往上檢查物件原型鍊 (prototype chain)，只會檢查是否存在這屬性
- in 運算子則會繼續往上物件原型鍊檢查

**_後續若寫到關於 prototype 的時候將繼續詳細解說_**

## 陣列

陣列也是一個<font class="red">物件</font>
陣列內可以是原始資料類、其他陣列、函式等等
陣列是個==有順序性的集合==且==只能透過[]存取==

可用 new 關鍵字建立
![](https://i.imgur.com/rLjxz4q.png)

實務上常見的是**陣列實字 (Array literal)**
![](https://i.imgur.com/Qtxc7Ub.png)

或是
![](https://i.imgur.com/y16taZb.png)

擷取陣列長度是由 array.length，而且這個屬性==可被覆寫==
![](https://i.imgur.com/ATdJCTF.png)

右上述得知陣列內容變成**undefined**

由此可知陣列內容可以有多種資料型態，但我想你<font class="red">不該這麼做</font>
備註：索引值可以是字串但<font class="red">我想你不會想這麼做</font>

陣列長度可隨時增加減少
指定索引元素不一定要連續指定
![](https://i.imgur.com/PvGfLi7.png)

陣列索引值由 <font class="red">0</font> 開始計算，因此要取得第一個元素的時候要用 array[0]

## typeof 型別判斷

可以檢查變數內值的型別
==變數沒有型別，值才有型別==
透過 typeof 運算子來處理
![](https://i.imgur.com/09Z07B6.png)

typeof<font class="red">回傳的東西是字串</font>

- 為什麼會出現 function?
- 而且利用 typeof 檢查 null 的時候回傳竟然是 object

**_function 仍屬於 object 的一種，可以想像成被呼叫的特殊物件。_**

另外
null 其實是一個 bug

**_由於 object 型別標籤是 0 而 Null 慣例也會用 0x00 來表示於是代表標籤和物件的標籤搞混了
ES6 曾有想過要改，但是會影響太多就有程式，因此最後被回絕了_**

#### 如何判別是否為陣列

ES5 有 isArray() 方法幫助判斷

## 運算式 (Expression) 與 運算子 (Operator)

分為兩大類
==「敘述句 (Statement)」==
變數宣告、賦值、迴圈、if 判斷式都可歸類於此
==「運算式 (Expression)」==
會產生一個值

像

呼叫 function 時的參數 (arguments)，或者透過 = 賦值時，在 = 「右側」的部分都屬於運算式的部分。

分成以下幾類
算術運算子 (Arithmetic Operator)
指派運算子 (Assignment Operator)
位元運算子 (Bitwise Operator)
比較運算子 (Comparison Operator)
邏輯運算子 (Logical Operator)
字串運算子 (String Operator)
特殊運算子 (Special Operator)

### +號

Infinity 系列
![](https://i.imgur.com/BnQO0C0.png)

NaN 系列
![](https://i.imgur.com/hjwrXBq.png)

加號兩側其中一方不是數字，而是「字串」呢
![](https://i.imgur.com/KYiC1eJ.png)

一方是字串，另一端會被**自動轉型**為字串後，連接在一起
![](https://i.imgur.com/QomwulZ.png)

**_以 number、boolean、object 的情況來說，轉型時會去呼叫它們的 .toString() 的「原型方法」
去取得對應的字串。
而 null 與 undefined 則是透過 JavaScript 的 String() 函式來將它們分別轉為 "null" 與 "undefined"。_**

當很長的運算式時會有數字和字串混搭時
![](https://i.imgur.com/sQ0JLnn.png)

答案會是"10 加 100 的數字會是 10100"
為了避免這樣問題可以使用小括號解決
![](https://i.imgur.com/SNeQXJO.png)

答案就是預期中的「"10 加 100 的數字會是 110"」

### -減號

Infinity 系列：
![](https://i.imgur.com/MgJQqeF.png)

NaN 系列同加號

與加法不同的是，另個基本型別不是數字的話，<font class="red">會在背後透過 Number() 嘗試將數值轉為「數字」，再進行運算</font>
![](https://i.imgur.com/wO469Mv.png)

如果是物件型別的情況下，則是會先透過物件的 valueOf() 方法 先求得對應的數值，如果得到 NaN，那麼結果就是 NaN

如果物件沒有 valueOf() 方法的話，則是透過 toString() 先轉成「字串」後，再以 Number() 嘗試將數值轉為「數字」後進行運算。

valueOf() 是用來回傳特定物件相對應原始型別的值，當 JavaScript 的物件在進行運算時，都會透過 valueOf() 或 toString() 方法，取回該物件對應的原始型別的值再進行運算
![](https://i.imgur.com/rydMMnC.png)

之後提到物件的 prototype 和 valueOf 有更多的介紹。

### \*乘號

若超出 JavaSCript 的數字範圍，那麼就會看結果是正數或負數來決定是 Infinity 或是 -Infinity。

其中一個是 NaN 的話，那麼結果必定也是 NaN。
而依照 IEEE754 標準的規定，Infinity \* 0 的結果也是 NaN

如果有其中一個不是數字的話，那麼 JavaScript 就會先在背後以 Nubmer() 作轉換後再進行計算
![](https://i.imgur.com/SdYopz3.png)

/除號

除數為 0 的情況下：

- 被除數為正數，則結果為 Infinity
- 被除數為負數，則結果為 -Infinity
- 被除數為 0，則結果為 NaN

取餘數 (%)
![](https://i.imgur.com/GjWCZ1P.png)
Infinity 系列
![](https://i.imgur.com/HWCKqAu.png)

**被除數是數值，除數為 0→NaN**
**其中一個是 NaN，結果也是 NaN**

與除法同，若其中一個不是數字，js 會以 number() 轉換再進行計算。

## 一元運算子 (Unary Operator)

**僅需單個數值就可做運算**

若後面緊跟著的不是數字先用 Number 方法嘗試轉型\
若物件型別 → 透過 valueOf() 求得對應值再取其值
![](https://i.imgur.com/jGHGDE8.png)

<font class="red">Number() 太長想做數字轉型可透過 + 號</font>

### 遞增 ++ 與遞減 –

![](https://i.imgur.com/33wtjTr.png)

++ 與 --可當作是：a = a + 1 與 a = a - 1 的意思
![](https://i.imgur.com/M54K8o5.png)
上述看似一樣
換個寫法
![](https://i.imgur.com/b5me9d5.png)

當放變數後面回傳結果是原始數值
當放變數前面得到式 +1 之後的結果

### 比較運算子 (Comparison Operators)

「相等」 == 與「全等」 ===
一個等號是賦值、指定的意思
![](https://i.imgur.com/MOplsw6.png)
兩側左右進行比較
![](https://i.imgur.com/uyYmw0G.png)
資料型態不同時
![](https://i.imgur.com/c98fnea.png)
console.log( a == b ); 會是 true 或是 false？
答案 true
但倘若不是數字和字串呢
![](https://i.imgur.com/l2XMYkg.png)
答案都是 false
![](https://i.imgur.com/leFIQd2.png)

![](https://i.imgur.com/E3Q3FXs.png)
然後
![](https://i.imgur.com/4i8Wvev.png)

下個章節講解**自動轉型**規則你就知道了

### 三個等號 ===

<font class="red">「三個等號 === 不會替數值做自動轉型」</font>

原本 null == undefined 的情況下會得到 true
改成 null === undefined 之後，得到的會 false

### 不等於 != 與 !==

!= 與 !== 兩個版本： != 的版本會做自動轉型
!== 則不會做自動轉型

