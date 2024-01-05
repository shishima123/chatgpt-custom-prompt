console.log('Running');
const maxTries = 30;
let count = 0;
$(function () {
    let autoPromptClass = getAutoPromptClass()

    const div = autoPromptClass.getMutationObserverElement();
    const observer = new MutationObserver(function () {
        init(autoPromptClass);
    });
    observer.observe(div, {childList: true});

    // Necessary, if a chat was aborted and the page was reloaded, then AutoPrompt is initially included.
    // But as soon as the "Regenerate Response" or so is clicked, then it must be loaded again
    div.addEventListener('click', () => {
        init(autoPromptClass)
    });

    init(autoPromptClass);

})

var inInit = false;

function init(autoPromptClass) {
    if (inInit) {
        return;
    }
    inInit = true;
    try {
        setTimeout(function () {
            tryInitAutoPrompt(autoPromptClass)
        }, 500)
    } finally {
        inInit = false;
    }
}

async function tryInitAutoPrompt(autoPromptClass) {
    const appendParentElement = $(autoPromptClass.getAppendParentElement());
    if (!appendParentElement.length) {
        return;
    }

    if (!$(autoPromptClass.getAutoPromptContainerElement()).length) {
        const url = chrome.runtime.getURL('/templates/container.html');
        await fetch(url)
            .then(response => response.text())
            .then(html => {
                appendParentElement.append(html)
            })
        if ($(autoPromptClass.getAutoPromptContainerElement()).length) {
            autoPromptClass.init()
            $('#auto-prompt-container').addClass(autoPromptClass.getCustomCss())
            initSetLocalStorage()
        } else {
            count++;
            if (count < maxTries) {
                console.log(`AutoPrompt: Could not load template - try again ${count}/${maxTries}`);
                setTimeout(() => {
                    this.tryInitAutoPrompt(autoPromptClass);
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

function getAutoPromptClass() {
    let url = window.location.href
    let autoPromptClass;
    switch (true) {
        case url.includes('openai'):
            autoPromptClass = new ChatGPT()
            break;
        case url.includes('bard'):
            autoPromptClass = new Bard()
            break;
        case url.includes('copilot'):
            autoPromptClass = new Copilot()
            break;
    }

    return autoPromptClass;
}

