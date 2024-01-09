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

beforeAll(async () => {
  await seed(mongoLink, mongoDbName, allUsers, allCategories, allQuotes);
});
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
              password: expect.any(String),
              avatar: expect.any(String),
            });
          });
        });
    });
  });
  describe("GET User by username", () => {
    test("When given a username and correct password, should return that user", async () => {
      const inputPassword = { password: "banana" };

      return request(app)
        .get("/api/users/ASKJHD")
        .query(inputPassword)
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user).toMatchObject({
            _id: expect.any(String),
            username: "ASKJHD",
            firstname: "james",
            lastname: "harper",
            password: "banana",
            avatar: "quotesnap-fe/assets/avatar.png",
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
    test("400, password is wrong", () => {
      const inputPassword = { password: "jj" };
      return request(app)
        .get("/api/users/Hello")
        .send(inputPassword)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Password is incorrect!");
        });
    });
  });
  describe("POST User", () => {
    test("add a user to the db", () => {
      const toSend = {
        username: "testuser",
        firstname: "test",
        lastname: "user",
        password: "banana",
        avatar: "quotesnap-fe/assets/avatar.png",
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
            password: "banana",
            avatar: "quotesnap-fe/assets/avatar.png",
          });
        });
    });
    test("should fail if missing a key for db - username", () => {
      const toSend = {
        firstname: "test",
        lastname: "user",
        password: "banana",
        avatar: "quotesnap-fe/assets/avatar.png",
      };
      return request(app)
        .post("/api/users")
        .send(toSend)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request!");
        });
    });
    test("should fail if missing a key for db - avatar", () => {
      const toSend = {
        username: "testuser",
        firstname: "test",
        lastname: "user",
        password: "banana",
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
        password: "banana",
        avatar: "quotesnap-fe/assets/avatar.png",
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
        password: "banana",
        avatar: "quotesnap-fe/assets/avatar.png",
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
        password: "banana",
        avatar: "quotesnap-fe/assets/avatar.png",
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
            password: "banana",
            avatar: "quotesnap-fe/assets/avatar.png",
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
        });
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

describe("QUOTES", () => {
  describe("get all quotes", () => {
    test("200, each quote has correct values and check if its an array of quotes", async () => {
      return request(app)
        .get("/api/quotes")
        .expect(200)
        .then(({ body: { quotes } }) => {
          expect(quotes.length).toBe(11);
          quotes.forEach((quote) => {
            expect(quote).toMatchObject({
              quoteText: expect.any(String),
              quoteAuthor: expect.any(String),
              quoteOrigin: expect.any(String),
              quoteLocation: expect.any(String),
              quoteImage: expect.any(String),
              quoteIsPrivate: expect.any(Boolean),
              quoteUser: expect.any(String),
              quoteCategory: expect.any(String),
            });
          });
        });
    });
  });

  describe("post a quote", () => {
    test("add a quote to the db", () => {
      const newQuote = {
        quoteText: "test a POST quote",
        quoteAuthor: "test author",
        quoteOrigin: "fiction book",
        quoteLocation: "[10,10]",
        quoteImage: "apicturelink.jpg",
        quoteIsPrivate: Math.random() > 0.5 ? true : false,
        quoteCategory: "Book",
        quoteUser: "Hello",
      };
      return request(app)
        .post("/api/quotes")
        .send(newQuote)
        .expect(201)
        .then(({ body }) => {
          const quote = body.quote;
          expect(quote).toMatchObject({
            _id: expect.any(String),
            quoteText: "test a POST quote",
            quoteAuthor: "test author",
            quoteOrigin: "fiction book",
            quoteLocation: "[10,10]",
            quoteImage: "apicturelink.jpg",
            quoteIsPrivate: newQuote.quoteIsPrivate,
            quoteCategory: "Book",
            quoteUser: "Hello",
          });
        });
    });

    it("400, bad request - username invalid", () => {
      const newQuote = {
        quoteText: "test a POST quote",
        quoteAuthor: "test author",
        quoteOrigin: "fiction book",
        quoteLocation: "[10,10]",
        quoteImage: "apicturelink.jpg",
        quoteIsPrivate: Math.random() > 0.5 ? true : false,
        quoteCategory: "Book",
        quoteUser: "Pineapple",
      };
      return request(app)
        .post("/api/quotes")
        .send(newQuote)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request - username not found");
        });
    });

    it("400, bad request - missing keys in quote info", () => {
      const newQuote = {
        quoteText: "test a POST quote",
        quoteOrigin: "fiction book",
        quoteLocation: "[10,10]",
        quoteImage: "apicturelink.jpg",
        quoteIsPrivate: Math.random() > 0.5 ? true : false,
        quoteCategory: "Book",
        quoteUser: "Pineapple",
      };
      return request(app)
        .post("/api/quotes")
        .send(newQuote)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request!");
        });
    });
  });

  describe("GET quote by id", () => {
    test("When given an id, should return the quote by that id", async () => {
      return request(app)
        .get("/api/quotes")
        .expect(200)
        .then(({ body: { quotes } }) => {
          const testQuote = quotes[0];
          // console.log(testQuote, "test quote!");
          return request(app)
            .get(`/api/quotes/${testQuote._id}`)
            .expect(200)
            .then(({ body: { quote } }) => {
              //   console.log(quote, "this is quote");
              expect(quote).toEqual(testQuote);
            });
        });
    });

    test("Should fail if id doesnt exist", () => {
      const nonExistId = "65957a74106ffd05f02e7900";
      return request(app)
        .get(`/api/quotes/${nonExistId}`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Quote not found!");
        });
    });
    test("Should fail if id is bad", () => {
      const badID = ";'#[#/.'#";
      return request(app)
        .get(`/api/quotes/${badID}`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid ID!");
        });
    });
    test("Should fail if id is too short", () => {
      const shortID = "65957a74106ffd05f02e790";
      return request(app)
        .get(`/api/quotes/${shortID}`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid ID!");
        });
    });
    test("Should fail if id is too long", () => {
      const longID = "65957a74106ffd05f02e79000";
      return request(app)
        .get(`/api/quotes/${longID}`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid ID!");
        });
    });
  });
  describe("GET all categories", () => {
    test("Should return all categories", () => {
      return request(app)
        .get(`/api/categories`)
        .expect(200)
        .then(({ body: { categories } }) => {
          expect(categories.length).toBe(3);
        });
    });
  });

  describe.only("GET quote by id", () => {
    test("When given an id, should delete the quote", async () => {
      let oldLength;

      return request(app)
        .get("/api/quotes")
        .expect(200)
        .then(({ body: { quotes } }) => {
          const testQuote = quotes[0];
          oldLength = quotes.length;
          return request(app)
            .delete(`/api/quotes/${testQuote._id}`)
            .expect(204)
            .then(() => {
              return request(app)
                .get("/api/quotes")
                .expect(200)
                .then(({ body: { quotes } }) => {
                  expect(quotes.length).toBe(oldLength - 1);
                });
            });
        });
    });
  });
});
