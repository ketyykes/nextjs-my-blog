---
title: 讓 TypeScript 成為你全端開發的 ACE 讀書會 - 型別系統概論
slug: 2023-03-04T13:31:00.000Z
date: 2023-03-04T13:31:00.000Z
tags: ["TypeScript"]
---

本篇參與讓 TypeScript 成為你全端開發的 ACE 讀書會所做的筆記加上自己所蒐尋的資料理解後所構成的筆記。

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
@media (max-width: 576px) {
  .rem25{
    font-size:2rem;
  }
  .rem40{
    font-size:3.0rem;
  }
  .rem50{
    font-size:3.5rem;
  }
}
.red {
color:red;
}
.blue{
color:blue;
}
.code{
background-color:#f7f7f7;
padding :4px;
font-size:0.9rem;
font-weight:700;
}
</style>

## 2.1「判斷使用推論或者註記的時機點」

<span class="rem25 blue">不一定需要對所有的變數、函式、表達式都得積極的註記</span>
有時候依靠型別推論也可寫出容易維護及簡潔、潛顯易懂的程式碼

### 需要註記的情形

- 函式的宣告的**參數部分 (argument)**
  - 若未被註記表示任何型別皆可帶入到該函式中→容易產生淺在 BUG
- 僅宣告變數時且變數命名無法聯想時
  - 很難用人類常識聯想知道型別就是註記最佳時機點

### 不需註記的情形

- 直覺的變數命名
  - 例如 isPositive，單純直覺的變數名**可以猜想到型別時，即可不太需要註記**

<span class="rem25 blue">重點：學習何時使用推論或者註記</span>

- 評估各種狀況選擇加上型別註記或者使其自行推論
- 積極註記
  - 限縮型別可能性
  - 減少處理的例外狀況個數
  - 增加變數或方法的可讀性
  - 確保型別不會有衝突
- 若可讀性夠或從變數命名可判斷型別的話，使用型別系統的推論即可

## 2.2 型別註記—註記與斷言的差異性

<span class="rem40">本節將講解斷言與註記的差異</span>
但是<span class="red rem25">為了減少講解語法層面的複雜度</span>
<span class="red rem25">後續章節</span>僅用<span class="red rem25">「型別註記」涵蓋</span>斷言與註記

### 型別註記基本語法 (type annotation)

#### 變數註記
宣告某<span class="blue">變數 T</span>且<span class="blue">型別為 T</span>格式如下

```typescript
<let | const > foo: T = <express>
```

例如：
```typescript
let randomNumber : number = Math.random();
const myName : string = 'Maxwell';
```

#### 函式宣告與註記

宣告某函式為 bar，其**參數**為<span class="blue">p1</span>，**型別**則為<span class="blue">T1</span>，參數<span class="blue">p2</span>型別則為<span class="blue">T2</span>以此類推，其**輸出型別**為<span class="blue">Toutput</span>

```typescript
function bar (p1: T1,p2: T2,...Pn:Tn ) : Toutput
```
例如：

```typescript
function isPositive(input: number): boolean {
  return input > 0;
}
```

#### 變數為函式型別

變數為<span class="blue">一般 function 時</span>，可以用以下方式撰寫型別

**方式一**
註記在指派運算子 (也就是=符號) 的<span class="red">左方</span>

```typescript
const bar : (p1:T1,p2:T2...,Pn: Tn)=> Toutput = <funciton-declartion>
```

例如：
```typescript
function isPostive(input :number): boolean{
  return input > 0;
}
```

註記在指派運算子 (也就是=符號) 的<span class="red">右方</span>
**方式二**

```typescript
const bar = function (p1:T1,P2:T2,...Pn:Tn):Toutput{
  //函式宣告的內容
```

例如：
```typescript
const isPostive = function (input: number): boolean{
  return input > 0;
}
```

> 事實上方式二的例子 isPostive 變數是透過型別推論自動判定 isPostive 的型別為 function

```typescript
const isPostive: (input: number) => boolean = input => input > 0;
```

例如：

```typescript
const isPositive = (input: number):boolean => input >0;
```

#### 變數為 ES6 的箭頭函式

```typescript
const bar = (p1: T1,P2: T2,...Pn: Tn): Toutput => {
  //箭頭函式內容
}
```

### 型別斷言語法

<span class="red">斷言</span>本身帶有<span class="red">肯定的意思</span>，換句話說開發者肯定某些表達式的型別，畢竟開發者通常比 TS 更了解所寫的程式碼。

這樣的作法類似其他強行別語言的<span class="blue">**型別轉換 (type casting)**</span>，只是 Ts 在此是在編譯階段的功能。

<span class="rem25">用法</span>
<br/>
<span class="blue">斷言</span>的語法<span class="red">只能</span>用在<span class="blue">表達式</span>上，因為表達式具備回傳的值。反之敘述式則沒有。

總而言之成以下一句話

<span class="red">**斷言該表達式所運算的結果**</span>

```typescript
<expression> as Tassertion
```

```typescript
<Tassertion>(<expression>)
```

#### 使用情境

- 無法推論 (inference) 某表達式 (expression) 的運算結果型別
  - 例如第三方資源 (thurd0party resources)
    - 像是 JSON 格式 API
    - 套件提供的 function
    - 呼叫會回傳未知的結果

使用方法如下

<span class="blue rem25">一般表達式</span>

**方法一**

```typescript
const asNumber =returnNumber() as number;
```

**方法二**

```typescript
const asNumber = <number> (returnNumber());
```

<span class="blue rem25">函式表達式</span>
較少情況會撰寫函式表達式的斷言，但是在 ts 中是合法的撰寫方式

```typescript
const isPositive =(input => input > 0) as (input: number) => boolean;
```

或是

```typescript
const isPositive =<(input: number) => boolean >(input => input > 0) 
```

以上兩種函式表達式的斷言效果與先前提到的函式註記**效果差不多，但是意義就差很多**

<span class="blue rem25">**其他注意事項**</span>

<span class="red rem25">沒有人斷言在變數名稱宣告的部分</span>

以下為<span class="rem40 red">錯誤範例</span>

<span class="code">const asNumber ~~as number~~ = resturnNumber ();</span>

上述案例常理判斷也能得知不合理的原因是**變數是需要後來指派值，斷言應當是
寫在被指派的值或者表達式上。**

實際使用也要注意以下情形，<span class="red">編譯器將不會跳出警告</span>
斷言 num 是**number 型別**，**實際回傳的是 string 型別**

```typescript
function greeting(message: string) :string|number{
  return message + "Hello"
}
const num = greeting("Danny") as number;
```

或是以下例子
宣告成**any 型別**，即便**something 斷言成 string 型別**也不會跳出警告

```typescript
function returnAny(): any{
  return 123;
}
let something = returnAny()as string;
```

另外在<span class="red">**tsx 語法**</span>（React 的 jsx 語法的 ts 版）中<span class="red">**必須使用 as**</span>的用法

不過如果對某個已知型態斷言、或者違反當初宣告函式的回傳值型別的函式表達式斷言的話，還是會跳出警告訊息。

例如

```typescript
123 as string;
```

```typescript
function returnNumber ():number {
  return 666;
}
returnNumber as string();
```

有趣的是他所跳出的錯誤訊息是
>Conversion of type '() => number' to type 'string' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.ts(2352)

換句話說，該型別並沒有涵蓋在原始宣告的地方，有點類似數學集合的概念。

<span class="rem25">結論</span>

使用斷言是<span class="rem25 red">強制覆寫</span>表達式的型別結果，所以 Typescript 編譯器會果斷忽略斷言後的表達式運算結果型別，因此使用斷言較有機率產生人為錯誤。

## 2.3 綜觀 Typescript 型別種類

- 原始型別 Primitive Types
  - number
  - string
  - bollean
  - undefined
  - null
  - void
  - symbol
- 物件型別 Object Types 藉由以下方式建立
  - 物件實字法 (object literal) 所創造的物件
    - 明文 (literal) 表現形式的物件
  - 類別建構法所創造的物件
    - 型別別名 (Type alias)
  - 陣列
    - 陣列型別 (Array Type)
  - 函式
    - 函式型別 (function Type)

- 明文型別
  - <span class="blue">明文的定義</span>就是<span class="red">**值**</span>的表現方式

- 元組型別 (tuple)
  **範例**

  ```typescript
    const foo[number,string,boolean] = [666,'Devil',false]
  ```

- 列舉型別 (Enum)
  - **範例**

```typescript
enum Color {Red,Blue,Green,Yellow,White}
```

- 特殊型別 (Special Types)
  - any 型別
  - never 型別
  - unknown 型別

- 進階型別 (Advanced Types)
  - 泛用型別 簡稱泛型 (Generic Types)
    - 意思是**型別自身參數化**(Parameterize) 的特殊型別
    - 下列範例的 T 就是泛型的意思

    ```typescript
    function echo<T>(something: T): T{ return something;}
    ```

  - 可控索引型 (Indexable Type)
    - 例如 key 與 value 都必須為 string 的型別

    ```typescript
    const dirctionary: {[key: string]: string} = {
      name:'Tom',
      description:'Will always be 18 years old'
    }  
    ```

  - 索引型別 (Index Type)
    - 功用通常是某鍵是否正確使用到物件的屬性 (Property)
    - 通常關鍵是使用 keyof
      - keyof 又稱為索引列隊操作子 (Type Query Operator)
    - 範例如下

    ```typescript
     type dirctionary = {
      name:'Tom',
      description:'Will always be 18 years old'
      }  
      let info: keyof dirctionary;
      // info 型別是 ('name' | 'description')
    ```

  - 複合型別
    - 聯集型別 (Union Type)

    ```typescript
      let numberOrString: number | string;//聯集型別
    ```

    - 交集型別 (Intersection Type)
    - 以下範例為型別互斥 (Mutually Exclusive) 的情形

    ```typescript
      let numberAndString: number & string//交集型別
    ```

##### 參考資料

- [【Day 04】TypeScript 判斷資料型別的機制 - 型別推論 x 斷言 x 註解](https://ithelp.ithome.com.tw/articles/10217384)
- [medium-TypeScript — Assertion](https://medium.com/%E5%89%B5%E9%A0%86%E7%A7%91%E6%8A%80/%E7%AD%86%E8%A8%98-typescript-assertion-18fc95b69d9a)
- [tsdoc-Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

