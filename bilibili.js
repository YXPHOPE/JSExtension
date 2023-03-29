// ==UserScript==
// @name          哔哩哔哩
// @author        YXP
// @description   跳过bilibili视频末尾的充电鸣谢
// @version       0.1
// @icon         https://i0.hdslb.com/bfs/emote/f85c354995bd99e28fc76c869bfe42ba6438eff4.png
// @match        *://*bilibili.com/video*
// @include      /https?:\/\/www\.bilibili\.com\/video\/.*/
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @license      WTFPL
// ==/UserScript==
(function () {
    'use strict';
    var jumpButton = document.querySelector('.bilibili-player-electric-panel-jump');
    setInterval(() => {
        jumpButton = document.querySelector('.bilibili-player-electric-panel-jump');
        if (jumpButton && jumpButton.length > 0) {
            jumpButton.click();
        }
    }, 1000);

    function strtime(t) {
        var str = '', s = 0;
        if (t > 3600) {
            s = Math.floor(t / 3600);
            str += (s < 10 ? '0' : '') + s + ':';
            t %= 3600;
        }
        else { str += '00:' }
        if (t > 60) {
            s = Math.floor(t / 60);
            str += (s < 10 ? '0' : '') + s + ':';
            t %= 60;
        }
        else { str += '00:' }
        str += (t < 10 ? '0' : '') + Math.floor(t);
        return str;
    }

    function my$(s) {
        return document.querySelector(s);
    }
    var title = '';
    var btn = document.createElement('span');
    btn.innerHTML = `
        <div>
    <i style="display: inline-block;margin: 0 0 0 18px;"><svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1027" style="width: 26px;height: 26px;fill: currentColor;overflow: hidden;"><path d="M47.234 979.775v-210.45h102.303v70.151h724.874v-70.15h102.3v210.45H47.233zM149.54 359.948l242.595 0.175V44.451h242.6v309.827h242.6L517.821 734.253 149.539 359.948z" p-id="1028"></path></svg></i>
    <span>下载</span>
    </div>
    `;
    var board = null;
    setInterval(() => {
        if (title == document.title.split('_哔哩哔哩')[0]) { return; }
        title = document.title.split('_哔哩哔哩')[0];
        var info = unsafeWindow.window.__playinfo__.data;
        if (board) { board.remove(); }
        var duration = info.dash.duration;
        var quality = info.accept_description;
        console.log(quality);
        var video = info.dash.video;
        var audio = info.dash.audio;
        // console.log(video);
        var render = false;
        var bar = my$('#arc_toolbar_report>.ops') || my$('#arc_toolbar_report>.toolbar-left');
        var i = 0,
            j = 0;
        bar.appendChild(btn);
        var timeout;
        btn.onmouseenter = () => {
            clearTimeout(timeout);
            if (!render) {
                board = document.createElement('div');
                var html = '<div class="info">';
                html += '<div class="title" style="font-size: 18px;font-weight: bold;margin-right: 10px;max-width:500px;min-width:380px;line-height:20px;white-space:normal;margin-bottom:8px;">' + title + '</div>';
                html += '<div class="duration">时长：' + strtime(duration) + '<span style="float:right;margin-right:10px;"><button class="copy" style="height: 28px;line-height: 28px;padding:0 5px;cursor:pointer;">复制命令行指令</button></span></div></div><div class="table" style="overflow: auto;max-height: 250px;width: 100%;"><table><thead><tr><td style="width:210px;font-weight:500;">视频</td><td style="width:80px;font-weight:500;">音频</td></tr></thead><tbody><tr><td>';
                video.forEach((v, ind) => {
                    html += '<div class="item"><input class="video" id="ordervid' + ind + '" type="checkbox"' + (ind == 0 ? ' checked' : '') + '></input><label for="' + ind + 'ordervid" type="checkbox"> ' + v.width + 'x' + v.height + ' ' + parseInt(v.frameRate) + 'fps ' + parseInt(v.bandwidth / 1000) + 'kbps</label></div>';
                });
                html += '</td><td style="vertical-align: baseline;">';
                audio.forEach((a, ind) => {
                    html += '<div class="item"><input class="audio" id="orderaud' + ind + '" type="checkbox"' + (ind == 0 ? ' checked' : '') + '></input><label for="' + ind + 'ordervid" type="checkbox"> ' + parseInt(a.bandwidth / 1000) + 'kbps</label></div>';
                });
                html += '</td></tbody></table></div>';
                board.innerHTML = html;
                board.onclick = (e) => {
                    // 判断ori进行操作
                    var ori = e.originalTarget;
                    if (ori.className == 'copy') {
                        GM_setClipboard('bilibiliDownloader -a "' + audio[j].baseUrl + '" -v "' + video[i].baseUrl + '" -n "' + title + '"', 'text');
                    } else if (ori.classNaem == 'item') { ori = ori.children[0]; } else if (ori.tagName == 'LABEL') { ori = ori.previousElementSibling; }
                    if (ori.id.search('ordervid') != -1) {
                        my$('#ordervid' + i).checked = false;
                        i = parseInt(ori.id[ori.id.length - 1]);
                        ori.checked = true;
                    } else if (ori.id.search('orderaud') != -1) {
                        my$('#orderaud' + j).checked = false;
                        j = parseInt(ori.id[ori.id.length - 1]);
                        ori.checked = true;
                    }
                }
                board.style.cssText = 'cursor:auto; background: white;position: absolute;left: 0;bottom: 120%;z-index: 999;border: solid 2px #757575;border-radius: 4px;padding: 10px;color: black !important;box-shadow: 0 0 4px 1px #999;max-height:300px;display: flex;flex-direction: column;';
                board.className = 'board';
                board.style.display = 'none';
                btn.append(board);
            }
            board.style.display = 'flex';
            render = true;
        };
        btn.onmouseleave = () => {
            timeout = setTimeout(() => { if (board) board.style.display = 'none'; }, 600);
        }
    }, 5000);
})();