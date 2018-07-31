class RouterData {
    constructor() {
        this.keys = [];
        Object.defineProperty(this, 'keys', {
            writable: false
        });
        Object.defineProperty(this, 'key', {
            get() { return this.keys[this.keys.length - 1]; },
            set(v) {
                if (this.keys[this.keys.length - 1] !== v) this.keys.push(v);
            },
        });
    }
}

module.exports = RouterData;
