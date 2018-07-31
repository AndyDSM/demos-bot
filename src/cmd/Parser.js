class Parser {
    static name(str, pr) {
        let name = str.match(new RegExp(pr + '[^ ]+'));
        if (name === null) return name;
        else return name[0].substring(pr.length);
    }

    static args(str) {

    }
}
