var Rete = require("rete");

var VueTextControl = {
    props: ['readonly', 'emitter', 'ikey', 'getData', 'putData'],
    template: '<input type="string" :readonly="readonly" :value="value" @input="change($event)" @dblclick.stop="" @pointerdown.stop="" @pointermove.stop=""/>',
    data() {
        return {
            value:"",
        }
    },
    methods: {
        change(e: any) {
            this.value = e.target.value;
            this.update();
        },
        update() {
            if (this.ikey)
                this.putData(this.ikey, this.value)
            this.emitter.trigger('process');
        }
    },
    mounted() {
        this.value = this.getData(this.ikey);
    }
}

export class TextControl extends Rete.Control {
    constructor(emitter: any, key: string, readonly: boolean) {
        super(key);
        this.component = VueTextControl;
        this.props = { emitter, ikey: key, readonly };
    }

    setValue(val: string) {
        this.vueContext.value = val;
    }
}