// GLOBAL VARS
var saved_images = new Set();
var saved_messages = new Set();
var settings;
var enabled = true;

// SETTINGS
const FREQ=300; // Every X ms

// Main handler
function handle_chat() {
    var img_len = saved_images.size;
    var msg_len = saved_messages.size;
    var messages = document.getElementsByClassName('chat_message');

    message_loop:
    for (let message of messages) {
        if (message.getAttribute('handled'))
            continue;
        message.setAttribute('handled', true);

        var message_box = message.parentElement.parentElement;
        var images = message.getElementsByClassName('chat_image');
        var remove = false;

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
        if (images.length != 0) {
            saved_images.add(images[0].src); // Can't see duplicated images without looking at pixels
            if (!settings.includes('img')) {
                message_box.remove();
                continue;
            }
        } else {
            if (saved_messages.has(message.innerText) && !settings.includes('dupes') && settings.includes('msg')) {
                message_box.remove();
                if (settings.includes('verbose'))
                    console.log("Removed duplicate!");
                continue;
            } else {
                saved_messages.add(message.innerText);
            }
            if (!settings.includes('msg')) {
                message_box.remove();
                continue;
            }
        }

    }

    var new_img = saved_images.size-img_len;
    var new_msg = saved_messages.size-msg_len;
    if (new_img > 0) {
        document.getElementById('img_len').innerHTML = img_len+new_img;
        if (settings.includes('verbose'))
            console.log("Found " + new_img + " new images!");
    }
    if (new_msg > 0) {
        document.getElementById('msg_len').innerHTML = msg_len+new_msg;
        if (settings.includes('verbose'))
            console.log("Found " + new_msg + " new messages!");
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
        document.getElementById('toggle').innerHTML="Off";
    } else {
        clearInterval(chat_handler);
        document.getElementById('toggle').innerHTML="On";
    }
}

// Set settings to default
settings_handler();

// Enable handler as default
chat_handler = setInterval(handle_chat, FREQ);
