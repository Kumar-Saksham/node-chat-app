const expect = require('expect');

const { isRealString } = require('./validation');

describe('isRealString', () => {
    it('should accept string with visible characters', () => {
        const str = 'Hello';
        expect(isRealString(str)).toBe(true);
    })

    it('should reject strings with only invisible characters', () => {
        const str = '       ';
        expect(isRealString(str)).toBe(false);
    })

    it('should reeject non string values', () => {
        const str = 21;
        expect(isRealString(str)).toBe(false);
    })
})