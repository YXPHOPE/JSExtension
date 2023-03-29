// ==UserScript==
// @name         百词斩单词对战实时翻译
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  利用金山词霸获取单词的意思，然后与答案比对，选出最佳答案
// @author       YXP
// @match        https://pk.baicizhan.com/pages/challenge/*
// @icon         data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iMCAwIDQwIDQwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0MCA0MDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgoJPHJlY3QgeD0iMCIgc3R5bGU9ImZpbGw6IzAwM0JENDsiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIvPgoJPHJlY3QgeD0iOCIgeT0iNy4xIiBzdHlsZT0iZmlsbDojRkRGREZGOyIgd2lkdGg9IjMuNCIgaGVpZ2h0PSIyNi4zIi8+Cgk8cmVjdCB4PSIxMi42IiB5PSI3LjEiIHN0eWxlPSJmaWxsOiNGREZERkY7IiB3aWR0aD0iOS4xIiBoZWlnaHQ9IjI2LjMiLz4KCTxyZWN0IHg9IjIzLjIiIHk9IjcuMSIgc3R5bGU9ImZpbGw6I0ZERkRGRjsiIHdpZHRoPSI5LjEiIGhlaWdodD0iMjYuMyIvPgoJPHJlY3QgeD0iMTYuMiIgeT0iOS45IiBzdHlsZT0iZmlsbDojRkRGREZGOyIgd2lkdGg9IjEuNyIgaGVpZ2h0PSIyMS4xIi8+CgkJPHJlY3QgeD0iNC41IiB5PSIyMCIgdHJhbnNmb3JtPSJtYXRyaXgoMC45OTI0IC0wLjEyMzQgMC4xMjM0IDAuOTkyNCAtMi4zOTk0IDIuNTkwNSkiIHN0eWxlPSJmaWxsOiMwMDNCRDQ7IiB3aWR0aD0iMzAuNSIgaGVpZ2h0PSIxLjQiLz4KCQk8cmVjdCB4PSI1LjUiIHk9IjE5LjYiIHRyYW5zZm9ybT0ibWF0cml4KC0xLjgzNjk3MGUtMTYgMSAtMSAtMS44MzY5NzBlLTE2IDM3LjU0NzYgMy4xNTQ4KSIgc3R5bGU9ImZpbGw6IzAwM0JENDsiIHdpZHRoPSIyMy40IiBoZWlnaHQ9IjEuNCIvPgoJCTxyZWN0IHg9IjE2LjEiIHk9IjE5LjgiIHRyYW5zZm9ybT0ibWF0cml4KC0xLjgzNjk3MGUtMTYgMSAtMSAtMS44MzY5NzBlLTE2IDQ4LjMwOTUgLTcuMzIxNCkiIHN0eWxlPSJmaWxsOiMwMDNCRDQ7IiB3aWR0aD0iMjMuNCIgaGVpZ2h0PSIxLjQiLz4KPC9zdmc+
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==
// @createdDate  2022-12-2
/*
v1.0 主体功能：利用金山词霸接口查词，显示意思
v1.1 对选项进行indexOf匹配
v1.2 优化匹配机制：按 "; "分开词义进行匹配
v1.3 优化匹配：如果没有查到匹配项，则逐字匹配，匹配数最多的为正确答案
v1.4 修复了close-up等词只选取close的bug
v1.5 添加播放单词声音的功能，使用new Audio 需要配合block网页的bgm使用，否则不易听清
v2.0 添加错误单词收集
待改进：地 实际为 地理意义时，不是adv标志时的匹配
*/
(function () {
    'use strict';
    // 如果此js不可用了，可能是百词斩对网页进行了重构，造成class类名的随机项改变，使得现在的获取元素无效
    // 参数列表
    var myauto = 0; // 是否自动做题（无法应付验证码，验证码应该在连胜场次过多或者选择时间过快时出现）
    var trsl = 1; // 是否自动显示翻译，默认开启，且开启自动做题默认开启显示翻译
    var auto = { // 自动做题自动点击的动作
        start: true,
        back: true,
        select: true,
        quick: 0,
    };
    var itv = { // 自动点击的等待间隔
        start: 1000,
        back: 5000,
        select: 2500, // 已无效（目的必赢，敌方分数越低时我方等待时间越长）选择的间隔时间 800 + random(select);判断分数，当得分低于对方100分时，直接选择，低于50,1000ms选择，其他才使用当前随机数
        prn: 1000, // 播放读音的时间
    };
    var span = 50; //所有动作尝试间隔
    const jscburl = 'https://dict-mobile.iciba.com/interface/index.php?c=word&list=100,24,8,21,22,10,12,13,9,15,2,5,14,4,6,7&client=1&timestamp=1660571931&sign=cc4677186dac0e85&uuid=fcf712001d8b4f049c6e7096c2b43763&sv=android11&v=8.5.2&uid=';
    const bczurl = 'https://7n.bczcdn.com/r/';
    var captcha = 0;
    var word = '';
    var lastAns;
    var lastRival = '';
    var clk = {
        select: 0,
        start: 0,
        back: 0,
    }
    var bczWord = GM_getValue('bczWord', {});
    console.log(bczWord);

    function nE(e, id, cla, html) {
        var ele = document.createElement(e);
        id && (ele.id = id);
        cla && (ele.className = cla);
        html && (ele.innerHTML = html);
        return ele;
    }
    var sty = nE('style');
    sty.innerHTML = `
#result_result_plane_background_28qQY {display:none !important}
.bczbtn {
	position: fixed;
	right: 0;
	background-color: rgba(255,255,255,0.5);
	padding: 0 4px;
	border-radius: 2px;
    cursor:pointer;
    z-index:9999;
    font-size:20px;
}
#bczauto {
top: 0;
padding: 0 6px;
font-weight: bold;
}
#bczauto:after{content:"√";}
#bcztrsl {
    top:32px;
    background-color:yellow;
}
#bcztrsl:after {content:"中"}
#bczquick:after {content:"立"}
#bczquick {
    top:64px;
}
.bczbtn>p {
display:none;
position: absolute;
right: 32px;
margin: 0;
font-weight: normal;
border: 1px solid black;
padding: 0 3px;
background: white;
cursor: default;
width:max-content;
}
.bczbtn:hover p {display:block}
#bczlog {top:96px;z-index:99999999;}
#bczlog:after {content:"志"}
#logbody {
	position: fixed;
	top: 100%;
	left: 0;
	z-index: 999;
	height: 100%;
	width: 96%;
	background: white;
	opacity: 0.8;
	transition: top 0.6s;
	border: solid 1px gray;
	margin: 2%;
	border-radius: 8px;
	box-shadow: 1px 1px 1px 4px rgba(50,50,50,0.1);
    overflow:scroll;
}
#logbody.logbody-show {display:block;top:0;}
.filter-blur {filter:blur(8px) !important;}
#logbody .wordmean {padding:2px 10px; }
#logbody .wordmean span {padding:2px 4px;}
#logbody .vs {text-align:center;}
.challenge_puzzle_title_29GOt>p {
	font: 400 16px/20px sans-serif;
	width: 80%;
	white-space: normal;
	margin: 0 auto;
}
`;
    document.head.append(sty);
    var bczauto = nE('div', 'bczauto', 'bczbtn', '<p>自动答题</p>');
    var bcztrsl = nE('div', 'bcztrsl', 'bczbtn', '<p>显示翻译</p>');
    var bczquick = nE('div', 'bczquick', 'bczbtn', '<p>立即选择</p>');
    var bczlog = nE('div', 'bczlog', 'bczbtn', '<p>日志</p>');
    var logbody = nE('div', 'logbody');
    var docu = document.documentElement;
    docu.append(bczauto);
    docu.append(bcztrsl);
    docu.append(bczquick);
    docu.append(bczlog);
    docu.append(logbody);
    var color = ['rgba(255,255,255,0.5)', 'yellow'];
    bczauto.onclick = () => {
        myauto = myauto === 0 ? 1 : 0;
        myauto && (lastAns = undefined, word = '', trsl = 1, bcztrsl.style.backgroundColor = color[1]);
        console.log('myauto=', myauto);
        bczauto.style.backgroundColor = color[myauto];
    }
    bcztrsl.onclick = () => {
        trsl = trsl === 0 ? 1 : 0;
        trsl || (word = '', myauto = 0, bczauto.style.backgroundColor = color[0]);
        console.log('trsl=', trsl);
        bcztrsl.style.backgroundColor = color[trsl];
    }
    bczquick.onclick = () => {
        auto.quick = auto.quick ? 0 : 1;
        bczquick.style.backgroundColor = color[auto.quick];
    }
    bczlog.onclick = () => {
        logbody.className = logbody.className ? '' : 'logbody-show';
        setTimeout(() => { document.body.className = document.body.className ? '' : 'filter-blur'; }, logbody.className ? 500 : 100);
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
    // 想在手机上尝试，但由于没有tampermonkey只能写内置的请求，这个请求受百词斩same-cross-origin影响，无法发送请求
    function ajax(obj) {
        var XHR = XMLHttpRequest;
        XHR = new XMLHttpRequest();
        XHR.open(obj.method, obj.url,);
        var i;
        for (i in obj.headers) {
            XHR.setRequestHeader(i, obj.headers[i]);
        }
        var dat = null;
        if (obj.data) {
            if (typeof (obj.data) === 'object' && !Array.isArray(obj.data)) {
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
    var interval = setInterval(() => {
        // 每隔 span 重复此函数
        // 弹出验证码则什么也不做
        if ($('.captcha-mask')) {
            if (captcha === 0) {
                var mp3 = bczurl + 'stop.mp3';
                var player = new Audio(mp3);
                player.play();
            }
            captcha = 1;
            return
        }
        else { captcha = 0; }
        if (myauto) {
            if (lastAns && auto.select && !clk.select && lastAns.innerHTML.length < 150) {
                clk.select = 1;
                if (auto.quick) {
                    lastAns && lastAns.click();
                    setTimeout(() => { clk.select = 0 }, 800);
                }
                else {
                    var i = itv.select,
                        b = 1500;
                    try {
                        var myscore = $('.challenge_challenge_from_left_1dkgI>.challenge_challenge_score_value_mVT8O').innerText;
                        var tascore = $('.challenge_challenge_from_right_3pWNE>.challenge_challenge_score_value_mVT8O').innerText;
                        var t = myscore - tascore;
                        // 总等待时间等于固定时间b+随机时间random(i)
                        i = t < 20 ? 100 : t < 50 ? 1000 : t < 100 ? 2000 : 3000;
                        b = t > 0 ? t * 12 : 0;
                    } catch (e) { }
                    i = b + Math.round(Math.random() * i);
                    // i > 500 && console.log(t, i);
                    setTimeout(() => {
                        clk.select = 0;
                        lastAns && lastAns.click();
                    }, i)
                }
            }
            // 获取元素
            if (!clk.back) {
                var back = $("#result_result_action_2xKB4>div");
                if (back) {
                    // 对局信息
                    clk.back = 1;
                    var s = $('#result_result_score_3u7sc', 0).innerText.split('\n');
                    var mys = parseInt(s[1]);
                    var tas = parseInt(s[3]);
                    var info = s[0] + ' ' + s[1] + '  VS  ' + s[2] + ' ' + s[3];
                    console.log(`%c${info}`, "color: red; font-size: 16px");
                    logbody.innerHTML += mys < tas || mys > 1420 || tas > 1440 || mys < 1200 ? `<p class="vs" style="color: red; font-size: 16px">${info}</p>` : `<p class="vs" style="color: blueviolet; font-size: 14px">${info}</p>`;
                    // 自动保存答错的单词
                    var all = $('#result_plane_result_plane_CTsTe').children;
                    for (var i = 0; i < all.length; i++) {
                        var h = all[i].innerHTML;
                        if (h.indexOf('wrong.png"><div>') > 0) {
                            var s = all[i].innerText;
                            var ind = s.indexOf(' ');
                            var p = s.slice(0, ind);
                            bczWord[p] || (bczWord[p] = s.slice(ind + 1), console.log(p, ':', bczWord[p]));
                            GM_setValue('bczWord', bczWord);
                        }
                    }
                    // 点击返回
                    auto.back && (setTimeout(() => {
                        clk.back = 0;
                        myauto && back.click();
                    }, itv.back));
                }
            }
            if (!clk.start) {
                var start = $('#qualifying_qualifying_body_content_button_1vLM9');
                if (start && auto.start) {
                    clk.start = 1;
                    setTimeout(() => {
                        clk.start = 0;
                        myauto && start.click();
                    }, itv.start)
                }
            }
        }
        var rival = $('#match_match_vs_right_33YDh', 0);
        if (rival) {
            rival = rival.children[1].innerText;
            rival !== "???" && rival !== lastRival && (lastRival = rival, console.log('rival=', rival));
        }
        var puzzle = $('div.challenge_puzzle_title_29GOt', 0);
        var opt = $('.challenge_challenge_option_2sJI-', 1);
        if (!(puzzle && opt)) { return 0 } // 如果没有则跳过
        var cur = puzzle.innerText;
        cur = cur.replace(/[^a-zA-Z]*([a-zA-Z\-]+)[\n\u0000-\uffff]*$/, '$1');
        if (!cur || cur == word) { return 0 } // 如果还是上一个词或为空则跳过
        word = cur;
        lastAns = undefined;
        try {
            var mp3 = bczurl + cur + '.mp3';
            var player = new Audio(mp3);
            setTimeout(() => { player.play(); }, itv.prn);
        } catch { }
        // 如果未启用自动翻译则退出
        if (!trsl) { return }
        // 第一层保障，如果查找到是以前错过的单词，则使用之
        if (bczWord[cur]) {
            console.log("%c" + cur, "color:blue;font-weight:bold", " find in bczWord", bczWord[cur]);
            opt.forEach((v) => { v.style.backgroundColor = 'rgba(255,255,255,0.8)'; if (v.innerText === bczWord[cur]) { lastAns = v; v.style.backgroundColor = '#aaf'; } });
            return;
        }
        // 通过金山词霸接口查词
        GM_xmlhttpRequest({
            method: "post",
            url: jscburl,
            data: "word=" + cur,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "Apache-HttpClient/UNAVAILABLE (java 1.4)",
            },
            onabort: function (abort) {
                console.log('aborted:', abort)
            },
            timeout: 5000,
            onerror: function (e) { console.log('error:', e) },
            ontimeout: function (o) { console.log('timeout:', o) },
            onload: function (dat) {
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
                        partsEle = '<p>'
                        parts.forEach(function (v) {
                            v.means.forEach(function (s, i) { partsEle += s + ',' });
                            partsEle += ('  ');
                        })
                        partsEle += '</p>';
                    }
                    var meaning = partsEle.slice(3, -7);
                    console.log("%c" + cur, "color:blue;", meaning);
                    logbody.innerHTML += `<p class="wordmean"><span style="color:blue;">${cur}</span>${meaning}</p>`;
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
                        opt.forEach((v) => {
                            var str1 = v.innerText + ','; // 适配"地,"
                            var sameNum = 0;
                            for (let i = 0; i < str1.length; i++) {
                                var tmp = str1[i];
                                if (tmp != ',' && tmp != ' ' && tmp != '的' && !(tmp == '地' && str1[i + 1] == ',')) {
                                    meaning.indexOf(tmp) >= 0 && sameNum++;
                                }
                            }
                            if (max < sameNum) {
                                max = sameNum;
                                right[0] = v
                            }
                        });
                        right.length > 1 && (opt.forEach((v) => { v.style.backgroundColor = 'rgba(255,255,255,0.8)'; }));
                        console.log('复查   max=', max, `\noption:\n${optText}`);
                        right[0] && (console.log('ans:', right[0].innerText), right[0].style.backgroundColor = '#aaf');
                    }
                    // 还是没找出答案：(通过选项的中文意思逆向查英文单词，结果不是很能行)
                    if (right.length == 0) {
                        opt.forEach((v) => {
                            var s = v.innerText;
                            s.split(', ').forEach((d) => {
                                GM_xmlhttpRequest({
                                    method: "post",
                                    url: jscburl,
                                    data: "word=" + d,
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
                                        console.log(d, '--', res);
                                        if (res.indexOf(cur) >= 0) {
                                            console.log(v.innerText);
                                            v.style.backgroundColor = 'rgba(255,255,255,0.8)';
                                            lastAns = right[0] = v;
                                        }
                                    }
                                });
                            });
                        });
                    }
                    right[0] ? (lastAns = right[0]) : console.log("%c" + cur, "color:red; ");
                    right.length == 0 && (lastAns = undefined);
                } else { console.log('not a english word:', baesInfo.word_name) }
            }
        });
    }, span)
})();