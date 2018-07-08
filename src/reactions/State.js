class State {
    constructor(f) {
        this.parentList = undefined;
        if (f) this.run = f;
    }

    run() {
        return false;
    }

    setList(list) {
        this.parentList = list;
    }

    delete() {
        try {
            //console.log(this.parentList);
            //console.log(this.parentList.route.indexOf(this));
            this.parentList.delete(this.parentList.route.indexOf(this));
        } catch (e) {}
    }
}

module.exports = State;
