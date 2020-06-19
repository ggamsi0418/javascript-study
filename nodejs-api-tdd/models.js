const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db.sqlite',
    logging: false
});


// 모델 정의, 첫 번째 인자는 테이블명, 두 번째 인자는 테이블의 속성명 
const User = sequelize.define('User', {
    // id는 자동생성
    name: {
        type: Sequelize.DataTypes.STRING, // varchar 255
        unique: true
    }
});

module.exports = {
    Sequelize,
    sequelize,
    User
}