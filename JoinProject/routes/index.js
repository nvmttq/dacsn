
const authRouter = require('./auth.js');
const homeRouter = require('./home.js');
function route(app) {

    app.use('/', homeRouter);
    app.use('/auth', authRouter);
    
}

module.exports = route