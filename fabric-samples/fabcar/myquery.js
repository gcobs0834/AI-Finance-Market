var query = require('./test.js');

query.queryOrderByObject('queryOrderByProductName',['Honda']).then((result)=>{console.log(result)})
