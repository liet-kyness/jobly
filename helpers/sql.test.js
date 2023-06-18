const sqlForPartialUpdate = require('./sql');

describe("sqlForPartialUpdate", function () {
    test('works: 1 item', function () {
        const result = sqlForPartialUpdate(
            {f1: 'v1'},
            {f1: 'f1', fF2: 'f2'});
        expect(result).toEqual({
            setCols: "\"f1\"=$1",
            values: ['v1'],
        });
        
    });
});