const pug = require('pug');
const C = require('../util/console.js');

class Renderer {

    static render(file, locals) {
        try {
            let r = pug.renderFile(__dirname + '/templates/' + file + '.pug', locals);
            //C.logTest(r);
            return r;
        } catch (e) {
            C.logError(e);
            return '<!ERROR>';
        }
    }

}

module.exports = Renderer;
