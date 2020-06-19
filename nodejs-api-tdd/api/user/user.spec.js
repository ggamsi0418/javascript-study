const request = require("supertest");
const should = require("should");
const app = require("../../index");
const models = require("../../models");

describe("GET /users는 ", () => {
    const users = [{
            name: "alice",
        },
        {
            name: "bek",
        },
        {
            name: "chris",
        },
    ];
    // done을 가지고 있는 콜백함수를 넘겨주는 이유는 DB 싱크가 비동기로 작업는 일이기 때문이다.
    before(() =>
        models.sequelize.sync({
            force: true,
        })
    );
    before(() => models.User.bulkCreate(users));
    describe("성공시", () => {
        it("user 객체를 담은 배열로 응답한다. ", done => {
            request(app)
                .get("/users")
                .end((err, res) => {
                    res.body.should.be.instanceOf(Array);
                    done();
                });
        });

        it("최대 limit 갯수만큼 응답한다. ", done => {
            request(app)
                .get("/users?limit=2")
                .end((err, res) => {
                    res.body.should.have.length(2);
                    done();
                });
        });
    });

    describe("실패시", () => {
        it("limit이 숫자형이 아니면 400을 응답한다. ", done => {
            //슈퍼테스트 모듈
            request(app).get("/users?limit=two").expect(400).end(done);
        });
    });
});

describe("GET /users/:id은 ", () => {
    const users = [{
            name: "alice",
        },
        {
            name: "bek",
        },
        {
            name: "chris",
        },
    ];
    // done을 가지고 있는 콜백함수를 넘겨주는 이유는 DB 싱크가 비동기로 작업는 일이기 때문이다.
    before(() =>
        models.sequelize.sync({
            force: true,
        })
    );
    before(() => models.User.bulkCreate(users));
    describe("성공시 ", () => {
        it("id가 1인 user 객체를 반환한다. ", done => {
            request(app)
                .get("/users/1")
                .end((err, res) => {
                    res.body.should.have.property("id", 1);
                    done();
                });
        });
    });
    describe("실패시 ", () => {
        it("id가 숫자가 아닐 경우 400으로 응답한다. ", done => {
            request(app).get("/users/one").expect(400).end(done);
        });
        it("id로 user를 찾을 수 없을 경우 404로 응답한다. ", done => {
            request(app).get("/users/999").expect(404).end(done);
        });
    });
});

describe("DELETE /users/:id은", () => {
    const users = [{
            name: "alice",
        },
        {
            name: "bek",
        },
        {
            name: "chris",
        },
    ];
    // done을 가지고 있는 콜백함수를 넘겨주는 이유는 DB 싱크가 비동기로 작업는 일이기 때문이다.
    before(() =>
        models.sequelize.sync({
            force: true,
        })
    );
    before(() => models.User.bulkCreate(users));
    describe("성공시", () => {
        it("204를 응답한다. ", done => {
            request(app).delete("/users/1").expect(204).end(done);
        });
    });
    describe("실패시", () => {
        it("id가 숫자가 아닐 경우 400으로 응답한다. ", done => {
            request(app).delete("/users/one").expect(400).end(done);
        });
    });
});

describe("POST /users", () => {
    const users = [{
            name: "alice",
        },
        {
            name: "bek",
        },
        {
            name: "chris",
        },
    ];
    // done을 가지고 있는 콜백함수를 넘겨주는 이유는 DB 싱크가 비동기로 작업는 일이기 때문이다.
    before(() =>
        models.sequelize.sync({
            force: true,
        })
    );
    before(() => models.User.bulkCreate(users));
    describe("성공시 ", () => {
        let name = "daniel",
            body;
        before(done => {
            request(app)
                .post("/users")
                .send({
                    name,
                }) // ES6 문법
                .expect(201)
                .end((err, res) => {
                    body = res.body;
                    done();
                });
        });
        it("생성된 user 객체를 반환한다.", () => {
            body.should.have.property("id");
        });
        it("입력한 name을 반환한다.", () => {
            body.should.have.property("name", name);
        });
    });
    describe("실패시 ", () => {
        it("name 파라미터 누락시 400을 반환한다.", done => {
            request(app).post("/users").send({}).expect(400).end(done);
        });
        it("name이 중복일 경우 409를 반환한다.", done => {
            request(app)
                .post("/users")
                .send({
                    name: "daniel",
                })
                .expect(409)
                .end(done);
        });
    });
});

describe.only("PUT /Users/:id", () => {
    const users = [{
            name: "alice",
        },
        {
            name: "bek",
        },
        {
            name: "chris",
        },
    ];
    // done을 가지고 있는 콜백함수를 넘겨주는 이유는 DB 싱크가 비동기로 작업는 일이기 때문이다.
    before(() =>
        models.sequelize.sync({
            force: true,
        })
    );
    before(() => models.User.bulkCreate(users));

    describe("성공시", () => {
        it("변경된 name을 응답한다.", done => {
            const name = "den";
            request(app)
                .put("/users/3")
                .send({
                    name,
                })
                .end((err, res) => {
                    res.body.should.have.property("name", name);
                    done();
                });
        });
    });

    describe("실패시", () => {
        it("정수가 아닌 id일 경우 400을 응답한다.", done => {
            request(app).put("/users/one").expect(400).end(done);
        });
        it("name이 없을 경우 400을 응답한다.", done => {
            request(app).put("/users/1").send({}).expect(400).end(done);
        });
        it("없는 user일 경우 404을 응답한다.", done => {
            request(app)
                .put("/users/999")
                .send({
                    name: "foo",
                })
                .expect(404)
                .end(done);
        });
        it("이름이 중복일 경우 409를 응답한다.", done => {
            request(app)
                .put("/users/3")
                .send({
                    name: "bek",
                })
                .expect(409)
                .end(done);
        });
    });
});