class Election {
    constructor(cs) {
        this.cs = cs; // candidates
        this.vs = []; // votes
    }
    addVotes(vs) {
        this.vs = this.vs.concat(vs);
    }
    streamVotes(fnc) { // replace with database query function in future
        for (let v of this.vs) {
            fnc(v);
        }
    }

    static aboveThresh(cs, thresh) {
        for (let [k, v] of cs) {
            if (v >= thresh) return v;
        }
        return null;
    }

    static lowestInCands(cs) {
        let rs = '';
        let low = null;
        for (let [k, v] of cs) {
            if (low === null) {
                rs += k;
                low = v;
            } else if (v === low) {
                rs += k;
            } else if (v <= low) {
                rs = k;
                low = v;
            }
        }
        return rs;
    }

    /*
    012345 25 30
    530214
    /[^25][2530]*([^2530]|$)/
    3021
    */

    static elimCandidates(cs, es, fes, vf) { // cs = candidates, es = candidates eliminated, fes = candidates to be eliminated, vf = vote stream
        let to = es + fes;
        let test = new RegExp('^[' + es + '][' + fes + '][' + to + ']*[^' + to + ']');
        let elimVC = 0; // number of votes of eliminated candidates
        let transVC = 0; // number of votes transferred to other candidates
        for (let i of fes) {
            elimVC += cs.get(i);
            cs.delete(i);
        }
        vf(v => {
            let data = test.exec(v); // substring of vote which defines where votes should be transferred - if none, delete entirely
            if (data !== null) {
                let to_ = data[0].charAt(data[0].length - 1);
                cs.set(to_, cs.get(to_) + 1);
            }
        });
        return elimVC - transVC;
    }

    winner(es = '') { // Es = already eliminated candidates
        let cs = new Map();
        this.cs.forEach(x => {
            cs.set(x, 0);
        }); // key: candidate id, value: number of votes

        let totalVotes = 0;
        this.streamVotes(v => {
            cs.set(v[0], cs.get(v[0]) + 1); // assumes v[0] is a candidate
            totalVotes++;
        });
        let threshold = Math.ceil(totalVotes / 2);
        for (let i = 0; i < 10; i++) {
            let abT_ = Election.aboveThresh(cs, threshold); // not null if any candidate has threshold no. of votes
            if (abT_ !== null) return abT_;
            let fes = Election.lowestInCands(cs); // elims = candidates to be eliminated
            totalVotes -= Election.elimCandidates(cs, es, fes, this.streamVotes);
            threshold = Math.ceil(totalVotes / 2);
            es += fes;
        }
        return Symbol('oops');
    }
}

function genVotes(cands, n) {
    function shuffle(arr) {
        let r = [];
        let l = arr.length;
        for (let i = 0; i < l; i++) {
            r.push(arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
        }
        return r;
    }
    let r = [];
    for (let i = 0; i < n; i++) {
        r.push(shuffle(Array.from(cands)).splice(0, Math.floor(Math.random() * cands.length)));
    }
    r = r.map(x => x.reduce((a, e) => a + e, ''));
    return r;
}
