(()=>{"use strict";var n,e,o,t={923:(n,e,o)=>{o.d(e,{Z:()=>r});var t=o(645),a=o.n(t)()((function(n){return n[1]}));a.push([n.id,'body,\ndiv,\ndl,\ndt,\ndd,\nul,\nol,\nli,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\npre,\nform,\nfieldset,\ninput,\ntextarea,\np,\nblockquote,\nth,\ntd {\n    margin: 0;\n    padding: 0;\n}\n* {\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box;\n}\n:before,\n:after {\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box;\n}\nimg,\nobject,\nembed {\n    max-width: 100%;\n    height: auto;\n}\nobject,\nembed {\n    height: 100%;\n}\nimg {\n    margin: 1.25% 0;\n    -ms-interpolation-mode: bicubic;\n}\nhtml {\n    background-color: #f0f1f3;\n    padding: 2%;\n}\nbody {\n    font-size: 16px;\n    line-height: 1.6;\n    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,\n        Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",\n        "Segoe UI Symbol";\n    color: #242424;\n    max-width: 800px;\n    margin: 5% auto;\n}\nbody::after {\n    clear: both;\n    content: "";\n    display: table;\n}\nheader {\n    margin-bottom: 8%;\n}\nfooter {\n    text-align: center;\n}\nh1,\nh2,\nh3,\nh4,\nh5,\nh1 a {\n    color: #263a48;\n    font-weight: 500;\n    text-decoration: none;\n}\nh1,\nh2 {\n    font-size: 36px;\n    padding-bottom: 0.3em;\n    margin-bottom: 0.4em;\n    border-bottom: 1px solid #eee;\n}\nh2 {\n    font-size: 22px;\n    padding-bottom: 0.6em;\n    margin-bottom: 0.6em;\n    margin-top: 2.5em;\n}\nh3 {\n    font-size: 18px;\n    margin-bottom: 0.3em;\n}\nh1 small a {\n    color: #98999c;\n    font-size: 15px;\n    font-weight: normal;\n    float: right;\n    position: absolute;\n    top: 15px;\n    right: 20px;\n}\nsection {\n    background: #fff;\n    margin-bottom: 1%;\n    position: relative;\n    padding: 6% 8%;\n}\nblockquote {\n    border-left: 3px solid #d54e21;\n    font-size: 16px;\n    padding: 0 0 0 20px;\n    color: #d54e21;\n}\nblockquote a {\n    color: #d54e21;\n    font-weight: 500;\n}\nblockquote code {\n    color: #d54e21;\n}\ncode,\ncite {\n    background-color: #f0f2f4;\n    border-radius: 3px;\n    color: #000;\n    font: inherit;\n    padding: 2px 7px;\n    white-space: nowrap;\n}\npre {\n    background-color: #f0f2f4;\n    clear: both;\n    border-radius: 4px;\n    display: block;\n    font-size: 14px;\n    overflow: auto;\n    padding: 20px;\n    white-space: pre-wrap;\n    word-wrap: break-word;\n}\npre + img {\n    margin-top: 2.4em;\n}\na {\n    color: #1e8cbe;\n    text-decoration: underline;\n}\na:hover {\n    color: #d54e21;\n}\nul {\n    list-style: none;\n}\nol {\n    list-style: number;\n}\nol li {\n    color: #98999c;\n    margin-bottom: 5px;\n}\nol li:last-child {\n    margin-bottom: 0;\n}\np,\nul,\nol,\nblockquote {\n    margin-bottom: 4%;\n}\nul ul {\n    padding-top: 0;\n    margin-bottom: 0;\n    margin-left: 4%;\n}\nul ul li:before {\n    content: "-";\n    display: inline-block;\n    padding-right: 2%;\n}\n\nul.col-2 {\n    color: #98999c;\n    -webkit-column-count: 2;\n    -moz-column-count: 2;\n    column-count: 2;\n    -webkit-column-gap: 20px;\n    -moz-column-gap: 20px;\n    column-gap: 20px;\n}\n\n@media screen and (min-width: 500px) {\n    ul.col-2 {\n        -webkit-column-count: 3;\n        -moz-column-count: 3;\n        column-count: 3;\n        -webkit-column-gap: 20px;\n        -moz-column-gap: 20px;\n        column-gap: 20px;\n    }\n}\nnav {\n    background: #f0f1f3;\n    min-width: 215px;\n    margin-bottom: 5px;\n    margin-top: 15px;\n}\nnav:first-of-type a {\n    color: #d54e21;\n    border-radius: 0;\n}\nnav:first-of-type a:hover {\n    color: #d54e21;\n}\nnav:first-of-type a:before {\n    background-color: #d54e21;\n}\nnav.affix {\n    position: fixed;\n    top: 20px;\n}\nnav.affix-bottom {\n    position: absolute;\n}\nnav a {\n    border-radius: 3px;\n    font-size: 15px;\n    display: block;\n    cursor: pointer;\n    font-weight: 500;\n    position: relative;\n    text-decoration: none;\n    padding: 10px 12px;\n    width: 100%;\n    padding-right: 3px;\n    border-bottom: 2px solid #fff;\n}\nnav a:before {\n    content: "";\n    width: 4px;\n    display: block;\n    left: 0;\n    position: absolute;\n    height: 100%;\n    display: none;\n    background: #1e8cbe;\n    top: 0;\n}\nnav a:hover {\n    background-color: #e6e8ea;\n    color: #1e8cbe;\n    text-decoration: underline;\n}\nnav a:hover:before {\n    display: block;\n}\nnav a:last-of-type {\n    border-bottom: none;\n}\n.gist {\n    margin-top: 5.1%;\n    margin-bottom: 5%;\n}\n@media screen and (max-width: 1050px) {\n    body {\n        margin: 0 auto;\n    }\n}\n@media screen and (max-width: 767px) {\n    header span {\n        display: none;\n    }\n    h1 {\n        font-size: 26px;\n    }\n    h2 {\n        font-size: 20px;\n    }\n}\n@media screen and (max-width: 514px) {\n    p,\n    ul,\n    ol,\n    blockquote {\n        margin-bottom: 8%;\n    }\n}\n',""]);const r=a},645:n=>{n.exports=function(n){var e=[];return e.toString=function(){return this.map((function(e){var o=n(e);return e[2]?"@media ".concat(e[2]," {").concat(o,"}"):o})).join("")},e.i=function(n,o,t){"string"==typeof n&&(n=[[null,n,""]]);var a={};if(t)for(var r=0;r<this.length;r++){var i=this[r][0];null!=i&&(a[i]=!0)}for(var l=0;l<n.length;l++){var d=[].concat(n[l]);t&&a[d[0]]||(o&&(d[2]?d[2]="".concat(o," and ").concat(d[2]):d[2]=o),e.push(d))}},e}},379:(n,e,o)=>{var t,a=function(){var n={};return function(e){if(void 0===n[e]){var o=document.querySelector(e);if(window.HTMLIFrameElement&&o instanceof window.HTMLIFrameElement)try{o=o.contentDocument.head}catch(n){o=null}n[e]=o}return n[e]}}(),r=[];function i(n){for(var e=-1,o=0;o<r.length;o++)if(r[o].identifier===n){e=o;break}return e}function l(n,e){for(var o={},t=[],a=0;a<n.length;a++){var l=n[a],d=e.base?l[0]+e.base:l[0],c=o[d]||0,s="".concat(d," ").concat(c);o[d]=c+1;var p=i(s),u={css:l[1],media:l[2],sourceMap:l[3]};-1!==p?(r[p].references++,r[p].updater(u)):r.push({identifier:s,updater:f(u,e),references:1}),t.push(s)}return t}function d(n){var e=document.createElement("style"),t=n.attributes||{};if(void 0===t.nonce){var r=o.nc;r&&(t.nonce=r)}if(Object.keys(t).forEach((function(n){e.setAttribute(n,t[n])})),"function"==typeof n.insert)n.insert(e);else{var i=a(n.insert||"head");if(!i)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");i.appendChild(e)}return e}var c,s=(c=[],function(n,e){return c[n]=e,c.filter(Boolean).join("\n")});function p(n,e,o,t){var a=o?"":t.media?"@media ".concat(t.media," {").concat(t.css,"}"):t.css;if(n.styleSheet)n.styleSheet.cssText=s(e,a);else{var r=document.createTextNode(a),i=n.childNodes;i[e]&&n.removeChild(i[e]),i.length?n.insertBefore(r,i[e]):n.appendChild(r)}}function u(n,e,o){var t=o.css,a=o.media,r=o.sourceMap;if(a?n.setAttribute("media",a):n.removeAttribute("media"),r&&"undefined"!=typeof btoa&&(t+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(r))))," */")),n.styleSheet)n.styleSheet.cssText=t;else{for(;n.firstChild;)n.removeChild(n.firstChild);n.appendChild(document.createTextNode(t))}}var m=null,h=0;function f(n,e){var o,t,a;if(e.singleton){var r=h++;o=m||(m=d(e)),t=p.bind(null,o,r,!1),a=p.bind(null,o,r,!0)}else o=d(e),t=u.bind(null,o,e),a=function(){!function(n){if(null===n.parentNode)return!1;n.parentNode.removeChild(n)}(o)};return t(n),function(e){if(e){if(e.css===n.css&&e.media===n.media&&e.sourceMap===n.sourceMap)return;t(n=e)}else a()}}n.exports=function(n,e){(e=e||{}).singleton||"boolean"==typeof e.singleton||(e.singleton=(void 0===t&&(t=Boolean(window&&document&&document.all&&!window.atob)),t));var o=l(n=n||[],e);return function(n){if(n=n||[],"[object Array]"===Object.prototype.toString.call(n)){for(var t=0;t<o.length;t++){var a=i(o[t]);r[a].references--}for(var d=l(n,e),c=0;c<o.length;c++){var s=i(o[c]);0===r[s].references&&(r[s].updater(),r.splice(s,1))}o=d}}}}},a={};function r(n){var e=a[n];if(void 0!==e)return e.exports;var o=a[n]={id:n,exports:{}};return t[n](o,o.exports,r),o.exports}r.n=n=>{var e=n&&n.__esModule?()=>n.default:()=>n;return r.d(e,{a:e}),e},r.d=(n,e)=>{for(var o in e)r.o(e,o)&&!r.o(n,o)&&Object.defineProperty(n,o,{enumerable:!0,get:e[o]})},r.o=(n,e)=>Object.prototype.hasOwnProperty.call(n,e),n=r(379),e=r.n(n),o=r(923),e()(o.Z,{insert:"head",singleton:!1}),o.Z.locals,document.body.innerHTML='<!DOCTYPE html> <html id="html"> <head lang="en"> <meta http-equiv="content-type" content="text/html;charset=utf-8"/> <meta name="viewport" content="width=device-width"/> <title>@@name Help Guide | ThemeBeans</title> </head> <body> <section id="Menu"> <header> <h1>Dungeon Mayhem Online</h1> <p> Use the Add Local Player section to add a controllable player on this computer, click the Class you want and a new set of cards should be added to the table. Use the Add AI Player section similarly to add a computer controlled player, warning: Its quite good. </p> <p> You can play locally, or connect to other people on the same network. For testing you can use multiple tabs on the same computer/browser. </p> <p> On one computer/tab click "Add Remote", a new section is added, you can follow the instruction in the Status field. You need to send a token back and forth to establish the connection, the Copy and Paste will automatically use your clipboard so you dont have to select or type manually. </p> <ul> <li> Host: Copy the token by clicking Copy, send that string to the other person. </li> <li> Player: Copy the token you received from the host, and click the Paste button. </li> <ul> <li> A new token will be added to your clipboard automatically, send it to the host </li> </ul> <li> Host: Copy the token you received from the player, and click the Paste button </li> <li> A new set of cards should be added, and the remote player should see the game state. </li> </ul> <p> The game should be fairly simple to follow, selectable items have a red spotlight on them, the current player has a cyan spotlight </p> </header> <nav> <a href="game.html" id="playNow">Play Now</a> </nav> </section> <section> <h1>Shortcuts from the URL</h1> <p> There are some shortcuts you can access by adding to the url after game.html, add multiple by putting & between each </p> <p> You can add <a href="game.html#join">#join</a> to automatically open the menu for joining a game </p> <p> You can add <a href="game.html#p1=Wizard">#p1=Wizard</a> to automatically add a local player </p> <p> change 1 to any number up to 6 and change Wizard to any class or <a href="game.html#p1=remote"></a>remote to add a remote player You can add AI before the class to make it a computer player </p> </section> </body> </html> '})();