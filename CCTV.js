// ==UserScript==
// @name         CCTV
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  提供央视网视频下载功能
// @author       You
// @match        *://*.cctv.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';
    setTimeout(() => {
        let guid = unsafeWindow.window.guid
        if (!guid) { return; }
        console.log('guid=', guid);
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://vdn.apps.cntv.cn/api/getHttpVideoInfo.do?pid=" + guid,
            headers: {
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "Accept-Language": "en-US,en;q=0.5",
                "Accept-Encoding": "gzip, deflate, br",
                "Origin": "https://tv.cctv.com",
                "Connection": "keep-alive",
                "Referer": "https://tv.cctv.com/",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "cross-site"
            },
            responseType: "json", // 设置返回值类型可以自动解析
            onload: function (response) {
                if (response.status !== 200) {
                    console.log("https://vdn.apps.cntv.cn/api/getHttpVideoInfo.do?pid=" + guid, "访问错误：", response.status);
                    return;
                }
                if (response.response.status !== "001") {
                    console.log("服务器拒绝：", response.response);
                    return;
                }
                let res = response.response;
                console.log(res);
                let name = res.title;
                let url = res.hls_url;
                // "https:br=2048" --workDir "D:\Download\Video" --saveName "会跳舞的笔" --maxThreads "24" --minThreads "8" --retryCount "20" --timeOut "3" --enableMuxFastStart
                let button = document.createElement('button');
                button.style.cssText = `position:fixed;left:0;top:40%;width:30px;height:30px;cursor:pointer;z-index:9999999;border-radius:4px;`;
                button.innerHTML = `<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3662" width="20" height="20"><path d="M828.975746 894.125047 190.189132 894.125047c-70.550823 0-127.753639-57.18542-127.753639-127.752616L62.435493 606.674243c0-17.634636 14.308891-31.933293 31.93227-31.933293l63.889099 0c17.634636 0 31.93227 14.298658 31.93227 31.933293l0 95.821369c0 35.282574 28.596292 63.877843 63.87682 63.877843L765.098927 766.373455c35.281551 0 63.87682-28.595268 63.87682-63.877843l0-95.821369c0-17.634636 14.298658-31.933293 31.943526-31.933293l63.877843 0c17.634636 0 31.933293 14.298658 31.933293 31.933293l0 159.699212C956.729385 836.939627 899.538849 894.125047 828.975746 894.125047L828.975746 894.125047zM249.938957 267.509636c12.921287-12.919241 33.884738-12.919241 46.807049 0l148.97087 148.971893L445.716876 94.89323c0-17.634636 14.300704-31.94762 31.933293-31.94762l63.875796 0c17.637706 0 31.945573 14.312984 31.945573 31.94762l0 321.588299 148.97087-148.971893c12.921287-12.919241 33.875528-12.919241 46.796816 0l46.814212 46.818305c12.921287 12.922311 12.921287 33.874505 0 46.807049L552.261471 624.930025c-1.140986 1.137916-21.664416 13.68365-42.315758 13.69286-20.87647 0.010233-41.878806-12.541641-43.020816-13.69286L203.121676 361.13499c-12.922311-12.933567-12.922311-33.884738 0-46.807049L249.938957 267.509636 249.938957 267.509636z" fill="#272636" p-id="3663"></path></svg>`;
                document.documentElement.appendChild(button);
                button.onclick = () => {
                    GM_setClipboard(`N_m3u8DL-CLI_v3.0.2 "${url}" --workDir "D:\\Download\\Video" --saveName "${name}" --maxThreads "24" --minThreads "8" --retryCount "20" --timeOut "3" --enableMuxFastStart`);
                }
            }
        });
    }, 2000);
    // Your code here...
})();