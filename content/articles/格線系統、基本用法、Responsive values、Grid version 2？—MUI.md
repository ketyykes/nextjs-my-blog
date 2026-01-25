---
title: 格線系統、基本用法、Responsive values、Grid version 2？—MUI
slug: 2022-12-07T03:35:00.000Z
date: 2022-12-07T03:35:00.000Z
tags: ["React","UI Framework"]
---

本文包含以下內容

- 格線系統
- 基本用法
- 設置斷點
- 父組件設置欄數
- Grid version 2

## 格線系統

如果先前有學習過**boostrap5**的人應該對於layout排版布局並不陌生，他們基於w3c所制定的[flex-box](https://www.w3.org/TR/css-flexbox-1/)的設計來達到靈活的排版，每個寬度是固定的分比，在Material design也有介紹關於[Responsive layout grid](https://material.io/design/layout/responsive-layout-grid.html)的介紹，與bootstrp一樣在MUI的設計也是預設12欄的設計

## 各個斷點

| prop名稱 | 原名        | px值   |
| -------- | ----------- | ------ |
| xs       | extra-small | 0px    |
| sm       | small       | 600px  |
| md       | medium      | 900px  |
| lg       | large       | 1200px |
| xl       | extra-large | 1536px |


## 基本用法

我們引入**Grid**後，然後再父層的**Grid component**添加**container**作為容器使用，在子層的時候添加**item**作為**props**使用，以物件的形式傳入**Grid component**裡面，由於是12欄的設計，當我們撰寫`xs={12}`也就是相當於佔滿12欄，同理我們撰寫`xs={8}`就是相當佔滿8欄

```javascript
import React from "react";
import Grid from "@mui/material/Grid";
import "./Div.css";
const BasicGrid = () => {
  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <div className="item">12</div>
        </Grid>
        <Grid item xs={8}>
          <div className="item">8</div>
        </Grid>
      </Grid>
    </>
  );
};
export default BasicGrid;
```

如圖

![](https://i.imgur.com/5EHxhvV.png)

## 設置多個breakpoint

我們可以透過設置斷點的方式讓滿不同的螢幕寬度的時候佔滿的欄數發生變化，在一個Grid同時設置`xs={12}`和`md={6}`的時候，螢幕在大於900px的時候會佔滿的欄數就是6格，觀看以下程式碼

```javascript
import React from "react";
import Grid from "@mui/material/Grid";
import "./Div.css";
const BasicGrid = () => {
  return (
    <>
      <Grid container>
        <Grid xs={12} md={6}>
          <div className="item">Hello</div>
        </Grid>
        <Grid xs={12} md={6}>
          <div className="item">World</div>
        </Grid>
      </Grid>
    </>
  );
};
export default BasicGrid;

```

當在大於900px螢幕的時候，我們會佔滿12欄

![](https://i.imgur.com/23oMtLe.png)

在小螢幕的時候就會佔滿全部

![](https://i.imgur.com/NaXy90m.png)

## 父組件設置欄數

預設十二欄，但我們可以在父層的**container**撰寫**columns**，在子層的地方撰寫欄數就會一樣依照比例切割，例如當我們父層的**container**撰寫sm的斷點設置成8，在子層的item下斷點4的話，就會依照螢幕切分成4/8和4/8的方式佔滿整個螢幕也就是各一半

觀看以下程式碼

```javascript
import React from "react";
import Grid from "@mui/material/Grid";
import "./Div.css";
const BasicGrid = () => {
  return (
    <>
      <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid item xs={2} sm={4} md={4}>
          <div className="item">Hello</div>
        </Grid>
        <Grid item xs={2} sm={4} md={4}>
          <div className="item">World</div>
        </Grid>
        <Grid item xs={2} sm={4} md={4}>
          <div className="item">Hello</div>
        </Grid>
        <Grid item xs={2} sm={4} md={4}>
          <div className="item">World</div>
        </Grid>
        <Grid item xs={2} sm={4} md={4}>
          <div className="item">Hello</div>
        </Grid>
        <Grid item xs={2} sm={4} md={4}>
          <div className="item">World</div>
        </Grid>
      </Grid>
    </>
  );
};
export default BasicGrid;
```

在md以上的時候是12欄
![](https://i.imgur.com/Ar3ToDw.png)

在sm~md的時候由於父組件總欄數是8，即便在子組件的xs設置4還是會佔滿一半的螢幕

![](https://i.imgur.com/oVn1UL7.png)

同理在xs的時候總欄數是4，即便在子組件設置2也是會佔滿一半的螢幕

![](https://i.imgur.com/hLyeWDI.png)

## Grid version 2？

在官方網站近期推出了Grid系統v2版本，改善了幾項問題，首先不需要在子元素撰寫item屬性以及[修復](https://github.com/mui/material-ui/pull/32746)了一些已知問題，對於所有的容器給定了負邊界預設值，另外也可了預防滾動條的方式。

目前Grid version 2正在實作中，預計下一個主要版的時候將會棄用原先的Grid1

以下翻譯自官方[遷移Grid 2](https://mui.com/zh/material-ui/migration/migration-grid-v2/)的原因

主要列出以下幾點

- Grid v2 使用CSS變數取代了class的選擇器，現在可以使用sx來控制任何的樣式
- 全部格線不需要再添加item props
- 透過期待已久的offset featuer將會有更彈性的空間配置
- 巢狀grid不再有深度限制
- disableEqualOverflow的屬性將可以在較小的viewport禁用水平卷軸

```javascript
import Grid from '@mui/material/Unstable_Grid2';
```



##### 參考資料

- [Material-design Responsive layout grid](https://material.io/design/layout/responsive-layout-grid.html)
- [Flex Containers](https://www.w3.org/TR/css-flexbox-1/#flex-containers)
- [Flexible Box Layout Module](https://www.w3.org/TR/css-flexbox-1/)
- [Migration to Grid v2](https://mui.com/zh/material-ui/migration/migration-grid-v2/)
- [Grid version 2](https://mui.com/zh/material-ui/react-grid2/)