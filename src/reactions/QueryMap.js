class QueryMap extends Map {
    constructor() {
        super(...arguments);
    }
    getQuery(key) {
        let query = this.get(key);
        if (query === undefined) {
            return r => r;
        } else return query;
    }
}

module.exports = QueryMap;
