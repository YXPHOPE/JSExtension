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

(function () {
    'use strict';
    function $(str, arr) {
        var ele = document.querySelectorAll(str);
        var div = document.createElement('div');
        if (ele.length == 0) { ele = [div] }
        if (/^\d+$/.test(arr)) { ele = ele[arr]; if (!ele) { ele = div } }
        else if (Array.isArray(arr)) {
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
        }
        else {
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
        document.body.oncontextmenu = function () {
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
            document.querySelector('#downloadbtn').onclick = function () {
                var name = $('#musicTitle', 0).innerHTML;
                var imglist = $('.img-responsive.DownMusicPNG');
                var type = url.match(/^\/Stave-/) ? '-五线谱-' : '-简谱-';
                var tip = document.createElement('div');
                tip.id = 'downtip';
                tip.style.cssText = 'position: fixed;background-color: rgba(200,220,255,0.3);height: 40px;top: 80px;left: 60px;font: 400 24px/40px microsoft-yahei;padding: 0 10px;color: yellowgreen;border-radius: 10px;';
                document.body.append(tip);
                imglist.forEach(function (img, i) {
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