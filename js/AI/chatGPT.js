class ChatGPT extends PromptBase {
    constructor() {
        super();
        this.$promptInputElement = '#prompt-textarea';
        this.$appendParentElement = 'form.stretch div:first';
        this.$mutationObserverElement = document.querySelector('body > div:first-child');
        this.$customCss = 'custom-chatgpt';
    }

    init() {
        this.listenPromptInput()
    }

    listenPromptInput() {
        let that = this
        $('form.stretch').on('submit', function (e) {
            that.appendNewPromptTextToPromptInput()
        })
        $('form.stretch textarea').on('keydown', function (event) {
            if (event.key == 'Enter' && !event.shiftKey && !event.ctrlKey && !event.altKey) {
                that.appendNewPromptTextToPromptInput();
            }
        })
    }

    appendNewPromptTextToPromptInput() {
        if ($('#shouldTranslate').is(":checked")) {
            $(this.getPromptInputElement()).val(this.getNewPromptText())
        }
    }
}
