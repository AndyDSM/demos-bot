exports.range = function*(n) {
    var index = 0;
    while (index < n)
        yield index++;
}
