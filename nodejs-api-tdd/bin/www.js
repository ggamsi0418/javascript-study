const app = require('../index');
const syncDb = require('./sync-db');

// promise를 리턴하기 때문에 then을 사용할 수 있다.
syncDb().then(_ => {
    console.log('Sync Database!');
    app.listen(3000, () => {
        console.log('Server is running on 3000 port');
    });
});