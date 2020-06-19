const models = require('../models')

module.exports = () => {
    return models.sequelize.sync({
        force: true // 기존의 db를 날려버리고 다시 새로 만든다는 의미.
    })
    //  models.sequelize.sync는 내부적으로 promise를 리턴하게 되어 있다.
    // 그래서 비동기 처리를 완료할 수 있도록 인터페이스를 제공한다.
}