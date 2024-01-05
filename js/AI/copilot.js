class Copilot extends PromptBase {
    constructor() {
        super();
        this.$promptInputElement = '';
        this.$appendParentElement = '#b_header';
        this.$mutationObserverElement = document.getElementById('b_sydConvCont');
        this.$customCss = 'custom-copilot';
    }

    init() {
        this.listenPromptInput()
    }

    listenPromptInput() {
        let that = this
        $(that.getPromptInputElement()).on('keydown', function (event) {
            if (event.altKey) {
                that.appendNewPromptTextToPromptInput();
            }
        })
    }

    appendNewPromptTextToPromptInput() {
        if ($('#shouldTranslate').is(":checked")) {
            $(this.getPromptInputElement()).val(this.getNewPromptText())
        }
    }

    getPromptInputElement() {
        let element = $('.cib-serp-main')[0].shadowRoot
        element = $(element).find('#cib-action-bar-main')[0].shadowRoot
        element = $(element).find('cib-text-input')[0].shadowRoot
        element = $(element).find('#searchbox')[0]
        return element
    }
}
