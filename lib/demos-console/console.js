class C {
    static getTime() {
        let d = new Date();
        return C.fitRight('' + d.getDate(), 2, '0') + `/` +
            C.fitRight('' + (d.getMonth() + 1), 2, '0') + `/` +
            C.fitRight('' + d.getFullYear(), 2, '0') + ` ` +
            C.fitRight('' + d.getHours(), 2, '0') + `:` +
            C.fitRight('' + d.getMinutes(), 2, '0') + `:` +
            C.fitRight('' + d.getSeconds(), 2, '0');
    }

    static fitRight(txt, n, str) {
        if (txt.length >= n) return txt.substring(txt.length - n);
        let r = "";
        for (let i = 0; i < n - txt.length; i++) {
            r += str.charAt(i % str.length);
        }
        return r + txt;
    }

    static log() {
        console.log('\x1b[38;2;255;255;255m ' + C.getTime() + '\x1b[0m |', ...arguments);
    }

    static logError() {
        console.log('\x1b[38;2;255;0;0m ' + C.getTime() + '\x1b[0m |', ...arguments);
    }

    static logTest() {
        console.log('\x1b[38;2;100;255;200m ' + C.getTime() + '\x1b[0m |', ...arguments);
    }

    static logDev() {
        console.log('\x1b[38;2;100;100;255m ' + C.getTime() + '\x1b[0m |', ...arguments);
    }
}

module.exports = C;
