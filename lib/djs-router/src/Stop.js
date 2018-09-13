class RouteStop {
    constructor(key, fnc) {
        this.key = key;
        this.value = fnc;
        this.fnc = fnc;
        this.parentArrays = [];
        this.parentRouter;
    }
    delete() {
        for (let [arr, key] of this.parentArrays) {
            let i = arr.indexOf(this);
            if (i !== -1) arr.splice(i, 1);
            if (arr.length === 0 && key !== undefined && this.parentRouter !== undefined) this.parentRouter.delete(key);
        }
    }
    pushParent(arr, key) {
        this.parentArrays.push([...arguments]);
    }
    pushRouter(router) {
        this.parentRouter = router;
    }
}

module.exports = RouteStop;
