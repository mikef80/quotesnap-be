const request = require("supertest");
const app = require("../app");
const allCategories = require("../data/categoryData");
const allQuotes = require("../data/quoteData");
const allUsers = require("../data/userdata");
const { mongoLink, mongoDbName } = require("../testMongoDB");
const seed = require("../seed");

beforeEach(async () => {
  await seed(mongoLink, mongoDbName, allUsers, allCategories, allQuotes);
});

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
});
