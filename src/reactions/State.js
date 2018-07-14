const QueryMap = require('./QueryMap.js');

class State {
    constructor(f) {
        this.queries = new QueryMap();
        this.parentList = undefined;
        if (f) this.run = f;
    }

    run() {
        return false;
    }

    setList(list) {
        this.parentList = list;
    }

    query(func, r) {
        return this.queries.getQuery(func)(r);
    }

    delete() {
        try {
            //console.log(this.parentList);
            //console.log(this.parentList.route.indexOf(this));
            this.parentList.delete(this.parentList.route.indexOf(this));
        } catch (e) {}
    }

    onQuery(query, f) {
        this.queries.set(event, f);
        return this;
    }
}

module.exports = State;
