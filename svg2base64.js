// ==UserScript==
// @name         SVG2Base64
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  svg to base64
// @author       You
// @match        https://www.iconfont.cn/*
// @icon         data:image/svg+xml;base64,PHN2ZyB0PSIxNjc5MTExNTMzMDg5IiBjbGFzcz0iaWNvbiIgc3R5bGU9IndpZHRoOiAxZW07aGVpZ2h0OiAxZW07dmVydGljYWwtYWxpZ246IG1pZGRsZTtmaWxsOiBjdXJyZW50Q29sb3I7b3ZlcmZsb3c6IGhpZGRlbjsiIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBwLWlkPSIxNjUwIj48cGF0aCBkPSJNMTkyIDM4NGg2NDBhNDIuNjY2NjY3IDQyLjY2NjY2NyAwIDAgMSA0Mi42NjY2NjcgNDIuNjY2NjY3djM2Mi42NjY2NjZhNDIuNjY2NjY3IDQyLjY2NjY2NyAwIDAgMS00Mi42NjY2NjcgNDIuNjY2NjY3SDE5MnYxMDYuNjY2NjY3YTIxLjMzMzMzMyAyMS4zMzMzMzMgMCAwIDAgMjEuMzMzMzMzIDIxLjMzMzMzM2g3MjUuMzMzMzM0YTIxLjMzMzMzMyAyMS4zMzMzMzMgMCAwIDAgMjEuMzMzMzMzLTIxLjMzMzMzM1YzMDguODIxMzMzTDk0OS45MDkzMzMgMjk4LjY2NjY2N2gtMTI2LjUyOEE5OC4wNDggOTguMDQ4IDAgMCAxIDcyNS4zMzMzMzMgMjAwLjYxODY2N1Y3Mi42NjEzMzNMNzE2LjcxNDY2NyA2NEgyMTMuMzMzMzMzYTIxLjMzMzMzMyAyMS4zMzMzMzMgMCAwIDAtMjEuMzMzMzMzIDIxLjMzMzMzM3YyOTguNjY2NjY3ek0xMjggODMySDQyLjY2NjY2N2E0Mi42NjY2NjcgNDIuNjY2NjY3IDAgMCAxLTQyLjY2NjY2Ny00Mi42NjY2NjdWNDI2LjY2NjY2N2E0Mi42NjY2NjcgNDIuNjY2NjY3IDAgMCAxIDQyLjY2NjY2Ny00Mi42NjY2NjdoODUuMzMzMzMzVjg1LjMzMzMzM2E4NS4zMzMzMzMgODUuMzMzMzMzIDAgMCAxIDg1LjMzMzMzMy04NS4zMzMzMzNoNTMwLjAyNjY2N0wxMDI0IDI4Mi40NTMzMzNWOTM4LjY2NjY2N2E4NS4zMzMzMzMgODUuMzMzMzMzIDAgMCAxLTg1LjMzMzMzMyA4NS4zMzMzMzNIMjEzLjMzMzMzM2E4NS4zMzMzMzMgODUuMzMzMzMzIDAgMCAxLTg1LjMzMzMzMy04NS4zMzMzMzN2LTEwNi42NjY2Njd6IG02MS4zNzYtMzY0Ljg4NTMzM2MtMjcuNDM0NjY3IDAtNDkuODk4NjY3IDYuNTI4LTY3LjcxMiAxOS45NjgtMTkuMjIxMzMzIDEzLjgyNC0yOC41MDEzMzMgMzMuMDI0LTI4LjUwMTMzMyA1Ny4yMTZzOS42MjEzMzMgNDIuNjI0IDI5LjIyNjY2NiA1NS4yOTZjNy40NjY2NjcgNC42MDggMjcuMDkzMzMzIDEyLjI4OCA1OC40MzIgMjMuMDQgMjguMTM4NjY3IDkuMjE2IDQ0LjUyMjY2NyAxNS4zNiA0OS41MTQ2NjcgMTguMDQ4IDE1LjY4IDguNDQ4IDIzLjg3MiAxOS45NjggMjMuODcyIDM0LjU2IDAgMTEuNTItNS42OTYgMjAuMzUyLTE2LjM4NCAyNy4yNjQtMTAuNjg4IDYuNTI4LTI1LjY2NCA5Ljk4NC00NC4xODEzMzMgOS45ODQtMjEuMDEzMzMzIDAtMzYuMzUyLTQuMjI0LTQ2LjMxNDY2Ny0xMS45MDQtMTEuMDUwNjY3LTguODMyLTE3LjgxMzMzMy0yMy44MDgtMjAuNjcyLTQ0LjU0NEg4NS4zMzMzMzNjMS43OTIgMzQuOTQ0IDEzLjU0NjY2NyA2MC4yODggMzQuOTIyNjY3IDc2LjQxNiAxNy40NTA2NjcgMTMuMDU2IDQyLjAyNjY2NyAxOS41ODQgNzMuMzg2NjY3IDE5LjU4NCAzMi40MjY2NjcgMCA1Ny43MDY2NjctNy4yOTYgNzUuNTItMjEuMTIgMTcuODEzMzMzLTE0LjIwOCAyNi43MzA2NjctMzMuNzkyIDI2LjczMDY2Ni01OC4zNjggMC0yNS4zNDQtMTEuMDUwNjY3LTQ0LjkyOC0zMy4xMzA2NjYtNTkuMTM2LTkuOTg0LTYuMTQ0LTMyLjA2NC0xNS4zNi02Ni42MjQtMjYuODgtMjMuNTA5MzMzLTguMDY0LTM4LjEyMjY2Ny0xMy44MjQtNDMuNDc3MzM0LTE2Ljg5Ni0xMi4wOTYtNi45MTItMTcuODEzMzMzLTE2LjUxMi0xNy44MTMzMzMtMjguMDMyIDAtMTMuMDU2IDQuOTkyLTIyLjY1NiAxNS42OC0yOC40MTYgOC41NTQ2NjctNC45OTIgMjAuNjcyLTcuMjk2IDM2LjY5MzMzMy03LjI5NiAxOC41Mzg2NjcgMCAzMi43ODkzMzMgMy40NTYgNDIuMDQ4IDExLjEzNiA5LjI1ODY2NyA3LjI5NiAxNi4wMjEzMzMgMTkuNTg0IDE5LjU4NCAzNi40OGg0MS4zNDRjLTIuNDk2LTI5Ljk1Mi0xMi44MjEzMzMtNTIuMjI0LTMwLjY1Ni02Ni40MzItMTYuNzI1MzMzLTEzLjQ0LTQwLjI1Ni0xOS45NjgtNzAuMTg2NjY2LTE5Ljk2OHogbTExOC45NzYgNS4zNzZMMzk4Ljg0OCA3NDYuNjY2NjY3aDUwLjI0bDkwLjQ5Ni0yNzQuMTc2aC00NS4yMjY2NjdsLTY5Ljg0NTMzMyAyMjMuNDg4aC0xLjA2NjY2N2wtNjkuODQ1MzMzLTIyMy40ODhoLTQ1LjIyNjY2N3ogbTM2OC40MDUzMzMtNS4zNzZjLTM3Ljc2IDAtNjcuNjkwNjY3IDEzLjgyNC04OS43OTIgNDIuMjQtMjEuMDEzMzMzIDI2LjQ5Ni0zMS4zNiA2MC4yODgtMzEuMzYgMTAxLjM3NiAwIDQwLjcwNCAxMC4zNDY2NjcgNzQuMTEyIDMxLjM2IDk5Ljg0IDIyLjQ0MjY2NyAyNy42NDggNTMuODAyNjY3IDQxLjQ3MiA5NC40MjEzMzQgNDEuNDcyIDIyLjgwNTMzMyAwIDQzLjA5MzMzMy0zLjA3MiA2MS42MzItOS4yMTZBMTQzLjgyOTMzMyAxNDMuODI5MzMzIDAgMCAwIDc4OS4zMzMzMzMgNzE2LjcxNDY2N1Y2MDAuNzQ2NjY3aC0xMDkuMDEzMzMzdjM4LjRoNjcuMzI4djU2LjQ0OGMtOC41MzMzMzMgNS4zNzYtMTcuNDUwNjY3IDkuNi0yNy40MzQ2NjcgMTIuNjcyYTEyMy4yODUzMzMgMTIzLjI4NTMzMyAwIDAgMS0zNC4xOTczMzMgNC42MDhjLTMwLjk5NzMzMyAwLTUzLjgwMjY2Ny05LjIxNi02OC40MTYtMjcuNjQ4LTEzLjUyNTMzMy0xNy4yOC0yMC4zMDkzMzMtNDIuMjQtMjAuMzA5MzMzLTc0LjQ5NiAwLTMzLjc5MiA3LjQ4OC01OS41MiAyMi44MjY2NjYtNzcuOTUyIDEzLjg2NjY2Ny0xNy42NjQgMzIuNzY4LTI2LjExMiA1Ni42NC0yNi4xMTIgMTkuMjIxMzMzIDAgMzQuOTAxMzMzIDQuMjI0IDQ2LjY1NiAxMy4wNTYgMTEuNDEzMzMzIDguODMyIDE5LjI0MjY2NyAyMS44ODggMjIuODI2NjY3IDM5LjU1Mmg0Mi4wMjY2NjdjLTQuNjI5MzMzLTMwLjcyLTE2LjA0MjY2Ny01My4zNzYtMzQuMTk3MzM0LTY4LjczNi0xOC44OC0xNS43NDQtNDQuNTQ0LTIzLjQyNC03Ny4zMTItMjMuNDI0eiIgZmlsbD0iIzFBOEVGNyIgcC1pZD0iMTY1MSI+PC9wYXRoPjwvc3ZnPg==
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';
    var svg = '';
    var obj;
    var res = '';
    setInterval(()=>{
        obj = my$('.download-content .stage svg');
        if(obj && obj.outerHTML!=svg){
            svg = obj.outerHTML;
            res = svg2base64(svg);
            var btn = my$('.download-btns');
            if(btn.children[5]){btn.children[5].remove();}
            var cpy = btn.querySelector('.btn-disabled');
            cpy.innerHTML = "复制Base64";
            cpy.className = "btn btn-normal mr20";
            cpy.onclick = ()=>{
                GM_setClipboard(res,"text");
            };
        }
    },2000);
    function my$(s){return document.querySelector(s)}
    function svg2base64(objstr){
        var s=typeof(objstr);
        if(s=="object"){
            try{
                s = objstr.outerHTML;
            }
            catch{}
        }
        else if(s=="string"){s = objstr;}
        s = s.replace(/^.*(<svg.*<\/svg>).*$/,"$1");
        s = "data:image/svg+xml;base64,"+btoa(s);
        // console.log(s);
        // GM_setClipboard(s,"text");
        return s;
    }
    function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  link.remove();
}
})();