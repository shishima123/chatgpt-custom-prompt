class ChatGPT extends PromptBase {
    constructor() {
        super();
        this.$promptInputElement = '#prompt-textarea';
        this.$appendParentElement = 'form div:first';
        this.$mutationObserverElement = document.querySelector('body > div:first-child');
        this.$customCss = 'custom-chatgpt';
    }

    init() {
        this.listenPromptInput()
    }

    listenPromptInput() {
        let that = this
        $('form button').on('click', function (e) {
            that.appendNewPromptTextToPromptInput()
        })
        $(this.getPromptInputElement()).on('keydown', function (event) {
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
