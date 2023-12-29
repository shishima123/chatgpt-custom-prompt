class PromptBase {
    $promptInputElement
    $appendParentElement
    $mutationObserverElement
    $customCss

    getNewPromptText() {
        return this.getTransText(this.$promptInputElement.text())
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
        return `You are a highly skilled AI trained in language translation. I would like you to translate the text delimited by triple quotes into ${lang} language, ensuring that the translation is colloquial and authentic.
Only give me the output and nothing else. Do not wrap responses in quotes.
"""
${inputText}
"""`
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
}