//개발, 배포 시에 따라 다른 설정을 줄 수 있다
if (process.env.NODE_ENV == 'production') {
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');
}
