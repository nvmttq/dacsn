
const homeRouter = require('./home.js');
function route(app) {

    app.use('/', homeRouter);
   
}

module.exports = route