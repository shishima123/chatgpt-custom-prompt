const maxTries = 30;
let count = 0;
$(function () {
    const div = document.querySelector('body > div:first-child');
    const observer = new MutationObserver(function () {
        init();
    });
    observer.observe(div, {childList: true});

    // Necessary, if a chat was aborted and the page was reloaded, then AutoPrompt is initially included.
    // But as soon as the "Regenerate Response" or so is clicked, then it must be loaded again
    div.addEventListener('click', () => {
        init()
    });

    init();

})

var inInit = false;

function init() {
    if (inInit) {
        return;
    }
    inInit = true;
    try {
        setTimeout(function () {
            tryInitAutoPrompt();
        }, 500)
    } finally {
        inInit = false;
    }
}

function tryInitAutoPrompt() {
    const responseForm = $('form.stretch div').first();
    if (!responseForm.length) {
        return;
    }

    if (!$("#auto-prompt").length) {
        const url = chrome.runtime.getURL('/templates/container.html');
        fetch(url)
            .then(response => response.text())
            .then(text => {
                responseForm.append(text)
                if ($("#auto-prompt").length) {
                    listenChatGptTextArea()
                    initSetLocalStorage()
                }
            }).then(() => {
            if (!$("#auto-prompt").length) {
                count++;
                if (count < maxTries) {
                    console.log(`AutoPrompt: Could not load template - try again ${count}/${maxTries}`);
                    setTimeout(() => {
                        tryInitAutoPrompt();
                    }, 250); // try again
                } else {
                    console.log('AutoPrompt: Could not load template - abort');
                }
            }
        });
    }
}

function listenChatGptTextArea() {
    $('form.stretch').on('submit', function (e) {
        appendPromptToTextArea()
    })
    $('form.stretch textarea').on('keydown', function (event) {
        if (event.key == 'Enter' && !event.shiftKey && !event.ctrlKey && !event.altKey) {
            appendPromptToTextArea();
        }
    })
}

function appendPromptToTextArea() {
    if ($('#shouldTranslate').is(":checked")) {
        $('form.stretch textarea').val(getPromptText())
    }
}

function getPromptText() {
    let chatGptInputVal = $('#prompt-textarea').text()
    let langs = $('input[name="lang[]"]:checked')
    if (!langs.length) {
        alert('Select lang')
        return chatGptInputVal;
    }
    let lang = getLang(langs);

    return getTransText(chatGptInputVal, lang)
}

function getLang(langs) {
    var langList = [];
    langs.each(function () {
        langList.push($(this).val());
    })

    return langList.join(' and ')
}

function getTransText(chatGptInputVal, lang) {
    return `You are a highly skilled AI trained in language translation. I would like you to translate the text delimited by triple quotes into ${lang} language, ensuring that the translation is colloquial and authentic.
Only give me the output and nothing else. Do not wrap responses in quotes.
"""
${chatGptInputVal}
"""`
}

function initSetLocalStorage() {
    let storageKeys = {
        'should-translate': 'chatgpt-chatgpt-custom-prompt:should-translate',
        'vi_cb': 'chatgpt-chatgpt-custom-prompt:vi_cb',
        'en_cb': 'chatgpt-chatgpt-custom-prompt:en_cb',
        'jp_cb': 'chatgpt-chatgpt-custom-prompt:jp_cb',
    }

    $.each(storageKeys, function (elementId, storageKey) {
        if (localStorage.getItem(storageKey)) {
            $(`#${elementId}`).attr('checked', localStorage.getItem(storageKey) === 'true')
        }
    });
    $('#shouldTranslate, input[name="lang[]"]').on('change', function () {
        localStorage.setItem('chatgpt-chatgpt-custom-prompt:should-translate', $('#shouldTranslate').is(':checked'))
        $('input[name="lang[]"]').each(function () {
            let key = $(this).attr('id')
            localStorage.setItem(`chatgpt-trans-convert:${key}`, $(this).is(':checked'))
        })
    })
}

