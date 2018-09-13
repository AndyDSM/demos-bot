class Hasher {

    static helixBound(x, c) {
        let fT = (x, c) => {
            let xr = Math.floor((1 + Math.sqrt(1 + 8 * x)) / 2);
            return c - xr + (c + 1) * (Math.floor(x) - xr * (xr - 1) / 2);
        }
        let cT = c * (c - 1);

        if (x < cT / 2) return fT(x, c);
        else return cT - 1 - fT(cT - x - 1, c);
    }

    static fanInteger(x, c) {
        return (c + 1) * Math.floor(x) - c * c * Math.floor(x / c);
    }

    static fanNatural(x, c) {
        let xr = Math.floor((1 + Math.sqrt(1 + 8 * x)) / 2);
        let cT = c * (c - 1) / 2
        if (x < cT) return c - xr + (c + 1) * (Math.floor(x) - xr * (xr - 1) / 2);
        else return (c + 1) * Math.floor(x - cT) - c * c * Math.floor((x - cT) / c);
    }

    static fanBound(x, c, m) {
        let fx = Math.floor(x) % m;
        let cmc = Math.ceil(m / c);
        if (x < (m - c * (cmc - 1)) * cmc) return c * fx + (1 - c * cmc) * Math.floor(x / cmc);
        else return c * (fx - m + c * cmc - c) + (1 + c - c * cmc) * Math.floor(c + (x - m) / (cmc - 1));
    }

    static shake(x, c) {
        return 2 * c * Math.floor(x / c) - Math.floor(x) + c - 1;
    }

    static shakeBound(x, c, m) {
        let cxc = c * Math.floor(x / c);
        let r = cxc - Math.floor(x) - 1;
        if (x < c * Math.floor(m / c)) return r + cxc + c;
        else r + m;
    }

    /*
        f in form (x,m) => output
    */
    static boundToInt(f, x, m) { // (f (hash function), x (input), m (max bounded input))
        return f(x % m, m) + m * Math.floor(x / m);
    }

    static genRange(n) {
        let r = [];
        for (let i = 0; i < n; i++) {
            r.push(i);
        }
        return r;
    }

}

module.exports = Hasher;
