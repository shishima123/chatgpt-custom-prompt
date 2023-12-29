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
            let autoPromptClass = new ChatGPT()
            tryInitAutoPrompt(autoPromptClass)
        }, 500)
    } finally {
        inInit = false;
    }
}

async function tryInitAutoPrompt(autoPromptClass) {
    const appendParentElement = autoPromptClass.getAppendParentElement();
    if (!appendParentElement.length) {
        return;
    }

    if (!$("#auto-prompt-container").length) {
        const url = chrome.runtime.getURL('/templates/container.html');
        await fetch(url)
            .then(response => response.text())
            .then(html => {
                appendParentElement.append(html)
                $("#auto-prompt-container").addClass(autoPromptClass.getCustomCss())
            })

        if ($("#auto-prompt-container").length) {
            autoPromptClass.init()
            initSetLocalStorage()
        } else {
            count++;
            if (count < maxTries) {
                console.log(`AutoPrompt: Could not load template - try again ${count}/${maxTries}`);
                setTimeout(() => {
                    this.tryInitAutoPrompt();
                }, 250); // try again
            } else {
                console.log('AutoPrompt: Could not load template - abort');
            }
        }
    }
}

function initSetLocalStorage() {
    let storageKeys = {
        'shouldTranslate': 'chatgpt-custom-prompt:should-translate',
        'vi_cb': 'chatgpt-custom-prompt:vi_cb',
        'en_cb': 'chatgpt-custom-prompt:en_cb',
        'jp_cb': 'chatgpt-custom-prompt:jp_cb',
    }

    $.each(storageKeys, function (elementId, storageKey) {
        if (localStorage.getItem(storageKey)) {
            $(`#${elementId}`).attr('checked', localStorage.getItem(storageKey) === 'true')
        }
    });

    $('#shouldTranslate, input[name="lang[]"]').on('change', function () {
        localStorage.setItem('chatgpt-custom-prompt:should-translate', $('#shouldTranslate').is(':checked'))

        $('input[name="lang[]"]').each(function () {
            let key = $(this).attr('id')
            localStorage.setItem(`chatgpt-custom-prompt:${key}`, $(this).is(':checked'))
        })
    })
}

