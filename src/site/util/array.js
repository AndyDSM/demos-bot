exports.removeDups = function(arr_, f) { // sort array, then remove duplicate entries
    if (arr_.length === 0) return [];
    let arr = (f ? arr_.sort(f) : arr_.sort());
    let r = [arr[0]];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] !== arr[i - 1]) r.push(arr[i]);
    }
    return r;
}
