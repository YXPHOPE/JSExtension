function nE(e, cla, id, css, html, events) { // cla: class是个类，不让用 // 无this版本的nE
    if (typeof(e) === 'object') {
        cla = e.class;
        id = e.id;
        css = e.css;
        html = e.html;
        events = e.events;
        e = e.tag;
        cpnt = e.component;
    } else if (typeof(e) === 'string') { return document.createElement(ele) } else { return }
    var ele = document.createElement(e);
    id && (ele.id = id);
    css && (ele.style.cssText = css);
    cla && (ele.className = cla);
    if (html) {
        if (typeof(html) === 'object') { ele.innerHTML = html[WDconfig.lang] } else { ele.innerHTML = html }
    }
    if (cpnt) {
        if (Array.isArray(cpnt)) { cpnt.forEach((v) => { ele.append(nE(WDconfig.component[v])) }) } else { ele.append(WDconfig.component[cpnt]) }
    }
    if (events) {
        if (Array.isArray(events)) {
            events.forEach((v) => {
                ele.addEventListener(v.event, v.function);
            })
        } else if (typeof(events) === 'object') {
            ele.addEventListener(events.event, events.function);
        }
    }
    return ele;
}
var WDconfig = {
    lang: 'zh', // 控制组件中html的显示语言
    icon: {
        close: '',
        stick: '',
        fullScreen: '',
        expand: '',
        minimize: '',
        closeAll: ''
    },
    component: {
        // 默认tag=div, hide=false
        drag: {
            class: 'wd_drag',
            component: {
                top: { class: 'wd_drag_tb', css: 'top:-3px', },
                topRight: { class: 'wd_drag_diag', css: 'top:-3px;right:-3px', },
                right: { class: 'wd_drag_lr', css: 'right:-3px', },
                rightBottom: { class: 'wd_drag_diag', css: 'right:-3px;bottom:-3px', },
                bottom: { class: 'wd_drag_tb', css: 'bottom:-3px', },
                bottomLeft: { class: 'wd_drag_diag', css: 'bottom:-3px;left:-3px', },
                left: { class: 'wd_drag_lr', css: 'left:-3px', },
                leftTop: { class: 'wd_drag_diag', css: 'left:-3px;top:-3px', },
            },
        },
        titlebar: {
            class: 'wd_titlebar',
            component: {
                close: {
                    tag: 'div',
                    class: 'wd_close hover',
                    html: { "zh": '<div></div><p>关闭此窗口</p>', 'en': '<div></div><p>Close this window</p>' },
                    event: []
                },
            }
        },
        body: {
            tag: 'div',
            class: 'wd_mainbody',
            css: 'height:200px;background:pink;',
            component: {}, // 自主添加的元素
        },
    },
    css: {
        cssText: '',
        component: [
            { status: true, }
        ],
    },
    container: '#wd_container'
}
WDconfig.container = nE('div', 0, WDconfig.container);
WDconfig.lang = (navigator.language.indexOf('zh') != -1) ? 'zh' : 'en'; // 语言多了可以优化

class WD {
    // 类内部直接写key=value;fn(){var private = '';this.key = ''}
    /*WD元素结构
    div.wd_Div // 顶级窗格 overflow=visible
    |-div.wd_drag // 拖动及resize组件 overflow=visible
    |-div.wd_titlebar // 窗口最上方标题栏
    |-div.wd_mainbody // body overflow=hidden
    |-style
    |-other component
    */
    build = false; // 是否完成初始化（init()调用后）
    constructor(title) {
        this.hide = [];
        if (typeof(title) === 'object') {
            this.hide = title.hide;
        }
        title = (title && typeof(title) === 'string') ? title : 'Window';
        // constructor内也可以调用自己的函数
        this.div = nE({ tag: 'div', class: 'wd_Div' });
        this.config = {...WDconfig }; // 这会复制一份WDconfig对象，而不是引用它
        this.css = this.nE({ tag: 'style' });
        this.div.append(this.css);
    }
    append() {
        if (!this.build) { return }
        for (i in arguments) {
            this.body.append(arguments[i]);
        }
    }
    addCSS(c) { this.css.innerHTML += c }
    initCSS() {}
    init() {
        var cnpt = this.config.component;
        this.bar = this.nE(cnpt.titlebar);
        this.body = this.nE(cnpt.body);
        this.drag = this.nE(cnpt.drag);
        this.div.append(this.drag);
        this.div.append(this.bar);
        this.div.append(this.body);
        this.build = true;
    }
    title(s) {
        this.config.title = s;
        if (this.build) { this.bar.title.innerText = s; } // 判断config
    }
    show({ x, y, e, position, animation }) {
        this.div.style.display = 'none';
        WD.container.append(this.div);
        var abs = position && position === 'absolute'; // 默认为fixed
        this.div.style.position = abs ? 'absolute' : 'fixed';
        if (x && y) {} else if (e) {
            [x, y] = abs ? [e.pageX, e.pageY] : [e.clientX, e.clientY];
        } else {
            x = '20%';
            y = '10%';
        }
        this.div.style.cssText = `left:${x};top:${y};`;
        this.div.style.display = 'block';
        if (animation instanceof Function) { animation(this.div) } else if (typeof(animation) === 'string' && animation.indexOf('animation:' != -1)) { this.div.style.cssText = animation }
        // clickToTop(this);
    }
    hide(e) {
        if (e.build && typeof(e) === 'string') { console.warn('WD instance has already benn initialised. Hide is no effect. You should try directly to use WD.hide(this.div.component)') } else if (e instanceof Element) { e.style.display = 'none' } else if (typeof(e) === 'string') { this.hide.push(e) }
    }
    remove(e) {
        if (e) {
            if (!e.build && typeof(e) === 'string') { this.hide.push(e) } else if (e instanceof Element) { e.remove() }
        } else { this.div.remove() }
    }
    nE(e) { // 有this版本的nE
        if (typeof(e) === 'object') {
            if (e.hide) { return } // 如果此组件加了hide=true则跳过
            if (this.hide.indexOf(e.tag) != -1) { return } // 如果设置了hide，且组件位于其中也跳过
            var cla = e.class,
                id = e.id,
                css = e.css,
                html = e.html,
                events = e.events,
                cpnt = e.component,
                ele = e.tag || 'div'; // 默认创建div元素
        } else if (typeof(e) === 'string') { return document.createElement(ele) } else { return }
        var ele = document.createElement(ele);
        id && (ele.id = id);
        css && (ele.style.cssText = css);
        cla && (ele.className = cla);
        // 优先取 this.config中的配置，不存在再取 WDconfig 中的配置 
        if (html) {
            if (typeof(html) === 'object') { ele.innerHTML = html[this.config.lang || WDconfig.lang] } else { ele.innerHTML = html }
        }
        if (cpnt) {
            if (Array.isArray(cpnt)) {
                cpnt.forEach((v) => {
                    var x = this.config.component[v] || WDconfig.component[v];
                    var tmp = this.nE(x);
                    ele.append(tmp);
                    ele[x] = tmp;
                })
            } else if (typeof(cnpt) === 'object') {
                for (key in cnpt) {
                    var tmp = this.nE(cnpt[key]);
                    ele.append(tmp);
                    ele[key] = tmp;
                }
            } else if (typeof(cnpt) === 'string') {
                ele.append(this.nE(this.config.component[v] || WDconfig.component[cpnt]))
            }
        }
        if (events) {
            if (Array.isArray(events)) {
                events.forEach((v) => {
                    ele.addEventListener(v.event, v.function);
                })
            } else if (typeof(events) === 'object') {
                ele.addEventListener(events.event, events.function);
            }
        }
        return ele;
    }
};
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
注意：有的时候你选择不到文本可能并不是pointer-event，userselect的原因，而是有一层div覆盖在上面使得你无法点击到自己想要的元素
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
覆写动画，改用CSS
 * @updateDate 2022-11-14
*/
(function() {
    'use strict';
    // 注入自己想要用的函数 用于div属性里添加onclick
    var autoHost = [];
    // 函数库
    function $(s) { return document.querySelector(s) }

    function log() { arguments.length === 1 ? console.log(arguments[0]) : console.log(arguments) }

    function nE(e, cla, id) {
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
pointer-events:auto !important;
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
    /* 
    对于多参数的函数，且有的可以省略，最好使用一个对象作为参数，
    function fn({a,b,c}){if(b){console.log(b)}} 
    可以跨越不想填的参数
    只有当形式参数是({a,b,c})这么填时才能直接使用a,b,c
    (arg={a,b,c})->arg.a
    ({a:'default',b})->无效，调用时不能跳过a写参数b
    */
    // 无论是在document还是window对象绑定 WD 类都无法调用，于是只能用万能招数：向dom里添加script，让它自己运行
    var WDscript = nE('script');
    WDscript.innerHTML = '';



    docu.append(WDscript);
    class dToast {
        constructor(config) {
            if (typeof config.inner == 'undefined') { config.inner = true }
            if (typeof config == 'string') { config = { title: '新消息', body: config, } } else if (typeof config.title == 'undefined') { config.title = '新消息' }
            this.toast(config)
        };
        inner(config) {
            var date = new Date();
            date = date.getHours() + ':' + date.getMinutes();
            var _div = nE('div', 'd-toast');
            var _div_content = nE('div', 'd-toast-content');
            var _close = nE('span', 'd-toast-close');
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
    // 创建翻译用div
    var tran = nE('div', 0, "trslDiv");
    tran.maxZ = 99000;
    docu.append(tran);
    var last = '';
    var feat = nE('div', 'clearfix', 'myFeature');
    var fanyibtn = nE('div', 'featureBtn', 'translateBtn'),
        searchbtn = nE('div', 'featureBtn', 'searchBtn'),
        jhbsouti = nE('div', 'featureBtn', 'jhbsouti');
    fanyibtn.innerHTML = '<svg t="1660904800228" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2248" width="30" height="30"><path d="M545.3 65c38.3 0 69.7 29.2 73.3 66.5l0.4 7.1v265.8h256.8c43 0 78.4 33 82.2 75.2l0.4 7.5v389.1c0 43.1-33 78.5-75.1 82.3l-7.5 0.3H486.6c-43.1 0-78.5-33-82.3-75.1l-0.3-7.5V619.4H138.2c-37.9 0-69.6-28.8-73.3-66.5l-0.3-7.1V138.6c0-38.3 29.2-69.6 66.5-73.2l7.2-0.4h407z m330.4 387.1H619v93.7c-0.1 38.3-29.2 69.7-66.6 73.2l-7.1 0.4h-93.7v256.8c0 17.5 13 32 29.8 34.6l5.1 0.4h389.2c17.5 0 32-13 34.5-29.8l0.4-5.1V487.1c0-19.3-15.5-35-34.9-35zM167.1 666.6l2.8-0.1c12.1 0 22.3 9.1 23.7 21.1 0.2 1.9 3.9 30.1 21.7 60.3 16.6 28.2 45.2 58.1 95.1 70.9l11.1 2.5h0.1c9.7 2.3 16.6 10.1 18.2 19.2l0.4 4.1-0.6 5.4c-2.1 9.4-9.7 16.6-19.2 18.2l-4 0.3-3.8-0.3h-0.1c-73.8-14.3-115.6-57.9-138.5-97.7-13.8-23.6-23.1-49.6-27.6-76.6V693.1l-0.2-2.8c0-10.4 6.7-19.7 16.7-22.8l4.2-0.9 2.7-0.1-2.7 0.1zM695.2 557c8.6 0 16.3 4.5 20.5 11.6l1.8 3.7 84.4 219.9 1.6 8.6c0 8.4-4.4 16.1-11.5 20.5l-3.8 1.9-8.5 1.6c-8.3 0-16.1-4.3-20.5-11.4l-1.9-3.9-18.1-47.5h-89.7l-18.7 47.6c-3.1 7.8-10 13.4-18.3 14.8l-4 0.3-8.7-1.7c-7.8-3.1-13.4-9.9-14.8-18.2l-0.3-4.1 1.7-8.8L673 572c3-7.8 9.8-13.4 18-14.8l4.2-0.2h0.1-0.1z m-0.3 89.7l-26.6 67.6h52.5l-25.9-67.6z m-149.6-534h-407c-12.5 0.1-23.2 9-25.5 21.3l-0.4 4.6v407.3c0 12.5 9 23.2 21.2 25.4l4.7 0.5h407.2c12.5-0.1 23.2-9 25.5-21.3l0.4-4.7V138.6c0-14.3-11.6-25.9-25.9-25.9h-0.2z m-205.6 75.7c13.2 0 23.8 10.7 23.8 23.8v27.7h77.8c20 0 36.3 16.2 36.3 36.3v75.2c0 20-16.3 36.3-36.3 36.3h-77.8v89.2c-0.6 12.8-11.1 22.8-23.9 22.8-12.8 0-23.3-10-23.9-22.8v-89.2H238c-20-0.1-36.3-16.3-36.3-36.4v-75.1c0.1-20 16.3-36.2 36.3-36.3h77.8v-27.7c0-13.1 10.7-23.8 23.9-23.8z m90.2 99.2h-66.4V340h66.3l0.1-52.4z m-114.1 0h-66.4V340h66.3l0.1-52.4zM714.2 139l1.8 0.1c29.3 2.3 71.2 13.9 106.8 40.9 33.1 25.2 60.4 64.2 65.2 120.8l0.7 12.4c0 11.9-8.1 21.7-19 24l-4.2 0.5h-0.7c-12.9 0-23.5-10.3-23.8-23.3-1.7-58.3-32.1-89.4-63.3-107-20-10.9-41.9-18-64.6-20.7l-0.9-0.1-4.5-0.8c-8.7-2.4-15.3-9.6-17-18.4l-0.4-4.5 0.1-1.9c1.1-12.4 11.5-21.9 23.8-22z m0 0" fill="#707070" p-id="2249"></path></svg>';
    searchbtn.innerHTML = '<svg t="1668148786266" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3432" width="28" height="28"><path d="M1010.100627 940.224384l-191.906195-188.631579c159.91046-182.150566 150.359494-453.87555-25.582945-620.13058C613.462653-44.343771 319.156457-44.343771 136.801227 134.668621c-179.148834 172.5996-182.35523 457.081945-9.550966 632.887941l9.550966 9.619188c166.323251 159.842239 425.495536 179.012392 610.988941 41.614923l191.974417 188.563358c9.550966 9.550966 22.376549 15.963757 35.133911 15.963757a51.370553 51.370553 0 0 0 35.202131-15.963757c16.031979-16.031979 19.238374-47.959494 0-67.129647zM98.460921 454.353098c3.138175-198.250766 166.323251-358.024783 367.848634-358.024784s364.642239 159.774017 367.848634 358.024784c-3.206396 201.32072-169.529647 361.162958-367.848634 357.956562A361.708728 361.708728 0 0 1 98.460921 454.353098z" p-id="3433" fill="#707070"></path></svg>';
    jhbsouti.innerHTML = '<svg t="1670049345013" viewBox="0 0 1092 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4495" width="28" height="30"><path d="M1023.992235 341.31291c37.682914 0 68.266149 30.651501 68.266149 68.266149v546.129192c0 37.614648-30.583235 68.266149-68.266149 68.266149H68.266149c-37.682914 0-68.266149-30.651501-68.266149-68.266149v-546.129192c0-37.614648 30.583235-68.266149 68.266149-68.266149h136.532298c18.841457 0 34.133074 15.291617 34.133074 34.133075s-15.291617 34.133074-34.133074 34.133074H68.266149v546.129192h955.726086v-546.129192H750.927639c-18.841457 0-34.133074-15.291617-34.133075-34.133074s15.291617-34.133074 34.133075-34.133075h273.064596z m-170.665373 204.798447c18.841457 0 34.133074 15.291617 34.133075 34.133075s-15.291617 34.133074-34.133075 34.133074H648.528415c-18.841457 0-34.133074-15.223351-34.133074-34.133074s15.291617-34.133074 34.133074-34.133075h204.798447z m0 204.798447c18.841457 0 34.133074 15.291617 34.133075 34.133075s-15.291617 34.133074-34.133075 34.133074H307.19767c-18.841457 0-34.133074-15.223351-34.133074-34.133074s15.291617-34.133074 34.133074-34.133075h546.129192z m-10.99085-644.36418a34.158674 34.158674 0 0 1 0 48.264167L745.875944 251.26986l-0.068266 0.068266-0.068267 0.068266L407.89024 589.255563c-3.754638 3.754638-8.32847 6.55355-13.380165 8.191938l-144.792502 48.264168c-3.54984 1.228791-7.167946 1.77492-10.786052 1.77492a34.27814 34.27814 0 0 1-24.166216-9.966858 34.141608 34.141608 0 0 1-8.260204-34.952268l48.264167-144.792502c1.706654-5.051695 4.573832-9.625527 8.32847-13.380166L697.54351 10.017289a34.158674 34.158674 0 0 1 48.264168 0l96.528334 96.528335z m-477.043849 428.711416l308.085131-308.085131-48.264168-48.264167-308.08513 308.08513-24.166217 72.430384 72.430384-24.166216z m356.349298-356.349298l48.264167-48.264167-48.264167-48.264168-48.264167 48.264168 48.264167 48.264167z" fill="#707070" p-id="4496"></path></svg>';
    var ftd = nE('div', 'clearfix');
    feat.append(ftd);
    ftd.append(fanyibtn);
    ftd.append(searchbtn);
    ftd.append(jhbsouti);
    docu.append(feat);
    var input = nE('input', 0, 'transInput');
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

    function close(relNode = 'parentNode') { return `<div class="fanyiClose hover" onclick="var f=this.` + relNode + `;myFade(f,[{name:'top',from:f.offsetTop,to:window.pageYOffset+document.documentElement.clientHeight,unit:'px'},{name:'opacity',from:1,to:0,unit:''},],300,function(x){return x**3});setTimeout(function(){f.outerHTML=''},500)">X<p>关闭</p></div>`; }

    function closeAll(relNode = 'parentNode.parentNode') { return `<div class="fanyiClose hover" onclick="var f=this.` + relNode + `;myFade(f,[{name:'opacity',from:1,to:0,unit:''},],300,function(x){return x**3});setTimeout(function(){f.innerHTML='';f.style.opacity=1;f.style.scale=1;f.style.display='initial'},500)">A<p>全部关闭</p></div>`; }
    var size = `<div class="size hover">` + svg + `</div>`;
    var sizeAbs = `<div class="size sizeAbs hover">` + svg + `</div>`;

    function collapse(relNode = 'parentNode') { return `<div class="fanyiClose hover" style="padding: 2px 8px;" onclick="this.style.display='none';this.nextSibling.style.display='block';var f=this.` + relNode + `;myFade(f,[{name:'height',from:f.offsetHeight,to:25,unit:'px'},{name:'width',from:f.offsetWidth,to:275,unit:'px'},{name:'opacity',from:1,to:0.5,unit:''}],500,easeInOut)"><svg t="1668177842226" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4436" width="22" height="22"><path d="M98.23 451.003l829.685-1.992 0.154 64-829.685 1.992z" fill="#000000" p-id="4437"></path></svg><p>收起</p></div>`; }

    function expand(relNode = 'parentNode') { return `<div class="fanyiClose hover" style="display:none;paddding:2px 6px 4px" onclick="this.style.display='none';this.previousSibling.style.display='block';var f=this.` + relNode + `;myFade(f,[{name:'height',from:f.offsetHeight/document.documentElement.clientHeight*100,to:60,unit:'%'},{name:'width',from:f.offsetWidth/document.documentElement.clientWidth*100,to:40,unit:'%'},{name:'opacity',from:0.5,to:1,unit:''}],500,easeInOut)"><svg t="1668177770562" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3546" width="20" height="20"><path d="M890.41032533 75.09333333h-573.472768c-32.555008 0-59.04247467 26.279936-59.04247466 58.5728V255.91808H134.68194133c-32.56046933 0-59.04247467 26.279936-59.04247466 58.57826133v575.832064c0 32.29832533 26.48200533 58.57826133 59.04247466 58.57826134H708.149248c32.54954667 0 59.04247467-26.279936 59.04247467-58.57826134V768.07645867h123.21860266c32.555008 0 59.04247467-26.27447467 59.04247467-58.57826134v-575.832064c0-32.292864-26.48746667-58.5728-59.04247467-58.5728z m-188.82013866 808.72516267H141.24100267V321.00078933h560.349184V883.818496zM883.851264 702.99374933H767.19172267V314.49634133c0-32.29832533-26.492928-58.57826133-59.04247467-58.57826133H323.50208V140.17604267H883.851264V702.99374933z" fill="#000000" p-id="3547"></path></svg><p>展开</p></div>`; }

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
                var fanyi = nE('div', 'fanyiDiv');
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
                    eemean = dat.ee_mean || [],
                    phrase = dat.phrase || [],
                    slang = dat.slang || [],
                    stems = dat.stems_affixes || [];
                // symbols = dat.baesInfo.symbols[0] || {},
                // mean = symbols.parts || [],
                // 基本释义 baesInfo
                var baesInfo = dat.baesInfo || {},
                    baesInfoEle = '';
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
                                cgcz += '<div><span class="partname">' + v.value_en + '</span><span>' + v.value_cn + '</span></div>';
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
                // 英文意思
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
        var search = nE('div', 'fanyiDiv searchDiv', id);
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

function noDebuger() {
    function testDebuger() {
        var date0 = new Date();
        debugger;
        if (new Date() - date0 > 10) { document.documentElement.innerHTML = "nodebuger"; return true }
        return false
    }

    function start() {
        while (testDebuger()) {
            testDebuger()
        }
    }
    if (!testDebuger()) {
        window['\x6f\x6e\x62\x6c\x75\x72'] = function() {
            setTimeout(function() {
                start()
            }, 500)
        }
    } else {
        start()
    }
}