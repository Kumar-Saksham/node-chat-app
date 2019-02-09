const expect = require('expect');

const {generateMessage} = require('./message');

describe('generateMessge', () => {
    it("should generate correct message object", done => {
        const message = { from: "Admin", text: "Hello how are you" }
        const genMessage = generateMessage(message.from, message.text);

        expect(genMessage.from).toBe(message.from);
        expect(genMessage.text).toBe(message.text);
        expect(typeof genMessage.createdAt).toBe('number');
        done();
    });
});