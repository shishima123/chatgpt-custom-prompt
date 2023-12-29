class Bard extends PromptBase {
    constructor() {
        super();
        this.$promptInputElement = $('.ql-editor.textarea p');
        this.$appendParentElement = $('.input-area-container');
        this.$mutationObserverElement = document.getElementById('app-root');
        this.$customCss = 'custom-bard';
    }

    init() {
        this.listenPromptInput()
    }

    listenPromptInput() {
        let that = this
        // $('.send-button').on('click', function (e) {
        //     that.appendNewPromptTextToPromptInput()
        // })
        $('.ql-editor.textarea').on('keydown', function (event) {
            if (event.key == 'Enter' && !event.shiftKey && !event.ctrlKey && !event.altKey) {
                that.appendNewPromptTextToPromptInput();
            }
        })
        // that.appendNewPromptTextToPromptInput();
        // setTimeout(function () {
        //     $('.send-button').trigger('click')
        //
        // }, 1000)
    }

    appendNewPromptTextToPromptInput() {
        this.handlePromptInsert($('.ql-editor.textarea')[0], this.getNewPromptText())

        // console.log(window.Quill)
        //
        // if ($('#shouldTranslate').is(":checked")) {
        //     // let element = document.getElementsByClassName('text-input-field_textarea')[0]
        //     // $('body').find('*').each(function () {
        //     // })
        //     // if (element) {
        //     // console.log(Quill.find(element));
        //     // quill_instance.setText(this.getNewPromptText());
        //     // }
        //
        //     // this.$promptInputElement.text(this.getNewPromptText())
        // }
    }
}
