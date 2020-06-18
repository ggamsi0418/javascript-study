const express = require("express");
const router = express.Router(); // 라우트 클래스로 객체 생성
const ctrl = require('./user.ctrl')


// 기존에는 애플리케이션(app)의 HTTP 메소드들을 사용.
// 이제는 라우터 객체의 HTTP 메소드들 활용
// uri path에서 'users' 생략
router.get("/", ctrl.index);
router.get("/:id", ctrl.show);
router.delete("/:id", ctrl.destroy);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);


// root에 있는  index.js에서 가져다 써야하기 때문에
// 라우터 객체를 module로 exports 한다.
module.exports = router;