const State = require('./State.js');
const C = require('../util/console.js');

class StateRouter {
    constructor() {
        this.route = [];
        this.stateMap;
        this.key;
    }

    appendStart(arr) {
        for (let i = 0; i < arr.length; i++) {
            //C.logDev(i, arr[i]);
            arr[i].setList(this);
        }
        this.route.splice(0, 0, ...arr);
    }

    appendEnd(arr) {
        for (let i = 0; i < arr.length; i++) {
            arr[i].setList(this);
        }
        this.route.splice(this.route.length, 0, ...arr);
    }

    delete(i) {
        try {
            this.route.splice(i, 1);
            if (this.route.length === 0) this.stateMap.delete(this.key);
        } catch (e) {}
    }

    handlerPromise(state) {
        return function() {
            let args = arguments;
            return new Promise((res, rej) => { // turn every result into a promise
                try { // if error, act like state hasn't handled message
                    let r = state.run(...args); // get result of handling function
                    if (Promise.prototype.isPrototypeOf(r)) r.then(r => { res(r === true); }).catch(e => { rej(e) }); // if promise, wait for result to resolve
                    else res(r === true); // if not promise, just resolve it now
                } catch (e) {
                    rej(e);
                }
            });
        }
    }

    run() {
        let args = arguments;
        return new Promise((res, rej) => {
            if (this.route.length === 0) { // if no states in route, message cant be handled
                res(false);
                return;
            }
            let chain = this.handlerPromise(this.route[0])(...args); // start chain of handling function promises
            for (let i = 1; i < this.route.length; i++) {
                chain = chain.then(handled => { // once previous promise has resolved, check for result
                    if (handled === true) return true; // if result is true, no further handling functions should run
                    else return this.handlerPromise(this.route[i])(...args); // if false, check for next functions
                }).catch(() => false); // error means unhandled message
            }
            chain.then(handled => { // end handling function chain, check for overall result
                res(handled); // return result
            }).catch(() => { res(false) }); // if last promise is an error, return false
        })
    }

    query(func, i) {
        let r = (i !== undefined ? i : null);
        for (let j = 0; j < this.route.length; j++) {
            r = this.route[j].query(func, r);
        }
        return r;
    }

    state() {
        let that = this;
        let r = new State(function() {
            return that.run(...arguments);
        });
        r.query = function(func, r) {
            return that.query(func, r);
        }
        return r;
    }
}

module.exports = StateRouter;
