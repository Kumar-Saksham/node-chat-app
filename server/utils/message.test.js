const expect = require("expect");

const { generateMessage, generateLocationMessage } = require("./message");

describe("generateMessge", () => {
  it("should generate correct message object", done => {
    const message = { from: "Admin", text: "Hello how are you" };
    const genMessage = generateMessage(message.from, message.text);

    expect(genMessage.from).toBe(message.from);
    expect(genMessage.text).toBe(message.text);
    expect(typeof genMessage.createdAt).toBe("number");
    done();
  });
});

describe("generateLocationMessage", () => {
  it("should generate correct location message object", () => {
    const locationMessage = {
      from: "Admin",
      latitude: 1234,
      longitude: 5678
    };

    const genLocationMessage = generateLocationMessage(
      locationMessage.from,
      locationMessage.latitude,
      locationMessage.longitude
    );

    expect(genLocationMessage.from).toBe(locationMessage.from);
    expect(genLocationMessage.url).toBe(`https://www.google.com/maps?q=${locationMessage.latitude},${locationMessage.longitude}`);
    expect(typeof genLocationMessage.createdAt).toBe("number");
  });
});
