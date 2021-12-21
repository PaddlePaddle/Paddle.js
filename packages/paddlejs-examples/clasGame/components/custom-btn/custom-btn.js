// components/common/custom-btn.js
// eslint-disable-next-line no-undef
Component({
    properties: {
        width: {
            type: String,
            value: ''
        },
        height: {
            type: String,
            value: ''
        },
        bgUrl: {
            type: String,
            value: ''
        },
        bgColor: {
            type: String,
            value: ''
        },
        fontSize: {
            type: String,
            value: ''
        },
        color: {
            type: String,
            value: ''
        },
        btnText: {
            type: String,
            value: ''
        },
        jumpScheme: {
            type: String,
            value: ''
        }
    },
    methods: {
        bindButtonTap() {
            this.triggerEvent('buttonTap');
        }
    }
});
