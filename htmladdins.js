// ==UserScript==
// @name         翻译&搜索
// @version      2.1.5
// @description  小窗口显示搜索结果；通过调用金山词霸的接口，监听body鼠标按下事件实现显示单词解释，多种语言（en,pt,it,jp,ru,ko,fr,de）翻译为中文，以及中英文互译，不过有字数限制。（grant GM_xmlhttpRequest是为修改header，模拟金山词霸，防止接口被墙）
// @author       YXP
// @match        *://*/*
// @icon         data:image/svg+xml;base64,PHN2ZyB0PSIxNjYwNTc4Nzc2NzkwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIyNTAiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNNTQ1LjMgNjVjMzguMyAwIDY5LjcgMjkuMiA3My4zIDY2LjVsMC40IDcuMXYyNjUuOGgyNTYuOGM0MyAwIDc4LjQgMzMgODIuMiA3NS4ybDAuNCA3LjV2Mzg5LjFjMCA0My4xLTMzIDc4LjUtNzUuMSA4Mi4zbC03LjUgMC4zSDQ4Ni42Yy00My4xIDAtNzguNS0zMy04Mi4zLTc1LjFsLTAuMy03LjVWNjE5LjRIMTM4LjJjLTM3LjkgMC02OS42LTI4LjgtNzMuMy02Ni41bC0wLjMtNy4xVjEzOC42YzAtMzguMyAyOS4yLTY5LjYgNjYuNS03My4ybDcuMi0wLjRoNDA3eiBtMzMwLjQgMzg3LjFINjE5djkzLjdjLTAuMSAzOC4zLTI5LjIgNjkuNy02Ni42IDczLjJsLTcuMSAwLjRoLTkzLjd2MjU2LjhjMCAxNy41IDEzIDMyIDI5LjggMzQuNmw1LjEgMC40aDM4OS4yYzE3LjUgMCAzMi0xMyAzNC41LTI5LjhsMC40LTUuMVY0ODcuMWMwLTE5LjMtMTUuNS0zNS0zNC45LTM1ek0xNjcuMSA2NjYuNmwyLjgtMC4xYzEyLjEgMCAyMi4zIDkuMSAyMy43IDIxLjEgMC4yIDEuOSAzLjkgMzAuMSAyMS43IDYwLjMgMTYuNiAyOC4yIDQ1LjIgNTguMSA5NS4xIDcwLjlsMTEuMSAyLjVoMC4xYzkuNyAyLjMgMTYuNiAxMC4xIDE4LjIgMTkuMmwwLjQgNC4xLTAuNiA1LjRjLTIuMSA5LjQtOS43IDE2LjYtMTkuMiAxOC4ybC00IDAuMy0zLjgtMC4zaC0wLjFjLTczLjgtMTQuMy0xMTUuNi01Ny45LTEzOC41LTk3LjctMTMuOC0yMy42LTIzLjEtNDkuNi0yNy42LTc2LjZWNjkzLjFsLTAuMi0yLjhjMC0xMC40IDYuNy0xOS43IDE2LjctMjIuOGw0LjItMC45IDIuNy0wLjEtMi43IDAuMXpNNjk1LjIgNTU3YzguNiAwIDE2LjMgNC41IDIwLjUgMTEuNmwxLjggMy43IDg0LjQgMjE5LjkgMS42IDguNmMwIDguNC00LjQgMTYuMS0xMS41IDIwLjVsLTMuOCAxLjktOC41IDEuNmMtOC4zIDAtMTYuMS00LjMtMjAuNS0xMS40bC0xLjktMy45LTE4LjEtNDcuNWgtODkuN2wtMTguNyA0Ny42Yy0zLjEgNy44LTEwIDEzLjQtMTguMyAxNC44bC00IDAuMy04LjctMS43Yy03LjgtMy4xLTEzLjQtOS45LTE0LjgtMTguMmwtMC4zLTQuMSAxLjctOC44TDY3MyA1NzJjMy03LjggOS44LTEzLjQgMTgtMTQuOGw0LjItMC4yaDAuMS0wLjF6IG0tMC4zIDg5LjdsLTI2LjYgNjcuNmg1Mi41bC0yNS45LTY3LjZ6IG0tMTQ5LjYtNTM0aC00MDdjLTEyLjUgMC4xLTIzLjIgOS0yNS41IDIxLjNsLTAuNCA0LjZ2NDA3LjNjMCAxMi41IDkgMjMuMiAyMS4yIDI1LjRsNC43IDAuNWg0MDcuMmMxMi41LTAuMSAyMy4yLTkgMjUuNS0yMS4zbDAuNC00LjdWMTM4LjZjMC0xNC4zLTExLjYtMjUuOS0yNS45LTI1LjloLTAuMnogbS0yMDUuNiA3NS43YzEzLjIgMCAyMy44IDEwLjcgMjMuOCAyMy44djI3LjdoNzcuOGMyMCAwIDM2LjMgMTYuMiAzNi4zIDM2LjN2NzUuMmMwIDIwLTE2LjMgMzYuMy0zNi4zIDM2LjNoLTc3Ljh2ODkuMmMtMC42IDEyLjgtMTEuMSAyMi44LTIzLjkgMjIuOC0xMi44IDAtMjMuMy0xMC0yMy45LTIyLjh2LTg5LjJIMjM4Yy0yMC0wLjEtMzYuMy0xNi4zLTM2LjMtMzYuNHYtNzUuMWMwLjEtMjAgMTYuMy0zNi4yIDM2LjMtMzYuM2g3Ny44di0yNy43YzAtMTMuMSAxMC43LTIzLjggMjMuOS0yMy44eiBtOTAuMiA5OS4yaC02Ni40VjM0MGg2Ni4zbDAuMS01Mi40eiBtLTExNC4xIDBoLTY2LjRWMzQwaDY2LjNsMC4xLTUyLjR6TTcxNC4yIDEzOWwxLjggMC4xYzI5LjMgMi4zIDcxLjIgMTMuOSAxMDYuOCA0MC45IDMzLjEgMjUuMiA2MC40IDY0LjIgNjUuMiAxMjAuOGwwLjcgMTIuNGMwIDExLjktOC4xIDIxLjctMTkgMjRsLTQuMiAwLjVoLTAuN2MtMTIuOSAwLTIzLjUtMTAuMy0yMy44LTIzLjMtMS43LTU4LjMtMzIuMS04OS40LTYzLjMtMTA3LTIwLTEwLjktNDEuOS0xOC02NC42LTIwLjdsLTAuOS0wLjEtNC41LTAuOGMtOC43LTIuNC0xNS4zLTkuNi0xNy0xOC40bC0wLjQtNC41IDAuMS0xLjljMS4xLTEyLjQgMTEuNS0yMS45IDIzLjgtMjJ6IG0wIDAiIGZpbGw9IiM2NjY2NjYiIHAtaWQ9IjIyNTEiPjwvcGF0aD48L3N2Zz4=
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @connect      *
// @run-at       document-end
// ==/UserScript==
/*
注意：有的时候你选择不到文本可能并不是pointer-event，userselect的原因，而是有一层完全透明毫无内容的div覆盖在上面使得你无法点击到自己想要的元素
 * @creatDate 2022-08-15 23:00:00
v1.1.1: 选中弹出按钮，鼠标经过按钮时即显示查词翻译
v1.2.1：增加翻译窗口移动、调节大小功能
v1.2.3：增加窗口最小化和正常化按钮，增加窗口出现动画
v1.3.1：完善金山词霸查词提供的更多信息的显示
v1.4.1: 窗口透明度支持通过在窗口上边栏滚轮滑动调节
v1.5.1：自动收起过长的内容，增加使用分界线作为展开内容的入口
v1.5.2：增加maxZ选项，点击每个窗口可使其在最上层
v2.1.1: 开发搜索功能，对窗口界面作了一些改善
v2.1.2: 增加固定/取消固定按钮
v2.1.3：搜索仅支持百度，但对百度搜索结果页专门进行了处理，显示主体，去除广告，使链接可以直接在另一个小窗中打开等
v2.1.4：优化百度搜索广告拦截机制（不能直接删除，否则百度js又会生成新的广告），而是通过伪类选择器has选择有广告特定类的div，设置其高度为0，overflow:hidden
v2.1.5: 修复将元素移动到body之外后select全部可选的样式无效了，改为html *的选择器有效
v2.1.6: 添加精华吧搜题
v2.1.7: 删除pointer-event:auto !important 因为有的界面顶部加了个全屏div，值为none
下一步计划，覆写js动画，改用CSS的animation；覆写CSS2的样式，改用CSS3的flex和grid等布局
 * @updateDate 2022-11-14
*/
(function() {
    'use strict';
    // 注入自己想要用的函数 用于div属性里添加onclick
    var autoHost = [];
    // 函数库
    function $(s) { return document.querySelector(s) }

    function log() { arguments.length === 1 ? console.log(arguments[0]) : console.log(arguments) }

    function nE(e, id = undefined, cla = undefined) {
        var ele = document.createElement(e);
        id ? ele.id = id : 0;
        cla ? ele.className = cla : 0;
        return ele;
    }

    function hide(e) { e.style.display = 'none' }

    function show(e, str) { e.style.display = str }

    function bgc(e, c) { e.style.backgroundColor = c }
    var body = document.body;
    var docu = document.documentElement;
    var head = document.head;
    var clear = '<div style="display: block; clear: both;"></div>';
    var header = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:82.0) Gecko/20100101 Firefox/82.0",
        'DNT': 1,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
    };
    var scr = nE('script');
    docu.append(scr);
    scr.innerHTML = `
    var timerFade=null;
    function myFade(ele,animArr, time,func) {
        clearInterval(timerFade);
        var t = Math.floor(time/15);
        var sty = ele.style;
        sty.display = 'initial';
        var i=0;
        timerFade = setInterval(function () {
            animArr.forEach((v)=>{
                sty[v.name]=v.from+(v.to-v.from)*func(i/t)+v.unit;
            });
            i++;
            if (i > t ) {
            if(sty.opacity-0<0.02){sty.display = 'none';}
            clearInterval(timerFade);
            }
        }, 15);
    }
    var easeIn=function(x){return x**0.2}
    var easeOut=function(x){return x**2}
    var easeInOut=function(x){return x<0.5?8*x**4:-8*(x-1)**4+1}
    function shhi(h) {
        if (h.style.maxHeight == 'none') {
            h.style.maxHeight = '150px'; h.style.overflow = 'hidden'
        }
        else { h.style.maxHeight = 'none' }
    }
    function sel(str) { return document.querySelector(str) }
    function togClass(ele, c1, c2) {
        if (ele.className == c1) { ele.className = c2 }
        else { ele.className = c1 }
    }
    function min(arr) {
        var min = arr[0];
        arr.forEach(function (cur) { if (cur < min) { min = cur } });
        return min;
    }
    `;
    var sty = nE('style');
    sty.innerHTML = `
html * {
user-select: auto !important;
-webkit-user-select: auto !important;
}
html,body{filter:none !important;}
html {overflow:auto !important;}
* {scrollbar-width:thin;}
.fanyiDiv .fenline:hover {
    cursor: pointer
}
.fanyiDiv>.class {
    max-height: 150px;
    overflow: hidden;
}
.translate .info {
    font: 400 12px/14px sans-serif;
    color: gray;
    padding: 3px 0 5px 5px;
    cursor: move;
    position:sticky;
}
.fanyiDiv .Duyin {
    color: blue
}
.fanyiDiv .part {
    padding: 0 5px;
    max-width: 300px;
    border-left: dotted 2px #aaa;
    margin: 2px 3px;
    min-width:120px;
}
.fanyiDiv .float {
    float: left;
}
.clearfix:after {
    content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden
}
.fanyiDiv .hide {
    display: none
}
.fanyiDiv .full {
    width: 100% !important;
    border: 0
}
.fanyiDiv .translate>div {
    float: left;
    box-sizing: border-box;
    text-align: justify;
    text-justify: inter-character;
}
.fanyiDiv .translateResult {
    border-right: 1px dotted gray;
    padding-right: 10px;
    margin: 0
}
.fanyiDiv .translateOrigin {
    padding-left: 10px;
    color: #444;
    margin: 0
}
.fanyiDiv .partMean {
    float: left;
    padding: 0 12px 0 5px;
    border-left:dotted 1px #bbb;
}
.fanyiDiv .wordName {
    font: 800 18px/24px sans-serif;
    float: left;
}
.fanyiDiv .pronounciation {
    float: left;
    height: 24px;
    margin: 0 0 0 15px;
    font: 600 16px/24px times;
    color: brown;
}
.fanyiDiv * {
    margin: 0;
    font-size: 16px;
    line-height: 20px;
    font-family: sans-serif;
}
.fanyiDiv {
    display: none;
    position: absolute;
    z-index: 99000;
    background-color: rgba(245, 245, 245, .9);
    min-width:30%;
    max-width:50%;
    max-height:70%;
    border: 1px solid rgba(80,80,80,0.3);
    border-radius: 4px;
    font: 400 16px/20px sans-serif;
    color: black;
    box-shadow: 1px 1px 1px 2px rgba(80,80,80,0.3);
    overflow: auto;
    scrollbar-width: none !important;
    transform-origin:0 0 0;
}
.fanyiDiv>.size {position: sticky;right: 0;bottom: 0;cursor: nw-resize;float:right;margin:0;}
.fanyiDiv>.sizeAbs {position: absolute;}
.searchDiv {
height:500px;
width:600px;
}
#wordname {
    font: 700 16px/24px sans-serif;
    padding: 0 10px;
}
#wordpn {
    font: italic 500 14px/24px sans-serif;
}
#exform {
    border: 1px solid gray;
    border-right: 0;
    border-left: 0;
    padding: 2px 0;
    margin: 3px 0;
}
#exform .exformName {
    display:inline-flex;
}
.fanyiDiv .exform {
    color: blueviolet;
    padding: 0 5px 0 10px;
}
.fanyiDiv .wordpart {
    color: black
}
.fanyiDiv .partName {
    font-weight: 600;
    padding-right: 5px;
    color: darkblue;
    float: left;
}
.fanyiDiv .partmeans {
    color: blue
}
.fanyiDiv .egst {
    color: black;
    font-size: 14px;
    padding-left: 10px
}
.fanyiDiv .cizuname {
    color: darkorange;
    font: 600 14px/18px sans-serif;
}
.fanyiDiv .cizumean {
    color: blue
}
.fanyiDiv .fenline {
    border: 5px solid rgba(245, 245, 245, .99);
    padding: 1px;
    background-color: gray;
}
.fanyiDiv .cgcz {
    color: blue;
    margin: 0 10px;
    font-weight: bold;
}
.fanyiDiv .fanyiClose {
    float: right;
    position: sticky;
    right: 0px;
    top:0;
    font: 600 22px/20px sans-serif;
    padding: 4px 8px;
    color: #000;
    cursor: pointer;
    opacity: 0.2;
    z-index: 9999999;
}
.fanyiDiv .fanyiClose:hover {
    opacity: 1 !important;
    background:#bbb;
}
.fanyiDiv>div{margin:2px 5px;}
.chinese .hanzi {
    font-weight: bold;
    color: yellowgreen
}
.fanyiDiv div span {
    margin: 0 5px;
}
.fanyiDiv>.info {
   padding: 2px 5px;
font: 400 16px/28px sans-serif;
color: gray;
cursor: move;
height: 28px;
}
.featureBtn {
    float:left;
    padding:3px;
    border-radius:5px;
    opacity:0.5;
    background-color:rgba(240,240,240,0.8);
    font-size:0;
    margin:3px;
}
.featureBtn:hover {
    display:block !important;
    opacity:1 !important;
    scale:1 !important;
}
.fanyiDiv .hover {opacity:0;}
.fanyiDiv .hover p {
display:none;
position: absolute;
top: 30px;
width: max-content;
color: black;
border: solid 1px black;
padding: 1px 2px;
left: 0;
background: white;
font: 400 12px/14px microsoft-yahei;
}
.fanyiDiv .hover:hover p {display:block;}
.fanyiDiv:hover .hover{opacity:0.2}
    #transInput {
	height: 18px;
	width: 18px;
	border-radius: 2px;
	padding: 2px;
	border: 1px solid gray;
	position: absolute;
	bottom: 0;
	left: 0;
	opacity: .2;
}
#transInput:hover,#transInput:focus {
	width: 200px;
	border-color: aqua;
	box-shadow: 0 0 1px 2px aquamarine;
	opacity: 1;
}
#myFeature{
    display:none;
    position:absolute;
    border-radius:5px;
    opacity:0.5;
    background-color:rgba(240,240,240,0.8);
    font-size:0;
    z-index:9999999;
    width: 42px;
height: 42px;
overflow: hidden;
animation:0.3s featurebtncollapse;
transform-origin:0 0 0;
transform:scale(0.8,0.8);
}
@keyframes myfadein {
0% {opacity:0}
20% {opacity:1}
60% {opacity:1}
100% {opacity:0}
}
#myFeature>div {
width:126px;
}
#myFeature:hover {
display:block !important;
opacity:1 !important;
width: max-content;
height: min-content;
animation:0.3s featurebtnexpand;
max-width: 130px;
}
@keyframes featurebtnexpand {
from {
    width: 42px;
height: 42px;}
to {
width: 126px;
height: 42px;}
}
@keyframes featurebtncollapse {
from {
width: 126px;
height: 42px;}
to {
    width: 42px;
height: 42px;}
}
.windowTitle {
    position: sticky;
    top: 0;
    padding: 2px 0;
    height:24px;
    overflow:hidden;
    font: 500 18px sans-serif;
}
.cgczhide .partname {
color: #CC0;
}
.cgczhide .partword {
    color:blue;
}
.cgczhide>p{
    color:gray;
}
.searchDisplayBox {height:100%;}
.baiduPage {height:100%;}
`;
    head.append(sty);
    // 引入Windows通知的动画
    /**
     * @file 桌面通知、仿桌面通知
     * @author cedar(YXP修改)
     * @createDate 2018-09-05 16:21:11
     **/
    var d_toast_text_node = `.zoom-image {
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    overflow: hidden;
    background-position: center center;
    background-repeat: no-repeat;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    background-size: cover
}
.d-toast-icon {
    width: 50px;
    height: 50px;
    margin: auto;
    margin-left: 20px;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0
}
.d-toast-close:hover {
    color: #FFFFFF!important
}
.d-toast {
    z-index: 999999;
    animation: d-toast-left-in 0.5s;
}
.d-toast:hover {
display:block !important;
right:30px !important;
opacity:1 !important;
}
.d-toast-close::before {
    content: "＋"
}
@keyframes d-toast-left-in {
    from {right: -400px}
    to { right: 30px}
}
@keyframes d-toast-right-out {
    from {right: 30px }
    to {right: -400px}
}
.d-toast-close-start {
    animation: d-toast-right-out 0.5s;
}
.d-toast {
    cursor: default;
    width: 360px;
    padding: 6px;
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: rgba(238,238,255,.9);
    border-radius:10px;
}
.d-toast-content {
    position: relative;
    left: 10px
}
.d-toast-content>ul {
    list-style: outside none none;
    padding-left: 0px;
    margin: 5px 0;
    width: max-content
}
.d-toast-title {
    color:#111;
    font: 700 18px/22px microsoft-yahei
}
.d-toast-content>ul>li {
    max-width: 340px;
    overflow-wrap: break-word
}
.d-toast-body {
    color: #222;
    padding: 2px;
    font: 400 16px/20px microsoft-yahei
}
.d-toast-info {
    color: #555;
    font-size: 12px
}
.d-toast-close {
    transform: rotate(45deg);
    color: rgb(173, 173, 173);
    font-size: 26px;
    font-weight: normal;
    position: absolute;
    top: 6px;
    right: 6px;
    display: none
}
.d-toast:hover .d-toast-close{
    display: block;
}
`;
    var d_toast_style = nE('style');
    d_toast_style.innerHTML = d_toast_text_node;
    document.head.appendChild(d_toast_style);
    // 无论是在document还是window对象绑定 WD 类都无法调用，于是只能用万能招数：向dom里添加script，让它自己运行
    /* var WDscript = nE('script');
     WDscript.innerHTML = `
     function nE(e, id = undefined, cla = undefined) {
         var ele = document.createElement(e);
         id ? ele.id = id : 0;
         cla ? ele.className = cla : 0;
         return ele;
     }
     class WD{
         constructor(title){
             title = title || 'Window';
             this.div = document.createElement('div','','fanyiDiv');
             this.say = ()=>{console.log(this.div)};
         }
         init(){}
         show(x='20%',y='20%',e={clientX:'',clientY:1,x:1,y:1,pageX:1,pageY:1},position='absolute',animation=''){
             clickToTop(this);
         }
         hide(){}
         remove(){}
     }`;
     docu.append(WDscript);*/
    class dToast {
        constructor(config) {
            if (typeof config.inner == 'undefined') { config.inner = true }
            if (typeof config == 'string') { config = { title: '新消息', body: config, } } else if (typeof config.title == 'undefined') { config.title = '新消息' }
            this.toast(config)
        };
        inner(config) {
            var date = new Date();
            date = date.getHours() + ':' + date.getMinutes();
            var _div = nE('div', 0, 'd-toast');
            var _div_content = nE('div', 0, 'd-toast-content');
            var _close = nE('span', 0, 'd-toast-close');
            _div.oncontextmenu = 'return false';
            _div.onselectstart = 'return false';
            var toast_data = config.data;
            _div_content.innerHTML = `<ul><li class="d-toast-title">` + config.title + `</li><li class="d-toast-body">` + config.body + `</li><li class="d-toast-info">` + date + `<span style="font-size:16px;font-weight:bold;">·</span>` + document.domain + `</li></ul>`;
            _close.onclick = function(e) {
                _div.className = 'd-toast d-toast-close-start';
                setTimeout(function() { _div.remove(); if (typeof onclose == 'function') { config.onclose(e) } }, 500)
            };
            var toast_items = document.getElementsByClassName('d-toast');
            var _width = 0;
            for (var i = 0; i < toast_items.length; i++) {
                var item = toast_items[i];
                _width += item.offsetHeight + 20
            };
            var _div_bottom = _width + 20;
            var _body_height = document.documentElement.clientHeight;
            if (_body_height - 200 < _div_bottom) {
                for (var i = toast_items.length - 1; i >= 0; i--) { toast_items[i].remove() }
                _div_bottom = 20
            };
            if (typeof config.onclick == 'function') { _div.onclick = function(e) { var _target = e.target; if (_target.nodeName == 'SPAN') { _close.click } else { config.onclick(toast_data) } } };
            _div.style.bottom = _div_bottom + 'px';
            _div.appendChild(_div_content);
            _div.appendChild(_close);
            var _d_toast_timeout = config.timeout;
            if (typeof _d_toast_timeout == 'undefined') { _d_toast_timeout = 6500 };
            document.documentElement.appendChild(_div);
            console.log(_d_toast_timeout);
            if (_d_toast_timeout > 0) {
                setTimeout(function() {
                    _div.className = 'd-toast d-toast-close-start';
                    setTimeout(function() { _div.style.opacity = 0; }, 500);
                    setTimeout(function() { _div.remove() }, 2500);
                }, _d_toast_timeout)
            }
        };
        toast(config) {
            var self = this;
            var toast_config = config;
            if (window.Notification && Notification.permission !== 'denied' && config.inner != true) {
                Notification.requestPermission(function(status) {
                    if (status == 'granted') {
                        var _config = { lang: 'zh-CN', tag: 'toast-' + (+new Date()), body: config.body, };
                        if (typeof config.data != 'undefined') { _config.data = config.data };
                        if (typeof config.timeout != 'undefined') { _config.timestamp = config.timeout };
                        const d_toast_n = new Notification(config.title, _config);
                        var d_toast_data = config.data;
                        d_toast_n.onclick = function(e) { if (typeof toast_config.onclick == 'function') { toast_config.onclick(d_toast_data) } }
                    } else {
                        if (config.dev == true) { console.warn('请允许通知！') };
                        self.inner(config)
                    }
                })
            } else {
                if (config.dev == true) { console.warn('你的浏览器不支持！\n1、被禁止通知\n2、请更换浏览器\n3、已设置成浏览器通知') };
                self.inner(config)
            }
        }
    };
    // 创建翻译用div
    var tran = nE('div', "trslDiv");
    tran.maxZ = 99000;
    docu.append(tran);
    var last = '';
    var feat = nE('div', 'myFeature', 'clearfix');
    var fanyibtn = nE('div', 'translateBtn', 'featureBtn'),
        searchbtn = nE('div', 'searchBtn', 'featureBtn'),
        jhbsouti = nE('div', 'jhbsouti', 'featureBtn');
    fanyibtn.innerHTML = '<svg t="1660904800228" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2248" width="30" height="30"><path d="M545.3 65c38.3 0 69.7 29.2 73.3 66.5l0.4 7.1v265.8h256.8c43 0 78.4 33 82.2 75.2l0.4 7.5v389.1c0 43.1-33 78.5-75.1 82.3l-7.5 0.3H486.6c-43.1 0-78.5-33-82.3-75.1l-0.3-7.5V619.4H138.2c-37.9 0-69.6-28.8-73.3-66.5l-0.3-7.1V138.6c0-38.3 29.2-69.6 66.5-73.2l7.2-0.4h407z m330.4 387.1H619v93.7c-0.1 38.3-29.2 69.7-66.6 73.2l-7.1 0.4h-93.7v256.8c0 17.5 13 32 29.8 34.6l5.1 0.4h389.2c17.5 0 32-13 34.5-29.8l0.4-5.1V487.1c0-19.3-15.5-35-34.9-35zM167.1 666.6l2.8-0.1c12.1 0 22.3 9.1 23.7 21.1 0.2 1.9 3.9 30.1 21.7 60.3 16.6 28.2 45.2 58.1 95.1 70.9l11.1 2.5h0.1c9.7 2.3 16.6 10.1 18.2 19.2l0.4 4.1-0.6 5.4c-2.1 9.4-9.7 16.6-19.2 18.2l-4 0.3-3.8-0.3h-0.1c-73.8-14.3-115.6-57.9-138.5-97.7-13.8-23.6-23.1-49.6-27.6-76.6V693.1l-0.2-2.8c0-10.4 6.7-19.7 16.7-22.8l4.2-0.9 2.7-0.1-2.7 0.1zM695.2 557c8.6 0 16.3 4.5 20.5 11.6l1.8 3.7 84.4 219.9 1.6 8.6c0 8.4-4.4 16.1-11.5 20.5l-3.8 1.9-8.5 1.6c-8.3 0-16.1-4.3-20.5-11.4l-1.9-3.9-18.1-47.5h-89.7l-18.7 47.6c-3.1 7.8-10 13.4-18.3 14.8l-4 0.3-8.7-1.7c-7.8-3.1-13.4-9.9-14.8-18.2l-0.3-4.1 1.7-8.8L673 572c3-7.8 9.8-13.4 18-14.8l4.2-0.2h0.1-0.1z m-0.3 89.7l-26.6 67.6h52.5l-25.9-67.6z m-149.6-534h-407c-12.5 0.1-23.2 9-25.5 21.3l-0.4 4.6v407.3c0 12.5 9 23.2 21.2 25.4l4.7 0.5h407.2c12.5-0.1 23.2-9 25.5-21.3l0.4-4.7V138.6c0-14.3-11.6-25.9-25.9-25.9h-0.2z m-205.6 75.7c13.2 0 23.8 10.7 23.8 23.8v27.7h77.8c20 0 36.3 16.2 36.3 36.3v75.2c0 20-16.3 36.3-36.3 36.3h-77.8v89.2c-0.6 12.8-11.1 22.8-23.9 22.8-12.8 0-23.3-10-23.9-22.8v-89.2H238c-20-0.1-36.3-16.3-36.3-36.4v-75.1c0.1-20 16.3-36.2 36.3-36.3h77.8v-27.7c0-13.1 10.7-23.8 23.9-23.8z m90.2 99.2h-66.4V340h66.3l0.1-52.4z m-114.1 0h-66.4V340h66.3l0.1-52.4zM714.2 139l1.8 0.1c29.3 2.3 71.2 13.9 106.8 40.9 33.1 25.2 60.4 64.2 65.2 120.8l0.7 12.4c0 11.9-8.1 21.7-19 24l-4.2 0.5h-0.7c-12.9 0-23.5-10.3-23.8-23.3-1.7-58.3-32.1-89.4-63.3-107-20-10.9-41.9-18-64.6-20.7l-0.9-0.1-4.5-0.8c-8.7-2.4-15.3-9.6-17-18.4l-0.4-4.5 0.1-1.9c1.1-12.4 11.5-21.9 23.8-22z m0 0" fill="#707070" p-id="2249"></path></svg>';
    searchbtn.innerHTML = '<svg t="1668148786266" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3432" width="28" height="28"><path d="M1010.100627 940.224384l-191.906195-188.631579c159.91046-182.150566 150.359494-453.87555-25.582945-620.13058C613.462653-44.343771 319.156457-44.343771 136.801227 134.668621c-179.148834 172.5996-182.35523 457.081945-9.550966 632.887941l9.550966 9.619188c166.323251 159.842239 425.495536 179.012392 610.988941 41.614923l191.974417 188.563358c9.550966 9.550966 22.376549 15.963757 35.133911 15.963757a51.370553 51.370553 0 0 0 35.202131-15.963757c16.031979-16.031979 19.238374-47.959494 0-67.129647zM98.460921 454.353098c3.138175-198.250766 166.323251-358.024783 367.848634-358.024784s364.642239 159.774017 367.848634 358.024784c-3.206396 201.32072-169.529647 361.162958-367.848634 357.956562A361.708728 361.708728 0 0 1 98.460921 454.353098z" p-id="3433" fill="#707070"></path></svg>';
    jhbsouti.innerHTML = '<svg t="1670049345013" viewBox="0 0 1092 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4495" width="28" height="30"><path d="M1023.992235 341.31291c37.682914 0 68.266149 30.651501 68.266149 68.266149v546.129192c0 37.614648-30.583235 68.266149-68.266149 68.266149H68.266149c-37.682914 0-68.266149-30.651501-68.266149-68.266149v-546.129192c0-37.614648 30.583235-68.266149 68.266149-68.266149h136.532298c18.841457 0 34.133074 15.291617 34.133074 34.133075s-15.291617 34.133074-34.133074 34.133074H68.266149v546.129192h955.726086v-546.129192H750.927639c-18.841457 0-34.133074-15.291617-34.133075-34.133074s15.291617-34.133074 34.133075-34.133075h273.064596z m-170.665373 204.798447c18.841457 0 34.133074 15.291617 34.133075 34.133075s-15.291617 34.133074-34.133075 34.133074H648.528415c-18.841457 0-34.133074-15.223351-34.133074-34.133074s15.291617-34.133074 34.133074-34.133075h204.798447z m0 204.798447c18.841457 0 34.133074 15.291617 34.133075 34.133075s-15.291617 34.133074-34.133075 34.133074H307.19767c-18.841457 0-34.133074-15.223351-34.133074-34.133074s15.291617-34.133074 34.133074-34.133075h546.129192z m-10.99085-644.36418a34.158674 34.158674 0 0 1 0 48.264167L745.875944 251.26986l-0.068266 0.068266-0.068267 0.068266L407.89024 589.255563c-3.754638 3.754638-8.32847 6.55355-13.380165 8.191938l-144.792502 48.264168c-3.54984 1.228791-7.167946 1.77492-10.786052 1.77492a34.27814 34.27814 0 0 1-24.166216-9.966858 34.141608 34.141608 0 0 1-8.260204-34.952268l48.264167-144.792502c1.706654-5.051695 4.573832-9.625527 8.32847-13.380166L697.54351 10.017289a34.158674 34.158674 0 0 1 48.264168 0l96.528334 96.528335z m-477.043849 428.711416l308.085131-308.085131-48.264168-48.264167-308.08513 308.08513-24.166217 72.430384 72.430384-24.166216z m356.349298-356.349298l48.264167-48.264167-48.264167-48.264168-48.264167 48.264168 48.264167 48.264167z" fill="#707070" p-id="4496"></path></svg>';
    var ftd = nE('div', 0, 'clearfix');
    feat.append(ftd);
    ftd.append(fanyibtn);
    ftd.append(searchbtn);
    ftd.append(jhbsouti);
    docu.append(feat);
    var input = nE('input', 'transInput');
    // if(self==top){document.documentElement.append(input);}
    var tar, eventL, selected;
    var urlcallback = {
        baidusearch: function(id, dat, ifrw) {
            ifrw.body.style.display = 'none';
            var dc = ifrw.documentElement;
            var content = ifrw.querySelector('#content_left');
            content.style.marginLeft = '5px';
            content.style.paddingLeft = '0px';
            dc.append(content);
            var t = 0;
            var chd = content.children;
            for (var i = 0; i < chd.length; i++) {
                var v = chd[i];
                v.getElementsByClassName('c-gap-left').length ? (v.style.height = '0', v.style.overflow = 'hidden') : 0;
            }
            var a = setInterval(() => {
                for (var i = 0; i < chd.length; i++) {
                    var v = chd[i];
                    v.getElementsByClassName('c-gap-left').length ? (v.style.height = '0', v.style.overflow = 'hidden') : 0;
                }
                t++;
                t > 1 ? (clearInterval(a)) : 0;
            }, 3000);
            // content.children.forEach((v) => { v.id ? 0 : (console.log(v),v.style.display='none !important') });
            var toptip = ifrw.querySelector('.result-molecule.hit-toptip.new-pmd');
            if (toptip) { toptip.remove() }
            ifrw.querySelectorAll('#content_left .t>a').forEach((e) => {
                var title = e.parentNode;
                var t = e.innerText;
                var href = e.href;
                title.innerHTML = '<a>' + e.innerHTML + '</a>';
                title.onclick = () => {
                    var ev = {
                        pos: {
                            bottom: '100px',
                            left: '200px'
                        }
                    };
                    newsearch(ev, href, () => {}, t);
                }
            });
        },
        jinghua8: function(id, dat, ifrw) {
            console.log(id, data, ifrw);
            console.log(ifrw.querySelector('div'));
        }
    };
    var svg = '<svg t="1661011012771" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6165" width="12" height="12"><path d="M341.333333 725.333333c-8.533333 0-25.6 0-34.133333-8.533333s-8.533333-25.6-8.533333-34.133333 0-25.6 8.533333-34.133334l341.333333-341.333333c17.066667-17.066667 42.666667-17.066667 59.733334 0 17.066667 8.533333 17.066667 25.6 17.066666 34.133333s0 25.6-8.533333 34.133334l-341.333333 341.333333c-8.533333 8.533333-25.6 8.533333-34.133334 8.533333z" p-id="6166" fill="#1296db"></path><path d="M597.333333 810.666667c-8.533333 0-25.6 0-34.133333-8.533334s-8.533333-25.6-8.533333-34.133333 0-25.6 8.533333-34.133333l170.666667-170.666667c17.066667-17.066667 42.666667-17.066667 59.733333 0 17.066667 8.533333 17.066667 25.6 17.066667 34.133333s0 25.6-8.533334 34.133334l-170.666666 170.666666c-8.533333 8.533333-25.6 8.533333-34.133334 8.533334z" p-id="6167" fill="#1296db"></path></svg>';

    function close(relNode = 'parentNode') { return `<div class="fanyiClose hover" title="关闭" onclick="var f=this.` + relNode + `;myFade(f,[{name:'top',from:f.offsetTop,to:window.pageYOffset+document.documentElement.clientHeight,unit:'px'},{name:'opacity',from:1,to:0,unit:''},],300,function(x){return x**3});setTimeout(function(){f.outerHTML=''},500)">X</div>`; }

    function closeAll(relNode = 'parentNode.parentNode') { return `<div class="fanyiClose hover" title="全部关闭" onclick="var f=this.` + relNode + `;myFade(f,[{name:'opacity',from:1,to:0,unit:''},],300,function(x){return x**3});setTimeout(function(){f.innerHTML='';f.style.opacity=1;f.style.scale=1;f.style.display='initial'},500)">A<p>全部关闭</p></div>`; }
    var size = `<div class="size hover">` + svg + `</div>`;
    var sizeAbs = `<div class="size sizeAbs hover">` + svg + `</div>`;

    function collapse(relNode = 'parentNode') { return `<div class="fanyiClose hover" title="收起" style="padding: 2px 8px;" onclick="this.style.display='none';this.nextSibling.style.display='block';var f=this.` + relNode + `;myFade(f,[{name:'height',from:f.offsetHeight,to:25,unit:'px'},{name:'width',from:f.offsetWidth,to:275,unit:'px'},{name:'opacity',from:1,to:0.5,unit:''}],500,easeInOut)"><svg t="1668177842226" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4436" width="22" height="22"><path d="M98.23 451.003l829.685-1.992 0.154 64-829.685 1.992z" fill="#000000" p-id="4437"></path></svg><p>收起</p></div>`; }

    function expand(relNode = 'parentNode') { return `<div class="fanyiClose hover" title="展开" style="display:none;paddding:2px 6px 4px" onclick="this.style.display='none';this.previousSibling.style.display='block';var f=this.` + relNode + `;myFade(f,[{name:'height',from:f.offsetHeight/document.documentElement.clientHeight*100,to:60,unit:'%'},{name:'width',from:f.offsetWidth/document.documentElement.clientWidth*100,to:40,unit:'%'},{name:'opacity',from:0.5,to:1,unit:''}],500,easeInOut)"><svg t="1668177770562" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3546" width="20" height="20"><path d="M890.41032533 75.09333333h-573.472768c-32.555008 0-59.04247467 26.279936-59.04247466 58.5728V255.91808H134.68194133c-32.56046933 0-59.04247467 26.279936-59.04247466 58.57826133v575.832064c0 32.29832533 26.48200533 58.57826133 59.04247466 58.57826134H708.149248c32.54954667 0 59.04247467-26.279936 59.04247467-58.57826134V768.07645867h123.21860266c32.555008 0 59.04247467-26.27447467 59.04247467-58.57826134v-575.832064c0-32.292864-26.48746667-58.5728-59.04247467-58.5728z m-188.82013866 808.72516267H141.24100267V321.00078933h560.349184V883.818496zM883.851264 702.99374933H767.19172267V314.49634133c0-32.29832533-26.492928-58.57826133-59.04247467-58.57826133H323.50208V140.17604267H883.851264V702.99374933z" fill="#000000" p-id="3547"></path></svg><p>展开</p></div>`; }

    function collapse2(relNode = 'parentNode') { return `<div class="fanyiClose hover" style="padding: 2px 8px;" onclick="this.style.display='none';this.nextSibling.style.display='block';var f=this.` + relNode + `;myFade(f,[{name:'height',from:f.offsetHeight,to:34,unit:'px'},{name:'width',from:f.offsetWidth,to:154,unit:'px'},{name:'opacity',from:1,to:0.5,unit:''}],500,easeInOut)"><svg t="1668177842226" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4436" width="22" height="22"><path d="M98.23 451.003l829.685-1.992 0.154 64-829.685 1.992z" fill="#000000" p-id="4437"></path></svg><p>收起</p></div>`; }

    function drag(title = '', widget = '') { return '<div style="height: 28px;overflow:visible;background-color:rgba(200,220,255,.8);cursor: move;position: sticky;top: 0;left: 0;margin:0;scrollbar-width: none;" onscroll="var o=(102-this.scrollTop)/102;o=o>1?1:o;o=o<0.1?0.05:o;this.parentNode.style.opacity=o;">' + widget + '<div class="windowTitle">' + title + '</div><br><br><br><br><br><br></div>'; }

    function gofixed(relNode = 'parentNode') { return `<div class="fanyiClose hover" style="padding: 4px 8px;" onclick="var f=this.` + relNode + `;var p=f.style.position;var gofixed=(p=='absolute' || !p)?1:0;this.style.background=gofixed?'deepskyblue':'none';if(gofixed){f.style.top=(f.offsetTop-document.documentElement.scrollTop)+'px';f.style.position='fixed';}else{f.style.position='absolute';f.style.top=(f.offsetTop+document.documentElement.scrollTop)+'px';}"><svg t="1668231785516" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4282" width="18" height="18"><path d="M674.632519 600.429005 674.618193 600.429005c-7.303336 0-14.300704 1.342578-19.455097-3.839445L428.228573 371.187951c-10.715039-10.741645-10.701736-27.069519 0.026606-37.797861L666.18615 95.984075c20.168342-20.167319 48.607044-31.473829 78.012771-31.473829 27.981285 0 53.707203 10.460236 72.424496 29.17753L930.634054 207.764927c19.228947 19.21462 30.667463 47.142693 31.380708 76.561723 0.737804 30.144554-9.937326 58.542324-29.286 77.890998L694.075337 596.616166C688.918897 601.772606 681.923576 600.429005 674.632519 600.429005zM486.570329 353.920682 674.658102 542.519084l219.185025-219.159442c8.756431-8.754385 13.5629-22.490224 13.187347-37.662785-0.363274-15.213493-6.083555-29.782304-15.282055-38.97978L777.739828 132.707464c-8.337899-8.337899-20.24816-12.930497-33.540907-12.930497-14.932084 0-29.191856 5.706979-39.127136 15.628956L486.570329 353.920682z" p-id="4283"></path><path d="M590.940398 332.275709c-3.53143 0-7.062859-1.342578-9.749038-4.042059-5.355985-5.384637-5.342682-14.084787 0.039909-19.442818l5.318122-5.28947c5.355985-5.384637 14.072507-5.357008 19.442818 0.026606 5.355985 5.384637 5.344728 14.08581-0.039909 19.442818l-5.318122 5.290493C597.962326 330.946434 594.444199 332.275709 590.940398 332.275709z" p-id="4284"></path><path d="M623.31269 299.903417c-3.518127 0-7.03523-1.342578-9.721409-4.028757-5.370311-5.371334-5.370311-14.071484 0-19.442818l89.692788-89.693812c21.161972-21.161972 56.273654-21.806655 76.68452-1.38351l58.488089 58.489112c5.370311 5.371334 5.370311 14.071484 0 19.442818s-14.072507 5.371334-19.442818 0l-58.488089-58.489112c-9.519818-9.506515-27.539216-8.848529-37.798884 1.38351l-89.692788 89.693812C630.34792 298.559816 626.830817 299.903417 623.31269 299.903417z" p-id="4285"></path><path d="M585.783958 957.923072 585.783958 957.923072c-7.305383 0-14.286378-2.902096-19.457144-8.05649-27.605731-27.607778-66.532299-66.840314-111.646799-112.331391C339.018785 720.931496 180.631452 561.249681 70.259692 453.778994c-5.27719-5.129834-8.271384-12.151761-8.311293-19.509333-0.054235-7.357572 2.846838-14.433734 8.05649-19.631106 105.72595-105.752556 264.180821-139.374304 403.715785-85.651752 14.165628 5.451152 21.227464 21.36254 15.776312 35.541471-5.451152 14.152325-21.36254 21.228487-35.541471 15.776312-110.505813-42.564421-234.96236-20.973684-324.535421 54.380538 109.136629 106.866936 255.57277 254.498298 364.30724 364.097462 34.938744 35.234479 66.156746 66.707284 91.266633 91.923596 72.922846-86.177731 95.748714-203.160049 59.293431-311.666322-4.835122-14.393825 2.914376-29.981848 17.308201-34.815947 14.380522-4.859681 29.981848 2.90005 34.830273 17.308201 46.094828 137.198755 11.156084 285.992593-91.198072 388.334469C600.070336 955.020976 593.075015 957.923072 585.783958 957.923072z" p-id="4286"></path><path d="M99.893616 941.164387c-7.102768 0-14.193257-2.738367-19.576871-8.190543-10.660804-10.822486-10.540054-28.222785 0.26913-38.883589l236.224096-232.902444c10.809183-10.67513 28.210505-10.541077 38.898939 0.268106 10.660804 10.822486 10.540054 28.224832-0.281409 38.885636L119.201357 933.243997C113.84435 938.533466 106.875634 941.164387 99.893616 941.164387z" p-id="4287"></path></svg><p>固定/取消固定</p></div>` }

    function newTab(relNode = 'parentNode') { return `<div class="fanyiClose hover" onclick="var f=this.` + relNode + `;window.open(f.uri,'_blank')"><svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2678" width="18" height="18"><path d="M908.8 1005.44H115.2a101.76 101.76 0 0 1-101.12-101.76V110.72A101.76 101.76 0 0 1 115.2 8.96h296.96a32.64 32.64 0 0 1 32 32V262.4a32 32 0 0 1-32 32 32 32 0 0 1-32-32v-192H115.2a37.76 37.76 0 0 0-37.12 37.76v795.52a37.76 37.76 0 0 0 37.12 37.76h793.6a37.76 37.76 0 0 0 37.12-37.76V267.52a32 32 0 0 1 32-32 32 32 0 0 1 32 32v636.16a101.76 101.76 0 0 1-101.12 101.76z" fill="#323333" p-id="2679"></path><path d="M977.92 299.52a32.64 32.64 0 0 1-32-32V180.48a37.12 37.12 0 0 0-37.12-37.76H421.12a32 32 0 0 1-32-32 32 32 0 0 1 32-32h487.68a101.76 101.76 0 0 1 101.12 101.76v87.04a32 32 0 0 1-32 32z" fill="#323333" p-id="2680"></path><path d="M977.92 299.52H64a32 32 0 0 1-32-32 32 32 0 0 1 32-32h913.92a32 32 0 0 1 32 32 32 32 0 0 1-32 32z" fill="#323333" p-id="2681"></path><path d="M699.52 299.52a32 32 0 0 1-32-32V110.72a32 32 0 0 1 64 0v156.8a32 32 0 0 1-32 32z" fill="#323333" p-id="2682"></path></svg><p>在新标签页中打开</p></div>` }
    input.onkeydown = function(e) {
            if (e.keyCode == 13) {
                var ev = {
                    pos: {
                        bottom: '60px',
                        left: '20px'
                    }
                };
                onselect(ev, input.value);
                input.value = '';
            }
        }
        /*fanyibtn.onmouseover = function () {
            var str;
            if(selected){str=}
            if (str.search(/[a-zA-Z0-9\u0800-\u9fbf\uac00-\ud7ff]+/) === -1) {
                return false;
            }
            // feat.style.top='-40px';
            feat.style.display = 'none';
            onselect(eventL, str);
        }*/
    function judgetxt() {
        feat.style.display = 'none';
        var str;
        selected ? (str = selected, selected = '') : (str = tar.innerText);
        if (str.search(/[a-zA-Z0-9\u0800-\u9fbf\uac00-\ud7ff]+/) === -1) {
            return false;
        } else { return str }
    }
    fanyibtn.onclick = function() {
            var s = judgetxt();
            s ? onselect(eventL, s) : 0;
        }
        /*searchbtn.onmouseover = function () {
            var str = window.getSelection().toString();
            feat.style.display = 'none';
            search(eventL, str);
        }*/
    searchbtn.onclick = function() {
        var s = judgetxt();
        if (/^ *https?:\/\/www\.[\w\-]{1,10}\./.test(s)) { window.open(s) } else if (/^ *www\.[\w\-]{1,10}\./.test(s)) { window.open('http://' + s) } else {
            s ? newsearch(eventL, 'https://www.baidu.com/s?wd=' + s, urlcallback.baidusearch, '搜索 ' + s) : 0;
        }
    }
    jhbsouti.onclick = () => {
        var s = judgetxt();
        // 精华吧这玩意有很强的保护措施，无法在别的域名下显示它的页面
        // zhao 前面有即时cookie验证，懒得弄了，直接找baidu site:www.jhq8.cn
        /*if(s){
            var url = 'https://www.baidu.com/s?wd='+s+' site:www.jhq8.cn';
            GM_xmlhttpRequest({
                method: "get",
            url:url ,
            headers: header,
            timeout: 5000,
            onerror: function (e) {new dToast({title:`连接错误`,body:'URL:'+url.substr(0,30)}); console.log('error:', e) },
            ontimeout: function (o) { new dToast({title:`连接超时`,body:'URL:'+url.substr(0,30)});console.log('timeout:', o) },
            onload: function (data) {
                var res = data.response;
                console.log(res);
            }
            });
        }*/
        newsearch(eventL, 'https://jhq8.cn/daan/2022/01/708664.html', () => { console.log('hhh') }, '搜索 ' + s);
        s ? newsearch(eventL, 'https://www.baidu.com/s?wd=' + s + ' site:www.jhq8.cn', urlcallback.baidusearch, '搜索 ' + s) : 0;

    };
    document.onclick = function() { setTimeout(() => { window.getSelection().toString() ? 0 : (selected = 0) }, 100) }
    document.onmouseup = function(e) {
        eventL = e;
        this.onmousemove = null;
        // e.stopPropagation(); // 这里好像会有些问题，会使选取无法终止。原来的作用已经忘了
        var tgt = e.target;
        var tag = tgt.tagName || '',
            id = tgt.id || '',
            text = tgt.innerText || '';
        var seltext = window.getSelection().toString();
        if (seltext) { selected = seltext; try { GM_setClipboard(seltext, window.getSelection()); } catch (err) { console.log(err) } }
        if (id != 'translateBtn' && id != 'searchBtn' && text.match(/[a-zA-Z0-9\u0800-\u9fbf\uac00-\ud7ff]+/) && tag != 'svg' && tag != 'img' && tag != 'video' && (seltext || tgt.innerText.length > 2)) {
            tar = e.target;
            var y = e.pageY - 60;
            y = y < window.pageYOffset ? e.clientY + 40 : y;
            var x = e.pageX + 30;
            var xm = window.pageXOffset + window.innerWidth;
            x = x > xm - 50 ? xm - 100 : x;
            feat.style.top = y + 'px';
            feat.style.left = x + 'px';
            feat.style.opacity = 0;
            myFade(feat, [{ name: "opacity", from: 0, to: 0.8, unit: '' }], 300, function(x) { return x ** 3 });
        }
        if (autoHost.findIndex(function(h) { return this.match(h) || h.match(this) }, window.location.hostname) != -1) {
            var str = window.getSelection().toString();
            console.log(str);
            if (str.search(/[a-zA-Z0-9\u0800-\u9fbf\uac00-\ud7ff]+/) === -1) { console.log("Rejected:", str); return; }
            /* 中文：/[\u4e00-\u9fa5]/
            日文：/[\u0800-\u4e00]/
            韩文：/[\uac00-\ud7ff]/ */
            onselect(e, str);
        }
    }
    setInterval(function() {
        if (feat.style.opacity > 0.15) {
            myFade(feat, [{ name: "opacity", from: 0.8, to: 0.1, unit: '' }], 1500, function(x) { return x ** 2 });
            setTimeout(() => { feat.style.display = 'none' }, 4000);
        }
        last = '';
    }, 8000);

    function sel(str) { return $(str) }

    function move(obj, tgt, size) {
        obj.onmousedown = function(e) { //鼠标按下事件
            var z = tgt.style.zIndex;
            z < tran.maxZ ? (tgt.style.zIndex = tran.maxZ = tran.maxZ + 1) : 0;
            e = e || window.event; //事件对象
            var x_down = e.clientX; //鼠标按下X的坐标
            var y_down = e.clientY; //鼠标按下Y的坐标
            var h = tgt.offsetHeight;
            var w = tgt.offsetWidth;
            var leftDown = tgt.offsetLeft || x_down - parseFloat(tgt.lastW) / 2; //获取盒子的初始left值,如果是全屏化则。。。
            var topDown = tgt.offsetTop; //获取盒子的初始top值
            tgt.lastH ? 0 : (tgt.lastH = h + 'px', tgt.lastW = w + 'px');
            if (size) { tgt.style.cssText += "max-height:none;max-width:none;min-width:auto;min-height:auto;" }
            var th = tgt.style.height,
                tw = tgt.style.width;

            function move(e) { //鼠标移动事件
                e = e || window.event;
                var x = e.clientX;
                var y = e.clientY;
                var dx = x - x_down;
                var dy = y - y_down;
                if (size) {
                    tgt.style.width = tgt.lastW = w + dx + 'px';
                    tgt.style.height = tgt.lastH = h + dy + 'px';
                } else {
                    if (y < 5 || x < 5 || window.innerWidth - x < 5) { //靠近顶部全屏
                        tgt.style.cssText += "max-height:none;max-width:none;min-width:auto;min-height:auto;"
                        tgt.style.top = window.pageYOffset + 'px';
                        tgt.style.height = '100%';
                        tgt.style.left = window.innerWidth - x < 5 ? '50%' : 0;
                        tgt.style.width = y < 5 ? '100%' : '50%';
                    } else {
                        tgt.style.top = topDown + dy + 'px';
                        tgt.style.left = leftDown + dx + 'px';
                        tgt.style.height = (th == '100%' || th == body.offsetHeight + 'px') ? tgt.lastH : (h + 'px');
                        tgt.style.width = (tw == '100%' || tw == '50%' || tw == body.offsetWidth + 'px') ? tgt.lastW : (w + 'px');
                    }
                }
            }
            document.onmousemove = move;
            /*document.onmouseup = function(e){
                if(!size){
                if(e.clientY<5){//靠近顶部全屏
                    tgt.style.top=window.pageYOffset+'px';
                    tgt.style.cssText='left:0;width:100%;height:100%';
                }else if(e.clientX<5){ // 靠近左边左半屏
                    tgt.style.top=window.pageYOffset+'px';
                    tgt.style.cssText='left:0;width:50%;height:100%';
                }else if(window.clientX-e.clientX<5){ // 靠近右半边右半屏
                    tgt.style.top=window.pageYOffset+'px';
                    tgt.style.cssText='right:0;width:50%;height:100%';
                }}
                document.removeEventListener('mousemove',move);
                this.mousemove = this.mouseup = null;
                return false;
            }*/
            tgt.lastX ? 0 : (tgt.lastX = tgt.offsetLeft, tgt.lastY = tgt.offsetTop);
            e.stopPropagation();
            return false //阻止默认事件
        }
    }

    function clickToTop(obj, tgt) {
        tgt = tgt || obj;
        obj.onmousedown = () => {
            var z = tgt.style.zIndex;
            z < tran.maxZ ? (tgt.style.zIndex = tran.maxZ = tran.maxZ + 1) : 0;
        }
    }
    console.log('翻译&搜索插件运行中');
    const jscburl = 'https://dict-mobile.iciba.com/interface/index.php?c=word&list=100,24,8,21,22,10,12,13,9,15,2,5,14,4,6,7&client=1&timestamp=1660571931&sign=cc4677186dac0e85&uuid=fcf712001d8b4f049c6e7096c2b43763&sv=android11&v=8.5.2&uid=';

    function onselect(e, str) {
        str = str.replace(/^[0-9,\.\/<>\?;':"\[\]\{\}\\\|\+=\-_\(\)\*\&\^%\$#@\!`~，。、《》？；：’“”‘【】—（）·~…￥]+([a-zA-Z\-]+)[0-9,\.\/<>\?;':"\[\]\{\}\\\|\+=\-_\(\)\*\&\^%\$#@\!`~，。、《》？；：’“”‘【】—（）·~…￥]+$/, '$1');
        if (str === '' || str === last) { return; }
        GM_xmlhttpRequest({
            method: "post",
            url: jscburl,
            data: "word=" + str,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "Apache-HttpClient/UNAVAILABLE (java 1.4)",
            },
            onabort: function(abort) {
                console.log('aborted:', abort)
            },
            timeout: 5000,
            onerror: function(e) {
                new dToast({ title: '翻译&搜索插件：连接错误', body: `data:word=${str}` });
                console.log('error:', e)
            },
            ontimeout: function(o) {
                new dToast({ title: '翻译&搜索插件：连接超时', body: `data:word=${str}` });
                console.log('timeout:', o)
            },
            onload: function(dat) {
                dat = JSON.parse(dat.response);

                if (dat.status == 0 || dat.message.baesInfo.translate_type == 3) {
                    new dToast({ title: '翻译&搜索插件：返回结果错误', body: `type:${dat.message.baesInfo.translate_type}<br>data:word=${str}<br>` });
                    console.log('error:', dat);
                    return;
                }
                dat = dat.message;
                console.log(dat);
                var fanyi = nE('div', 0, 'fanyiDiv');
                clickToTop(fanyi);
                /* fanyi.onmouseup = function (e) {
                    var s = document.getSelection().toString();
                    if (s.search(/[a-zA-Z0-9\u0800-\u9fbf\uac00-\ud7ff]+/)=== -1) {
                    console.log(e);return false;}onselect(e, s);
                }*/
                if (e.pos) {
                    fanyi.style.position = 'fixed';
                    for (var v in e.pos) {
                        fanyi.style[v] = e.pos[v];
                    }
                } else {
                    var x = e.pageX,
                        y = e.pageY,
                        wx = window.innerWidth,
                        wy = window.innerHeight;
                    console.log('已选择：' + str + '  位置：x=' + x + ',y=' + y);
                    x = min([x, wx * 0.7 - 10]);
                }
                // 当mouseup看是否有选择
                fanyi.style.left = (x + 10) + 'px';
                tran.append(fanyi);
                // console.log(dat);
                var symbols = {},
                    mean = [],
                    baesInfo = dat.baesInfo || {},
                    cetFour = dat.cetFour || [],
                    cetSix = dat.cetSix || [],
                    eemean = dat.ee_mean || [],
                    phrase = dat.phrase || [],
                    sentence = dat.sentence || [],
                    slang = dat.slang || [],
                    stems = dat.stems_affixes || [],
                    synonym = dat.synonym || [],
                    trade_means = dat.trade_means || [];
                // symbols = dat.baesInfo.symbols[0] || {},
                // mean = symbols.parts || [],
                // 基本释义 baesInfo
                var baesInfoEle = '';
                if (dat.word_name && dat.result_from === 'fanyi') {
                    var from = 'style="width:60%"',
                        to = 'style="width:40%"';
                    if (baesInfo.to == '英语') {
                        var t = from;
                        from = to;
                        to = t;
                    }
                    var info = '<div class="info">翻译&emsp;&emsp;&emsp;' + baesInfo.from + ' <=> ' + baesInfo.to + '</div>';
                    baesInfoEle += ('<div class="translate"><div id="tlres" class="translateResult" ' + to + ' onclick="togClass(event.target,\'translateResult\',\'full\');togClass(event.target.nextElementSibling,\'translateOrigin\',\'hide\')">' + baesInfo.translate_result + '</div><div id="tlori" class="translateOrigin" ' + from + ' onclick="togClass(event.target.previousElementSibling,\'translateResult\',\'hide\');togClass(event.target,\'translateOrigin\',\'full\')">' + dat.word_name + '</div></div>');
                    fanyi.innerHTML = '<div style="float:left"' + close().substr(4) + close() + closeAll() + collapse2() + expand() + gofixed() + info + baesInfoEle + '<input id="transInput">' + size + sizeAbs;
                    var h = fanyi.offsetHeight;
                    if (y > wy * 0.5) {
                        y -= (h + 10);
                    } else {
                        y += 10;
                    }
                    fanyi.style.top = y + 'px';
                    last = str;
                    // fanyi.style.opacity = 0;
                    fanyi.style.display = 'block';
                    move(fanyi.children[6], fanyi);
                    move(fanyi.lastChild, fanyi, 1);
                    move(fanyi.lastChild.previousSibling, fanyi, 1);
                    var inp = fanyi.lastChild.previousSibling.previousSibling;
                    inp.onkeydown = function(e) {
                        if (e.keyCode == 13) {
                            var ev = {
                                pos: {
                                    bottom: '100px',
                                    left: '200px'
                                }
                            };
                            onselect(ev, inp.value);
                            inp.value = '';
                        }
                    }
                    myFade(fanyi, [{ name: "top", from: window.pageYOffset, to: fanyi.offsetTop, unit: 'px' }, { name: "opacity", from: 0, to: 1, unit: '' }, ], 300, function(x) { return x ** (0.2) });
                    return true; // 翻译直接返回结果
                } else {
                    if (baesInfo.word_name.search(/[a-zA-Z]+/) > -1) {
                        // 英文单词或词组
                        var symbols = baesInfo.symbols[0] || {};
                        var pronounciation = symbols.ph_en;
                        if (pronounciation) { pronounciation = '<div class="pronounciation">' + pronounciation + ('&nbsp;&nbsp;&nbsp;' + symbols.ph_am + '</div>'); } else { pronounciation = '' }
                        var exform = baesInfo.exchange || {},
                            form = '';
                        if (exform) { form += '<div id="exform">' }
                        for (var key in exform) {
                            var keyname = key.replace('word_', '');
                            form += `<span class="exformName">${keyname}`;
                            exform[key].forEach(function(val) { form += '<span class="exform">' + val + '</span>' });
                            form += '</span>';
                        }
                        if (form === '<div id="exform">') { form = '' } else { form += '</div>' }
                        var parts = symbols.parts || [],
                            partsEle = '';
                        if (parts) {
                            partsEle = '<div class="wordBaseMean clearfix">'
                            parts.forEach(function(v) {
                                partsEle += '<div class="part float"><div class="partName">' + v.part + '</div><div class="partMean clearfix">';
                                v.means.forEach(function(s, i) { partsEle += ('<p class="partMeanP">' + s + '</p>'); if ((i + 1) % 6 == 0) { partsEle += '</div><div class="partMean clearfix">' } });
                                partsEle += ('</div></div>');
                            })
                            partsEle += '</div>';
                        }
                        baesInfoEle += '<div class="wordEng"><div class="wordName">' + baesInfo.word_name + '</div>' + pronounciation + clear + form + partsEle + '</div>';
                    } else {
                        // 中文汉字或词组
                        var symbols = baesInfo.symbols || [];
                        baesInfoEle += '<div class="wordCh">'
                        symbols.forEach(function(duyin) {
                            baesInfoEle += ('<div class="wordDuyin"><div class="Duyin">' + duyin.word_symbol + '</div>');
                            var part = '<div class="DuyinMean clearfix">';
                            duyin.parts.forEach(function(v) {
                                part += ('<div class="part float"><div class="partName">' + v.part + '</div><div class="partMean clearfix">');
                                v.means.forEach(function(s) { part += ('<p class="partMeanP">' + s + '</p>') });
                                part += ('</div></div>');
                            })
                            part += '</div>';
                            baesInfoEle += (part + '</div>');
                        });
                        baesInfoEle += '</div>';
                    }
                }
                // 汉语词典 chinese
                var chinese = dat.chinese || {};
                var chinEle = '';
                if (chinese.zi || chinese.ci) {
                    chinEle = '<div class="fenline" onclick="shhi(event.target.nextSibling)"></div><div class="chinese class">';
                    if (chinese.zi) {
                        var zi = chinese.zi;
                        var yin = zi[0];
                        chinEle += '<div class="baseInfo"><span class="hanzi">' + yin.hanzi + '</span><span class="fanti">' + yin.fanti + '</span><span class="bushou">' + yin.bushou + '</span><span class="bihua">' + yin.bihua + '</span><span class="jiegou">' + yin.jiegou + '</span><span class="zaozi">' + yin.zaozi + '</span></div>';
                        zi.forEach(function(yin) {
                            chinEle += '<div><div class="yin"><span class="Duyin">' + yin.pinyin + '</span>';
                            if (yin.tongyin) { chinEle += '<span class="tongyin">同音词：<b>' + yin.tongyin + '</b></span>'; }
                            if (yin.fanyi) { chinEle += '<span class="fanyici">反义词：<b>' + yin.fanyi + '</b></span>' }
                            var ciyu = yin.ciyu.replace(/,/g, ' ');
                            var nixu = yin.nixu.replace(/～/g, yin.hanzi);
                            nixu = nixu.replace(/｜/g, ' ');
                            chinEle += '</div><div class="jieshi">' + yin.jieshi + '</div><div class="ciyu">' + ciyu + '\n' + nixu + '</div></div>';
                        })
                    } else if (chinese.ci) {
                        var ci = chinese.ci;
                        chinEle += '<div class=baseInfo><span class="hanzi">' + ci.ciyu + '</span><span class="Duyin">' + ci.pinyin + '</span><span class="goucheng">' + ci.goucheng + '</span>';
                        if (ci.tongyi) { chinEle += '<span class="tongyi">同义词：<b>' + ci.tongyi + '</b></span>'; }
                        if (ci.fanyi) { chinEle += '<span class="fanyici">反义词：<b>' + ci.fanyi + '</b></span>' }
                        if (ci.tongyin) { chinEle += '<span class="tongyin">同音词：<b>' + ci.tongyin + '</b></span>' }
                        chinEle += '</div><div class="jieshi">' + ci.ciyi + '</div><div class="exlg">' + ci.liju + '</div>';
                    }
                    chinEle += '</div>';
                }
                // 英英词典 ee_mean
                var enmean = '';
                if (eemean.length > 0) { enmean += '<div class="fenline" onclick="shhi(event.target.nextSibling)"></div><div class="eemean class">'; }
                eemean.forEach(function(val) {
                    var means = '';
                    val.means.forEach(function(v) {
                        var s = '';
                        v.sentences.forEach(function(st, i) {
                            if (i > 2) { return; }
                            s += ('<div class="egst">' + st.sentence.replace(/^"(.+)";?$/, '$1') + '</div>');
                        });
                        means += ('<div>' + v.word_mean + '</div>' + s);
                    });
                    enmean += '<div class="wordpart"><span class="partname">' + val.part_name + '</span><span class="partmeans">' + means + '</span></div>';
                })
                if (eemean.length > 0) { enmean += '</div>' }
                // 词根词缀 stems_affixes
                // 同义词   synonym
                // 同义辨析 sameAnalysis
                // 反义词   antonym
                // 行业词典 trade_means
                // 词组搭配 phrase
                // 双语例句 sentence
                // 四级例句 cetFour
                // 六级例句 cetSix
                // 常用俚语 slang
                // 权威例句 还没见过-_-
                // 网络释义 还没见过-_-
                // 维基词典 还没见过-_-
                // 中文意思
                var chmean = '';
                mean.forEach(function(val) {
                    var means = '';
                    val.means.forEach(function(v) { means += v + '；' })
                    means = means.replace(/；$/, '。');
                    chmean += '<div class="wordpart"><span class="partname">' + val.part + '</span><span class="partmeans">' + means + '</span></div>';
                });
                // 词根词缀
                var cgcz = '';
                if (stems.length > 0) {
                    cgcz += '<div class="fenline" onclick="shhi(event.target.nextSibling)"></div><div class="cgczhide class">'
                    stems.forEach(function(type) {
                        cgcz += '<div><span class="typename">' + type.type + '</span><span class="cgcz">' + type.type_value + '</span><span>' + type.type_exp + '</span></div>';
                        type.word_parts.forEach(function(part) {
                            cgcz += '<div class="partname">' + part.word_part + '</div>';
                            part.stems_affixes.forEach(function(v) {
                                cgcz += '<div><span class="partword">' + v.value_en + '</span><span>' + v.value_cn + '</span></div>';
                                cgcz += '<p>' + v.word_buile + '</p>';
                            })
                        })
                    });
                    cgcz += '</div>';
                }
                // 短语
                var phrasestr = '';
                if (phrase.length > 0) { phrasestr += '<div class="fenline" onclick="shhi(event.target.nextSibling)"></div><div class="phrase class">'; }
                phrase.forEach(function(val, ind) {
                    phrasestr += ('<div class="cizuname">' + val.cizu_name + '</div>');
                    val.jx.forEach(function(v) {
                        phrasestr += ('<div class="cizumean">' + v.jx_cn_mean + '&nbsp;&nbsp;' + v.jx_en_mean + '</div>');
                        var a = v.lj || [];
                        a.forEach(function(g, i) {
                            if (i > 2) { return; }
                            phrasestr += ('<div class="egst">' + g.lj_ly + '</div>');
                        });
                    });
                });
                if (phrase.length > 0) { phrasestr += '</div>' }
                // 常用俚语
                var slan = '';
                if (slang.length > 0) { slan += '<div class="fenline" onclick="shhi(event.target.nextSibling)"></div><div class="slang class">'; }
                slang.forEach(function(v) {
                    var mean = '';
                    v.list.forEach(function(val) {
                        mean += '<p style="color:blueviolet">' + val.explanation + '</p>';
                        var ex = val.example;
                        if (ex.length > 0) { mean += ('<p>' + ex[0].en + '</p><p>' + ex[0].zh + '</p>') }
                    });
                    slan += '<div class="wordslang"><div class="cizumean">' + v.tokens + '</div><div>' + mean + '</div></div>';
                });
                if (slang.length > 0) { slan += '</div>' }
                // 同义词辨析
                // 这里可以调节显示的顺序
                var pp = 'parentNode.parentNode';
                fanyi.innerHTML = drag('查词 ' + baesInfo.word_name, '<div style="float:left"' + close(pp).substr(4) + close(pp) + closeAll(pp + '.parentNode') + collapse(pp) + expand(pp) + gofixed(pp)) + baesInfoEle + chmean + chinEle + cgcz + phrasestr + enmean + slan + '<input id="transInput">' + size + sizeAbs;
                if (e.pos) {} else {
                    var h = fanyi.offsetHeight;
                    if (y > wy * 0.5) {
                        y -= (h + 10);
                    } else {
                        y += 10;
                    }
                    fanyi.style.top = y + 'px';
                }
                last = str;
                // fanyi.style.opacity = 0;
                fanyi.style.display = 'block';
                move(fanyi.children[0], fanyi);
                move(fanyi.lastChild, fanyi, 1);
                move(fanyi.lastChild.previousSibling, fanyi, 1);
                var inp = fanyi.lastChild.previousSibling.previousSibling;
                inp.onkeydown = function(e) {
                    if (e.keyCode == 13) {
                        var ev = {
                            pos: {
                                bottom: '100px',
                                left: '200px'
                            }
                        };
                        onselect(ev, inp.value);
                        inp.value = '';
                    }
                }
                myFade(fanyi, [{ name: "top", from: window.pageYOffset, to: fanyi.offsetTop, unit: 'px' }, { name: "opacity", from: 0, to: 1, unit: '' }, ], 300, function(x) { return x ** (0.2) });
            }
        })
    }
    var searchId = 1;

    function newsearch(e = { pos: { top: '100px', left: '200px' } }, url = '', success = () => {}, title = '') {
        if (url === '') { return; }
        if (/^ *https?:\/\//.test(url) || /^ *[\w-]+\.[\w\-]{1,10}\./.test(url)) {} else { url = 'https://www.baidu.com/s?wd=' + url; }
        var id = 'search' + searchId;
        var search = nE('div', id, 'fanyiDiv searchDiv');
        id = '#' + id;
        searchId += 1;
        search.style.zIndex = tran.maxZ = tran.maxZ + 1;
        var pp = 'parentNode.parentNode';
        search.innerHTML = drag(title, '<div style="float:left"' + close(pp).substr(4) + close(pp) + closeAll(pp + '.parentNode') + collapse(pp) + expand(pp) + gofixed(pp) + newTab(pp)) + `<div class="searchDisplayBox"><div class="baiduPage"><iframe class="myiframe" width="100%" height="100%" frameBorder=0></iframe></div></div>
        <!-- <div class="searchEngine">
        <svg class="baiduSvg" onclick="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5341" width="30" height="30"><path d="M184.682 538.759c111.177-23.874 96.03-156.737 92.702-185.776-5.445-44.768-58.102-123.02-129.606-116.831-89.98 8.074-103.126 138.052-103.126 138.052-12.17 60.08 29.132 188.452 140.03 164.555zM302.746 769.86c-3.257 9.331-10.517 33.228-4.234 54.03 12.402 46.677 52.912 48.77 52.912 48.77h58.218v-142.31h-62.336c-28.016 8.354-41.535 30.157-44.56 39.51z m88.281-453.898c61.406 0 111.037-70.667 111.037-158.04C502.064 70.643 452.433 0 391.027 0c-61.312 0-111.06 70.643-111.06 157.923 0 87.373 49.77 158.04 111.06 158.04z m264.47 10.447c82.068 10.657 134.84-76.925 145.335-143.31 10.703-66.292-42.256-143.288-100.357-156.527-58.218-13.356-130.909 79.904-137.54 140.704-7.912 74.32 10.633 148.593 92.562 159.133z m201.086 390.213s-126.976-98.24-201.11-204.414C555 355.66 412.272 419.37 364.525 498.993 316.987 578.594 242.9 628.947 232.382 642.28c-10.68 13.124-153.385 90.166-121.694 230.87 31.669 140.612 142.939 137.936 142.939 137.936s81.998 8.074 177.12-13.217c95.168-21.104 177.096 5.26 177.096 5.26s222.284 74.435 283.108-68.852c60.754-143.334-34.368-217.654-34.368-217.654zM476.26 929.88H331.739c-62.406-12.449-87.257-55.03-90.398-62.29-3.072-7.376-20.802-41.604-11.425-99.845 26.968-87.257 103.87-93.516 103.87-93.516h76.926v-94.563l65.524 1V929.88z m269.146-1h-166.3c-64.453-16.614-67.455-62.407-67.455-62.407v-183.89l67.455-1.094v165.276c4.119 17.637 26.015 20.825 26.015 20.825h68.525V682.581h71.76v246.297z m235.408-490.99c0-31.76-26.387-127.394-124.23-127.394-98.008 0-111.108 90.258-111.108 154.06 0 60.894 5.142 145.894 126.883 143.195 121.788-2.7 108.455-137.936 108.455-169.86z m0 0" fill="#3245DF" p-id="5342"></path></svg>
        <svg class="googleSvg" onclick="" width="30px" height="30px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M214.101333 512c0-32.512 5.546667-63.701333 15.36-92.928L57.173333 290.218667A491.861333 491.861333 0 0 0 4.693333 512c0 79.701333 18.858667 154.88 52.394667 221.610667l172.202667-129.066667A290.56 290.56 0 0 1 214.101333 512" fill="#FBBC05" /><path d="M516.693333 216.192c72.106667 0 137.258667 25.002667 188.458667 65.962667L854.101333 136.533333C763.349333 59.178667 646.997333 11.392 516.693333 11.392c-202.325333 0-376.234667 113.28-459.52 278.826667l172.373334 128.853333c39.68-118.016 152.832-202.88 287.146666-202.88" fill="#EA4335" /><path d="M516.693333 807.808c-134.357333 0-247.509333-84.864-287.232-202.88l-172.288 128.853333c83.242667 165.546667 257.152 278.826667 459.52 278.826667 124.842667 0 244.053333-43.392 333.568-124.757333l-163.584-123.818667c-46.122667 28.458667-104.234667 43.776-170.026666 43.776" fill="#34A853" /><path d="M1005.397333 512c0-29.568-4.693333-61.44-11.648-91.008H516.650667V614.4h274.602666c-13.696 65.962667-51.072 116.650667-104.533333 149.632l163.541333 123.818667c93.994667-85.418667 155.136-212.650667 155.136-375.850667" fill="#4285F4" /></svg>
        </div>-->` + '<input id="transInput">' + size + sizeAbs;
        move(search.firstChild, search);
        move(search.lastChild, search, 1);
        move(search.lastChild.previousSibling, search, 1);
        search.style.opacity = 0;
        search.style.display = 'block';
        clickToTop(search);
        if (e.pos) {
            search.style.position = 'fixed';
            for (var v in e.pos) {
                search.style[v] = e.pos[v];
            }
        } else {
            var x = e.pageX,
                y = e.pageY,
                wx = window.innerWidth,
                wy = window.innerHeight;
            x = min([x, wx * 0.7 - 10]);
        }
        // 当mouseup看是否有选择
        search.style.left = (x + 10) + 'px';
        if (e.pos) {} else {
            var h = search.offsetHeight;
            if (y > wy * 0.5) {
                y -= (h + 10);
            } else {
                y += 10;
            }
            search.style.top = y + 'px';
        }
        tran.append(search);
        var inp = search.lastChild.previousSibling.previousSibling;
        inp.onkeydown = function(e) {
            if (e.keyCode == 13) {
                var ev = {
                    pos: {
                        bottom: '100px',
                        left: '200px'
                    }
                };
                var tmp = inp.value.search(/https?:\/\//) != -1 ? inp.value : ('https://www.baidu.com/s?wd=' + inp.value);
                newsearch(ev, inp.value, () => {}, 'Title');
                inp.value = '';
            }
        }
        myFade(search, [{ name: "top", from: window.pageYOffset, to: search.offsetTop, unit: 'px' }, { name: "opacity", from: 0, to: 1, unit: '' }, ], 300, function(x) { return x ** (0.2) });
        GM_xmlhttpRequest({
            method: "get",
            url: url,
            headers: header,
            timeout: 5000,
            onerror: function(e) {
                new dToast({ title: `搜索：连接错误`, body: 'URL:' + url.substr(0, 30) });
                console.log('error:', e)
            },
            ontimeout: function(o) {
                new dToast({ title: `搜索：连接超时`, body: 'URL:' + url.substr(0, 30) });
                console.log('timeout:', o)
            },
            onload: function(data) {
                var final = decodeURI(data.finalUrl);
                if (final == url) {
                    log(url, data);
                    var ifr = $(id + ' .baiduPage iframe');
                    var ifrw = ifr.contentDocument;
                    ifr.uri = search.uri = url;
                    ifrw.open();
                    ifrw.write(data.response);
                    ifrw.close();
                    var dc = ifrw.documentElement;
                    dc.style.scrollbarWidth = 'none';
                    dc.style.background = '#f5f5f5';
                    success(id, data, ifrw);
                } else {
                    GM_xmlhttpRequest({
                        method: "get",
                        url: final,
                        headers: header,
                        timeout: 5000,
                        onerror: function(e) {
                            new dToast({ title: `搜索：连接错误`, body: 'URL:' + final.substr(0, 30) });
                            console.log('error:', e)
                        },
                        ontimeout: function(o) {
                            new dToast({ title: `搜索：连接超时`, body: 'URL:' + final.substr(0, 30) });
                            console.log('timeout:', o)
                        },
                        onload: function(dat) {
                            log(final, dat);
                            var ifr = $(id + ' .baiduPage iframe');
                            var ifrw = ifr.contentDocument;
                            ifr.uri = search.uri = final;
                            ifrw.open();
                            ifrw.write(dat.response);
                            ifrw.close();
                            var dc = ifrw.documentElement;
                            dc.style.scrollbarWidth = 'none';
                            dc.style.background = '#f5f5f5';
                            success(id, data, ifrw);
                        },
                    });
                }
            }
        })
    }
    var lastScale = window.devicePixelRatio;
    var tmpSty = nE('style');
    tmpSty.innerHTML = '#myFeature {transform:scale(' + 1 / window.devicePixelRatio + ')} .fanyiDiv {transform:scale(' + 1.25 / window.devicePixelRatio + ')} #myReadMode {transform:scale(' + 1.25 / window.devicePixelRatio + ')}';
    head.append(tmpSty);
    setInterval(() => {
        if (window.devicePixelRatio == lastScale) { return } else {
            tmpSty.innerHTML = '#myFeature {transform:scale(' + 1 / window.devicePixelRatio + ')}' + '.fanyiDiv {transform:scale(' + 1.25 / window.devicePixelRatio + ')} #myReadMode {transform:scale(' + 1.25 / window.devicePixelRatio + ')}';
            lastScale = window.devicePixelRatio;
        }
    }, 500);
})();


// ==UserScript==
// @name         阅读模式
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  try to take over the world!
// @author       YXP
// @match        *://*/*
// @icon         data:image/svg+xml;base64,PHN2ZyB0PSIxNjY3NDkxMTk0MjA0IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQxODMiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTQ0NSAzNDcuOUgxOTkuMWMtOC43IDAtMTUuOC03LjEtMTUuOC0xNS44IDAtOC43IDcuMS0xNS44IDE1LjgtMTUuOEg0NDVjOC43IDAgMTUuOCA3LjEgMTUuOCAxNS44IDAgOC43LTcgMTUuOC0xNS44IDE1Ljh6TTQzNi4zIDQ3OC4xSDE5OS4xYy04LjcgMC0xNS44LTcuMS0xNS44LTE1LjggMC04LjcgNy4xLTE1LjggMTUuOC0xNS44aDIzNy4yYzguNyAwIDE1LjggNy4xIDE1LjggMTUuOCAwIDguNy03LjEgMTUuOC0xNS44IDE1Ljh6TTM1Ny40IDYwOC4ySDE5OS4xYy04LjcgMC0xNS44LTcuMS0xNS44LTE1LjggMC04LjcgNy4xLTE1LjggMTUuOC0xNS44aDE1OC4zYzguNyAwIDE1LjggNy4xIDE1LjggMTUuOCAwIDguOC03LjEgMTUuOC0xNS44IDE1Ljh6IiBmaWxsPSIjRTg2MjYyIiBwLWlkPSI0MTg0Ij48L3BhdGg+PHBhdGggZD0iTTQ4NCA4NTMuNmMtMC44IDAtMS42IDAtMi40LTAuMWwtMjg0LjEtMTMuM2MtNDcuNi0yLjItODQuOS00NS04NC45LTk3LjV2LTUwMmMwLTI4LjMgMTEuMS01NS4yIDMwLjYtNzMuNyAxNy4xLTE2LjQgMzkuMS0yNC42IDYxLjktMjMuOGwyODEuNCAxMy4xYzMwLjMgMS40IDU0IDI4LjYgNTQgNjEuOXY1NzMuMmMwIDE4LTcuMSAzNS0xOS40IDQ2LjgtMTAuNSAxMC4xLTIzLjUgMTUuNC0zNy4xIDE1LjR6TTIwMS4yIDE3NC45Yy0xMy4yIDAtMjYgNS4zLTM2LjMgMTUuMS0xMy4yIDEyLjYtMjAuOCAzMS4xLTIwLjggNTAuOHY1MDJjMCAzNS41IDI0LjEgNjQuNSA1NC44IDY1LjlMNDgzIDgyMmM4LjEgMC43IDEyLjgtMy4zIDE2LjEtNi40IDYuMS01LjggOS42LTE0LjYgOS42LTIzLjlWMjE4LjRjMC0xNi4xLTEwLjctMjkuNy0yMy44LTMwLjNMMjAzLjUgMTc1Yy0wLjgtMC4xLTEuNS0wLjEtMi4zLTAuMXoiIGZpbGw9IiNFODYyNjIiIHAtaWQ9IjQxODUiPjwvcGF0aD48cGF0aCBkPSJNNDYzLjQgODU4LjdjLTEgMC0yLjEgMC0zLjEtMC4xbC0zMjguMi0xM0M3Ni42IDg0My41IDMzIDgwMC4xIDMzIDc0Ni45VjIzN2MwLTI2LjMgMTAuNy01MS4xIDMwLjEtNjkuNyAyMC40LTE5LjYgNDguOC0zMCA3Ny41LTI5bDMzNS4xIDEzLjJjMzYuMyAxLjQgNjQuNyAyOS45IDY0LjcgNjQuOHY1NjguNmMwIDE5LjctOCAzOC4yLTIyLjUgNTIuMS0xNC40IDEzLjktMzQuMSAyMS43LTU0LjUgMjEuN3ogbS0xLjktMzEuNmMxMyAwLjYgMjUuNS00LjIgMzQuNS0xMi44IDguMi03LjkgMTIuOC0xOC4zIDEyLjgtMjkuM1YyMTYuM2MwLTE3LjgtMTUuMS0zMi40LTM0LjQtMzMuMmwtMzM1LjEtMTMuMmMtMjAuNS0wLjctNDAuMiA2LjYtNTQuNCAyMC4yLTEzLjEgMTIuNi0yMC40IDI5LjMtMjAuNCA0Ni45djUwOS45YzAgMzYuMiAzMC4yIDY1LjcgNjguNyA2Ny4ybDMyOC4zIDEzeiIgZmlsbD0iI0U4NjI2MiIgcC1pZD0iNDE4NiI+PC9wYXRoPjxwYXRoIGQ9Ik04NDUuMSAzNDcuOWgtMjQ2Yy04LjcgMC0xNS44LTcuMS0xNS44LTE1LjggMC04LjcgNy4xLTE1LjggMTUuOC0xNS44SDg0NWM4LjcgMCAxNS44IDcuMSAxNS44IDE1LjggMC4xIDguNy03IDE1LjgtMTUuNyAxNS44ek04MzYuMyA0NzguMUg1OTkuMWMtOC43IDAtMTUuOC03LjEtMTUuOC0xNS44IDAtOC43IDcuMS0xNS44IDE1LjgtMTUuOGgyMzcuMmM4LjcgMCAxNS44IDcuMSAxNS44IDE1LjggMCA4LjctNyAxNS44LTE1LjggMTUuOHpNNzU3LjQgNjA4LjJINTk5LjFjLTguNyAwLTE1LjgtNy4xLTE1LjgtMTUuOCAwLTguNyA3LjEtMTUuOCAxNS44LTE1LjhoMTU4LjNjOC43IDAgMTUuOCA3LjEgMTUuOCAxNS44IDAgOC44LTcuMSAxNS44LTE1LjggMTUuOHoiIGZpbGw9IiNFODYyNjIiIHAtaWQ9IjQxODciPjwvcGF0aD48cGF0aCBkPSJNNTYwLjIgODUzLjZjLTEzLjYgMC0yNi43LTUuMy0zNi45LTE1LjItMTIuMy0xMS44LTE5LjQtMjguOC0xOS40LTQ2LjhWMjE4LjRjMC0zMy4zIDIzLjctNjAuNSA1NC02MS45bDI4MS40LTEzLjFjMjIuOC0xIDQ0LjcgNy40IDYxLjkgMjMuOCAxOS40IDE4LjUgMzAuNiA0NS40IDMwLjYgNzMuN3Y1MDJjMCA1Mi40LTM3LjMgOTUuMi04NC45IDk3LjVsLTI4NC4xIDEzLjNjLTEtMC4xLTEuOC0wLjEtMi42LTAuMXogbTI4Mi43LTY3OC43Yy0wLjggMC0xLjUgMC0yLjMgMC4xbC0yODEuNCAxMy4xYy0xMy4xIDAuNi0yMy44IDE0LjItMjMuOCAzMC4zdjU3My4yYzAgOS40IDMuNSAxOC4xIDkuNiAyMy45IDMuMyAzLjEgOSA3IDE2LjEgNi40bDI4NC4xLTEzLjNjMzAuNy0xLjQgNTQuOC0zMC40IDU0LjgtNjUuOXYtNTAyYzAtMTkuNy03LjYtMzguMi0yMC44LTUwLjgtMTAuMi05LjctMjMtMTUtMzYuMy0xNXoiIGZpbGw9IiNFODYyNjIiIHAtaWQ9IjQxODgiPjwvcGF0aD48cGF0aCBkPSJNNTgwLjcgODU4LjdjLTIwLjQgMC00MC4xLTcuOC01NC41LTIxLjctMTQuNS0xMy45LTIyLjUtMzIuNC0yMi41LTUyLjFWMjE2LjNjMC0zNC45IDI4LjQtNjMuMyA2NC43LTY0LjhsMzM1LjEtMTMuMmMyOC45LTAuOSA1Ny4xIDkuNCA3Ny41IDI5IDE5LjQgMTguNiAzMC4xIDQzLjQgMzAuMSA2OS43djUwOS45YzAgNTMuMi00My41IDk2LjYtOTkuMSA5OC44bC0zMjguMiAxM2gtMy4xeiBtMzI3LjEtNjg4LjljLTEgMC0yIDAtMyAwLjFsLTMzNS4xIDEzLjJjLTE5LjMgMC44LTM0LjQgMTUuMy0zNC40IDMzLjJ2NTY4LjZjMCAxMSA0LjUgMjEuNCAxMi44IDI5LjMgOSA4LjcgMjEuOCAxMy40IDM0LjUgMTIuOGwzMjguMi0xM2MzOC41LTEuNSA2OC43LTMxIDY4LjctNjcuMlYyMzdjMC0xNy42LTcuMi0zNC4zLTIwLjQtNDYuOS0xMy41LTEzLTMyLjEtMjAuMy01MS4zLTIwLjN6IiBmaWxsPSIjRTg2MjYyIiBwLWlkPSI0MTg5Ij48L3BhdGg+PC9zdmc+
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// ==/UserScript==
/*
*@createdDate: 2022-10-15
v1.0.1:配制了基本的便捷操作的函数（$(),log(),nE()），阅读模式支持每日新闻联播
v1.0.2:增添了body，docu，head, hide(e),show(e,'block')，阅读模式新增对360doc的支持
v1.0.3:支持CSDN，新增designMode功能，design模式对所有网页启用(在开启阅读模式后，由于元素移动到了body之外，无法编辑)
v1.0.4:将host按点分隔开，从第二个开始便利fun里面有没有，没有就到第三级域，用于适配zhidao.baidu.com、zhihu.baidu.com等多级域名
v1.0.5:与我的另一个插件“翻译&搜索”联合，每秒检查是否有新的iframe.myiframe出现，如果有则直接给它开启阅读模式
v1.1.1:提供common选项，用于全局生效的规则，收集大量article#content.content等选择器
v1.1.2:识别符不再为主机域名，而是host/firstdir,并支持修改其属性为height:100%;overflow:visible;
v1.2.3:增加选择阅读窗口按钮，按下后可以直接选中页面的元素，以及是否直接进入阅读模式，并保存这些设置到GM_setValue中。结合AdBlockerUltimate的元素删除使用。
v1.2.4:进入选择模式后，按下Esc键可退出
v1.2.5:引入通知包，显示操作通知
v1.2.6:有的网页操作后生成了一个新的body，里面空白但占位置占高度，因此对queryselectall body进行隐藏
v1.3.1:域名匹配使用正则表达式，用每一个key去test当前页面的链接，如果检测到了就执行，否则执行common函数
task：css编辑器、域名增加通配符.*
*@updatedDate: 2022-11-20
*/
(function() {
    'use strict';
    // if(self != top){return false} // 只在顶部frame中作用
    // 函数库
    var wind = 0;
    // GM_deleteValue('contentDIV');
    // auto是自动进入阅读模式，ele是阅读元素，expand是展开后能看全部的元素（height:100%;overflow:visible）
    var contentDIV = GM_getValue('contentDIV', { 'href': { auto: 0, ele: 'div#content', expand: '', css: '' } });
    Array.isArray(contentDIV) ? (contentDIV = {}) : 0;
    console.log(contentDIV);

    function $(s) { return wind ? wind.querySelector(s) : document.querySelector(s) }

    function log() { console.log(arguments) }

    function nE(e, id = undefined, cla = undefined) {
        var ele = document.createElement(e);
        id ? ele.id = id : 0;
        cla ? ele.className = cla : 0;
        return ele;
    }

    function hide(e) { if (e.toString() === "[object HTMLDivElement]") { e.style.display = 'none' } else if (e.toString() === "[object NodeList]") { e.forEach((v) => { v.style.display = 'none' }) } }

    function show(e, str = "block") { if (e.toString() === "[object HTMLDivElement]") { e.style.display = str } else if (e.toString() === "[object NodeList]") { e.forEach((v) => { v.style.display = str }) } }

    function bgc(e, c) { e.style.backgroundColor = c }

    function addCSS(css, head) {
        var s = nE('style');
        s.innerHTML = css;
        head.append(s);
    }
    // 引入Windows通知的动画
    /**
     * @file 桌面通知、仿桌面通知
     * @author cedar(YXP修改)
     * @createDate 2018-09-05 16:21:11
     **/
    var d_toast_text_node = `.zoom-image {
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    overflow: hidden;
    background-position: center center;
    background-repeat: no-repeat;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    background-size: cover
}

.d-toast-icon {
    width: 50px;
    height: 50px;
    margin: auto;
    margin-left: 20px;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0
}

.d-toast-close:hover {
    color: #FFFFFF!important
}

.d-toast {
    z-index: 999999;
    animation: d-toast-left-in 0.5s;
}
.d-toast:hover {
display:block !important;
right:30px !important;
opacity:1 !important;
}
.d-toast-close::before {
    content: "＋"
}

@keyframes d-toast-left-in {
    from {
        right: -400px
    }
    to {
        right: 30px
    }
}


@keyframes d-toast-right-out {
    from {
        right: 30px
    }
    to {
        right: -400px
    }
}
.d-toast-close-start {
    animation: d-toast-right-out 0.5s;
}

.d-toast {
    cursor: default;
    width: 360px;
    padding: 6px;
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: rgba(238,238,255,.9);
    border-radius:10px;
}

.d-toast-content {
    position: relative;
    left: 10px
}

.d-toast-content>ul {
    list-style: outside none none;
    padding-left: 0px;
    margin: 5px 0;
    width: max-content
}

.d-toast-title {
    color:#111;
    font: 700 18px/22px microsoft-yahei
}

.d-toast-content>ul>li {
    max-width: 340px;
    overflow-wrap: break-word
}

.d-toast-body {
    color: #222;
    padding: 2px;
    font: 400 16px/20px microsoft-yahei
}

.d-toast-info {
    color: #555;
    font-size: 12px
}

.d-toast-close {
    transform: rotate(45deg);
    color: rgb(173, 173, 173);
    font-size: 26px;
    font-weight: normal;
    position: absolute;
    top: 6px;
    right: 6px;
    display: none
}
.d-toast:hover .d-toast-close{
    display: block;
}
`;
    var d_toast_style = nE('style');
    d_toast_style.innerHTML = d_toast_text_node;
    document.head.appendChild(d_toast_style);
    class dToast {
        constructor(config) {
            if (typeof config.inner == 'undefined') { config.inner = true }
            if (typeof config == 'string') { config = { title: '新消息', body: config, } } else if (typeof config.title == 'undefined') { config.title = '新消息' }
            this.toast(config)
        };
        inner(config) {
            var date = new Date();
            date = date.getHours() + ':' + date.getMinutes();
            var _div = nE('div', 0, 'd-toast');
            var _div_content = nE('div', 0, 'd-toast-content');
            var _close = nE('span', 0, 'd-toast-close');
            _div.oncontextmenu = 'return false';
            _div.onselectstart = 'return false';
            var toast_data = config.data;
            _div_content.innerHTML = `<ul><li class="d-toast-title">` + config.title + `</li><li class="d-toast-body">` + config.body + `</li><li class="d-toast-info">` + date + `<span style="font-size:16px;font-weight:bold;">·</span>` + document.domain + `</li></ul>`;
            _close.onclick = function(e) {
                _div.className = 'd-toast d-toast-close-start';
                setTimeout(function() { _div.remove(); if (typeof onclose == 'function') { config.onclose(e) } }, 500)
            };
            var toast_items = document.getElementsByClassName('d-toast');
            var _width = 0;
            for (var i = 0; i < toast_items.length; i++) {
                var item = toast_items[i];
                _width += item.offsetHeight + 20
            };
            var _div_bottom = _width + 20;
            var _body_height = document.documentElement.clientHeight;
            if (_body_height - 200 < _div_bottom) {
                for (var i = toast_items.length - 1; i >= 0; i--) { toast_items[i].remove() }
                _div_bottom = 20
            };
            if (typeof config.onclick == 'function') { _div.onclick = function(e) { var _target = e.target; if (_target.nodeName == 'SPAN') { _close.click } else { config.onclick(toast_data) } } };
            _div.style.bottom = _div_bottom + 'px';
            _div.appendChild(_div_content);
            _div.appendChild(_close);
            var _d_toast_timeout = config.timeout;
            if (typeof _d_toast_timeout == 'undefined') { _d_toast_timeout = 6500 };
            document.documentElement.appendChild(_div);
            console.log(_d_toast_timeout);
            if (_d_toast_timeout > 0) {
                setTimeout(function() {
                    _div.className = 'd-toast d-toast-close-start';
                    setTimeout(function() { _div.style.opacity = 0; }, 500);
                    setTimeout(function() { _div.remove() }, 5500);
                }, _d_toast_timeout)
            }
        };
        toast(config) {
            var self = this;
            var toast_config = config;
            if (window.Notification && Notification.permission !== 'denied' && config.inner != true) {
                Notification.requestPermission(function(status) {
                    if (status == 'granted') {
                        var _config = { lang: 'zh-CN', tag: 'toast-' + (+new Date()), body: config.body, };
                        if (typeof config.data != 'undefined') { _config.data = config.data };
                        if (typeof config.timeout != 'undefined') { _config.timestamp = config.timeout };
                        const d_toast_n = new Notification(config.title, _config);
                        var d_toast_data = config.data;
                        d_toast_n.onclick = function(e) { if (typeof toast_config.onclick == 'function') { toast_config.onclick(d_toast_data) } }
                    } else {
                        if (config.dev == true) { console.warn('请允许通知！') };
                        self.inner(config)
                    }
                })
            } else {
                if (config.dev == true) { console.warn('你的浏览器不支持！\n1、被禁止通知\n2、请更换浏览器\n3、已设置成浏览器通知') };
                self.inner(config)
            }
        }
    };
    makeread(document, 0, window.location.href.replace(/https?:\/\/([^\/]+(\/[^\/]{1,10}\/)?).*$/, '$1').replace(/^(.*)\/$/, '$1')); // 对本文档进行添加组件
    setInterval(() => {
        // 检查有无搜索&翻译创建的iframe.myiframe子页面，对其direct进入阅读模式
        var list = document.querySelectorAll('iframe.myiframe');
        list.forEach((v) => {
            var wind = v.contentDocument;
            if (!v.uri) { return 0 }
            if (!v.readmode) {
                v.readmode = 1;
                var host = v.uri;
                host = host.replace(/https?:\/\/([^\/]+(\/[^\/]{1,10}\/)?).*$/, '$1').replace(/^(.*)\/$/, '$1');
                makeread(wind, 1, host);
            }
        })
    }, 3000);

    function makeread(wind, direct = 0, href) {
        var body = wind.body;
        var docu = wind.documentElement;
        var head = wind.head;

        function $w(s) { return wind.querySelector(s) }
        var btn = nE('div');
        btn.id = 'myReadMode';
        btn.className = 'noprint';
        btn.innerHTML = `<button class="mybtn" id="my-read-mode"><svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2595" width="16" height="16"><path d="M445 347.9H199.1c-8.7 0-15.8-7.1-15.8-15.8 0-8.7 7.1-15.8 15.8-15.8H445c8.7 0 15.8 7.1 15.8 15.8 0 8.7-7 15.8-15.8 15.8zM436.3 478.1H199.1c-8.7 0-15.8-7.1-15.8-15.8 0-8.7 7.1-15.8 15.8-15.8h237.2c8.7 0 15.8 7.1 15.8 15.8 0 8.7-7.1 15.8-15.8 15.8zM357.4 608.2H199.1c-8.7 0-15.8-7.1-15.8-15.8 0-8.7 7.1-15.8 15.8-15.8h158.3c8.7 0 15.8 7.1 15.8 15.8 0 8.8-7.1 15.8-15.8 15.8z" fill="#333333" p-id="2596"></path><path d="M484 853.6c-0.8 0-1.6 0-2.4-0.1l-284.1-13.3c-47.6-2.2-84.9-45-84.9-97.5v-502c0-28.3 11.1-55.2 30.6-73.7 17.1-16.4 39.1-24.6 61.9-23.8l281.4 13.1c30.3 1.4 54 28.6 54 61.9v573.2c0 18-7.1 35-19.4 46.8-10.5 10.1-23.5 15.4-37.1 15.4zM201.2 174.9c-13.2 0-26 5.3-36.3 15.1-13.2 12.6-20.8 31.1-20.8 50.8v502c0 35.5 24.1 64.5 54.8 65.9L483 822c8.1 0.7 12.8-3.3 16.1-6.4 6.1-5.8 9.6-14.6 9.6-23.9V218.4c0-16.1-10.7-29.7-23.8-30.3L203.5 175c-0.8-0.1-1.5-0.1-2.3-0.1z" fill="#333333" p-id="2597"></path><path d="M463.4 858.7c-1 0-2.1 0-3.1-0.1l-328.2-13C76.6 843.5 33 800.1 33 746.9V237c0-26.3 10.7-51.1 30.1-69.7 20.4-19.6 48.8-30 77.5-29l335.1 13.2c36.3 1.4 64.7 29.9 64.7 64.8v568.6c0 19.7-8 38.2-22.5 52.1-14.4 13.9-34.1 21.7-54.5 21.7z m-1.9-31.6c13 0.6 25.5-4.2 34.5-12.8 8.2-7.9 12.8-18.3 12.8-29.3V216.3c0-17.8-15.1-32.4-34.4-33.2l-335.1-13.2c-20.5-0.7-40.2 6.6-54.4 20.2-13.1 12.6-20.4 29.3-20.4 46.9v509.9c0 36.2 30.2 65.7 68.7 67.2l328.3 13z" fill="#333333" p-id="2598"></path><path d="M845.1 347.9h-246c-8.7 0-15.8-7.1-15.8-15.8 0-8.7 7.1-15.8 15.8-15.8H845c8.7 0 15.8 7.1 15.8 15.8 0.1 8.7-7 15.8-15.7 15.8zM836.3 478.1H599.1c-8.7 0-15.8-7.1-15.8-15.8 0-8.7 7.1-15.8 15.8-15.8h237.2c8.7 0 15.8 7.1 15.8 15.8 0 8.7-7 15.8-15.8 15.8zM757.4 608.2H599.1c-8.7 0-15.8-7.1-15.8-15.8 0-8.7 7.1-15.8 15.8-15.8h158.3c8.7 0 15.8 7.1 15.8 15.8 0 8.8-7.1 15.8-15.8 15.8z" fill="#333333" p-id="2599"></path><path d="M560.2 853.6c-13.6 0-26.7-5.3-36.9-15.2-12.3-11.8-19.4-28.8-19.4-46.8V218.4c0-33.3 23.7-60.5 54-61.9l281.4-13.1c22.8-1 44.7 7.4 61.9 23.8 19.4 18.5 30.6 45.4 30.6 73.7v502c0 52.4-37.3 95.2-84.9 97.5l-284.1 13.3c-1-0.1-1.8-0.1-2.6-0.1z m282.7-678.7c-0.8 0-1.5 0-2.3 0.1l-281.4 13.1c-13.1 0.6-23.8 14.2-23.8 30.3v573.2c0 9.4 3.5 18.1 9.6 23.9 3.3 3.1 9 7 16.1 6.4l284.1-13.3c30.7-1.4 54.8-30.4 54.8-65.9v-502c0-19.7-7.6-38.2-20.8-50.8-10.2-9.7-23-15-36.3-15z" fill="#333333" p-id="2600"></path><path d="M580.7 858.7c-20.4 0-40.1-7.8-54.5-21.7-14.5-13.9-22.5-32.4-22.5-52.1V216.3c0-34.9 28.4-63.3 64.7-64.8l335.1-13.2c28.9-0.9 57.1 9.4 77.5 29 19.4 18.6 30.1 43.4 30.1 69.7v509.9c0 53.2-43.5 96.6-99.1 98.8l-328.2 13h-3.1z m327.1-688.9c-1 0-2 0-3 0.1l-335.1 13.2c-19.3 0.8-34.4 15.3-34.4 33.2v568.6c0 11 4.5 21.4 12.8 29.3 9 8.7 21.8 13.4 34.5 12.8l328.2-13c38.5-1.5 68.7-31 68.7-67.2V237c0-17.6-7.2-34.3-20.4-46.9-13.5-13-32.1-20.3-51.3-20.3z" fill="#333333" p-id="2601"></path></svg><p>进入阅读模式</p></button>
<button class="mybtn" id="my-designMode"><svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2583" width="16" height="16"><path d="M1001.505 291.007 780.695 511.895l224.155 224.232c24.761 24.77 24.761 64.927 0 89.694l-179.323 179.391c-24.76 24.767-64.904 24.767-89.662 0L511.71 780.975 377.217 915.517c-119.18 119.22-342.489 72.284-342.489 72.284S-11.32 766.026 108.23 646.435l134.495-134.54L18.569 287.66c-24.758-24.77-24.758-64.927 0-89.694L197.894 18.576c24.758-24.767 64.902-24.767 89.66 0L511.71 242.812l220.863-220.94c6.399-8.619 17.173-15.609 34.256-15.609 29.66-0.627 69.125-1.464 96.478-2.046 19.284 0 42.092 9.214 51.349 18.47 22.575 22.498 59.933 59.729 83.516 83.234 10.412 10.412 20.864 25.399 20.864 55.701C1019.036 233.745 1025.04 275.533 1001.505 291.007zM586.428 766.026l67.246-67.269c4.128-4.128 10.817-4.128 14.944 0l14.944 14.949c4.125 4.128 4.125 10.821 0 14.949l-67.246 67.269 59.774 59.799 67.246-67.271c4.128-4.13 10.817-4.13 14.944 0l14.942 14.946c4.128 4.13 4.128 10.823 0 14.951l-67.246 67.271 44.832 44.846c16.508 16.512 43.269 16.512 59.774 0l119.548-119.591c16.508-16.512 16.508-43.285 0-59.797L735.865 556.741 556.54 736.127 586.428 766.026zM85.223 852.91c45.59 42.741 64.857 59.403 94.772 86.915 37.116-1.19 98.624-15.37 122.504-39.257L123.174 721.18C98.08 746.283 84.779 813.977 85.223 852.91zM272.61 93.321c-16.506-16.51-43.269-16.51-59.774 0L93.285 212.913c-16.504 16.512-16.504 43.285 0 59.797l44.832 44.848 67.246-67.271c4.128-4.128 10.817-4.128 14.944 0l14.944 14.946c4.125 4.13 4.125 10.823 0 14.951l-67.246 67.271 59.774 59.797 67.246-67.271c4.128-4.13 10.817-4.13 14.944 0l14.942 14.949c4.13 4.128 4.13 10.821 0 14.949l-67.244 67.271 29.886 29.897L466.88 287.66 272.61 93.321zM744.208 199.091c-14.607-14.605-21.943-26.582-21.943-50.8 0.208-7.995 0.453-17.316 0.708-27.125L168.006 676.332l179.323 179.391 555.825-556.024c-4.734 0.102-9.547 0.204-13.946 0.299-37.412 0-54.373-10.647-67.934-24.206C798.714 253.339 765.954 220.733 744.208 199.091zM898.202 123.958c-24.265-24.265-53.768-34.099-65.902-21.968-12.134 12.134-2.297 41.639 21.968 65.904 24.263 24.265 53.771 34.099 65.902 21.966C932.304 177.731 922.467 148.223 898.202 123.958z" p-id="2584"></path></svg><p>网页编辑模式</p></button>
<button class="mybtn" id="my-selectArea"><svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3474" width="16" height="16"><path d="M320 928c5.888 0 10.666667 4.778667 10.666667 10.666667v74.666666A10.666667 10.666667 0 0 1 320 1024h-74.666667a10.666667 10.666667 0 0 1-10.666666-10.666667V938.666667c0-5.888 4.778667-10.666667 10.666666-10.666667z m-234.666667 0c5.888 0 10.666667 4.778667 10.666667 10.666667v74.666666A10.666667 10.666667 0 0 1 85.333333 1024H10.666667A10.666667 10.666667 0 0 1 0 1013.333333V938.666667c0-5.888 4.778667-10.666667 10.666667-10.666667zM459.093333 455.68l536.405334 199.850667-196.266667 76.032 222.293333 222.293333c2.56 2.56 2.816 6.656 1.109334 10.24l-2.474667 3.498667-52.821333 52.821333a10.922667 10.922667 0 0 1-10.752 3.157333l-2.986667-1.877333L721.92 790.186667l-100.864 214.613333L459.093333 455.68zM85.333333 695.978667c5.888 0 10.666667 4.778667 10.666667 10.666666v74.666667A10.666667 10.666667 0 0 1 85.333333 791.978667H10.666667A10.666667 10.666667 0 0 1 0 781.312v-74.666667c0-5.888 4.778667-10.666667 10.666667-10.666666z m0-232.021334c5.888 0 10.666667 4.864 10.666667 10.666667v74.666667A10.666667 10.666667 0 0 1 85.333333 560.042667H10.666667A10.666667 10.666667 0 0 1 0 549.376v-74.666667c0-5.802667 4.778667-10.666667 10.666667-10.666666zM1013.333333 232.106667c5.888 0 10.666667 4.778667 10.666667 10.666666v74.666667a10.666667 10.666667 0 0 1-10.666667 10.666667H938.666667a10.666667 10.666667 0 0 1-10.666667-10.666667v-74.666667c0-5.888 4.778667-10.666667 10.666667-10.666666zM85.333333 232.021333c5.888 0 10.666667 4.778667 10.666667 10.666667v74.666667A10.666667 10.666667 0 0 1 85.333333 328.021333H10.666667A10.666667 10.666667 0 0 1 0 317.354667v-74.666667c0-5.888 4.778667-10.666667 10.666667-10.666667zM317.354667 0c5.802667 0 10.666667 4.778667 10.666666 10.666667V85.333333a10.666667 10.666667 0 0 1-10.666666 10.666667h-74.666667A10.666667 10.666667 0 0 1 232.021333 85.333333V10.666667c0-5.888 4.778667-10.666667 10.666667-10.666667z m695.978666 0c5.888 0 10.666667 4.778667 10.666667 10.666667V85.333333a10.666667 10.666667 0 0 1-10.666667 10.666667H938.666667A10.666667 10.666667 0 0 1 928 85.333333V10.666667c0-5.888 4.778667-10.666667 10.666667-10.666667zM85.333333 0c5.888 0 10.666667 4.778667 10.666667 10.666667V85.333333A10.666667 10.666667 0 0 1 85.333333 96H10.666667A10.666667 10.666667 0 0 1 0 85.333333V10.666667C0 4.778667 4.778667 0 10.666667 0z m464.042667 0c5.802667 0 10.666667 4.778667 10.666667 10.666667V85.333333a10.666667 10.666667 0 0 1-10.666667 10.666667h-74.666667A10.666667 10.666667 0 0 1 464.042667 85.333333V10.666667c0-5.888 4.778667-10.666667 10.666666-10.666667z m231.936 0c5.888 0 10.666667 4.778667 10.666667 10.666667V85.333333a10.666667 10.666667 0 0 1-10.666667 10.666667h-74.666667A10.666667 10.666667 0 0 1 695.978667 85.333333V10.666667c0-5.888 4.778667-10.666667 10.666666-10.666667z" p-id="3475"></path></svg><p>选择阅读区域</p></button>
<button class="mybtn" id="my-cssEditor"><svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2908" width="16" height="16"><path d="M112 16h736v992H112z" fill="#EDF2F9" p-id="2909"></path><path d="M368 743.36V848a16 16 0 0 0 16 16h32a16 16 0 1 0 0-32h-16v-96a15.68 15.68 0 0 0-1.472-6.528 16 16 0 0 0-3.728-6.032l-19.36-19.36 19.824-19.824c3.424-3.424 4.928-7.952 4.736-12.432V576h16a16 16 0 1 0 0-32h-32a16 16 0 0 0-16 16v104.48l-27.264 27.264c-3.36 3.36-4.912 7.792-4.784 12.208-0.128 4.368 1.424 8.784 4.752 12.112L368 743.36z m193.472-13.888A15.68 15.68 0 0 0 560 736v96h-16a16 16 0 1 0 0 32h32a16 16 0 0 0 16-16v-104.64l27.296-27.296c3.328-3.328 4.864-7.728 4.752-12.112a16.544 16.544 0 0 0-4.784-12.208L592 664.48V560a16 16 0 0 0-16-16h-32a16 16 0 1 0 0 32h16v95.808c-0.192 4.48 1.312 9.008 4.736 12.432l19.824 19.824-19.36 19.36c-1.76 1.76-2.928 3.84-3.728 6.048zM896 128h-32V32a32 32 0 0 0-32-32H128a32 32 0 0 0-32 32v960a32 32 0 0 0 32 32h704a32 32 0 0 0 32-32V416h32a32 32 0 0 0 32-32V160a32 32 0 0 0-32-32z m-64 0H448a32 32 0 0 0-32 32v224a32 32 0 0 0 32 32h384v576H128V32h704v96z" fill="#8592A5" p-id="2910"></path><path d="M615.312 297.84c0.64 0 1.28 0.112 1.92 0.352 0.64 0.24 1.248 0.656 1.84 1.232l10.72 11.28a44.768 44.768 0 0 1-17.648 13.888c-7.072 3.12-15.44 4.672-25.072 4.672-8.864 0-16.8-1.504-23.808-4.528a51.2 51.2 0 0 1-17.824-12.48 54.944 54.944 0 0 1-11.248-18.88 69.824 69.824 0 0 1-3.92-23.712c0-8.688 1.504-16.672 4.48-23.968s7.152-13.568 12.512-18.832c5.376-5.28 11.776-9.392 19.248-12.32a66.816 66.816 0 0 1 24.72-4.4 62.144 62.144 0 0 1 23.2 4.368c3.36 1.36 6.448 2.992 9.28 4.88 2.832 1.904 5.328 4 7.52 6.288l-9.12 12.24a11.408 11.408 0 0 1-2.08 2.032 5.44 5.44 0 0 1-3.36 0.928 6.176 6.176 0 0 1-2.72-0.64 27.728 27.728 0 0 1-2.72-1.568l-3.152-2a25.536 25.536 0 0 0-4.08-2 35.168 35.168 0 0 0-12.928-2.208c-4.912 0-9.392 0.864-13.44 2.608-4.064 1.728-7.552 4.224-10.448 7.44s-5.168 7.136-6.8 11.712-2.432 9.728-2.432 15.44c0 5.984 0.816 11.28 2.432 15.92s3.84 8.544 6.64 11.712a28.416 28.416 0 0 0 21.792 9.728c2.448 0 4.704-0.112 6.72-0.352a26.4 26.4 0 0 0 10.624-3.536 32.48 32.48 0 0 0 4.752-3.472 9.872 9.872 0 0 1 2.096-1.328 5.68 5.68 0 0 1 2.304-0.496zM707.072 235.12a10.416 10.416 0 0 1-2.528 2.88 5.6 5.6 0 0 1-3.392 0.96 8.256 8.256 0 0 1-3.968-1.168c-1.408-0.768-3.008-1.648-4.8-2.592a40.08 40.08 0 0 0-6.128-2.608 24.592 24.592 0 0 0-7.824-1.168c-5.072 0-8.848 1.088-11.328 3.248a11.04 11.04 0 0 0-3.712 8.752 8 8 0 0 0 2.256 5.84c1.488 1.552 3.44 2.88 5.872 4 2.416 1.12 5.2 2.144 8.32 3.072 3.12 0.944 6.32 1.984 9.568 3.12 3.248 1.152 6.432 2.496 9.568 4.048s5.888 3.52 8.32 5.92c2.432 2.4 4.384 5.328 5.888 8.768 1.488 3.44 2.24 7.584 2.24 12.432 0 5.392-0.944 10.432-2.8 15.12a35.6 35.6 0 0 1-21.232 20.528 49.056 49.056 0 0 1-17.712 3.008 56.32 56.32 0 0 1-11.088-1.12 65.12 65.12 0 0 1-20.832-8 41.936 41.936 0 0 1-8.08-6.24l8-12.64a6.976 6.976 0 0 1 5.904-3.2c1.616 0 3.216 0.512 4.848 1.52l5.52 3.36c2.064 1.232 4.416 2.336 7.088 3.36 2.656 1.008 5.808 1.52 9.44 1.52 4.912 0 8.72-1.088 11.44-3.248 2.72-2.16 4.08-5.584 4.08-10.288a9.76 9.76 0 0 0-2.24-6.64 17.536 17.536 0 0 0-5.888-4.24 54.608 54.608 0 0 0-8.288-2.96c-3.088-0.848-6.272-1.792-9.52-2.832s-6.416-2.32-9.52-3.84a28.096 28.096 0 0 1-14.16-15.28c-1.504-3.712-2.256-8.288-2.256-13.728a32.864 32.864 0 0 1 10.4-23.92c3.408-3.264 7.6-5.856 12.56-7.808a46.24 46.24 0 0 1 17.024-2.928c3.584 0 7.056 0.288 10.432 0.848a55.328 55.328 0 0 1 18.176 6.4c2.64 1.52 4.992 3.248 7.072 5.168l-6.72 12.576zM793.792 235.12a10.416 10.416 0 0 1-2.528 2.88 5.6 5.6 0 0 1-3.392 0.96 8.256 8.256 0 0 1-3.968-1.168c-1.408-0.768-3.008-1.648-4.8-2.592a40.08 40.08 0 0 0-6.128-2.608 24.592 24.592 0 0 0-7.824-1.168c-5.072 0-8.848 1.088-11.328 3.248a11.04 11.04 0 0 0-3.712 8.752 8 8 0 0 0 2.256 5.84c1.488 1.552 3.44 2.88 5.872 4 2.416 1.12 5.2 2.144 8.32 3.072 3.12 0.944 6.32 1.984 9.568 3.12 3.248 1.152 6.432 2.496 9.568 4.048s5.888 3.52 8.32 5.92c2.432 2.4 4.384 5.328 5.888 8.768 1.488 3.44 2.24 7.584 2.24 12.432 0 5.392-0.944 10.432-2.8 15.12a35.6 35.6 0 0 1-21.232 20.528 49.056 49.056 0 0 1-17.712 3.008 56.32 56.32 0 0 1-11.088-1.12 65.12 65.12 0 0 1-20.832-8 41.936 41.936 0 0 1-8.08-6.24l8-12.64a6.976 6.976 0 0 1 5.904-3.2c1.616 0 3.216 0.512 4.848 1.52l5.52 3.36c2.064 1.232 4.416 2.336 7.088 3.36 2.656 1.008 5.808 1.52 9.44 1.52 4.912 0 8.72-1.088 11.44-3.248 2.72-2.16 4.08-5.584 4.08-10.288a9.76 9.76 0 0 0-2.24-6.64 17.536 17.536 0 0 0-5.888-4.24 54.608 54.608 0 0 0-8.288-2.96c-3.088-0.848-6.272-1.792-9.52-2.832s-6.416-2.32-9.52-3.84a28.096 28.096 0 0 1-14.16-15.28c-1.504-3.712-2.256-8.288-2.256-13.728a32.864 32.864 0 0 1 10.4-23.92c3.408-3.264 7.6-5.856 12.56-7.808a46.24 46.24 0 0 1 17.024-2.928c3.584 0 7.056 0.288 10.432 0.848a55.328 55.328 0 0 1 18.176 6.4c2.64 1.52 4.992 3.248 7.072 5.168l-6.72 12.576z" fill="#FFFFFF" p-id="2911"></path></svg><p>CSS编辑器</p></button>`;
        docu.append(btn);
        var globalSty = nE('style');
        globalSty.innerHTML = `
#myReadMode {
	position: fixed;
	opacity: .1;
    top:0;
    left:0;
    z-index:9999999;
    overflow:hidden;
    width:28px;
    height:25px;
}
#myReadMode:hover {
opacity:.8;
overflow:visible;
}
.mybtn{
    position:relative;
    float:left;
	border: 0;
	padding: 2px 5px;
	border-radius: 2px;
    cursor:pointer;
    margin:0 1px;
    width:auto;
    height:25px;
}
.mybtn p {
position:absolute;
top:4px;
left:28px;
display:none;
width: max-content;
font:400 12px/14px microsoft-yahei;
border:solid 1px black;
background:white;
z-index:999;
}
.mybtn:hover p {
display:block;
}
.mybtn:hover {
background-color:aqua;
}
/* @page {
    size: A4 portrait; /*  */
    margin: 3.7cm 2.6cm 3.5cm; /* 国家标准公文页边距 GB/T 9704-2012 */
}*/
@media print {
    .noprint {display:none}
}
.mymsgBody {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background: #eee;
    padding: 10px 20px 15px;
    font: 400 20px/26px arial,"Segoe UI";
}
.mymsgCont {
    margin: 10px;
}
.myfloat > * {
    float: left;
    margin: 0 5px;
}
.myfloat::after {
    content: ";;
    clear: both;
    display: block;
}
.mybutton {
    margin: 5px 10px;
}
.mymsgTitle {
    font-weight: 700;
}
.myfullbg {
    position: fixed;
    top: 0px;
    left: 0px;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.6) none repeat scroll 0% 0%;
    text-align: center;
    z-index: 9999999;
}
.mymsgCont td:first-child {
    text-align: right;
    margin: ;
    padding-right: 5px;
}
.mymsgBody input:focus {
    box-shadow: 0 0 3px 2px aqua;
}
.mymsgCont {
    /* padding: 10px; */
    margin: 10px;
}
.myautoRead > td:nth-child(2) > span:nth-child(1) {
    padding: 2px 10px 2px 0;
    display: inline-block;
}
.mymsgBody label {
    margin-bottom: 0
}
    `;
        // 建立网站对应的函数对象
        // 构建是按照域名来分大类，每个域名下面分为三个函数，第一个init用于初始化，把read、exit要用的属性放到this中，第二个第三个就是read和exit
        var fun = {
            'mrxwlb.com': {
                // url: window.location.href,
                // 本身是固定的数据也没有直接放进对象里面，因为放进去意味着每个对象都会执行并存储，浪费资源，故放在函数里，等待init执行时再放入对象里。
                init: function() { //初始化，向本对象设置一些用于read、exit函数的属性，添加必要的按钮元素及样式
                    var url = window.location.href;
                    this.today = Number(url.replace(/^.*?(\d+)日.*$/, '$1'));
                    this.prev = url.replace(/^(.*?)\d+(日.*)$/, "$1" + String(this.today - 1) + "$2");
                    this.next = url.replace(/^(.*?)\d+(日.*)$/, "$1" + String(this.today + 1) + "$2");
                    this.style = nE('style');
                    this.box = nE('div');
                    this.sty = `
#read-page {
position: fixed;
right: 20px;
top: 40px;
}
#read-page a {
    background-color: yellowgreen;
    padding: 6px;
    margin: 10px;
    border-radius: 3px;
    color:black;
}
#read-page a:hover {
    background-color:cyan;
}
.cntn-wrp.artl-cnt{
margin:20px
}
`;
                    this.xinwenDiv = $w('.cntn-wrp.artl-cnt');
                    this.farBox = $w('.sp-rt');
                    this.box.innerHTML = '<div id="read-page"><a href="http://' + this.prev + '">前一篇</a><a href="http://' + this.next + '">后一篇</a></div>';
                    docu.append(this.box);
                    head.append(this.style);
                },
                read: function() { // 进入阅读模式
                    if (this.xinwenDiv) {
                        this.style.innerHTML = this.sty;
                        docu.append(this.xinwenDiv);
                        hide(body);
                        return 1;
                    } else { return 0 }
                },
                exit: function() {
                    if (this.xinwenDiv) {
                        this.farBox.append(this.xinwenDiv);
                        this.style.innerHTML = '';
                        show(body, 'block');
                        return 1;
                    } else { return 0 }
                }
            },
            // 以数字开头的要加引号
            'www.360doc.com/content': {
                init: function() {
                    var glbsty = nE('style');
                    glbsty.innerHTML = `
.article_showall,#form1,.floatqrcode,.atfixednav,#arttopbdad,#goTop2,.gzhxcjh_entrance,#fullbg,#fullbg+div,#registerOrLoginLayer {display:none !important}
#articlecontent {height:auto;overflow:auto}
`;
                    head.append(glbsty);
                    // var fullbg = $w('#fullbg');
                    // fullbg && (hide(fullbg.nextSibling)); 此用法已弃用，因为如果页面本身的js后于这里渲染出该元素则失效，应通过 #fullbg+div 选择器修改样式实现
                    try { $w('#registerOrLoginLayer').outerHTML = ''; } catch (err) {}
                    this.readDiv = $w('#bgchange');
                    this.farDiv = $w('.a_left');
                },
                read: function() {
                    if (this.readDiv) {
                        docu.append(this.readDiv);
                        hide(body);
                        return 1;
                    } else { return 0 }
                },
                exit: function() {
                    if (this.readDiv) {
                        this.farDiv.insertBefore(this.readDiv, this.farDiv.firstChild);
                        show(body, 'block');
                        return 1;
                    } else { return 0 }
                },
                direct: () => {
                    docu.append($w('#bgchange'));
                    hide(body);
                }
            },
            'www.csdn.net': {
                init: function() {
                    var style = nE('style');
                    style.innerHTML = `
    .hljs-button,.leftPop,#toolBarBox,.wwads-vertical,.passport-login-container,#csdn-toolbar-profile-nologin,.programmer1Box,.box-shadow.mb8,#csdn-highschool-window,.csdn-side-toolbar,.toolbar-advert,.hide-article-box {display:none !important;}
    #csdn-toolbar {position:relative !important;}
    .nodata .container main {width:940px;}
    .nodata .container {width:1300px;}
    #content_views .directa {color: #4ea1db;cursor:pointer}
    #content_views .directa:hover {text-decoration:underline}
    #article_content {height:auto !important;overflow:auto !important}
`;
                    head.append(style);
                    this.readDiv = $w('.blog-content-box');
                    if (direct) { this.readDiv = thie.readDiv.clone(true); }
                    this.farDiv = $w('main');
                    this.main = nE('main');
                    this.main.style.cssText = "margin-bottom: 0;float: none;";
                    docu.append(this.main);
                    setTimeout(() => {
                        var alist = wind.querySelectorAll('#content_views a');
                        style.innerHTML += '#content_views a {display:none}';
                        alist.forEach((e) => {
                            var h = e.href;
                            if (h.search(/(https?:\/\/)?\w+\./) != -1) {
                                var s = nE('span');
                                s.className = "directa";
                                s.innerHTML = e.innerHTML + "(" + h.substring((h.indexOf("://") || -3) + 3, h.indexOf("/", 8) || undefined) + ")";
                                s.addEventListener("click", function() { window.open(this.nextSibling.href) })
                                e.parentNode.insertBefore(s, e);
                            }
                        })
                    }, 3000)
                },
                read: function() {
                    if (this.readDiv) {
                        if (direct) { wind.write(this.readDiv) } else {
                            this.main.append(this.readDiv);
                            hide(wind.querySelectorAll('body'));
                        }
                        return 1
                    } else { return 0 }
                },
                exit: function() {
                    if (this.readDiv) {
                        this.farDiv.insertBefore(this.readDiv, this.farDiv.firstChild);
                        show(wind.querySelectorAll('body'));
                        return 1
                    } else { return 0 }
                },
                direct: () => {
                    docu.append($w('.blog-content-box'));
                    hide(body);
                }
            },
            'zhihu.com': {
                init: function() {
                    var style = document.createElement('style');
                    style.innerHTML = `
    .css-1ynzxqw,.Modal-wrapper.Modal-enter-done,.Question-mainColumnLogin,.AppBanner,.css-1hwwfws,.ContentItem-actions,.css-1fu5tqj,.Post-SideActions {display:none !important;}
    .Question-main {width:1200px;}
    .Question-mainColumn {width: 880px;}
    .Sticky.ColumnPageHeader {display:none !important}
    `;
                    document.head.append(style);
                    var i = 0;
                    var timer = setInterval(() => {
                        var div = document.querySelector('.Button.Modal-closeButton');
                        if (div) { document.querySelector('.Button.Modal-closeButton').click(); }
                        i++;
                        if (i > 5) {
                            clearInterval(timer);
                        }
                    }, 1000);
                    var alist = document.querySelectorAll('.Post-RichTextContainer a');
                    alist.forEach((e) => {
                        log(e.href);
                        e.href = e.href.replace(/https:\/\/link.zhihu.com\/\?target=(https?%3A\/\/)?/, 'http://').replaceAll('%3A', ':').replaceAll('%3F', '?').replaceAll('%3D', '=');
                        log(e.href);
                    })
                },
                read: function() { return 0; },
                exit: function() { return 0 },
                direct: () => {
                    setInterval(() => {
                        docu.append($w('#qb-content'));
                        hide(body);
                    }, 2000);
                    var s = nE('style');
                    s.innerHTML = `.line.wgt-replyer-line,.newbest-content-meta.line.ff-arial,.wgt-best-mask{display:none !important}.best-text,.answer-text{height:auto;overflow:auto}`;
                    head.append(s);
                }
            },
            'wenku.baidu.com/view': {
                init: function() {
                    this.s = nE('style');
                    this.sty = `
.bg-theme-wrap,.menubar,.copyright-wrap,#app-top-right-tool,.no-full-screen .tool-bar-wrap,.pc-cashier-card,.theme-enter-wrap,.vip-privilege {
 display: none;
}
.try-end-fold-page {
margin-top: 0 !important;
}
.reader-topbar-below {height:100% !important}
.try-end-fold-page{padding:0 !important}
`;
                    this.s.innerHTML = this.sty;
                    head.append(this.s);
                },
                read: function() {
                    this.s.innerHTML += `
.header-wrapper,#app-left,.user-guide,#app-right,#reader-thumb,.page-icon-pos {display:none !important}
.reader-wrap,#original-creader-root,.center-wrapper {width: 100% !important;}
#original-creader-root {padding:0 !important;}
#original-creader-root::after{display:block;content:"";height:0;clear:both;}
.content-wrapper {height:calc(100%) !important}
.pageNo {float:left;width:auto !important;}
@media print {#original-creader-root,#original-creader-root * {display:initial !important}}
`;
                    return 1
                },
                exit: function() { this.s.innerHTML = this.sty; return 1 },
                direct: () => {}
            },
            common: {
                init: function() {
                    for (i in contentDIV) {
                        var r = new RegExp(i);
                        if (r.test(href)) {
                            this.ele = contentDIV[i].ele;
                            this.con = contentDIV[i];
                            break;
                        }
                    }
                    this.ele = this.ele || '#content,.content,.article,.main';
                    this.readDiv = $w(this.ele);
                    if (this.readDiv) {
                        this.prt = this.readDiv.parentNode;
                        this.next = this.readDiv.nextElementSibling;
                    }
                    if (this.con && this.con.css) {
                        this.style = nE('style');
                        this.style.innerHTML = this.con.css;
                        head.append(this.style);
                    }
                },
                read: function() {
                    if (this.readDiv) { // append默认放在最后，insertBefore可以指定放在哪个的前面。
                        docu.append(this.readDiv);
                        docu.style.margin = '25px 5px 0';
                        addCSS(this.ele + ' div {height:max-content;overflow:visible}', head); // 直接子元素全部展开
                        console.log(wind.querySelectorAll('body'));
                        hide(wind.querySelectorAll('body'));
                    }
                },
                exit: function() {
                    if (this.readDiv) {
                        if (this.next) { this.prt.insertBefore(this.readDiv, this.next) } else { this.prt.append(this.readDiv); }
                        docu.style.margin = '0';
                        show(wind.querySelectorAll('body'))
                    }
                }
            },
        }

        fun['blog.csdn.net'] = fun['www.csdn.net']; // 使用全域名带来的一个不好的影响
        // url信息，最终转变为域名中的第二域
        if (!href) { return 0 } // 旧的host，现在是host/dir
        var host = href.replace(/([^\/]+)\/.*/, '$1');
        log("read mode : url =", href);
        head.append(globalSty);
        var readbtn = $w('#my-read-mode');
        var designbtn = $w('#my-designMode');
        var selectarea = $w('#my-selectArea');
        var cssEditor = $w('#my-cssEditor');
        selectarea.onclick = () => {
            if (selectarea.disabled) { return false; }
            bgc(selectarea, 'yellow');
            new dToast({ title: '进入选择 - 阅读模式', body: '您已进入选择阅读元素模式,按下Esc退出', inner: true, timeout: 5000, });
            var tmp = [];
            var ele;
            var existEle = contentDIV[href] || contentDIV[host];
            if (existEle) { over({ originalTarget: $w(existEle.ele) || docu }) }

            function over(e) {
                // console.log(e);
                ele = e.originalTarget;
                while (ele && ele.offsetWidth < 400 || ele.offsetHeight < 300) { ele = ele.parentNode || undefined; if (!ele) { break } } // 此处设置了阅读元素盒子的最小值
                if (ele && (ele.tagName == 'svg' || ele.tagName == 'BUTTON' || ele.isEqualNode(docu) || ele.isEqualNode(body))) { ele = undefined; } // 不能选择body和document
                if (ele) {
                    tmp[0] = ele.style.boxSizing;
                    tmp[1] = ele.style.border;
                    ele.style.boxSizing = 'content-box';
                    ele.style.border = 'solid 5px red';
                }
            }

            function out() {
                if (ele) {
                    ele.style.boxSizing = tmp[0];
                    ele.style.border = tmp[1];
                }
            }

            function click(e) {
                var t = e.originalTarget;
                if ((t.tagName != 'svg' && t.tagName != 'BUTTON') || e.keyCode === 27) {
                    bgc(selectarea, '');
                    docu.removeEventListener('mouseover', over);
                    docu.removeEventListener('mouseout', out);
                    docu.removeEventListener('click', click);
                    body.removeEventListener('keydown', click);
                    out();
                    if (ele && e.keyCode != 27) { // 27是Esc键，支持通过按下返回退出
                        var cls = '';
                        ele.classList.forEach((v) => { cls += '.' + v });
                        var sel = ele.tagName.toLowerCase() + (('#' + ele.id) === '#' ? '' : '#' + ele.id) + cls;
                        var div = nE('div', 0, 'mymsgBox');
                        div.innerHTML = `<div class="myfullbg"><div class="mymsgBody"><div class="mymsgTitle">CHECK ELEMENT</div><table class="mymsgCont"><tbody><tr class="myHost" style="text-align: right;"><td>Host</td><td><input value="` + href + `"></td></tr><tr class="myselectarea"><td>Selector</td><td><input value="` + sel + `"></td></tr><tr class="myautoRead"><td>ReadMode</td><td style="text-align: left;"><span style="padding: 2px 10px 2px 0;display: inline-block;"><input id="auto" type="radio" name="auto"><label for="auto" style="margin: 0;">Auto</label></span><span><input id="manual" type="radio" checked="" name="auto"><label for="manual">Manual</label></span></td></tr></tbody></table><div class=""><button class="butSubmit mybutton">Submit</button><button class="butCancel mybutton">Cancel</button></div></div></div>`;
                        docu.append(div);
                        div.querySelector('.butSubmit').onclick = () => {
                            var k = div.querySelector('.myHost input').value;
                            var v = div.querySelector('.myselectarea input').value;
                            var auto = div.querySelector('.myautoRead #auto').checked ? 1 : 0;
                            if (k && v) {
                                console.log(k, v);
                                contentDIV[k] = { auto: auto, ele: v, };
                                GM_setValue('contentDIV', contentDIV);
                            } else { log('invalid!', k, v) }
                            div.outerHTML = '';
                            auto ? (fun.common.read() || bgc(readbtn, 'yellow') || (status = 1)) : 0;
                            new dToast({ title: '选择完毕 - 阅读模式', body: '网站：' + k + '<br>元素：' + v, inner: true, timeout: 5000, });
                        };
                        div.querySelector('.butCancel').onclick = () => {
                            div.outerHTML = '';
                            new dToast({ title: '取消操作 - 阅读模式', body: '您已取消选择该元素', inner: true, timeout: 5000, });
                        };
                    }
                    selectarea.disabled = false;
                    new dToast({ title: '退出选择 - 阅读模式', body: '您已退出选择阅读元素模式', inner: true, timeout: 5000, });
                }
            }
            docu.addEventListener('mouseover', over);
            docu.addEventListener('mouseout', out);
            docu.addEventListener('click', click);
            body.tabIndex = 0;
            body.focus(); // html以及部分元素添加keydown事件无效，添加keydown事件需要tabIndex参数，并聚焦
            body.addEventListener('keydown', click);
            selectarea.disabled = true;
        };
        cssEditor.onclick = function() {};
        var x, i;
        fun.common.init();
        for (i in fun) {
            var r = new RegExp(i);
            if (r.test(href)) {
                x = fun[i];
                console.log(i)
            }
        }
        if (x) {
            // 如果fun中有这个域名的对象则执行
            log('read mode : available.');
            new dToast({ title: '域名已知 - 阅读模式', body: 'Href：' + href, inner: true, timeout: 5000, });
            if (direct) { x.direct(); } else {
                x.init(); // 对象初始化
                readbtn.onclick = function() {
                    // read按钮每点一次就进入阅读模式或者退出
                    if (status) { x.exit() ? (bgc(readbtn, '') || (status = 0)) : (fun.common.exit()) } else {
                        x.read() ? (bgc(readbtn, 'yellow') || (status = 1)) : (fun.common.read());
                        new dToast({ title: '进入阅读模式', body: '再次点击即可切换正常模式', });
                    }
                }
            }
        } else {
            readbtn.onclick = function() {
                // read按钮每点一次就进入阅读模式或者退出
                if (status) { fun.common.exit() || bgc(readbtn, '') || (status = 0); } else {
                    fun.common.read() || bgc(readbtn, 'yellow') || (status = 1);
                    new dToast({ title: '进入阅读模式', body: '再次点击即可切换正常模式', });
                }
            }
            if (contentDIV[href] && (contentDIV[href].auto || direct)) {
                direct ? 0 : (new dToast({ title: '进入阅读模式', body: '您此前设置了自动进入阅读模式', }));
                fun.common.read() || bgc(readbtn, 'yellow') || (status = 1)
            }
        }
        // 不知道为什么，firefox中@media print {#read-mode {display:none}}样式没起效果，故而用下面的代替
        window.addEventListener("beforeprint", function() { hide(btn) })
        window.addEventListener("afterprint", function() { show(btn, 'block') })
        designbtn.onclick = function() {
            if (status) { new dToast({ title: '请在非阅读模式下使用网页编辑！', body: '由于阅读元素在body之外，网页编辑无效，所以请先点击黄色阅读按钮退出阅读模式再尝试。', }); return false }
            if (wind.designMode == "off") {
                wind.designMode = "on";
                bgc(designbtn, 'yellow');
                new dToast({ title: '进入网页设计模式', body: '您现在可以自由编辑网页！</br>再次点击以退出', });
            } else {
                wind.designMode = "off";
                bgc(designbtn, '');
                new dToast({ title: '退出网页设计模式', body: '您已退出设计模式，现在可以正常点击了', });
            }
        }
    }
})();



// ==UserScript==
// @name         BNU-Student
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *172.16.202.201/*
// @match        *172.16.202.204/*
// @icon         
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function $(str, arr) {
        var ele = document.querySelectorAll(str);
        var div = document.createElement('div');
        if (ele.length == 0) { ele = [div] }
        if (/^\d+$/.test(arr)) { ele = ele[arr]; if (!ele) { ele = div } } else if (Array.isArray(arr)) {
            var res = [];
            for (var i = 0; i < arr.length; i++) {
                var e = ele[arr[i]];
                if (e) { res.push(e) };
            }
            ele = res;
        }
        return ele;
    }
    $('#login', 0).click();
    window.close;
})();

// ==UserScript==
// @name         bnu.edu.cn
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       YXP
// @match        *://*.bnu.edu.cn/*
// @icon         https://www.bnu.edu.cn/images/logo1.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function $(str, arr) {
        var ele = document.querySelectorAll(str);
        var div = document.createElement('div');
        if (ele.length == 0) { ele = [div] }
        if (/^\d+$/.test(arr)) { ele = ele[arr]; if (!ele) { ele = div } } else if (Array.isArray(arr)) {
            var res = [];
            for (var i = 0; i < arr.length; i++) {
                var e = ele[arr[i]];
                if (e) { res.push(e) };
            }
            ele = res;
        }
        return ele;
    }
    var style = document.createElement('style');
    var sty;
    var url = window.location.href;
    url = url.replace(/\w+:\/\//, '');
    if (/532movie\.bnu\.edu\.cn\/player/.test(url)) {
        sty = `.container{width:100% !important}
                #video2,#video{width:100% !important;height:90% !important}
                #play_list{margin:10px !important;position:absolute !important;left: 300px !important;}
                .disabled{background-color:gray !important}
                .dplayer-video-wrap .dplayer-video {height:100% !important}`;
        window.onload = () => {
            var playlist = $('#play_list', 0);
            $('.dplayer-controller', 0).append(playlist);
        }
    } else if (/^gw/.test(url)) {
        $('#login', 0).click();
        window.close;
    } else if (/one\.bnu\.edu\.cn/.test(url)) {
        sty = `
.main_content > div:nth-child(2) {
    width: 1090px !important;
}

.main_content {
    width: 1290px !important;
}

.fomat_center {
    width: 800px !important;
}

.hp_width_486 {
    width: 770px !important;
}

.top_ra1,.header_sepline {
    display: none !important;
}

.header_inside {
    height: 54px !important;
}

.header_logo, .header_logo img {
    height: 54px !important;
}

.header_subtitle {
    margin: 12px 0 0 5px !important;
}

.header_search_box {
    margin: 12px 0 0 0 !important;
}
.profile_integral {
margin-top: 0 !important;
}
.profile_pfct {
    float: right;
    position: absolute;
    z-index: 9999;
    right: 0;
    border:0;
    top: 0;
    background-color: rgba(0,0,0,0);
    height: 98px;
    overflow: auto;
    scrollbar-width: none;
}

.profile_box_01 {
    margin-top: 0 !important;
}

.profile_box_02 {
    margin: 9px 0 6px 0 !important;
}

.profile_pfct_img {
    width: 50px !important;
    height: 50px !important;
}

.profile_bar_01 {
    font-size: 12px !important;
}

.wid_pim_pfct {
    height: 100% !important;
}

.wid_pim_pfct .wpim_view_item {
    width: 100% !important;
}

.wid_pim_pfct .wp_item_01 {
    width: 650px !important;
}
        `;
    }
    style.innerHTML = sty;
    document.head.append(style);
})();


// ==UserScript==
// @name         Powerline
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://powerline.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=powerline.io
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var style = document.createElement('style');
    var sty = `
.mobileBox,.rightBoxNews,.linkBox{
    display: none !important;
}
#overlay{opacity:0.02}
`;
    style.innerHTML = sty;
    document.head.append(style);
})();


// ==UserScript==
// @name         EOP
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       YXP
// @match        https://www.everyonepiano.cn/*
// @icon         https://www.everyonepiano.cn//favicon.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function $(str, arr) {
        var ele = document.querySelectorAll(str);
        var div = document.createElement('div');
        if (ele.length == 0) { ele = [div] }
        if (/^\d+$/.test(arr)) { ele = ele[arr]; if (!ele) { ele = div } } else if (Array.isArray(arr)) {
            var res = [];
            for (var i = 0; i < arr.length; i++) {
                var e = ele[arr[i]];
                if (e) { res.push(e) };
            }
            ele = res;
        }
        return ele;
    }

    function hide(str, arr) {
        var ele = $(str, arr);
        if (ele instanceof NodeList || Array.isArray(ele)) {
            for (var i = 0; i < ele.length; i++) { ele[i].style.display = 'none'; }
        } else {
            ele.style.display = 'none';
        }
    }

    function padding(n, l) {
        for (var i = (n + '').length; i < l; i++) { n = '0' + n; }
        return n;
    }
    var url = window.location.pathname;
    $('#musicTitle', 0).style.top = '10px';
    if (url.match(/^\/Stave-/) || url.match(/^\/Number-/)) {
        document.body.oncontextmenu = function() {
            var maskbg = $('#maskBg', 0);
            maskbg.outerHTML = '';
            var rclick = $('#PNG_RClick_Win', 0);
            rclick.style.display = 'none';
        }
    }

    function download(url, name) {
        var a = document.createElement('a');
        a.href = url;
        a.download = name || url.replace(/^.*\//, '');
        console.log('url=' + url + "\nname=" + a.download);
        document.body.append(a); // 修复firefox中无法触发click
        a.click();
    }

    function init() {
        // music详情页
        if (url.match(/^\/Music-\d/)) {
            $('#EOPFloat', 0).innerHTML = '';
            var MusicInfoTxt2 = $('#MusicInfoTxt2', 0);
            var image = MusicInfoTxt2.children[0];
            if (image && image.nodeName == 'DIV' && /img/.test(image.innerHTML)) {
                image.style.display = 'none'
            }
            hide('#UserStorySiteDiv', 0);
            $("#taobao_zhibo", 0).style.display = 'none';
            hide('#EOPSoftList', 0);
            hide('.EOPMusicIndexAD1', 0);
            var name = $('.EOPRTLeft', 0).firstElementChild.innerHTML;
            name = name.replace('钢琴谱：', '');
            var n = url.replace(/^.*-(\d+)\..*$/, '$1');
            var downlink = '/Music/down/' + n + '/' + padding(n, 7) + '/' + name;
            var downbtn = $('.btn.btn-success.btn-block.EOPDownButton2', 1);
            downbtn.href = downlink;
            hide('.EOPReadInfoBar', [0, 1, 5]);
            var infobar = $('.EOPReadInfoBar', 6).nextElementSibling;
            infobar.style.display = 'none';
            hide('.EOPReadInfobody', [0, 1]);
            hide('.EOPReadInfoBottom', 0);
        }
        // 列表页
        if (url.match(/^\/Music-?[^\d]/)) {
            $('#marqueeBox', 0).parentNode.style.display = 'none';
            hide('#EOPFooter', 0);
            hide('#MI_HeJi', 0);
            var MusicIndexBox = $('.MusicBtn1.hidden-xs');
            for (var i = 0; i < MusicIndexBox.length; i++) {
                var each = MusicIndexBox[i];
                var href = each.firstElementChild.href;
                // 示例href = 'Music-10000.html#名字EOP文件下载';
                var n = href.replace(/.*Music-(\d+)\..*$/, '$1');
                each.firstElementChild.href = '/Stave-' + n + '.html';
                each.children[1].href = '/Number-' + n + '.html';
                var name = href.replace(/.*#(.+)%E4%BA%94%E7%BA%BF%E8%B0%B1%E4%B8%8B%E8%BD%BD$/, '$1');
                var a = '//www.everyonepiano.cn/Music/down/' + n + '/' + padding(n, 7) + '/' + name;
                each.children[2].href = a;
            }
        }
        if (url.match(/^\/Stave-/) || url.match(/^\/Number-/)) {
            // 曲谱图片浏览界面
            hide('.EOPStamp');
            $('#musicTitle')[0].style.top = '10px';
            var EOPVideos = $('#EOPVideos', 0);
            if (EOPVideos) {
                EOPVideos.innerHTML = '';
                EOPVideos.style.display = 'none';
            }
            // q('.BarLockLogo', 0).click();
            $('#musicTitle', 0).style.top = '10px';
            var EOPYPJbody = $('#EOPYPJbody', 0);
            EOPYPJbody.style.background = 'none';
            EOPYPJbody.style.backgroundColor = 'rgb(55,55,55)';
            // 添加下载按钮
            document.body.innerHTML += '<div id="downloadbtn" style="position: fixed;left: -10px;top: 70px;cursor: pointer;border: 3px solid rgba(230,230,255,0.4);border-radius: 6px;z-index: 1000;" title="下载所有图片"><svg t="1659831073929" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2313" viewBox="0 0 1024 1024" width="60" height="35" style=""><path d="M897.706667 989.866667H126.293333c-51.2 0-92.16-40.96-92.16-92.16V512c0-13.653333 11.946667-25.6 25.6-25.6S85.333333 498.346667 85.333333 512v385.706667C85.333333 919.893333 104.106667 938.666667 126.293333 938.666667h769.706667c22.186667 0 40.96-18.773333 40.96-40.96V512c0-13.653333 11.946667-25.6 25.6-25.6s27.306667 11.946667 27.306667 25.6v385.706667c0 51.2-40.96 92.16-92.16 92.16z" p-id="2314" fill="#aabbee"></path><path d="M512 738.986667c-6.826667 0-13.653333-1.706667-18.773333-6.826667L267.946667 505.173333c-10.24-10.24-10.24-25.6 0-35.84s25.6-10.24 35.84 0L512 677.546667l208.213333-208.213334c10.24-10.24 25.6-10.24 35.84 0s10.24 25.6 0 35.84L530.773333 730.453333c-5.12 5.12-11.946667 8.533333-18.773333 8.533334z" p-id="2315" fill="#aabbee"></path><path d="M512 738.986667c-13.653333 0-25.6-11.946667-25.6-25.6V59.733333c0-13.653333 11.946667-25.6 25.6-25.6s25.6 11.946667 25.6 25.6v653.653334c0 13.653333-11.946667 25.6-25.6 25.6z" p-id="2316" fill="#aabbee"></path></svg></div>';
            document.querySelector('#downloadbtn').onclick = function() {
                var name = $('#musicTitle', 0).innerHTML;
                var imglist = $('.img-responsive.DownMusicPNG');
                var type = url.match(/^\/Stave-/) ? '-五线谱-' : '-简谱-';
                var tip = document.createElement('div');
                tip.id = 'downtip';
                tip.style.cssText = 'position: fixed;background-color: rgba(200,220,255,0.3);height: 40px;top: 80px;left: 60px;font: 400 24px/40px microsoft-yahei;padding: 0 10px;color: yellowgreen;border-radius: 10px;';
                document.body.append(tip);
                imglist.forEach(function(img, i) {
                    var filename = name + type + (i + 1) + '.png';
                    setTimeout(() => tip.innerHTML = '正在下载：' + filename + ' ' + (i + 1) + '/' + imglist.length, 200 * i);
                    download(img.src, filename);
                })
                tip.innerHTML = '下载完成！';
                setTimeout(() => tip.outerHTML = '', imglist.length * 200 + 3000);
            }
        }
    }
    window.onload = init();
})();


// ==UserScript==
// @name         百词斩单词对战实时翻译
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://pk.baicizhan.com/pages/challenge/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baicizhan.com
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';
    const jscburl = 'https://dict-mobile.iciba.com/interface/index.php?c=word&list=100,24,8,21,22,10,12,13,9,15,2,5,14,4,6,7&client=1&timestamp=1660571931&sign=cc4677186dac0e85&uuid=fcf712001d8b4f049c6e7096c2b43763&sv=android11&v=8.5.2&uid=';

    function $(s, all) { return all ? document.querySelectorAll(s) : document.querySelector(s) }

    function click(ele, time) {
        var l = ele.offsetLeft,
            t = ele.offsetTop,
            w = ele.offsetWidth,
            h = ele.offsetHeight;
        var x = l + w / 2,
            y = t + h / 2;
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window, 0, x, y, x, y, false, false, false, false, 0, null);
        setTimeout(() => { document.body.dispatchEvent(evt) }, time);
    }
    var word = '';
    var span = 50;
    var interval = setInterval(() => {
        // 每隔 span 重复一次
        // 获取元素
        var puzzle = $('div.challenge_puzzle_title_29GOt', 0);
        var opt = $('.challenge_challenge_option_2sJI-', 1);
        if (!(puzzle && opt)) { return 0 } // 如果没有则跳过
        var cur = puzzle.innerText;
        cur = cur.replace(/[^a-zA-Z]*([a-zA-Z]+)*$/, '$1');
        if (cur == word || !cur) { return 0 } // 如果还是上一个词或为空则跳过
        word = cur;
        console.log(cur);
        GM_xmlhttpRequest({
            method: "post",
            url: jscburl,
            data: "word=" + cur,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "Apache-HttpClient/UNAVAILABLE (java 1.4)",
            },
            onabort: function(abort) {
                console.log('aborted:', abort)
            },
            timeout: 5000,
            onerror: function(e) { console.log('error:', e) },
            ontimeout: function(o) { console.log('timeout:', o) },
            onload: function(dat) {
                dat = JSON.parse(dat.response);
                if (dat.status == 0 || dat.message.baesInfo.translate_type == 3) { console.log('error:', dat); return; }
                dat = dat.message;
                console.log(dat);
                var baesInfo = dat.baesInfo || {};
                if (baesInfo) {
                    // 英文单词或词组
                    var symbols = baesInfo.symbols[0] || {};
                    var parts = symbols.parts || [],
                        partsEle = '';
                    // 写入意思
                    if (parts) {
                        partsEle = '<p style="font: 400 16px/16px sans-serif;">'
                        parts.forEach(function(v) {
                            v.means.forEach(function(s, i) { partsEle += s + ',' });
                            partsEle += ('  ');
                        })
                        partsEle += '</p>';
                    }
                    console.log(partsEle);
                    puzzle.innerHTML += partsEle;
                    var right = [];
                    // 查找正确选项
                    opt.forEach((v) => {
                        v.style.backgroundColor = 'rgba(255,255,255,0.8)';
                        var s = v.innerText;
                        s = s.split(', ');
                        s.forEach((x) => {
                            if (partsEle.indexOf(x) >= 0) {
                                v.style.backgroundColor = '#aaf';
                                right[right.length] = v;
                            }
                        });
                    });
                    right.length == 1 && (setTimeout(() => {
                        console.log('clicked');
                        right[0].click();
                    }, 20));
                    // 复查
                    if (right.length == 0) {
                        var max = 1;
                        opt.forEach((v) => {
                            var str1 = v.innerText;
                            var str2 = partsEle.substr(42, 13);
                            var sameNum = 0;
                            for (let i = 0; i < str1.length; i++) {
                                for (let j = 0; j < str2.length; j++) {
                                    if (str1[i] === str2[j]) {
                                        sameNum++;
                                        break
                                    }
                                }
                            }
                            if (max < sameNum) {
                                max = sameNum;
                                right[0] = v
                            }
                            right && (right[0].style.backgroundColor = '#aaf');
                        });
                    }
                } else { console.log('not a english word:', baesInfo.word_name) }
            }
        });
    }, span)
})();


function ajax(obj) {
    var XHR = XMLHttpRequest;
    XHR = new XMLHttpRequest();
    XHR.open(obj.method, obj.url, );
    var i;
    for (i in obj.headers) {
        XHR.setRequestHeader(i, obj.headers[i]);
    }
    var dat = null;
    if (obj.data) {
        if (typeof(obj.data) === 'object' && !Array.isArray(obj.data)) {
            dat = [];
            for (i in obj.data) { dat[dat.length] = i + '=' + obj.data[i] }
            dat = dat.join('&');
        } else { dat = obj.data.toString(); }
    }
    console.log(dat, XHR);
    XHR.timeout = obj.timeout;
    XHR.onload = () => {
        console.log('onload', XHR);
        obj.onload(XHR)
    };
    XHR.onabort = obj.oabort;
    XHR.ontimeout = obj.ontimeout;
    XHR.onerror = obj.onerror;
    XHR.send(dat);
}



// ==UserScript==
// @name         百词斩单词对战实时翻译
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  利用金山词霸获取单词的意思，然后与答案比对，选出最佳答案
// @author       You
// @match        https://pk.baicizhan.com/pages/challenge/*
// @icon         data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iMCAwIDQwIDQwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0MCA0MDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgoJPHJlY3QgeD0iMCIgc3R5bGU9ImZpbGw6IzAwM0JENDsiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIvPgoJPHJlY3QgeD0iOCIgeT0iNy4xIiBzdHlsZT0iZmlsbDojRkRGREZGOyIgd2lkdGg9IjMuNCIgaGVpZ2h0PSIyNi4zIi8+Cgk8cmVjdCB4PSIxMi42IiB5PSI3LjEiIHN0eWxlPSJmaWxsOiNGREZERkY7IiB3aWR0aD0iOS4xIiBoZWlnaHQ9IjI2LjMiLz4KCTxyZWN0IHg9IjIzLjIiIHk9IjcuMSIgc3R5bGU9ImZpbGw6I0ZERkRGRjsiIHdpZHRoPSI5LjEiIGhlaWdodD0iMjYuMyIvPgoJPHJlY3QgeD0iMTYuMiIgeT0iOS45IiBzdHlsZT0iZmlsbDojRkRGREZGOyIgd2lkdGg9IjEuNyIgaGVpZ2h0PSIyMS4xIi8+CgkJPHJlY3QgeD0iNC41IiB5PSIyMCIgdHJhbnNmb3JtPSJtYXRyaXgoMC45OTI0IC0wLjEyMzQgMC4xMjM0IDAuOTkyNCAtMi4zOTk0IDIuNTkwNSkiIHN0eWxlPSJmaWxsOiMwMDNCRDQ7IiB3aWR0aD0iMzAuNSIgaGVpZ2h0PSIxLjQiLz4KCQk8cmVjdCB4PSI1LjUiIHk9IjE5LjYiIHRyYW5zZm9ybT0ibWF0cml4KC0xLjgzNjk3MGUtMTYgMSAtMSAtMS44MzY5NzBlLTE2IDM3LjU0NzYgMy4xNTQ4KSIgc3R5bGU9ImZpbGw6IzAwM0JENDsiIHdpZHRoPSIyMy40IiBoZWlnaHQ9IjEuNCIvPgoJCTxyZWN0IHg9IjE2LjEiIHk9IjE5LjgiIHRyYW5zZm9ybT0ibWF0cml4KC0xLjgzNjk3MGUtMTYgMSAtMSAtMS44MzY5NzBlLTE2IDQ4LjMwOTUgLTcuMzIxNCkiIHN0eWxlPSJmaWxsOiMwMDNCRDQ7IiB3aWR0aD0iMjMuNCIgaGVpZ2h0PSIxLjQiLz4KPC9zdmc+
// @grant        GM_xmlhttpRequest
// ==/UserScript==
// @createdDate  2022-12-2
/*
v1.0 主体功能：利用金山词霸接口查词，显示意思
v1.1 对选项进行indexOf匹配
v1.2 优化匹配机制：按 "; "分开词义进行匹配
v1.3 优化匹配：如果没有查到匹配项，则逐字匹配，匹配数最多的为正确答案
v1.4 修复了close-up只选取close的bug
v1.5 添加播放单词声音的功能，使用new Audio 需要配合block网页的bgm使用，否则不易听清
*/
(function() {
    'use strict';
    // 参数列表
    var auto = {
        start: true,
        back: true,
        select: true,
    };
    var itv = {
        start: 1000,
        back: 5000,
        select: 2500, // 选择的间隔时间 800 + random(select);判断分数，当得分低于对方100分时，直接选择，低于50,1000ms选择，其他才使用当前随机数
    };
    var span = 50; //所有动作尝试间隔
    const jscburl = 'https://dict-mobile.iciba.com/interface/index.php?c=word&list=100,24,8,21,22,10,12,13,9,15,2,5,14,4,6,7&client=1&timestamp=1660571931&sign=cc4677186dac0e85&uuid=fcf712001d8b4f049c6e7096c2b43763&sv=android11&v=8.5.2&uid=';
    const bczurl = 'https://7n.bczcdn.com/r/';
    var sty = document.createElement('style');
    sty.innerHTML = `
#result_result_plane_background_28qQY {display:none !important}
#bczauto {
	position: fixed;
	right: 0;
	top: 0;
	background-color: rgba(255,255,255,0.5);
	padding: 0 4px;
	border-radius: 2px;
    cursor:pointer;
    z-index:9999;
}
#bczauto:after{content:"√";}`;
    document.head.append(sty);
    var bczauto = document.createElement('div');
    bczauto.id = 'bczauto';
    document.documentElement.append(bczauto);
    var myauto = 0;
    bczauto.onclick = () => {
        myauto = myauto === 0 ? 1 : 0;
        console.log('myauto=', myauto);
        bczauto.style.backgroundColor = myauto ? 'yellow' : 'rgba(255,255,255,0.5)';
    }

    function $(s, all) { return all ? document.querySelectorAll(s) : document.querySelector(s) }

    function click(ele, time) {
        var l = ele.offsetLeft,
            t = ele.offsetTop,
            w = ele.offsetWidth,
            h = ele.offsetHeight;
        var x = l + w / 2,
            y = t + h / 2;
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window, 0, x, y, x, y, false, false, false, false, 0, null);
        setTimeout(() => { document.body.dispatchEvent(evt) }, time);
    }

    function ajax(obj) {
        var XHR = XMLHttpRequest;
        XHR = new XMLHttpRequest();
        XHR.open(obj.method, obj.url, );
        var i;
        for (i in obj.headers) {
            XHR.setRequestHeader(i, obj.headers[i]);
        }
        var dat = null;
        if (obj.data) {
            if (typeof(obj.data) === 'object' && !Array.isArray(obj.data)) {
                dat = [];
                for (i in obj.data) { dat[dat.length] = i + '=' + obj.data[i] }
                dat = dat.join('&');
            } else { dat = obj.data.toString(); }
        }
        console.log(dat, XHR);
        XHR.timeout = obj.timeout;
        XHR.onload = obj.onload(XHR);
        XHR.onabort = obj.oabort;
        XHR.ontimeout = obj.ontimeout;
        XHR.onerror = obj.onerror;
        XHR.send(dat);
    }
    var word = '';
    var lastAns;
    var clk = {
        select: 0,
        start: 0,
        back: 0,
    }
    var interval = setInterval(() => {
        // 每隔 span 重复此函数
        // 弹出验证码则什么也不做
        if ($('.captcha-mask')) { return }
        if (myauto) {
            if (lastAns && auto.select && !clk.select && lastAns.innerHTML.length < 150) {
                clk.select = 1;
                var i = itv.select,
                    b = 1500;
                try {
                    var myscore = $('.challenge_challenge_from_left_1dkgI>.challenge_challenge_score_value_mVT8O').innerText;
                    var tascore = $('.challenge_challenge_from_right_3pWNE>.challenge_challenge_score_value_mVT8O').innerText;
                    var t = myscore - tascore;
                    i = t < 20 ? 50 : t < 50 ? 1000 : t < 100 ? 2000 : itv.select;
                    b = t < 20 ? 0 : t < 50 ? 1000 : t < 100 ? 1500 : t < 300 ? 2000 : 4000
                } catch (e) {}
                i = b + Math.round(Math.random() * i);
                i > 500 && console.log(t, i);
                setTimeout(() => {
                    lastAns.click();
                    clk.select = 0;
                }, i)
            }
            // 获取元素
            var back = $("#result_result_action_2xKB4>div");
            back && auto.back && (clk.back || (clk.back = 1, setTimeout(() => {
                clk.back = 0;
                back.click();
                console.log('back');
            }, itv.back)));
            var start = $('#qualifying_qualifying_body_content_button_1vLM9');
            start && auto.start && (clk.start || (clk.start = 1, setTimeout(() => {
                clk.start = 0;
                start.click();
                console.log('start');
            }, itv.start)));
        }
        var puzzle = $('div.challenge_puzzle_title_29GOt', 0);
        var opt = $('.challenge_challenge_option_2sJI-', 1);
        if (!(puzzle && opt)) { return 0 } // 如果没有则跳过
        var cur = puzzle.innerText;
        cur = cur.replace(/[^a-zA-Z]*([a-zA-Z\-]+)[\n\u0000-\uffff]*$/, '$1');
        if (cur == word || !cur) { return 0 } // 如果还是上一个词或为空则跳过
        word = cur;
        console.log(cur);
        try {
            var mp3 = bczurl + cur + '.mp3';
            var player = new Audio(mp3);
            setTimeout(() => { player.play(); }, 1200);
        } catch {}
        GM_xmlhttpRequest({
            method: "post",
            url: jscburl,
            data: "word=" + cur,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "Apache-HttpClient/UNAVAILABLE (java 1.4)",
            },
            onabort: function(abort) {
                console.log('aborted:', abort)
            },
            timeout: 5000,
            onerror: function(e) { console.log('error:', e) },
            ontimeout: function(o) { console.log('timeout:', o) },
            onload: function(dat) {
                dat = JSON.parse(dat.response);
                if (dat.status == 0 || dat.message.baesInfo.translate_type == 3) { console.log('error:', dat); return; }
                dat = dat.message;
                var baesInfo = dat.baesInfo || {};
                if (baesInfo) {
                    // 英文单词或词组
                    var symbols = baesInfo.symbols[0] || {};
                    var parts = symbols.parts || [],
                        partsEle = '';
                    // 写入意思
                    if (parts) {
                        partsEle = '<p style="font: 400 16px/16px sans-serif;">'
                        parts.forEach(function(v) {
                            v.means.forEach(function(s, i) { partsEle += s + ',' });
                            partsEle += ('  ');
                        })
                        partsEle += '</p>';
                    }
                    console.log(partsEle);
                    puzzle.innerHTML += partsEle;
                    var right = [];
                    var optText = '';
                    // 查找正确选项
                    opt.forEach((v) => {
                        v.style.backgroundColor = 'rgba(255,255,255,0.8)';
                        var s = v.innerText;
                        optText += s + '\n';
                        s = s.split(', ');
                        for (var x = 0; x < s.length; x++) {
                            if (partsEle.indexOf(s[x]) >= 0) {
                                v.style.backgroundColor = '#aaf';
                                right[right.length] = v;
                                break;
                            }
                        }
                    });
                    // 复查
                    if (right.length != 1) {
                        var max = 0;
                        var str2 = partsEle.substr(43);
                        opt.forEach((v) => {
                            var str1 = v.innerText;
                            var sameNum = 0;
                            for (let i = 0; i < str1.length; i++) {
                                var tmp = str1[i];
                                if (tmp != ',' && tmp != ' ' && tmp != '的' && tmp != '地') {
                                    str2.indexOf(tmp) >= 0 && sameNum++;
                                }
                            }
                            if (max < sameNum) {
                                max = sameNum;
                                right[0] = v
                            }
                        });
                        right.length > 1 && (opt.forEach((v) => { v.style.backgroundColor = 'rgba(255,255,255,0.8)'; }));
                        console.log('复查: max=', max, ";str=", str2, `\noption:\n${optText}`);
                        right[0] && (right[0].style.backgroundColor = '#aaf');
                    }
                    // 还是没找出答案：(通过选项的中文意思逆向查英文单词，结果不是很能行)
                    if (right.length == 0) {
                        opt.forEach((v) => {
                            var s = v.innerText;
                            GM_xmlhttpRequest({
                                method: "post",
                                url: jscburl,
                                data: "word=" + s,
                                headers: {
                                    "Content-Type": "application/x-www-form-urlencoded",
                                    "User-Agent": "Apache-HttpClient/UNAVAILABLE (java 1.4)",
                                },
                                timeout: 5000,
                                onload: (dat) => {
                                    dat = JSON.parse(dat.response);
                                    if (dat.status == 0 || dat.message.baesInfo.translate_type == 3) { console.log('error:', dat); return; }
                                    dat = dat.message;
                                    var res = '';
                                    if (dat.baesInfo.symbols) {
                                        res = dat.baesInfo.symbols[0].parts[0].means;
                                        res = res.join(' ');
                                    } else { res = dat.baesInfo["translate_result"]; }
                                    console.log('res=', res);
                                    if (res.indexOf(cur) >= 0) {
                                        console.log(v);
                                        v.style.backgroundColor = 'rgba(255,255,255,0.8)';
                                        right[0] = v;
                                    }
                                }
                            });
                        });
                    }
                    right[0] && (lastAns = right[0]);
                    right.length == 0 && (lastAns = undefined);
                } else { console.log('not a english word:', baesInfo.word_name) }
            }
        });
    }, span)
})();