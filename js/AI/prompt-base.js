class PromptBase {
    // selector element where the input for entering prompt
    $promptInputElement

    // selector element where the custom prompt option will be added
    $appendParentElement
    $mutationObserverElement
    $customCss

    getNewPromptText() {
        return this.getTransText($(this.getPromptInputElement()).text())
    }

    getLang() {
        let langs = $('input[name="lang[]"]:checked')
        if (!langs.length) {
            alert('Select lang')
            return '';
        }

        var langList = [];
        langs.each(function () {
            langList.push($(this).val());
        })

        return langList.join(' and ')
    }

    getTransText(inputText) {
        let lang = this.getLang()

        return `Dịch sang tiếng ${lang}. Do not wrap responses in quotes and code block.
"""
${inputText}
"""`
//         return `You are a highly skilled AI trained in language translation. I would like you to translate the text delimited by triple quotes into ${lang} language, ensuring that the translation is colloquial and authentic.
// Only give me the output and nothing else. Do not wrap responses in quotes.
// """
// ${inputText}
// """`
    }

    getAppendParentElement() {
        return this.$appendParentElement
    }

    getMutationObserverElement() {
        return this.$mutationObserverElement
    }

    getCustomCss() {
        return this.$customCss
    }

    getAutoPromptContainerElement() {
        return '#auto-prompt-container'
    }

    getPromptInputElement() {
        return this.$promptInputElement
    }

    handlePromptInsert = (
        inputField,
        prompt
    ) => {
        if (
            inputField instanceof HTMLInputElement ||
            inputField instanceof HTMLTextAreaElement
        ) {
            // For a regular input or textarea
            const cursorPosition = inputField.selectionStart ?? 0;
            const currentValue = inputField.value;
            const newValue =
                currentValue.slice(0, cursorPosition) +
                prompt +
                currentValue.slice(cursorPosition);
            inputField.value = newValue;
            inputField.focus();
            inputField.setSelectionRange(
                cursorPosition + prompt.length,
                cursorPosition + prompt.length
            );
            const event = new Event("input", {bubbles: true});
            // inputField.dispatchEvent(event);
        } else if (inputField.getAttribute("contenteditable") === "true") {
            // For a contenteditable element
            inputField.focus();
            let sel, range;
            if (window.getSelection) {
                console.log(1);
                sel = window.getSelection();
                if (sel?.getRangeAt && sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(document.createTextNode(prompt));
                    range.collapse(false);
                }
            } else if (
                document.selection &&
                document.selection.createRange
            ) {
                console.log(2);
                document.selection.createRange().text = prompt;
            }
            const event = new Event("input", {bubbles: true});
            // inputField.dispatchEvent(event);
        }
    };
}