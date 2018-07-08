class ReactionMap extends Map {
    constructor() {
        super(...arguments);
    }
    getReaction(key) {
        let reaction = this.get(key);
        if (reaction === undefined) {
            return () => false;
        } else return reaction;
    }
}

module.exports = ReactionMap;
