---
title: Javascript物件與函式建構子—其他語言的建構子
slug: 2021-12-02T11:30:00.000Z
date: 2021-12-02T11:30:00.000Z
tags: ["Javascript"]
---

| 基於類的（Java）                                         | 基於原型的（JavaScript）                                                                           |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 類和實例是不同的事物                                     | 所有物件均為實例。                                                                                 |
| 通過類定義來定義類                                       | 通過建構函式來產生實體。                                                                           |
| 通過 new 操作符來建立物件                                | 相同                                                                                               |
| 通過類定義來定義現存類的子類，從而建構物件的層級結構     | 通過將一個物件作為原型指定關聯於建構函式來建構物件的層級結構                                       |
| 遵循類鏈繼承屬性                                         | 遵循原型鏈繼承屬性。                                                                               |
| 類定義指定類的所有實例的所有屬性。無法在運行時添加屬性。 | 建構函式或原型指定初始的屬性集。允許動態地向單個的物件或者整個物件集中添加屬性，或者從中移除屬性。 |

## Javascript 建立物件的方式

### 第一種物件實字法(literal object)

```javascript{numberLines: true}
const obj = {};
obj.age = 0;
obj.job = "";
```

### 第二種函式建構子(constructor function)

```javascript{numberLines: true}
function obj(age,job){
    this.age = age;
    this.job = job;
}
var John = new obj(17,"student");
console.log(John)
```

### 第三種(或歸類在第二種)內建物件函式建構子

```javascript{numberLines: true}
const obj = new Object();
obj.age =0;
obj.job ="";
```

### 第四種(或歸類在第二種) ES6 的 class 語法糖

```javascript{numberLines: true}
class ObjClass {
    constructor(age,job){
        this.age = age;
        this.job = job;
    }
}
const obj = new Obj(2,"student");
```

## 各種語言的物件和建構子(Object constructor)

### Java 的物件和函式建構子

```java
class Playground {
    public static void main(String[ ] args) {  //程式進入點
        ObjClass John = new ObjClass(17,"Student");
        System.out.println("John的Age "+ John.age);
        System.out.println("John的Job "+ John.job);

    }
}
class ObjClass {
    int age ;
    String job;
    public ObjClass (int num,String str){
        age = num;
        job = str;
    }
}
```

> [Java 遊樂場](https://code.sololearn.com/cVRUy2BwauK8)

### python 的物件和函式建構子

```python
class Obj:
    def __init__(self, age, job):
        self.age = age
        self.job = job
John = Obj(17,"student")
print(John.age)
print(John.job)
```

> [python playground](https://www.programming-hero.com/code-playground/python/index.html)

### C#的物件和函式建構子

```csharp
using System;
public class Program
{
	public static void Main() //程式進入點
	{
		Obj John = new Obj(19,"student");
		Console.WriteLine(John.age);
		Console.WriteLine(John.job);
	}
}
public class Obj
{
	public int age;
	public string job;
	public Obj(int num,string str){
		age = num;
		job = str;
	}
}
```

> [C#playground](https://dotnetfiddle.net/srx9kM)

參考資料：

> [物件導向程式設計 Wiki](https://zh.wikipedia.org/wiki/%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1) 
> [new 建構子 MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new) 
>  [MDNJava](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Guide/Details_of_the_Object_Model)

