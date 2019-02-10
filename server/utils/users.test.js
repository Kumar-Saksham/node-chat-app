const expect = require("expect");

const { Users } = require("./users");

describe("Users", () => {
  let users;

  beforeEach(() => {
    users = new Users();
    users.users = [
      {
        id: 1,
        name: "U1",
        room: "R1"
      },
      {
        id: 2,
        name: "U2",
        room: "R1"
      },
      {
        id: 3,
        name: "U3",
        room: "R3"
      }
    ];
  });

  it("should add new user", () => {
    const users = new Users();
    const user = {
      id: "123",
      name: "saksham",
      room: "Hello"
    };

    const res = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });

  it("should return all user in room 1", () => {
      expect(users.getUserList("R1")).toEqual(["U1", "U2"]);
  })

  it("should find User with id 2", () => {
      expect(users.getUser(2)).toEqual(users.users[1]);
  })

  it("should not get User with 100", () => {
      expect(users.getUser(99)).toBeFalsy();
  })

  it("should remove user with id 1", () => {
      const user1 = users.users[0];
      expect(users.removeUser(1)).toBe(user1);
      expect(users.getUser(1)).toBeFalsy();
  })

  it("should not remove user", () => {
      expect(users.removeUser(100)).toBeFalsy();
      expect(users.users.length).toBe(3);
  })
});
