const RouterData = require('./Data.js');
const Stop = require('./Stop.js');
const C = require('../util/console.js');
const util = require('../util/util.js');

class RouteMap extends Map {
    constructor() {
        super();
        this.regExp = [];
        this.getKey = data => data.key;
        this.deletable_ = false;
        this.cont = { // whether to continue through stops in parent routers given certain states
            error: false, // any stops throw an error (either sync or through promises) (internal)
            empty: true, // getRoute() is empty (external)
            nonEmpty: true, // getRoute() is not empty (external)
            bubble: true, // whether this route terminating in stops should terminate parent routers too
        };
    }
    deletable(bool) {
        this.deletable_ = bool === true;
    }
    continue (i) {
        for (let i_ of Object.keys(i)) {
            if (typeof i[i_] === 'boolean') this.cont[i_] = i[i_];
        }
    }
    getRegexRoute(key) {
        let r = []; // identity array
        for (let i of this.regExp) { // iterate through all regExp stops
            if (i.key.test(key)) r.push(i); // if key satisfies regex, add to return array
        }
        return r;
    }
    setRegex(stop, atStart) {
        for (let [k, v] of this[Symbol.iterator]()) { // iterate through all map arrays
            if (stop.key.test(k)) { // is k valid string to regex
                stop.pushParent(v); // if ye, give that bad boy regex a reference to new array
                if (atStart) v.splice(0, 0, stop); // put regex stop in array
                else v.push(stop);
            }
        }
    }
    setRoute(stop, atStart) { // place stop (function) in appropriate routes
        stop.pushRouter(this);
        if (typeof stop.key === 'string') { // if key is a string, create new array in map with string as key
            let arr = this.get(stop.key);
            if (arr === undefined) { // if no array in map, create one and place stop + all valid regex in route before
                let arr_ = this.getRegexRoute(stop.key); // get valid regex stops
                if (atStart) arr_.splice(0, 0, stop); // put at start of new array if needed
                else arr_.push(stop);
                for (let i of arr_) {
                    i.pushParent(arr_); // make sure all stops have reference to new array
                }
                this.set(stop.key, arr_); // place in map
            } else { // if array in map, just place in array
                stop.pushParent(arr); // make sure new stop has reference to new array
                if (atStart) arr.splice(0, 0, stop);
                else arr.push(stop);
            }
        } else { // if key is regex, put in all map arrays with key satisfying regex, as well as global regex route just in case
            stop.pushParent(this.regExp); // make sure new stop has reference to regex array
            if (atStart) this.regExp.splice(0, 0, stop); // you get the idea
            else this.regExp.push(stop); // or at least you should
            this.setRegex(stop, atStart); // put that bad boy regex in all array maps with valid keys
        }
    }
    getRoute(key) {
        if (key === util.symbol.skipRouter) return [];
        let route = this.get(key);
        if (route === undefined) return this.getRegexRoute(key);
        else return route;
    }

    getStop(args) { // convert (key, value) or just (value) into Stop object
        let key = /[^]*/,
            value;
        if (typeof args[0] === 'string' || RegExp.prototype.isPrototypeOf(args[0])) {
            key = args[0];
            value = args[1];
        } else {
            value = args[0];
        }
        if (!Function.prototype.isPrototypeOf(value)) { // if value is not function, convert to function
            //C.logDev(value);
            value = value.toStop();
        };
        let s = new Stop(key, value);
        return s;
    }
    stop() { // (key, value), or just (value),
        this.setRoute(this.getStop(arguments), false); // put function in appropriate routes
    }
    stops(ss_) { // [[key,value]*], or just [[value]*]
        let ss;
        if (!Array.prototype.isPrototypeOf(ss)) ss = ss_.toStops();
        else ss = ss_;
        for (let s of ss) {
            this.setRoute(this.getStop(s), false);
        }
    }
    start() { // (key, value), or just (value),
        this.setRoute(this.getStop(arguments), true); // put function at start of appropriate routes
    }
    starts(ss_) { // [[key,value]*], or just [[value]*]
        let ss;
        if (!Array.prototype.isPrototypeOf(ss)) ss = ss_.toStops();
        else ss = ss_;
        for (let s in ss) {
            this.setRoute(this.getStop(s), true);
        }
    }
    route(key, data_) {
        let that = this;
        //console.log('key:', data_.key);
        return new Promise((res_, rej_) => {
            let data;
            if (RouterData.prototype.isPrototypeOf(data_)) data = data_; // if data_ doesnt need parser boy, just assign that boy
            else {
                data = new RouterData(); // get the key parser boy
                data = Object.assign(data, data_); // add relevant properties
                data.key = key;
            }

            let currStop = new Promise((res, rej) => { res() }); // starting promise just so i can apply .then() to it without any if statements
            let route = that.getRoute(key); // relevant stops to this route
            if (route.length === 0) {
                res_(that.cont.empty)
            }
            for (let stopNo in route) { // iterate through stops
                let stop = route[stopNo]; // actually get stop you dingus
                currStop = currStop.then(() => new Promise((res, rej) => { // add promise wrapper of stop to route chain
                    let next = function(cont) { // finishing function
                        if (stop.deleteNext) {
                            stop.delete(); // if necessary, delete this stop from future routing
                            stop.deleteNext = false;
                        }
                        if (cont === undefined || cont) res(); // continue to next stop
                        else rej(); // if cont === false, finish route here
                    };
                    try {
                        stop.deleteNext = false; // whether to delete this stop from all future routes after next() is called
                        data.deleteStop = () => { stop.deleteNext = true };
                        stop.value(data, next); // run function
                    } catch (e) {
                        next(that.cont.error); // if error, just keep on going lad
                    }
                }));
            }
            currStop.then(() => { res_(that.cont.nonEmpty) }).catch(() => { res_(that.cont.bubble ? false : that.cont.nonEmpty) }); // overall promise finish
        });
    }

    keyer(keyfnc) { // define key modifying function for router if necessary
        this.getKey = keyfnc;
    }

    anyStops() { // returns false if there are no stops in any routes, true else
        try {
            if (this.regExp.length > 0) return true; // if anything in this.regExp, we know theres some left lol
            for (let [k, v] of this[Symbol.iterator]()) { // iterate through map arrays
                if (v.length > 0) { // if theres anything in any map array, just return true and ignore the rest
                    return true;
                }
            }
        } catch (e) { C.logError(e) }; // just in case you know
        return false; // if havent already returned, either theres an error or theres none left, return false for both
    }

    toStop() { // if subrouting, this converts router into stop
        let that = this;
        return function(data, next) {
            //console.log('hello');
            let currKey = data.key;
            let sameKey = false;
            let dataDeleteStop = data.deleteStop; // will get overwritten by this router, so gotta make sure to save
            new Promise((res, rej) => { // get the key
                try {
                    let k = that.getKey(data);
                    if (Promise.prototype.isPrototypeOf(k)) { // if keyer returns promise, wait for promise to resolve
                        k.then(res).catch((e) => {
                            C.logError(e);
                            res(data.key); // on error return original key (this is stupid)
                        });
                    } else {
                        res(k); // if not a promise, return straight away
                    }
                } catch (e) {
                    C.logError(e);
                    res(data.key); // (this is also stupid)
                }
            }).then(key => { // we got the key, now run the route
                if (key === currKey) sameKey = true; // if key hasn't changed, dont bother adding it to the list
                else {
                    data.key = key;
                }
                //console.log('key:', key, data.keys);
                return that.route(key, data); // run through this router's route with the key gotten and parent's data
            }).then(next_data => { // returning result back to parent
                if (!sameKey) data.keys.splice(data.keys.length - 1, 1); // if key never changed, dont bother getting rid of the latest one
                if (that.deletable_ && !that.anyStops()) dataDeleteStop(); // if necessary (i.e. user wants to and theres no stops left), delete

                next(next_data); // return what this router gave back to parent router
            }).catch(e => { // error handling
                C.logError(e);
                if (!sameKey) data.keys.splice(data.keys.length - 1, 1);
                if (this.deletable_ && !this.anyStops()) dataDeleteStop();
                next(that.cont.bubble ? that.cont.error : that.cont.nonEmpty); // return this router's error spec to parent router
            });
        };
    }
}

module.exports = RouteMap;
