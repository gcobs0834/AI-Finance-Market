var express = require('express');
var router = express.Router();
var chainQuery = require('../chaincode/newQuery.js');
var chainInvoke = require('../chaincode/newInvoke.js');



router.get('/queryAll', async function(req, res) {
    let a = await chainQuery.queryAll([''])
    res.send(a)
})

router.get('/queryOrderByType/', async function(req, res) {
    let id = req.params.id
    let a = await chainQuery.queryOrderByType(['']); 
    res.send(a);
    res.render('shop/chain.hbs', {
        a:a,
      });
});

router.get('/queryPredictionByType/', async function(req, res) {
  let id = req.params.id
  let a = await chainQuery.queryPredictionByType(['']); 
  res.send(a);
});

router.get('/queryOrderByProductName/:id', async function(req, res) {
    let id = req.params.id
    let a = await chainQuery.queryOrderByProductName([id]); 
    res.send(a);
});

router.get('/queryOrderByBuyer/:id', async function(req, res) {
    let id = req.params.id
    let a = await chainQuery.queryOrderByBuyer([id]); 
    res.send(a);
});

router.get('/queryOrderBySeller/:id', async function(req, res) {
    let id = req.params.id
    let a = await chainQuery.queryOrderBySeller([id]); 
    res.send(a);
});

router.get('/queryPredictionByNumber/:id', async function(req, res) {
  let id = req.params.id
  let a = await chainQuery.queryPredictionByNumber([id]); 
  res.send(a);
});

router.get('/queryPredictionByBondid/:id', async function(req, res) {
  let id = req.params.id
  let a = await chainQuery.queryPredictionByBondid([id]); 
  res.send(a);
});

router.get('/queryPredictionByFund_name/:id', async function(req, res) {
  let id = req.params.id
  let a = await chainQuery.queryPredictionByFund_name([id]); 
  res.send(a);
});




module.exports = router;