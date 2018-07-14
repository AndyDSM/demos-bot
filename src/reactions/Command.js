const QueryMap = require('./QueryMap.js');

class Command {
    constructor() {
        this.queries = new QueryMap();
        this.desc = '';
        this.guide = '';
    }

    run() {}

    onQuery(query, f) {
        this.queries.set(event, f);
        return this;
    }

    query(func, r) {
        return this.queries.getQuery(func)(r);
    }
}

module.exports = Command;
