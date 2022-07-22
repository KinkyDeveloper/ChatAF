// ==UserScript==
// @name         ChatAF
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Filters for chat and logging.
// @author       KinkyDeveloper
// @match        *.chat-avenue.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chat-avenue.com
// @grant        none
// ==/UserScript==

const SETTINGS_INNERHTML = `
-= LOGS =-<br>
<span id="img_len"></span> image links<br>
<span id="msg_len"></span> messages<br><br>
-= SETTINGS =-
<div id="settings">
    <input type="checkbox" onclick="settings_handler()" value="verbose">
    Verbose<br>
    - SEX -<br>
    <input type="checkbox" onclick="settings_handler()" value="boy" checked>
    Boy<br>
    <input type="checkbox" onclick="settings_handler()" value="girl" checked>
    Girl<br>
    <input type="checkbox" onclick="settings_handler()" value="nosex" checked>
    No Sex<br>
    - CHAT -<br>
    <input type="checkbox" onclick="settings_handler()" value="dupes" checked>
    Duplicates<br>
    <input type="checkbox" onclick="settings_handler()" value="msg" checked>
    Messages<br>
    <input type="checkbox" onclick="settings_handler()" value="img" checked>
    Images<br>
    <input type="checkbox" onclick="settings_handler()" value="do_min_len">
    Min length<br>
    <input type="number" value="min_len" disabled>
</div>
<br>
-= EXPORT LOGS =-<br>
<button onclick="export_imgs()">Images Links</button><br>
<button onclick="export_msgs()">Messages</button><br>
<button onclick="toggle()" id="toggle">Off</button>
`

(function() {
    'use strict';
    // Add jQuery to page
    var script = document.createElement('script');
    script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.6.3/jquery.min.js";
    document.getElementsByTagName('head')[0].appendChild(script);
    script = document.createElement('script');
    script.src = "https://raw.githubusercontent.com/KinkyDeveloper/ChatAF/main/filter.js";
    document.getElementsByTagName('head')[0].appendChild(script);

    // Add settings to page
    var div = document.createElement('div');
    div.id = 'settings';
    div.innerHTML = SETTINGS_INNERHTML;
    document.getElementsByClassName('chat_left_menu_wrap')[0].appendChild(div);

})();
