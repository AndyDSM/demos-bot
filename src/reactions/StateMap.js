const StateRouter = require('./StateRouter.js');

class StateMap extends Map {
    constructor() {
        super(...arguments);
    }
    getStateRouter(key) {
        let stateRoute = this.get(key);
        if (stateRoute === undefined) {
            return new StateRouter();
        } else return stateRoute;
    }

    addState(key, state) {
        let stateRoute = this.get(key);
        if (stateRoute === undefined) {
            stateRoute = new StateRouter();
            this.setId(key, stateRoute);
        }
        stateRoute.appendStart([state]);
    }

    setId(key, value) {
        value.stateMap = this;
        value.key = key;
        this.set(key, value);
    }
}

module.exports = StateMap;
