//As i am using atlas mongo for this it is online elsewhere, this means that each test
//takes roughly 1 second to run, dont worry if running 'npm run test-db' takes a while!

const request = require("supertest");
const app = require("../app");
const allCategories = require("../data/categoryData");
const allQuotes = require("../data/quoteData");
const allUsers = require("../data/userdata");
const { mongoLink, mongoDbName } = require("../testMongoDB");
const seed = require("../seed");
const endpoints = require("../endpoints.json");

//reset db before each test
beforeEach(async () => {
  await seed(mongoLink, mongoDbName, allUsers, allCategories, allQuotes);
});

//reset db to base state after testing, was acting funny without this?
afterAll(async () => {
  await seed(mongoLink, mongoDbName, allUsers, allCategories, allQuotes);
});

describe("USERS", () => {
  describe("GET All Users", () => {
    test("should return all of the users in the database", async () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users.length).toBe(6);
          users.forEach((user) => {
            expect(user).toMatchObject({
              _id: expect.any(String),
              username: expect.any(String),
              firstname: expect.any(String),
              lastname: expect.any(String),
              email: expect.any(String),
            });
          });
        });
    });
  });
  describe("GET User by username", () => {
    test("When given a username, should return the document for that user", async () => {
      return request(app)
        .get("/api/users/ASKJHD")
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user).toMatchObject({
            _id: expect.any(String),
            username: "ASKJHD",
            firstname: "james",
            lastname: "harper",
            email: "b@a.com",
          });
        });
    });
    test("If username doesnt exist, return 404", () => {
      return request(app)
        .get("/api/users/banana")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Username not found!");
        });
    });
  });
  describe("POST User", () => {
    test("add a user to the db", () => {
      const toSend = {
        username: "testuser",
        firstname: "test",
        lastname: "user",
        email: "test@user.com",
      };
      return request(app)
        .post("/api/users")
        .send(toSend)
        .expect(201)
        .then(({ body: { user } }) => {
          expect(user).toMatchObject({
            _id: expect.any(String),
            username: "testuser",
            firstname: "test",
            lastname: "user",
            email: "test@user.com",
          });
        });
    });
    test("should fail if missing a key for db - username", () => {
      const toSend = {
        firstname: "test",
        lastname: "user",
        email: "test@user.com",
      };
      return request(app)
        .post("/api/users")
        .send(toSend)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request!");
        });
    });
    test("should fail if missing a key for db - email", () => {
      const toSend = {
        username: "testuser",
        firstname: "test",
        lastname: "user",
      };
      return request(app)
        .post("/api/users")
        .send(toSend)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request!");
        });
    });
    test("should fail if missing a key for db - firstname", () => {
      const toSend = {
        username: "testuser",
        lastname: "user",
        email: "test@user.com",
      };
      return request(app)
        .post("/api/users")
        .send(toSend)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request!");
        });
    });
    test("should fail if missing a key for db - lastname", () => {
      const toSend = {
        username: "testuser",
        firstname: "test",
        email: "test@user.com",
      };
      return request(app)
        .post("/api/users")
        .send(toSend)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request!");
        });
    });
    test("should fail if username is already in db", () => {
      const toSend = {
        username: "ASKJHD",
        firstname: "test",
        lastname: "user",
        email: "test@user.com",
      };
      return request(app)
        .post("/api/users")
        .send(toSend)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("User already exists!");
        });
    });
  });
  describe("PATCH User", () => {
    test("Update a users first/last name in the database", () => {
      const newData = {
        firstname: "newName",
        lastname: "newLastName",
      };
      return request(app)
        .patch("/api/users/ASKJHD")
        .send(newData)
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user).toMatchObject({
            username: "ASKJHD",
            firstname: "newName",
            lastname: "newLastName",
            email: "b@a.com",
          });
        });
    });
    test("Should fail if no update params set", () => {
      const newData = {};
      return request(app)
        .patch("/api/users/ASKJHD")
        .send(newData)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request!");
        });
    });
    test("Should fail if username does not exist", () => {
      const newData = {
        firstname: "newName",
        lastname: "newLastName",
      };
      return request(app)
        .patch("/api/users/banana")
        .send(newData)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Username not found!");
        });
    });
  });
  describe("DELETE User", () => {
    test("Sould remove a users document from the users collection", () => {
      return request(app)
        .delete("/api/users/ASKJHD")
        .expect(204)
        .then(() => {
          return request(app).get("/api/users/ASKJHD").expect(404);
        })
        .then(({ body }) => {
          expect(body.msg).toBe("Username not found!");
        });
    });
    test("If username doesnt exist and cant be deleted, then something went wrong", () => {
      return request(app)
        .delete("/api/users/banana")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Something went wrong - try again!");
        });
    });
  });
});

describe("ENDPOINTS", () => {
  it("GET:200 should a list of endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});

describe.only("QUOTES", () => {
  test("200, each quote has correct values and check if its an array of quotes", async () => {
    return request(app)
      .get("/api/quotes")
      .expect(200)
      .then(({ body: { quotes } }) => {
        console.log(quotes);
        expect(quotes.length).toBe(11);
        quotes.forEach((quote) => {
          expect(quote).toMatchObject({
            quoteText: expect.any(String),
            quoteAuthor: expect.any(String),
            quoteOrigin: expect.any(String),
            quoteLocation: expect.any(String),
            quoteImage: expect.any(String),
            quoteIsPrivate: expect.any(Boolean),
            userId: expect.any(String),
            categoryId: expect.any(String),
          });
        });
      });
  });
});
