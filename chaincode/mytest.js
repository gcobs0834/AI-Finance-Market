const invoke = require('./newInvoke.js');

async function a1() {
    let date = new Date;
    await invoke.createPrediction(['ObjectId("1234")', 'one', 'AC0022', '摩根新興日本基金', '20.569', '21.872', '6.329', date.toString()]);
    
}

a1()