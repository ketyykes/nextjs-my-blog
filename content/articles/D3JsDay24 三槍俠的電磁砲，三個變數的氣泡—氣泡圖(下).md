---
title: D3JsDay24 三槍俠的電磁砲，三個變數的氣泡—氣泡圖(下)
slug: 2021-10-09T06:16:00.000Z
date: 2021-10-09T06:16:00.000Z
tags: ["D3.js","Javascript"]
---

## 半徑R圓心座標(x,y)與x,y軸的關係

昨天我們渲染了圖表出來，但是出現的問題是超出了座標軸的範圍，這邊先解釋一下接下來要解決的方式的原理

我們預計使用者可以操作座標軸的最小值和最大值，因此目前的做法是如果繪製出的圓超過座標軸的話就將其消失。

這邊要考量的地方是要如何經過篩選機制將會超出範圍的圓形給過濾掉呢？
首先需要有些座標平面(又稱**笛卡爾座標系**)的概念，可以參見下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211009_01.png)

如圖在座標平面上面圓心分別為(1,1)和(4,0)的兩圓，半徑R為3.5，試著以變數(x,y)和R表示圓形超出座標軸的可能性?

嘗試著看左邊的圓
換句話說，將圓心的x座標(座標數字1)減去半徑R(半徑數字3.5)會是負值(小於零)
同理將圓心的y座標(座標數字1)減去半徑R(半徑數字3.5)也會是負值(小於零)

用數學式子表示在x座標的狀況是 **1-3.5<0** → **-2.5<0**的情況
同理用數學式子表示在y座標的狀況是 **1-3.5<0** → **-2.5<0**的情況

在代成變數就會變成**x-R<0**和**y-R<0**的情況

現在回到程式碼
我們可以對使用`scale函式`映射完在座標平面的**x值**和**y值**對**r值的開平方根相減**是正數的情形就繪製半徑出來，否則半徑就等於0(也就是不繪製)
```javascript{numberLines: true}
gCircle.selectAll("circle")
.data(house)
//中間省略
//中間省略
//中間省略
.attr("r",d=>{
     let R = Math.sqrt(scaleR(d["總價元"]));
    if(
       (scaleX(d["土地移轉總面積平方公尺"])-R>0)
        &&(scaleY(d["建物移轉總面積平方公尺"])-R>0)
        &&(scaleX(d["土地移轉總面積平方公尺"])+R<800)
        &&(scaleY(d["建物移轉總面積平方公尺"])+R<800)
    )
    {
        return Math.sqrt(scaleR(d["總價元"]));
    }
    else {
        return 0;
    }
```
另外要考量的地方是除了圓形會超出在svg的負數位置上面，還可能超出svg的寬高，因此也必須判斷任何圓形繪製完後超出寬為800高為800的圓形
因此程式碼如下
```javascript{numberLines: true}
//這有程式碼先前提過故省略
//這有程式碼先前提過故省略
//這有程式碼先前提過故省略
.attr("r",d=>{
if(
(scaleX(d["土地移轉總面積平方公尺"])-scaleR(d["總價元"]))>0
&&(scaleY(d["建物移轉總面積平方公尺"])-scaleR(d["總價元"]))>0
&&(scaleX(d["土地移轉總面積平方公尺"])+scaleR(d["總價元"]))<800
&&(scaleY(d["建物移轉總面積平方公尺"])+scaleR(d["總價元"]))<800
){
return scaleR(d["總價元"])    
}
else {
return 0;
}
})
```
這邊先製作渲染樣板的函式做為等等在滑鼠移入的時候會執行的事情程式碼如下
```javascript{numberLines: true}
function tooltip(city){
d3.select(".wrap-data").append("div").classed("tooltip",true).html(
`<p>交易標的：${city[0]["交易標的"]}</p>
<p>建物型態：${city[0]["建物型態"]}</p>
<p>主要用途：${city[0]["主要用途"]}</p>
<p>移轉層次：${city[0]["移轉層次"]}</p>
<p>建物總面積${parseInt(city[0]["建物移轉總面積平方公尺"])}m²</p>
<p>土地總面積${parseInt(city[0]["土地移轉總面積平方公尺"])}m²</p>
<p>總價錢${city[0]["總價元"]}元</p>
`)
}
```
如上述函式中所接收的變數city，等等將會接收到滑鼠移入的事件做為渲染畫面的資料。


接下來我們要進行滑鼠移入時所執行的function，在**mouseenter**的**callbackFunction** 裡面我們預計將所移入的圓點變換顏色，撰寫`attr("fill","blue")`，另外將所選到的圓點的data代入到一個tooltip的function執行，在**方法鏈串接**當中使用**mouseleave事件**，並且在其**callbackFuntion**裡面讓原本被改變的顏色恢復成透明度0.1的紅色。這邊使用`d3.select(".tooltip").remove();`在mouseenter的用意主要是希望我再移入下一個圓點之前房屋價格、土地面積等等的資料繼續出現直到下一個滑鼠移入圓點事件被觸發。
```javascript{numberLines: true}
//方法鏈串接程式碼省略
.on("mouseenter",function(){
d3.select(".tooltip").remove();
d3.select(this).attr("fill","blue");
tooltip(d3.select(this).data());
}).on("mouseleave",function(){
d3.select(this)
.attr("fill","rgba(255,0,0,.1)");
});
```
目前成果如下圖
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211009_02.gif)


最後我們進行**軸線更新**以及**切換行政區**的時候畫面更新，也就是當下拉式選單被選擇到某個行政區的時候重新渲染圖形，另外輸入土地和房屋面積的範圍值時按下軸線更新可以切換範圍。如下圖的按鈕及選單。

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211009_03.png)

因此我們回到先前的程式碼的下方添加**change事件**，程式碼如下
```javascript{numberLines: true}
const groupData = d3.group(data,d=>d["鄉鎮市區"]);
//省略
//省略
//省略
for (let i=0;i<districtAry.length;i++) {
d3.select("#district").append("option").text(districtAry[i]);
}
d3.select("#district").on("change", function(e) {
    defaultDistrict=e.target.value
    update();
})
```
然後將接下來的程式碼使用**updata的函式**包住，如果被觸發事件的時候使用`d3.selectAll("svg g").remove();`先移除先前的軸線和圓型後重新繪製，另外在畫面載入的時候執行一次updata()函式程式碼如下
```javascript{numberLines: true}
function update(){
d3.selectAll("svg g").remove();
const house = groupData.get(defaultDistrict).filter(function (d) {
if (d["交易標的"] !== "土地" && d["交易標的"] !== "車位") {
return d;
}
});
//中間省略
//中間省略
//中間省略
.on("mouseenter",function(){
d3.select(".tooltip").remove();
d3.select(this).attr("fill","blue");
tooltip(d3.select(this).data());
// console.log(d3.select(this).data());
}).on("mouseleave",function(){
d3.select(this)
.attr("fill","rgba(255,0,0,.1)");
});
}
update();
```

最後應當可以看到成果如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211009_04.gif)

**本日githubPage連結**
`
[githubPage](https://ketyykes.github.io/tainan-bubble-chart/)

本日完整程式碼如下
```html{numberLines: true}
<div class="wrap">
    <select id="district">
    </select>
    <div class="area-str">建物面積最小值</div>
    <input type="number" id="min-bulid" value=0>
    <span>平方公尺</span>

    <div class="area-str">建物面積最大值</div>
    <input type="number" id="max-bulid" value=300>
    <span>平方公尺</span>

    <div class="area-str">土地面積最大值</div>
    <input type="number" id="max-land" value=500>
    <span>平方公尺</span>

    <div class="area-str">土地面積最小值</div>
    <input type="number" id="min-land" value=0>
    <span>平方公尺</span>
    <button id="btn">軸線更新</button>
</div>
<div class="wrap-data">
  <div class="bulid-div">建物面積m²</div>
  <div class="land-div">土地面積m²</div>
</div>
<script>
let width = 900;
let height = 900;

const svg = d3.select(".wrap-data")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
    d3.csv("tainan11009.csv").then(function(data) {
        const groupData = d3.group(data,d=>d["鄉鎮市區"]);
        groupData.delete("The villages and towns urban district");
        console.log(groupData);
        const districtAry = [...groupData.keys()];
        let defaultDistrict = districtAry[0];
        for (let i=0;i<districtAry.length;i++) {
            d3.select("#district").append("option").text(districtAry[i]);
        }
        d3.select("#district").on("change", function(e) {
            defaultDistrict=e.target.value
            update();
        })
        d3.select("#btn").on("click",update);
        function update(){
            d3.selectAll("svg g").remove();
            console.log(groupData.get(defaultDistrict));
            console.log(Array.isArray(groupData.get(defaultDistrict)))
            const house = groupData.get(defaultDistrict).filter(function (d) {
                if (d["交易標的"] !== "土地" && d["交易標的"] !== "車位") {
                    return d;
                }
            });
            house.forEach(el => {
                el["建物移轉總面積平方公尺"] = +(el["建物移轉總面積平方公尺"]);
                el["土地移轉總面積平方公尺"] = +(el["土地移轉總面積平方公尺"]);
                el["總價元"] = +el["總價元"];
            });
            let minPrice = 0;
            let maxPrice = 10000000;
            let minBuildArea =d3.select("#min-bulid").node().value;
            let maxBuildArea =d3.select("#max-bulid").node().value;
            let minLandArea = d3.select("#min-land").node().value;
            let maxLandArea =d3.select("#max-land").node().value;
            const scaleX =  d3.scaleLinear().domain([minBuildArea,maxBuildArea]).range([0,800]).clamp(true);
            const scaleY =  d3.scaleLinear().domain([maxLandArea,minLandArea]).range([0,800]).clamp(true);
            const scaleR = d3.scaleLinear().domain([minPrice,maxPrice]).range([5,900]).clamp(false);
            const axisX = d3.axisBottom(scaleX)
                            .ticks(15)
                            .tickFormat(d=>(d+"m²"))
                            .tickSize(-800); 
            const axisY = d3.axisLeft(scaleY)
                            .ticks(15)
                            .tickFormat(d=>(d+"m²"))
                            .tickSize(-800); 
            const gX = svg.append("g")
                        .attr("transform",`translate(50,850)`)
                        .classed("xAxis",true);
            const gY = svg.append("g")
                        .attr("transform",`translate(50,50)`)
                        .classed("yAxis",true);                    
            gX.transition().duration(1000).call(axisX);
            gY.transition().duration(1000).call(axisY);

            const gCircle = svg.append("g");
            gCircle.selectAll("circle")
                    .data(house)
                    .join("circle")
                    .attr("transform", "translate(50,50)")
                    .attr("fill","rgba(255,0,0,.1)")
                    .attr("cx",d=>(scaleX(d["土地移轉總面積平方公尺"])))
                    .attr("cy",d=>(scaleY(d["建物移轉總面積平方公尺"])))
                    .attr("r",d=>{
                        let R = Math.sqrt(scaleR(d["總價元"]));
                        if(
                           (scaleX(d["土地移轉總面積平方公尺"])-R>0)
                            &&(scaleY(d["建物移轉總面積平方公尺"])-R>0)
                            &&(scaleX(d["土地移轉總面積平方公尺"])+R<800)
                            &&(scaleY(d["建物移轉總面積平方公尺"])+R<800)
                        )
                        {
                            return Math.sqrt(scaleR(d["總價元"]));
                        }
                        else {
                            return 0;
                        }
                    })
                    .on("mouseenter",function(){
                        d3.select(".tooltip").remove();
                        d3.select(this).attr("fill","blue");
                        tooltip(d3.select(this).data());
                        // console.log(d3.select(this).data());
                    }).on("mouseleave",function(){
                        d3.select(this)
                            .attr("fill","rgba(255,0,0,.1)");
                    });
        }
        update();
        function tooltip(city){
            d3.select(".wrap-data").append("div").classed("tooltip",true).html(
                `<p>交易標的：${city[0]["交易標的"]}</p>
                <p>建物型態：${city[0]["建物型態"]}</p>
                <p>主要用途：${city[0]["主要用途"]}</p>
                <p>移轉層次：${city[0]["移轉層次"]}</p>
                <p>建物總面積${parseInt(city[0]["建物移轉總面積平方公尺"])}m²</p>
                <p>土地總面積${parseInt(city[0]["土地移轉總面積平方公尺"])}m²</p>
                <p>總價錢${city[0]["總價元"]}元</p>
            `)
        }

    })
</script>
```

## 備註說明和題外話
HTML部分左下角加上文字說明此軸是土地面積還是建物面劑並且使用CSS調整了文字垂直排列、由於最後一個x和y軸的刻度的數字可能會被切掉、因此使用了CSS選取器將其設置不顯示，其他的css樣式撰寫就不多做說明，有興趣的人可以再使用devtool觀看。
另外筆者原本是帶入台北109的第四季資料試試看，但是渲染出來的圖片都是大圈圈(房價頗高)，而且變異數太大(代表高房價和低房價的資料頗多)，因此改使用變異數較少和資料量較少的台南110年9月份的資料讓，整個其呈現比較能看得出差異

有興趣者的人可以台北109第四季如下圖!![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211009_05.png)

