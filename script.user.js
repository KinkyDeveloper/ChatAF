// ==UserScript==
// @name         ChatAF
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Filters for chat and logging.
// @author       KinkyDeveloper
// @match        *.chat-avenue.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chat-avenue.com
// @grant        none
// ==/UserScript==

// GLOBAL VARS
var saved_images = new Set();
var saved_messages = new Set();
var settings;
var enabled = false; // Default filter is off
var chat_handler;

// SETTINGS
const FREQ=300; // Every X ms

function create_dashboard() {
    // Creates the option dashboard and adds it to the loaded page
    if (document.getElementById('dashboard') != null){
        return; // Return if already created
    }
    var dashboard = document.createElement('div');
    dashboard.id = 'dashboard';

    dashboard.appendChild(document.createTextNode('-= LOGS =-'))
    dashboard.appendChild(document.createElement('br'))
    // IMAGES LOGS
    var s = document.createElement('span');
    s.id = 'img_len';
    s.appendChild(document.createTextNode('0'));
    dashboard.appendChild(s);
    dashboard.appendChild(document.createTextNode(' image links'));
    dashboard.appendChild(document.createElement('br'));

    // MESSAGES LOG
    s = document.createElement('span');
    s.id = 'msg_len';
    s.appendChild(document.createTextNode('0'));
    dashboard.appendChild(s);
    dashboard.appendChild(document.createTextNode(' messages'));
    dashboard.appendChild(document.createElement('br'));
    dashboard.appendChild(document.createElement('br'));


    dashboard.appendChild(document.createTextNode('-= SETTINGS =-'));
    var settings = document.createElement('div');
    settings.id = 'settings';

    // VERBOSE
    s = document.createElement('input');
    s.type = 'checkbox';
    s.value = 'verbose';
    s.addEventListener('click', settings_handler);
    settings.appendChild(s);
    settings.appendChild(document.createTextNode(' Verbose'));
    settings.appendChild(document.createElement('br'));

    // FILTER
    s = document.createElement('input');
    s.type = 'checkbox';
    s.value = 'toggle';
    s.addEventListener('click', toggle);
    settings.appendChild(s);
    settings.appendChild(document.createTextNode(' Toggle Filter'));
    settings.appendChild(document.createElement('br'));


    settings.appendChild(document.createTextNode('- SEX -'))
    settings.appendChild(document.createElement('br'))

    // BOY
    s = document.createElement('input');
    s.checked = true;
    s.type = 'checkbox';
    s.value = 'boy';
    s.addEventListener('click', settings_handler);
    settings.appendChild(s);
    settings.appendChild(document.createTextNode(' Boy'));
    settings.appendChild(document.createElement('br'));

    // GIRL
    s = document.createElement('input');
    s.checked = true;
    s.type = 'checkbox';
    s.value = 'girl';
    s.addEventListener('click', settings_handler);
    settings.appendChild(s);
    settings.appendChild(document.createTextNode(' Girl'));
    settings.appendChild(document.createElement('br'));

    // NO SEX
    s = document.createElement('input');
    s.checked = true;
    s.type = 'checkbox';
    s.value = 'nosex';
    s.addEventListener('click', settings_handler);
    settings.appendChild(s);
    settings.appendChild(document.createTextNode(' No Sex'));
    settings.appendChild(document.createElement('br'));


    settings.appendChild(document.createTextNode('- CHAT -'))
    settings.appendChild(document.createElement('br'))

    // DUPLICATES
    s = document.createElement('input');
    s.type = 'checkbox';
    s.value = 'dupes';
    s.addEventListener('click', settings_handler);
    settings.appendChild(s);
    settings.appendChild(document.createTextNode(' Duplicates'));
    settings.appendChild(document.createElement('br'));

    // MESSAGES
    s = document.createElement('input');
    s.checked = true;
    s.type = 'checkbox';
    s.value = 'msg';
    s.addEventListener('click', settings_handler);
    settings.appendChild(s);
    settings.appendChild(document.createTextNode(' Messages'));
    settings.appendChild(document.createElement('br'));

    // IMAGES
    s = document.createElement('input');
    s.checked = true;
    s.type = 'checkbox';
    s.value = 'img';
    s.addEventListener('click', settings_handler);
    settings.appendChild(s);
    settings.appendChild(document.createTextNode(' Images'));
    settings.appendChild(document.createElement('br'));

    // MIN LENGTH
    s = document.createElement('input');
    s.type = 'checkbox';
    s.value = 'do_min_len';
    s.addEventListener('click', settings_handler);
    settings.appendChild(s);
    settings.appendChild(document.createTextNode(' Min length'));
    settings.appendChild(document.createElement('br'));
    s = document.createElement('input');
    s.type = 'number';
    s.id = 'min_len';
    s.value = 0;
    s.addEventListener('input', settings_handler);
    settings.appendChild(s);


    dashboard.appendChild(settings);
    dashboard.appendChild(document.createElement('br'));
    dashboard.appendChild(document.createTextNode(' -= EXPORT LOGS =-'));
    dashboard.appendChild(document.createElement('br'));

    s = document.createElement('button');
    s.addEventListener('click', export_imgs);
    s.appendChild(document.createTextNode('Images Links'))
    dashboard.appendChild(s);
    dashboard.appendChild(document.createElement('br'));

    s = document.createElement('button');
    s.addEventListener('click', export_msgs);
    s.appendChild(document.createTextNode('Messages'))
    dashboard.appendChild(s);
    dashboard.appendChild(document.createElement('br'));

    // Add settings to page
    document.getElementsByClassName('chat_left_menu_wrap')[0].appendChild(dashboard);
}

// Main handler
function handle_chat() {
    var img_len = saved_images.size;
    var msg_len = saved_messages.size;
    var messages = document.getElementsByClassName('chat_message');

    message_loop:
    for (let message of messages) {
        if (message.getAttribute('handled')) {
            continue;
        }
        message.setAttribute('handled', true);

        var message_box = message.parentElement.parentElement;
        var images = message.getElementsByClassName('chat_image');

        // Sex handling
        const sexes = ['boy', 'girl', 'nosex'];
        var avatar_classes = message_box.getElementsByClassName('cavatar')[0].classList;
        for(let sex of sexes) {
            if (avatar_classes.contains(sex) && !settings.includes(sex)) {
                message_box.remove();
                continue message_loop;
            }
        }


        // Message handling
        if (images.length != 0) { // Message is an image
            saved_images.add(images[0].src); // Can't see duplicated images without looking at pixels
            if (!settings.includes('img')) {
                message_box.remove();
                continue;
            }
        } else { // Message is an text message
            if (!settings.includes('msg')) {
                message_box.remove();
                continue;
            } else {
                if (saved_messages.has(message.innerText) && !settings.includes('dupes')) {
                    message_box.remove();
                    if (settings.includes('verbose')) {
                        console.log("Removed duplicate!");
                    }
                    continue;
                }
                if (message.innerText.length < document.getElementById('min_len').value && settings.includes('do_min_len')) {
                    message_box.remove();
                    if (settings.includes('verbose')) {
                        console.log("Removed duplicate!");
                    }
                    continue;
                }
            }
        }
        saved_messages.add(message.innerText); // Passed all checks (no continue)

    }

    var new_img = saved_images.size-img_len;
    var new_msg = saved_messages.size-msg_len;
    if (new_img > 0) {
        document.getElementById('img_len').innerHTML = img_len+new_img;
        if (settings.includes('verbose')) {
            console.log("Found " + new_img + " new images!");
        }
    }
    if (new_msg > 0) {
        document.getElementById('msg_len').innerHTML = msg_len+new_msg;
        if (settings.includes('verbose')) {
            console.log("Found " + new_msg + " new messages!");
        }
    }
}

// Handle settings changes
function settings_handler() {
    settings = $("#settings input:checkbox:checked").map(function(){return $(this).val()}).get();
    console.log(settings)
}

// Function to download data to a file for exporting functions
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

// Export links of images logged during this session
function export_imgs() {
    var str = Array.from(saved_images).join('\r\n')
    download(str,'image_urls','text/csv')
}

// Export messages logged during this session
function export_msgs() {
    var str = Array.from(saved_messages).join('\r\n')
    download(str,'messages','text/csv')
}

// Toggle the chat handler on and off
function toggle() {
    enabled = !enabled;
    if (enabled) {
        chat_handler = setInterval(handle_chat, FREQ);
    } else {
        clearInterval(chat_handler);
    }
}

(function() {
    'use strict';
    // Add jQuery to page
    var script = document.createElement('script');
    script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.6.3/jquery.min.js";
    document.getElementsByTagName('head')[0].appendChild(script);

    create_dashboard();
    // Set settings to default
    settings_handler();
})();