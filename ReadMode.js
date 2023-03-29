function readModeInit() {
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

    function nE(e, id, cla) {
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
    var tran = $('#trslDiv');
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
html {
scrollbar-width:none !important;
}
html * {
scrollbar-width: thin !important;
}
#myReadMode {
	position: fixed;
	opacity: .1;
    top:0;
    left:0;
    z-index:9999999;
    overflow:hidden;
    width:28px;
    height:25px;
    transform-origin:0 0 0;
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
.styleInputArea {
	padding: 6px;
	background-color: initial;
	border: 2px solid rgb(200,200,200);
	border-radius: 4px;
	float: left;
	height: 100%;
	width: 50%;
    margin:3px;
    outline:none;
}
.styleInputArea:focus,.styleInputArea:hover {
box-shadow: 0 0 2px 1px aqua;
}
.fanyiDiv .eleSty {
padding:3px;
width:40%;
}
.fanyiDiv .eleSty p {
font:400 12px/16px sans-serif;
}
.styleSubmit {
display:flex;
align-content:center;
margin:5px;
border: none;
background-color: #8d8;
border-radius: 5px;
padding: 5px 10px;
font-weight: 500;
}
.styleSubmit:hover {
background-color: #7c7;
cursor: pointer;
}
    `;
        // 建立网站对应的函数对象
        // 构建是按照域名来分大类，每个域名下面分为三个函数，第一个init用于初始化，把read、exit要用的属性放到this中，第二个第三个就是read和exit
        var keyForContentDiv;
        for (i in contentDIV) { var r = new RegExp(i); if (r.test(href)) { keyForContentDiv = i; break; } }
        var siteStyle = nE('style');
        head.append(siteStyle);
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
            '.*.csdn.net': {
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
            'www.icourse163.org/learn': {
                init: () => {
                    var x = '';
                    setInterval(() => {
                        var s = document.querySelectorAll('.f-fl.current');
                        if (s.length > 0) {
                            s = s[0].title;
                            if (s == x) { return } else { x = s; }
                            console.log(s);
                            var t = s.substr(-2, 2);
                            if (t == '视频') { s = s.slice(3, -5) + '.mp4' } else if (t == 'PT' || t == 'DF') { s = s.slice(3, -6) + '.pdf' }
                            GM_setClipboard('Downloads/' + s)
                        }
                    }, 1000);
                },
            },
            'localhost:[0-9]+/notebooks': {
                init: () => {
                    var style = nE('style');
                    style.innerHTML = `
    #menubar-container{background:white !important;;width:100% !important;;position:absolute;opacity:0;height:0;overflow:hidden;transition:height 0.5s,opacity 0.5s;box-shadow:1px 1px 3px 0 #ddd;}
    @keyframes menubarOverflow{
    0%{overflow:hidden}
    99%{overflow:hidden}
    100%{overflow:visible}
    }
    #header:hover #menubar-container{height:66px;opacity:1;background:white;width:100%;overflow:visible;display:block;animation:menubarOverflow 0.5s;}
    #header-container {padding:0 5px !important}
    #logout {margin-top: 2px;}
    #toc-wrapper{top:30px}
    #site{height:650px;margin-top:35px;}
    .notebook_app>#header {position:fixed;width:100%}
    li.dropdown:hover>.dropdown-toggle{background-color:#ddd !important;}
    li.dropdown:hover>.dropdown-menu,.dropdown-submenu:hover>.dropdown-menu {display:block;}
    .dropdown-menu {top:80%;}
    li.dropdown>a{padding:0 15px;font:400 16px/30px sans-serif;}
`;
                    console.log('loaded!!!');
                    head.append(style);
                }
            },
            common: {
                init: function() {
                    for (i in contentDIV) {
                        var r = new RegExp(i);
                        if (r.test(href)) {
                            keyForContentDiv = i;
                            this.ele = contentDIV[i].ele;
                            this.con = contentDIV[i];
                            break;
                        }
                    }
                    this.ele = this.ele || '#content,.content,.article,.main';
                    this.readDiv = $w(this.ele);
                    if (this.con && this.con.css) { addCSS(this.con.css, head) }
                    if (this.readDiv) {
                        this.prt = this.readDiv.parentNode;
                        this.next = this.readDiv.nextElementSibling;
                        return 1;
                    } else {
                        // new dToast({title:"这个网站还未选定阅读区域",body:""});
                        return 0;
                    }
                },
                read: function() {
                    if (this.readDiv) { // append默认放在最后，insertBefore可以指定放在哪个的前面。
                        docu.append(this.readDiv);
                        docu.style.margin = '25px 5px 0';
                        addCSS(this.ele + ' div {height:max-content;overflow:visible}', head); // 直接子元素全部展开
                        hide(wind.querySelectorAll('body') || docu.body);
                        return 1;
                    }
                    return 0;
                },
                exit: function() {
                    if (this.readDiv) {
                        if (this.next) { this.prt.insertBefore(this.readDiv, this.next) } else { this.prt.append(this.readDiv); }
                        docu.style.margin = '0';
                        show(wind.querySelectorAll('body'));
                        return 1
                    }
                    return 0
                }
            },
        }

        function getPath(ele) {
            var s = '';
            while (s.substr(0, 4) !== 'body' && s.substr(0, 4) !== 'html') {
                var t = ele.tagName.toLowerCase();
                ele.classList && (t += getClass(ele));
                ele.id && (t += ('#' + ele.id));
                ele = ele.parentElement;
                s = t + '>' + s;
            }
            return s;
        }

        function getClass(ele) {
            var s = '';
            ele.classList.forEach((v) => { s += ('.' + v) })
            return s;
        }

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
        // fun['blog.csdn.net'] = fun['www.csdn.net']; // 使用全域名带来的一个不好的影响
        // url信息，最终转变为域名中的第二域
        if (!href) { return 0 } // 旧的host，现在是host/dir
        var host = href.replace(/([^\/]+)\/.*/, '$1');
        log("read mode : url =", href);
        head.append(globalSty);
        // 获取直接用html写入的元素
        var readbtn = $w('#my-read-mode');
        var designbtn = $w('#my-designMode');
        var selectarea = $w('#my-selectArea');
        var cssEditor = $w('#my-cssEditor');
        // 为元素添加点击按钮
        selectarea.addEventListener('click', () => { selectEle(selectarea, 0) });
        var baseCSS = ['display', 'width', 'height'];

        function selectEle(btn, mode) {
            // button 为选择元素或者CSS编辑器中的一个，mode为false（选择阅读元素）或true（css）
            if (btn.disabled) { console.log('heihei 按钮被禁用了'); return false; }
            bgc(btn, 'yellow');
            new dToast({ title: mode ? '进入CSS编辑器' : '进入选择 - 阅读模式', body: '您已进入' + (mode ? 'CSS编辑器' : '选择阅读元素模式') + ',按下Esc退出，再次点击按钮无法退出', inner: true, timeout: 5000, });
            var tmp = [],
                first = 1;
            var ele;
            var existEle = contentDIV[href] || contentDIV[host];
            if (existEle) { over({ originalTarget: $w(existEle.ele) || docu }) }

            function over(e) {
                // console.log(e);
                ele = e.originalTarget;
                if (mode) {
                    if (ele) {
                        tmp[0] = ele.style.boxSizing;
                        tmp[1] = ele.style.border;
                        ele.style.boxSizing = 'content-box';
                        ele.style.border = 'dashed 1px gray';
                    }
                } else {
                    while (ele && ele.offsetWidth < 400 || ele.offsetHeight < 300) { ele = ele.parentNode || undefined; if (!ele) { break } } // 此处设置了阅读元素盒子的最小值
                    if (ele && (ele.tagName == 'svg' || ele.tagName == 'BUTTON' || ele.isEqualNode(docu) || ele.isEqualNode(body))) { ele = undefined; } // 不能选择body和document
                    if (ele) {
                        tmp[0] = ele.style.boxSizing;
                        tmp[1] = ele.style.border;
                        ele.style.boxSizing = 'content-box';
                        ele.style.border = 'solid 5px red';
                    }
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
                if (first) { first = 0; return; }
                if ((t.isEqualNode(ele) && !e.keyCode) || e.keyCode === 27) { // 27为Esc键
                    bgc(btn, '');
                    docu.removeEventListener('mouseover', over);
                    docu.removeEventListener('mouseout', out);
                    docu.removeEventListener('click', click);
                    body.removeEventListener('keydown', click);
                    out();
                    if (ele && mode) {
                        // mode 为 1 时，为css编辑器，执行以下代码
                        var div = nE('div');
                        div.innerHTML = `<div class="fanyiDiv" style="left: 60px; top: 36px; opacity: 1; display: initial; z-index: 99001; height: 455px; width: 638px;"><div style="height: 28px;overflow:visible;background-color:rgba(200,220,255,.8);cursor: move;position: sticky;top: 0;left: 0;margin:0;scrollbar-width: none;" onscroll="var o=(102-this.scrollTop)/102;o=o>1?1:o;o=o<0.1?0.05:o;this.parentNode.style.opacity=o;"><div style="float:left" class="fanyiClose hover" onclick="var f=this.parentNode.parentNode;myFade(f,[{name:'top',from:f.offsetTop,to:window.pageYOffset+document.documentElement.clientHeight,unit:'px'},{name:'opacity',from:1,to:0,unit:''},],300,function(x){return x**3});setTimeout(function(){f.outerHTML=''},500)">X<p>关闭</p></div><div class="fanyiClose hover" onclick="var f=this.parentNode.parentNode;myFade(f,[{name:'top',from:f.offsetTop,to:window.pageYOffset+document.documentElement.clientHeight,unit:'px'},{name:'opacity',from:1,to:0,unit:''},],300,function(x){return x**3});setTimeout(function(){f.outerHTML=''},500)">X<p>关闭</p></div><div class="fanyiClose hover" onclick="var f=this.parentNode.parentNode.parentNode;myFade(f,[{name:'opacity',from:1,to:0,unit:''},],300,function(x){return x**3});setTimeout(function(){f.innerHTML='';f.style.opacity=1;f.style.scale=1;f.style.display='initial'},500)">A<p>全部关闭</p></div><div class="fanyiClose hover" style="padding: 2px 8px;" onclick="this.style.display='none';this.nextSibling.style.display='block';var f=this.parentNode.parentNode;myFade(f,[{name:'height',from:f.offsetHeight,to:25,unit:'px'},{name:'width',from:f.offsetWidth,to:275,unit:'px'},{name:'opacity',from:1,to:0.5,unit:''}],500,easeInOut)"><svg t="1668177842226" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4436" width="22" height="22"><path d="M98.23 451.003l829.685-1.992 0.154 64-829.685 1.992z" fill="#000000" p-id="4437"></path></svg><p>收起</p></div><div class="fanyiClose hover" style="display:none;paddding:2px 6px 4px" onclick="this.style.display='none';this.previousSibling.style.display='block';var f=this.parentNode.parentNode;myFade(f,[{name:'height',from:f.offsetHeight/document.documentElement.clientHeight*100,to:60,unit:'%'},{name:'width',from:f.offsetWidth/document.documentElement.clientWidth*100,to:40,unit:'%'},{name:'opacity',from:0.5,to:1,unit:''}],500,easeInOut)"><svg t="1668177770562" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3546" width="20" height="20"><path d="M890.41032533 75.09333333h-573.472768c-32.555008 0-59.04247467 26.279936-59.04247466 58.5728V255.91808H134.68194133c-32.56046933 0-59.04247467 26.279936-59.04247466 58.57826133v575.832064c0 32.29832533 26.48200533 58.57826133 59.04247466 58.57826134H708.149248c32.54954667 0 59.04247467-26.279936 59.04247467-58.57826134V768.07645867h123.21860266c32.555008 0 59.04247467-26.27447467 59.04247467-58.57826134v-575.832064c0-32.292864-26.48746667-58.5728-59.04247467-58.5728z m-188.82013866 808.72516267H141.24100267V321.00078933h560.349184V883.818496zM883.851264 702.99374933H767.19172267V314.49634133c0-32.29832533-26.492928-58.57826133-59.04247467-58.57826133H323.50208V140.17604267H883.851264V702.99374933z" fill="#000000" p-id="3547"></path></svg><p>展开</p></div><div class="fanyiClose hover" style="padding: 4px 8px;" onclick="var f=this.parentNode.parentNode;var p=f.style.position;var gofixed=(p=='absolute' || !p)?1:0;this.style.background=gofixed?'deepskyblue':'none';if(gofixed){f.style.top=(f.offsetTop-document.documentElement.scrollTop)+'px';f.style.position='fixed';}else{f.style.position='absolute';f.style.top=(f.offsetTop+document.documentElement.scrollTop)+'px';}"><svg t="1668231785516" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4282" width="18" height="18"><path d="M674.632519 600.429005 674.618193 600.429005c-7.303336 0-14.300704 1.342578-19.455097-3.839445L428.228573 371.187951c-10.715039-10.741645-10.701736-27.069519 0.026606-37.797861L666.18615 95.984075c20.168342-20.167319 48.607044-31.473829 78.012771-31.473829 27.981285 0 53.707203 10.460236 72.424496 29.17753L930.634054 207.764927c19.228947 19.21462 30.667463 47.142693 31.380708 76.561723 0.737804 30.144554-9.937326 58.542324-29.286 77.890998L694.075337 596.616166C688.918897 601.772606 681.923576 600.429005 674.632519 600.429005zM486.570329 353.920682 674.658102 542.519084l219.185025-219.159442c8.756431-8.754385 13.5629-22.490224 13.187347-37.662785-0.363274-15.213493-6.083555-29.782304-15.282055-38.97978L777.739828 132.707464c-8.337899-8.337899-20.24816-12.930497-33.540907-12.930497-14.932084 0-29.191856 5.706979-39.127136 15.628956L486.570329 353.920682z" p-id="4283"></path><path d="M590.940398 332.275709c-3.53143 0-7.062859-1.342578-9.749038-4.042059-5.355985-5.384637-5.342682-14.084787 0.039909-19.442818l5.318122-5.28947c5.355985-5.384637 14.072507-5.357008 19.442818 0.026606 5.355985 5.384637 5.344728 14.08581-0.039909 19.442818l-5.318122 5.290493C597.962326 330.946434 594.444199 332.275709 590.940398 332.275709z" p-id="4284"></path><path d="M623.31269 299.903417c-3.518127 0-7.03523-1.342578-9.721409-4.028757-5.370311-5.371334-5.370311-14.071484 0-19.442818l89.692788-89.693812c21.161972-21.161972 56.273654-21.806655 76.68452-1.38351l58.488089 58.489112c5.370311 5.371334 5.370311 14.071484 0 19.442818s-14.072507 5.371334-19.442818 0l-58.488089-58.489112c-9.519818-9.506515-27.539216-8.848529-37.798884 1.38351l-89.692788 89.693812C630.34792 298.559816 626.830817 299.903417 623.31269 299.903417z" p-id="4285"></path><path d="M585.783958 957.923072 585.783958 957.923072c-7.305383 0-14.286378-2.902096-19.457144-8.05649-27.605731-27.607778-66.532299-66.840314-111.646799-112.331391C339.018785 720.931496 180.631452 561.249681 70.259692 453.778994c-5.27719-5.129834-8.271384-12.151761-8.311293-19.509333-0.054235-7.357572 2.846838-14.433734 8.05649-19.631106 105.72595-105.752556 264.180821-139.374304 403.715785-85.651752 14.165628 5.451152 21.227464 21.36254 15.776312 35.541471-5.451152 14.152325-21.36254 21.228487-35.541471 15.776312-110.505813-42.564421-234.96236-20.973684-324.535421 54.380538 109.136629 106.866936 255.57277 254.498298 364.30724 364.097462 34.938744 35.234479 66.156746 66.707284 91.266633 91.923596 72.922846-86.177731 95.748714-203.160049 59.293431-311.666322-4.835122-14.393825 2.914376-29.981848 17.308201-34.815947 14.380522-4.859681 29.981848 2.90005 34.830273 17.308201 46.094828 137.198755 11.156084 285.992593-91.198072 388.334469C600.070336 955.020976 593.075015 957.923072 585.783958 957.923072z" p-id="4286"></path><path d="M99.893616 941.164387c-7.102768 0-14.193257-2.738367-19.576871-8.190543-10.660804-10.822486-10.540054-28.222785 0.26913-38.883589l236.224096-232.902444c10.809183-10.67513 28.210505-10.541077 38.898939 0.268106 10.660804 10.822486 10.540054 28.224832-0.281409 38.885636L119.201357 933.243997C113.84435 938.533466 106.875634 941.164387 99.893616 941.164387z" p-id="4287"></path></svg><p>固定/取消固定</p></div><div class="windowTitle">插入CSS样式</div><br><br><br><br><br><br></div><div class="divContent clearfix" style="height: calc(100% - 50px);"></div><div class="size hover"><svg t="1661011012771" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6165" width="12" height="12"><path d="M341.333333 725.333333c-8.533333 0-25.6 0-34.133333-8.533333s-8.533333-25.6-8.533333-34.133333 0-25.6 8.533333-34.133334l341.333333-341.333333c17.066667-17.066667 42.666667-17.066667 59.733334 0 17.066667 8.533333 17.066667 25.6 17.066666 34.133333s0 25.6-8.533333 34.133334l-341.333333 341.333333c-8.533333 8.533333-25.6 8.533333-34.133334 8.533333z" p-id="6166" fill="#1296db"></path><path d="M597.333333 810.666667c-8.533333 0-25.6 0-34.133333-8.533334s-8.533333-25.6-8.533333-34.133333 0-25.6 8.533333-34.133333l170.666667-170.666667c17.066667-17.066667 42.666667-17.066667 59.733333 0 17.066667 8.533333 17.066667 25.6 17.066667 34.133333s0 25.6-8.533334 34.133334l-170.666666 170.666666c-8.533333 8.533333-25.6 8.533333-34.133334 8.533334z" p-id="6167" fill="#1296db"></path></svg></div><div class="size sizeAbs hover"><svg t="1661011012771" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6165" width="12" height="12"><path d="M341.333333 725.333333c-8.533333 0-25.6 0-34.133333-8.533333s-8.533333-25.6-8.533333-34.133333 0-25.6 8.533333-34.133334l341.333333-341.333333c17.066667-17.066667 42.666667-17.066667 59.733334 0 17.066667 8.533333 17.066667 25.6 17.066666 34.133333s0 25.6-8.533333 34.133334l-341.333333 341.333333c-8.533333 8.533333-25.6 8.533333-34.133334 8.533333z" p-id="6166" fill="#1296db"></path><path d="M597.333333 810.666667c-8.533333 0-25.6 0-34.133333-8.533334s-8.533333-25.6-8.533333-34.133333 0-25.6 8.533333-34.133333l170.666667-170.666667c17.066667-17.066667 42.666667-17.066667 59.733333 0 17.066667 8.533333 17.066667 25.6 17.066667 34.133333s0 25.6-8.533334 34.133334l-170.666666 170.666666c-8.533333 8.533333-25.6 8.533333-34.133334 8.533334z" p-id="6167" fill="#1296db"></path></svg></div></div>`;
                        //显示一个可拖动的界面，界面为一个
                        var text = nE('textarea', 0, 'styleInputArea float');
                        text.addEventListener('keydown', (e) => {
                            if (e.key == ';') { // 当按下;分号键时更新样式，自动应用
                                siteStyle.innerHTML = text.value;
                            }
                        });
                        var el = nE('div', 0, 'eleSty float');
                        el.innerHTML = '<div class="elePath">' + getPath(ele) + '</div>';
                        el.querySelector('.elePath')
                        var valsty = {};
                        var sty = window.getComputedStyle(ele);
                        var s = '';
                        for (i = 0; i < baseCSS.length; i++) {
                            var k = baseCSS[i];
                            s += `<p>${k}: ${sty[k]}</p>`;
                        }
                        el.innerHTML += s;
                        var button = nE('button', 0, 'styleSubmit');
                        button.innerText = 'Submit';
                        button.onclick = () => {
                            contentDIV[keyForContentDiv].css = text.value; // 但不自动保存
                            addCSS(text.value, head);
                            GM_setValue('contentDIV', contentDIV);
                        }
                        keyForContentDiv || (keyForContentDiv = href, contentDIV[keyForContentDiv] = {});
                        text.value = contentDIV[keyForContentDiv].css || '';
                        var Div = div.firstElementChild;
                        Div.style.cssText = `position:fixed;top:15%;left:20%;display:block`;
                        var content = Div.children[1];
                        content.append(text);
                        content.append(el);
                        content.append(button);
                        move(Div.firstChild, Div);
                        move(Div.lastChild, Div, 1);
                        move(Div.lastChild.previousSibling, Div, 1);
                        $('#trslDiv').append(Div);
                        //检测到;分号输入则更新样式

                    } else if (ele && !e.keyCode) { // 27是Esc键，支持通过按下返回退出
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
                                contentDIV[k] = { auto: auto, ele: v, };
                                GM_setValue('contentDIV', contentDIV);
                                fun.common.init();
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
                    btn.disabled = false;
                    if (e.keyCode === 27) { new dToast({ title: '退出选择 - 阅读模式', body: '您已退出选择阅读元素模式', inner: true, timeout: 5000, }); }
                }
            }
            docu.addEventListener('mouseover', over);
            docu.addEventListener('mouseout', out);
            docu.addEventListener('click', click);
            body.tabIndex = 0;
            body.focus(); // html以及部分元素添加keydown事件无效，添加keydown事件需要tabIndex参数，并聚焦
            body.addEventListener('keydown', click);
            btn.disabled = true;
        }
        cssEditor.onclick = function() {
            // 基本步骤：点击后进入元素选择模式，点击选中元素后，添加一个fixed框textarea显示元素的CSS信息，修改后检测到输入;后就加入这个样式
            // 使用selectarea的同一个函数获取点击选中的元素，然后
            selectEle(cssEditor, 1);
        };
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
            // new dToast({ title: '域名已知 - 阅读模式', body: 'Href：' + href, inner: true, timeout: 5000, });
            if (direct) { x.direct(); } else {
                x.init(); // 对象初始化
                readbtn.onclick = function() {
                    // read按钮每点一次就进入阅读模式或者退出
                    if (status) { x.exit() ? (bgc(readbtn, '') || (status = 0)) : (fun.common.exit()) } else {
                        x.read() ? (bgc(readbtn, 'yellow') || (status = 1) && new dToast({ title: '进入阅读模式', body: '再次点击即可切换正常模式', })) : (fun.common.read() && new dToast({ title: '进入阅读模式', body: '再次点击即可切换正常模式', }));
                    }
                }
            }
        } else {
            readbtn.onclick = function() {
                // read按钮每点一次就进入阅读模式或者退出
                if (status) { fun.common.exit() && (bgc(readbtn, '') || (status = 0)); } else {
                    fun.common.read() && (bgc(readbtn, 'yellow') || (status = 1, new dToast({ title: '进入阅读模式', body: '再次点击即可切换正常模式', })));
                }
            }
            if (contentDIV[href] && (contentDIV[href].auto || direct)) {
                direct ? 0 : (new dToast({ title: '进入阅读模式', body: '您此前设置了自动进入阅读模式', }));
                fun.common.read() && (bgc(readbtn, 'yellow') || (status = 1))
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
}

var info = {
    "from": "local",
    "result": "suee",
    "message": "",
    "quality": 16,
    "format": "mp4",
    "timelength": 884266,
    "accept_format": "flv_p60,flv,flv720,flv480,mp4",
    "accept_description": [
        "高清 1080P60",
        "高清 1080P",
        "高清 720P",
        "清晰 480P",
        "流畅 360P"
    ],
    "accept_quality": [
        116,
        80,
        64,
        32,
        16
    ],
    "video_codecid": 7,
    "seek_param": "start",
    "seek_type": "second",
    "dash": {
        "duration": 884,
        "minBufferTime": 1.5,
        "min_buffer_time": 1.5,
        "video": [{
                "id": 80,
                "baseUrl": "https://upos-sz-mirrorcos.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30080.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=77ec03d1e88fdaae27f5425d8b0bfbad&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=0,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=118226&logo=80000000",
                "base_url": "https://upos-sz-mirrorcos.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30080.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=77ec03d1e88fdaae27f5425d8b0bfbad&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=0,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=118226&logo=80000000",
                "backupUrl": [
                    "https://upos-sz-mirrorcos.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30080.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=77ec03d1e88fdaae27f5425d8b0bfbad&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=1,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=118226&logo=40000000",
                    "https://upos-sz-mirrorcosb.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30080.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=3577f21f85363e27da4b2db97a5e11c3&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=2,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=118226&logo=40000000"
                ],
                "backup_url": [
                    "https://upos-sz-mirrorcos.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30080.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=77ec03d1e88fdaae27f5425d8b0bfbad&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=1,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=118226&logo=40000000",
                    "https://upos-sz-mirrorcosb.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30080.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=3577f21f85363e27da4b2db97a5e11c3&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=2,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=118226&logo=40000000"
                ],
                "bandwidth": 945701,
                "mimeType": "video/mp4",
                "mime_type": "video/mp4",
                "codecs": "avc1.640032",
                "width": 1920,
                "height": 1080,
                "frameRate": "29.412",
                "frame_rate": "29.412",
                "sar": "1:1",
                "startWithSap": 1,
                "start_with_sap": 1,
                "SegmentBase": {
                    "Initialization": "0-996",
                    "indexRange": "997-3152"
                },
                "segment_base": {
                    "initialization": "0-996",
                    "index_range": "997-3152"
                },
                "codecid": 7
            },
            {
                "id": 80,
                "baseUrl": "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_x1-1-30077.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=7703c40a5573d15d0e4b3064a0b5f7f5&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=0,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=92382&logo=80000000",
                "base_url": "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_x1-1-30077.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=7703c40a5573d15d0e4b3064a0b5f7f5&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=0,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=92382&logo=80000000",
                "backupUrl": [
                    "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_x1-1-30077.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=7703c40a5573d15d0e4b3064a0b5f7f5&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=1,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=92382&logo=40000000",
                    "https://upos-sz-mirrorhwb.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_x1-1-30077.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=7ad9571930709c8fba9f10f0171c5eb8&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=2,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=92382&logo=40000000"
                ],
                "backup_url": [
                    "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_x1-1-30077.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=7703c40a5573d15d0e4b3064a0b5f7f5&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=1,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=92382&logo=40000000",
                    "https://upos-sz-mirrorhwb.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_x1-1-30077.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=7ad9571930709c8fba9f10f0171c5eb8&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=2,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=92382&logo=40000000"
                ],
                "bandwidth": 738981,
                "mimeType": "video/mp4",
                "mime_type": "video/mp4",
                "codecs": "hev1.1.6.L150.90",
                "width": 1920,
                "height": 1080,
                "frameRate": "30.303",
                "frame_rate": "30.303",
                "sar": "1:1",
                "startWithSap": 1,
                "start_with_sap": 1,
                "SegmentBase": {
                    "Initialization": "0-1060",
                    "indexRange": "1061-3216"
                },
                "segment_base": {
                    "initialization": "0-1060",
                    "index_range": "1061-3216"
                },
                "codecid": 12
            },
            {
                "id": 80,
                "baseUrl": "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665-1-100026.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=140d152914dedf01f3a70cf3f42390c4&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=0,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=88337&logo=80000000",
                "base_url": "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665-1-100026.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=140d152914dedf01f3a70cf3f42390c4&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=0,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=88337&logo=80000000",
                "backupUrl": [
                    "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665-1-100026.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=140d152914dedf01f3a70cf3f42390c4&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=1,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=88337&logo=40000000",
                    "https://upos-sz-mirrorhwb.bilivideo.com/upgcxcode/65/26/1027652665/1027652665-1-100026.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=fb5dc5ee716e599be2e71217f63d22af&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=2,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=88337&logo=40000000"
                ],
                "backup_url": [
                    "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665-1-100026.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=140d152914dedf01f3a70cf3f42390c4&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=1,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=88337&logo=40000000",
                    "https://upos-sz-mirrorhwb.bilivideo.com/upgcxcode/65/26/1027652665/1027652665-1-100026.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=fb5dc5ee716e599be2e71217f63d22af&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=2,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=88337&logo=40000000"
                ],
                "bandwidth": 704511,
                "mimeType": "video/mp4",
                "mime_type": "video/mp4",
                "codecs": "av01.0.08M.08.0.110.01.01.01.0",
                "width": 1920,
                "height": 1080,
                "frameRate": "30.019",
                "frame_rate": "30.019",
                "sar": "1:1",
                "startWithSap": 1,
                "start_with_sap": 1,
                "SegmentBase": {
                    "Initialization": "0-1022",
                    "indexRange": "1243-3398"
                },
                "segment_base": {
                    "initialization": "0-1022",
                    "index_range": "1243-3398"
                },
                "codecid": 13
            },
            {
                "id": 64,
                "baseUrl": "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30064.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=8705f8266e53a16d7e74d46e1622ba17&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=0,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=68853&logo=80000000",
                "base_url": "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30064.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=8705f8266e53a16d7e74d46e1622ba17&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=0,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=68853&logo=80000000",
                "backupUrl": [
                    "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30064.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=8705f8266e53a16d7e74d46e1622ba17&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=1,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=68853&logo=40000000",
                    "https://upos-sz-mirrorhwb.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30064.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=4c9df3c183f5b427f57ba6b7d44b4177&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=2,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=68853&logo=40000000"
                ],
                "backup_url": [
                    "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30064.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=8705f8266e53a16d7e74d46e1622ba17&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=1,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=68853&logo=40000000",
                    "https://upos-sz-mirrorhwb.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30064.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=4c9df3c183f5b427f57ba6b7d44b4177&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=2,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=68853&logo=40000000"
                ],
                "bandwidth": 550763,
                "mimeType": "video/mp4",
                "mime_type": "video/mp4",
                "codecs": "avc1.640028",
                "width": 1280,
                "height": 720,
                "frameRate": "29.412",
                "frame_rate": "29.412",
                "sar": "1:1",
                "startWithSap": 1,
                "start_with_sap": 1,
                "SegmentBase": {
                    "Initialization": "0-994",
                    "indexRange": "995-3150"
                },
                "segment_base": {
                    "initialization": "0-994",
                    "index_range": "995-3150"
                },
                "codecid": 7
            },
            {
                "id": 64,
                "baseUrl": "https://upos-sz-mirrorcos.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_x1-1-30066.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=ccdb850e9593a3060192494d812c2f5d&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=0,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=45776&logo=80000000",
                "base_url": "https://upos-sz-mirrorcos.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_x1-1-30066.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=ccdb850e9593a3060192494d812c2f5d&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=0,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=45776&logo=80000000",
                "backupUrl": [
                    "https://upos-sz-mirrorcos.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_x1-1-30066.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=ccdb850e9593a3060192494d812c2f5d&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=1,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=45776&logo=40000000",
                    "https://upos-sz-mirrorcosb.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_x1-1-30066.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=a4040c72ccf80db0e0b73d1cfbf59202&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=2,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=45776&logo=40000000"
                ],
                "backup_url": [
                    "https://upos-sz-mirrorcos.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_x1-1-30066.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=ccdb850e9593a3060192494d812c2f5d&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=1,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=45776&logo=40000000",
                    "https://upos-sz-mirrorcosb.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_x1-1-30066.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=a4040c72ccf80db0e0b73d1cfbf59202&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=2,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=45776&logo=40000000"
                ],
                "bandwidth": 366169,
                "mimeType": "video/mp4",
                "mime_type": "video/mp4",
                "codecs": "hev1.1.6.L120.90",
                "width": 1280,
                "height": 720,
                "frameRate": "30.303",
                "frame_rate": "30.303",
                "sar": "1:1",
                "startWithSap": 1,
                "start_with_sap": 1,
                "SegmentBase": {
                    "Initialization": "0-1060",
                    "indexRange": "1061-3216"
                },
                "segment_base": {
                    "initialization": "0-1060",
                    "index_range": "1061-3216"
                },
                "codecid": 12
            },
            {
                "id": 64,
                "baseUrl": "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665-1-100024.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=b6e770316cb6c09db4968fb2804ab59d&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=0,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=46124&logo=80000000",
                "base_url": "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665-1-100024.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=b6e770316cb6c09db4968fb2804ab59d&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=0,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=46124&logo=80000000",
                "backupUrl": [
                    "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665-1-100024.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=b6e770316cb6c09db4968fb2804ab59d&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=1,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=46124&logo=40000000",
                    "https://upos-sz-mirrorhwb.bilivideo.com/upgcxcode/65/26/1027652665/1027652665-1-100024.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=2e6d3323eeb061ac7ceaf72ffb43566c&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=2,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=46124&logo=40000000"
                ],
                "backup_url": [
                    "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665-1-100024.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=b6e770316cb6c09db4968fb2804ab59d&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=1,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=46124&logo=40000000",
                    "https://upos-sz-mirrorhwb.bilivideo.com/upgcxcode/65/26/1027652665/1027652665-1-100024.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=2e6d3323eeb061ac7ceaf72ffb43566c&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=2,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=46124&logo=40000000"
                ],
                "bandwidth": 366847,
                "mimeType": "video/mp4",
                "mime_type": "video/mp4",
                "codecs": "av01.0.08M.08.0.110.01.01.01.0",
                "width": 1280,
                "height": 720,
                "frameRate": "30.019",
                "frame_rate": "30.019",
                "sar": "1:1",
                "startWithSap": 1,
                "start_with_sap": 1,
                "SegmentBase": {
                    "Initialization": "0-1022",
                    "indexRange": "1243-3398"
                },
                "segment_base": {
                    "initialization": "0-1022",
                    "index_range": "1243-3398"
                },
                "codecid": 13
            },
            {
                "id": 32,
                "baseUrl": "https://upos-sz-mirrorcos.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30032.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=403a0882a5e5bd4a0aca1ab39a66d129&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=0,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=37442&logo=80000000",
                "base_url": "https://upos-sz-mirrorcos.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30032.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=403a0882a5e5bd4a0aca1ab39a66d129&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=0,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=37442&logo=80000000",
                "backupUrl": [
                    "https://upos-sz-mirrorcos.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30032.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=403a0882a5e5bd4a0aca1ab39a66d129&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=1,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=37442&logo=40000000",
                    "https://upos-sz-mirrorcosb.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30032.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=1dc7bd258c585f811d01371918948b05&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=2,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=37442&logo=40000000"
                ],
                "backup_url": [
                    "https://upos-sz-mirrorcos.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30032.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=403a0882a5e5bd4a0aca1ab39a66d129&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=1,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=37442&logo=40000000",
                    "https://upos-sz-mirrorcosb.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30032.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=1dc7bd258c585f811d01371918948b05&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=2,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=37442&logo=40000000"
                ],
                "bandwidth": 299509,
                "mimeType": "video/mp4",
                "mime_type": "video/mp4",
                "codecs": "avc1.64001F",
                "width": 852,
                "height": 480,
                "frameRate": "29.412",
                "frame_rate": "29.412",
                "sar": "640:639",
                "startWithSap": 1,
                "start_with_sap": 1,
                "SegmentBase": {
                    "Initialization": "0-999",
                    "indexRange": "1000-3155"
                },
                "segment_base": {
                    "initialization": "0-999",
                    "index_range": "1000-3155"
                },
                "codecid": 7
            },
            {
                "id": 32,
                "baseUrl": "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_x1-1-30033.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=faf4084dff7e65e485719bc771138c5c&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=0,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=31472&logo=80000000",
                "base_url": "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_x1-1-30033.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=faf4084dff7e65e485719bc771138c5c&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=0,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=31472&logo=80000000",
                "backupUrl": [
                    "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_x1-1-30033.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=faf4084dff7e65e485719bc771138c5c&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=1,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=31472&logo=40000000",
                    "https://upos-sz-mirrorhwb.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_x1-1-30033.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=684614308cd8b0a5a1befcfdda3c941e&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=2,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=31472&logo=40000000"
                ],
                "backup_url": [
                    "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_x1-1-30033.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=faf4084dff7e65e485719bc771138c5c&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=1,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=31472&logo=40000000",
                    "https://upos-sz-mirrorhwb.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_x1-1-30033.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=684614308cd8b0a5a1befcfdda3c941e&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=2,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=31472&logo=40000000"
                ],
                "bandwidth": 251753,
                "mimeType": "video/mp4",
                "mime_type": "video/mp4",
                "codecs": "hev1.1.6.L120.90",
                "width": 852,
                "height": 480,
                "frameRate": "30.303",
                "frame_rate": "30.303",
                "sar": "640:639",
                "startWithSap": 1,
                "start_with_sap": 1,
                "SegmentBase": {
                    "Initialization": "0-1064",
                    "indexRange": "1065-3220"
                },
                "segment_base": {
                    "initialization": "0-1064",
                    "index_range": "1065-3220"
                },
                "codecid": 12
            },
            {
                "id": 32,
                "baseUrl": "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665-1-100023.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=424854566df1a32df73e488822a31e2a&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=0,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=28730&logo=80000000",
                "base_url": "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665-1-100023.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=424854566df1a32df73e488822a31e2a&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=0,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=28730&logo=80000000",
                "backupUrl": [
                    "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665-1-100023.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=424854566df1a32df73e488822a31e2a&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=1,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=28730&logo=40000000",
                    "https://upos-sz-mirrorhwb.bilivideo.com/upgcxcode/65/26/1027652665/1027652665-1-100023.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=dd8dc0b920e023f6997fe3e15389e335&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=2,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=28730&logo=40000000"
                ],
                "backup_url": [
                    "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665-1-100023.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=424854566df1a32df73e488822a31e2a&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=1,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=28730&logo=40000000",
                    "https://upos-sz-mirrorhwb.bilivideo.com/upgcxcode/65/26/1027652665/1027652665-1-100023.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=dd8dc0b920e023f6997fe3e15389e335&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=2,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=28730&logo=40000000"
                ],
                "bandwidth": 227703,
                "mimeType": "video/mp4",
                "mime_type": "video/mp4",
                "codecs": "av01.0.08M.08.0.110.01.01.01.0",
                "width": 852,
                "height": 480,
                "frameRate": "30.019",
                "frame_rate": "30.019",
                "sar": "640:639",
                "startWithSap": 1,
                "start_with_sap": 1,
                "SegmentBase": {
                    "Initialization": "0-1022",
                    "indexRange": "1243-3398"
                },
                "segment_base": {
                    "initialization": "0-1022",
                    "index_range": "1243-3398"
                },
                "codecid": 13
            },
            {
                "id": 16,
                "baseUrl": "https://upos-sz-mirrorcos.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_x1-1-30011.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=c14c5f6c7524338836cd172ec46cf7f9&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=0,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=22554&logo=80000000",
                "base_url": "https://upos-sz-mirrorcos.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_x1-1-30011.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=c14c5f6c7524338836cd172ec46cf7f9&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=0,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=22554&logo=80000000",
                "backupUrl": [
                    "https://upos-sz-mirrorcos.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_x1-1-30011.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=c14c5f6c7524338836cd172ec46cf7f9&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=1,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=22554&logo=40000000",
                    "https://upos-sz-mirrorcosb.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_x1-1-30011.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=79cadb238bf488f27a0433abe0e7e196&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=2,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=22554&logo=40000000"
                ],
                "backup_url": [
                    "https://upos-sz-mirrorcos.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_x1-1-30011.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=c14c5f6c7524338836cd172ec46cf7f9&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=1,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=22554&logo=40000000",
                    "https://upos-sz-mirrorcosb.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_x1-1-30011.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=79cadb238bf488f27a0433abe0e7e196&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=2,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=22554&logo=40000000"
                ],
                "bandwidth": 180417,
                "mimeType": "video/mp4",
                "mime_type": "video/mp4",
                "codecs": "hev1.1.6.L120.90",
                "width": 640,
                "height": 360,
                "frameRate": "30.303",
                "frame_rate": "30.303",
                "sar": "1:1",
                "startWithSap": 1,
                "start_with_sap": 1,
                "SegmentBase": {
                    "Initialization": "0-1058",
                    "indexRange": "1059-3214"
                },
                "segment_base": {
                    "initialization": "0-1058",
                    "index_range": "1059-3214"
                },
                "codecid": 12
            },
            {
                "id": 16,
                "baseUrl": "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30016.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=d116cc118845934cb7b2ad410d0993a5&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=0,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=23037&logo=80000000",
                "base_url": "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30016.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=d116cc118845934cb7b2ad410d0993a5&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=0,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=23037&logo=80000000",
                "backupUrl": [
                    "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30016.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=d116cc118845934cb7b2ad410d0993a5&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=1,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=23037&logo=40000000",
                    "https://upos-sz-mirrorhwb.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30016.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=1d877ff48ac3627a97f3934596aef888&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=2,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=23037&logo=40000000"
                ],
                "backup_url": [
                    "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30016.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=d116cc118845934cb7b2ad410d0993a5&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=1,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=23037&logo=40000000",
                    "https://upos-sz-mirrorhwb.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30016.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=1d877ff48ac3627a97f3934596aef888&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=2,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=23037&logo=40000000"
                ],
                "bandwidth": 184281,
                "mimeType": "video/mp4",
                "mime_type": "video/mp4",
                "codecs": "avc1.64001E",
                "width": 640,
                "height": 360,
                "frameRate": "29.412",
                "frame_rate": "29.412",
                "sar": "1:1",
                "startWithSap": 1,
                "start_with_sap": 1,
                "SegmentBase": {
                    "Initialization": "0-1003",
                    "indexRange": "1004-3159"
                },
                "segment_base": {
                    "initialization": "0-1003",
                    "index_range": "1004-3159"
                },
                "codecid": 7
            },
            {
                "id": 16,
                "baseUrl": "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665-1-100022.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=7b1181f4d91e588456e71866798eae6c&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=0,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=23581&logo=80000000",
                "base_url": "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665-1-100022.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=7b1181f4d91e588456e71866798eae6c&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=0,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=23581&logo=80000000",
                "backupUrl": [
                    "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665-1-100022.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=7b1181f4d91e588456e71866798eae6c&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=1,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=23581&logo=40000000",
                    "https://upos-sz-mirrorhwb.bilivideo.com/upgcxcode/65/26/1027652665/1027652665-1-100022.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=7918b5d5556bd10e0e73cb02334678a1&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=2,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=23581&logo=40000000"
                ],
                "backup_url": [
                    "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665-1-100022.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=7b1181f4d91e588456e71866798eae6c&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=1,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=23581&logo=40000000",
                    "https://upos-sz-mirrorhwb.bilivideo.com/upgcxcode/65/26/1027652665/1027652665-1-100022.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=7918b5d5556bd10e0e73cb02334678a1&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=2,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=23581&logo=40000000"
                ],
                "bandwidth": 186518,
                "mimeType": "video/mp4",
                "mime_type": "video/mp4",
                "codecs": "av01.0.08M.08.0.110.01.01.01.0",
                "width": 640,
                "height": 360,
                "frameRate": "30.019",
                "frame_rate": "30.019",
                "sar": "1:1",
                "startWithSap": 1,
                "start_with_sap": 1,
                "SegmentBase": {
                    "Initialization": "0-1022",
                    "indexRange": "1243-3398"
                },
                "segment_base": {
                    "initialization": "0-1022",
                    "index_range": "1243-3398"
                },
                "codecid": 13
            }
        ],
        "audio": [{
                "id": 30280,
                "baseUrl": "https://upos-sz-mirrorcos.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30280.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=a2eaaef66117f8120aa702f99ac476d6&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=0,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=18145&logo=80000000",
                "base_url": "https://upos-sz-mirrorcos.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30280.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=a2eaaef66117f8120aa702f99ac476d6&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=0,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=18145&logo=80000000",
                "backupUrl": [
                    "https://upos-sz-mirrorcos.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30280.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=a2eaaef66117f8120aa702f99ac476d6&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=1,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=18145&logo=40000000",
                    "https://upos-sz-mirrorcosb.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30280.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=6ae765dcd3bb70afe72a601636202d21&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=2,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=18145&logo=40000000"
                ],
                "backup_url": [
                    "https://upos-sz-mirrorcos.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30280.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=a2eaaef66117f8120aa702f99ac476d6&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=1,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=18145&logo=40000000",
                    "https://upos-sz-mirrorcosb.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30280.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=6ae765dcd3bb70afe72a601636202d21&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=2,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=18145&logo=40000000"
                ],
                "bandwidth": 145131,
                "mimeType": "audio/mp4",
                "mime_type": "audio/mp4",
                "codecs": "mp4a.40.2",
                "width": 0,
                "height": 0,
                "frameRate": "",
                "frame_rate": "",
                "sar": "",
                "startWithSap": 0,
                "start_with_sap": 0,
                "SegmentBase": {
                    "Initialization": "0-933",
                    "indexRange": "934-3089"
                },
                "segment_base": {
                    "initialization": "0-933",
                    "index_range": "934-3089"
                },
                "codecid": 0
            },
            {
                "id": 30216,
                "baseUrl": "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30216.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=57bb8448fceaa9d58cb97f30eec1378f&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=0,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=4544&logo=80000000",
                "base_url": "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30216.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=57bb8448fceaa9d58cb97f30eec1378f&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=0,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=4544&logo=80000000",
                "backupUrl": [
                    "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30216.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=57bb8448fceaa9d58cb97f30eec1378f&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=1,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=4544&logo=40000000",
                    "https://upos-sz-mirrorhwb.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30216.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=42efb15dfbc454823c8b248c0f51ec0e&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=2,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=4544&logo=40000000"
                ],
                "backup_url": [
                    "https://upos-sz-mirrorhw.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30216.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=57bb8448fceaa9d58cb97f30eec1378f&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=1,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=4544&logo=40000000",
                    "https://upos-sz-mirrorhwb.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30216.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=hwbbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=42efb15dfbc454823c8b248c0f51ec0e&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=2,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=4544&logo=40000000"
                ],
                "bandwidth": 36342,
                "mimeType": "audio/mp4",
                "mime_type": "audio/mp4",
                "codecs": "mp4a.40.5",
                "width": 0,
                "height": 0,
                "frameRate": "",
                "frame_rate": "",
                "sar": "",
                "startWithSap": 0,
                "start_with_sap": 0,
                "SegmentBase": {
                    "Initialization": "0-943",
                    "indexRange": "944-3099"
                },
                "segment_base": {
                    "initialization": "0-943",
                    "index_range": "944-3099"
                },
                "codecid": 0
            },
            {
                "id": 30232,
                "baseUrl": "https://upos-sz-mirrorcos.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30232.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=0bd9bbf268259893e77c43bda2be596a&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=0,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=10393&logo=80000000",
                "base_url": "https://upos-sz-mirrorcos.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30232.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=0bd9bbf268259893e77c43bda2be596a&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=0,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=10393&logo=80000000",
                "backupUrl": [
                    "https://upos-sz-mirrorcos.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30232.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=0bd9bbf268259893e77c43bda2be596a&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=1,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=10393&logo=40000000",
                    "https://upos-sz-mirrorcosb.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30232.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=b87302799b2c33599f39aa642631c8ca&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=2,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=10393&logo=40000000"
                ],
                "backup_url": [
                    "https://upos-sz-mirrorcos.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30232.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=0bd9bbf268259893e77c43bda2be596a&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=1,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=10393&logo=40000000",
                    "https://upos-sz-mirrorcosb.bilivideo.com/upgcxcode/65/26/1027652665/1027652665_nb3-1-30232.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1678791213&gen=playurlv2&os=cosbbv&oi=0&trid=7269128b10ac4968aec4889ee995a877u&mid=678521080&platform=pc&upsig=b87302799b2c33599f39aa642631c8ca&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&orderid=2,3&buvid=3EFA8674-D020-D365-0F2F-096D53AA1BEF69051infoc&build=0&agrr=1&bw=10393&logo=40000000"
                ],
                "bandwidth": 83127,
                "mimeType": "audio/mp4",
                "mime_type": "audio/mp4",
                "codecs": "mp4a.40.2",
                "width": 0,
                "height": 0,
                "frameRate": "",
                "frame_rate": "",
                "sar": "",
                "startWithSap": 0,
                "start_with_sap": 0,
                "SegmentBase": {
                    "Initialization": "0-933",
                    "indexRange": "934-3089"
                },
                "segment_base": {
                    "initialization": "0-933",
                    "index_range": "934-3089"
                },
                "codecid": 0
            }
        ],
        "dolby": {
            "type": 0,
            "audio": null
        },
        "flac": null
    },
    "support_formats": [{
            "quality": 116,
            "format": "flv_p60",
            "new_description": "1080P 60帧",
            "display_desc": "1080P",
            "superscript": "60帧",
            "codecs": [
                "av01.0.09M.08.0.110.01.01.01.0",
                "avc1.640032",
                "hev1.1.6.L150.90"
            ]
        },
        {
            "quality": 80,
            "format": "flv",
            "new_description": "1080P 高清",
            "display_desc": "1080P",
            "superscript": "",
            "codecs": [
                "av01.0.08M.08.0.110.01.01.01.0",
                "avc1.640032",
                "hev1.1.6.L150.90"
            ]
        },
        {
            "quality": 64,
            "format": "flv720",
            "new_description": "720P 高清",
            "display_desc": "720P",
            "superscript": "",
            "codecs": [
                "av01.0.08M.08.0.110.01.01.01.0",
                "avc1.640028",
                "hev1.1.6.L120.90"
            ]
        },
        {
            "quality": 32,
            "format": "flv480",
            "new_description": "480P 清晰",
            "display_desc": "480P",
            "superscript": "",
            "codecs": [
                "av01.0.08M.08.0.110.01.01.01.0",
                "avc1.64001F",
                "hev1.1.6.L120.90"
            ]
        },
        {
            "quality": 16,
            "format": "mp4",
            "new_description": "360P 流畅",
            "display_desc": "360P",
            "superscript": "",
            "codecs": [
                "av01.0.08M.08.0.110.01.01.01.0",
                "avc1.64001E",
                "hev1.1.6.L120.90"
            ]
        }
    ],
    "high_format": null,
    "volume": {
        "measured_i": -18.7,
        "measured_lra": 7.1,
        "measured_tp": 0.2,
        "measured_threshold": -28.9,
        "target_offset": 0.4,
        "target_i": -14,
        "target_tp": -1
    },
    "last_play_time": 85000,
    "last_play_cid": 1027652665
};