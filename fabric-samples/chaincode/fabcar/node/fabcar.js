/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

'use strict';
const shim = require('fabric-shim');
const util = require('util');

let Chaincode = class {

  // The Init method is called when the Smart Contract 'fabcar' is instantiated by the blockchain network
  // Best practice is to have any Ledger initialization in separate function -- see initLedger()
  async Init(stub) {
    console.info('=========== Instantiated fabcar chaincode ===========');
    return shim.success();
  }

  // The Invoke method is called as a result of an application request to run the Smart Contract
  // 'fabcar'. The calling application program has also specified the particular smart contract
  // function to be called, with arguments
  async Invoke(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);

    let method = this[ret.fcn];
    if (!method) {
      console.error('no function of name:' + ret.fcn + ' found');
      throw new Error('Received unknown function ' + ret.fcn + ' invocation');
    }
    try {
      let payload = await method(stub, ret.params);
      return shim.success(payload);
    } catch (err) {
      console.log(err);
      return shim.error(err);
    }
  }

  async queryOrderFromID(stub, args) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments.');
    }
    let orderID = args[0];

    let jsonRes = {};
    jsonRes.Key = args[0];
    let orderAsBytes = await stub.getState(orderID); //get the car from chaincode state
    if (!orderAsBytes || orderAsBytes.toString().length <= 0) {
      throw new Error(orderID + ' does not exist: ');
    }
    console.log(orderAsBytes.toString());
    jsonRes.Detils = JSON.parse(orderAsBytes.toString('utf8'));
    return Buffer.from(JSON.stringify(jsonRes));
  }

  async initLedger(stub, args) {
    console.info('============= START : Initialize Ledger ===========');
    let cars = [];
    cars.push({
      productName: 'Toyota',
      seller: 'Prius',
      buyer: 'blue',
      purchaseDate: '2018/09/01' ,
      expiryDate: '2018/09/27'
    });
    cars.push({
      productName: 'Ford',
      seller: 'Mustang',
      buyer: 'red',
      purchaseDate: '2018/09/01',
      expiryDate: '2018/09/27'
    });
    for (let i = 0; i < cars.length; i++) {
      cars[i].docType = 'Order';
      await stub.putState('CAR' + i, Buffer.from(JSON.stringify(cars[i])));
      console.info('Added <--> ', cars[i]);
    }
    console.info('============= END : Initialize Ledger ===========');
  }

  async queryAll(stub, args) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments.');
    }

    let startKey = '';
    let endKey = '';

    let iterator = await stub.getStateByRange(startKey,endKey);

    let allResults = [];
    while (true) {
      let res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString('utf8'));

        jsonRes.Key = res.value.key;
        try {
          jsonRes.Detils = JSON.parse(res.value.value.toString('utf8'));
        } catch (err) {
          console.log(err);
          jsonRes.Detils = res.value.value.toString('utf8');
        }
          allResults.push(jsonRes);
      }
      if (res.done) {
        console.log('end of data');
        await iterator.close();
        console.info(allResults);
        return Buffer.from(JSON.stringify(allResults));
      }
    }
  }

  async createOrder(stub, args) {
    console.info('============= START : Create Order ===========');
    if (args.length != 6) {
      throw new Error('Incorrect number of arguments. Expecting 6');
    }

    var order = {
      docType: 'Order',
      productName: args[1],
      seller: args[2],
      buyer: args[3],
      purchaseDate: args[4],
      expiryDate: args[5]
    };

    await stub.putState(args[0], Buffer.from(JSON.stringify(order)));
    console.info('============= END : Create Order ===========');
  }

  async queryOrderByType(stub, args) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments.');
    }

    let startKey = '';
    let endKey = '';

    let iterator = await stub.getStateByRange(startKey,endKey);

    let allResults = [];
    while (true) {
      let res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString('utf8'));

        jsonRes.Key = res.value.key;
        try {
          jsonRes.Detils = JSON.parse(res.value.value.toString('utf8'));
        } catch (err) {
          console.log(err);
          jsonRes.Detils = res.value.value.toString('utf8');
        }
        if (jsonRes.Detils.docType == 'order'){
          allResults.push(jsonRes);
        }
      }
      if (res.done) {
        console.log('end of data');
        await iterator.close();
        console.info(allResults);
        return Buffer.from(JSON.stringify(allResults));
      }
    }
  }

  async queryOrderByProductName(stub, args) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments.');
    }

    let startKey = '';
    let endKey = '';

    let iterator = await stub.getStateByRange(startKey,endKey);

    let allResults = [];
    while (true) {
      let res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString('utf8'));

        jsonRes.Key = res.value.key;
        try {
          jsonRes.Detils = JSON.parse(res.value.value.toString('utf8'));
        } catch (err) {
          console.log(err);
          jsonRes.Detils = res.value.value.toString('utf8');
        }
        if (jsonRes.Detils.productName == args[0]){
          allResults.push(jsonRes);
        }
      }
      if (res.done) {
        console.log('end of data');
        await iterator.close();
        console.info(allResults);
        return Buffer.from(JSON.stringify(allResults));
      }
    }
  }

  async queryOrderByBuyer(stub, args) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments.');
    }

    let startKey = '';
    let endKey = '';

    let iterator = await stub.getStateByRange(startKey,endKey);

    let allResults = [];
    while (true) {
      let res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString('utf8'));

        jsonRes.Key = res.value.key;
        try {
          jsonRes.Detils = JSON.parse(res.value.value.toString('utf8'));
        } catch (err) {
          console.log(err);
          jsonRes.Detils = res.value.value.toString('utf8');
        }
        if (jsonRes.Detils.buyer == args[0]){
          allResults.push(jsonRes);
        }
      }
      if (res.done) {
        console.log('end of data');
        await iterator.close();
        console.info(allResults);
        return Buffer.from(JSON.stringify(allResults));
      }
    }
  }

  async queryOrderBySeller(stub, args) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments.');
    }

    let startKey = '';
    let endKey = '';

    let iterator = await stub.getStateByRange(startKey,endKey);

    let allResults = [];
    while (true) {
      let res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString('utf8'));

        jsonRes.Key = res.value.key;
        try {
          jsonRes.Detils = JSON.parse(res.value.value.toString('utf8'));
        } catch (err) {
          console.log(err);
          jsonRes.Detils = res.value.value.toString('utf8');
        }
        if (jsonRes.Detils.seller == args[0]){
          allResults.push(jsonRes);
        }
      }
      if (res.done) {
        console.log('end of data');
        await iterator.close();
        console.info(allResults);
        return Buffer.from(JSON.stringify(allResults));
      }
    }
  }

  async changeExpiryDate(stub, args) {
    console.info('============= START : changeExpiryDate ===========');
    if (args.length != 2) {
      throw new Error('Incorrect number of arguments. Expecting 2');
    }

    let orderAsBytes = await stub.getState(args[0]);
    let order = JSON.parse(orderAsBytes);
    order.expiryDate = args[1];

    await stub.putState(args[0], Buffer.from(JSON.stringify(order)));
    console.info('============= END : changeExpiryDate ===========');
  }

  //Prediction for gi

  async createPrediction(stub, args) {
    console.info('============= START : Create Order ===========');
    if (args.length != 8) {
      throw new Error('Incorrect number of arguments. Expecting 7');
    }

    var gi = {
      docType: 'Prediction',
      number: args[1],
      bondid: args[2],
      fund_name: args[3],
      value: args[4],
      ma5: args[5],
      rate: args[6],
      date: args[7]
    };

    await stub.putState(args[0], Buffer.from(JSON.stringify(gi)));
    console.info('============= END : Create gi ===========');

  }

  async queryPredictionByType(stub, args) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments.');
    }

    let startKey = '';
    let endKey = '';

    let iterator = await stub.getStateByRange(startKey,endKey);

    let allResults = [];
    while (true) {
      let res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString('utf8'));

        jsonRes.Key = res.value.key;
        try {
          jsonRes.Detils = JSON.parse(res.value.value.toString('utf8'));
        } catch (err) {
          console.log(err);
          jsonRes.Detils = res.value.value.toString('utf8');
        }
        if (jsonRes.Detils.docType == 'Prediction'){
          allResults.push(jsonRes);
        }
      }
      if (res.done) {
        console.log('end of data');
        await iterator.close();
        console.info(allResults);
        return Buffer.from(JSON.stringify(allResults));
      }
    }
  }

  async queryPredictionByNumber(stub, args) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments.');
    }

    let startKey = '';
    let endKey = '';

    let iterator = await stub.getStateByRange(startKey,endKey);

    let allResults = [];
    while (true) {
      let res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString('utf8'));

        jsonRes.Key = res.value.key;
        try {
          jsonRes.Detils = JSON.parse(res.value.value.toString('utf8'));
        } catch (err) {
          console.log(err);
          jsonRes.Detils = res.value.value.toString('utf8');
        }
        if (jsonRes.Detils.number == args[0]){
          allResults.push(jsonRes);
        }
      }
      if (res.done) {
        console.log('end of data');
        await iterator.close();
        console.info(allResults);
        return Buffer.from(JSON.stringify(allResults));
      }
    }
  }

  async queryPredictionByBondid(stub, args) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments.');
    }

    let startKey = '';
    let endKey = '';

    let iterator = await stub.getStateByRange(startKey,endKey);

    let allResults = [];
    while (true) {
      let res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString('utf8'));

        jsonRes.Key = res.value.key;
        try {
          jsonRes.Detils = JSON.parse(res.value.value.toString('utf8'));
        } catch (err) {
          console.log(err);
          jsonRes.Detils = res.value.value.toString('utf8');
        }
        if (jsonRes.Detils.bondid == args[0]){
          allResults.push(jsonRes);
        }
      }
      if (res.done) {
        console.log('end of data');
        await iterator.close();
        console.info(allResults);
        return Buffer.from(JSON.stringify(allResults));
      }
    }
  }

  async queryPredictionByFund_name(stub, args) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments.');
    }

    let startKey = '';
    let endKey = '';

    let iterator = await stub.getStateByRange(startKey,endKey);

    let allResults = [];
    while (true) {
      let res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString('utf8'));

        jsonRes.Key = res.value.key;
        try {
          jsonRes.Detils = JSON.parse(res.value.value.toString('utf8'));
        } catch (err) {
          console.log(err);
          jsonRes.Detils = res.value.value.toString('utf8');
        }
        if (jsonRes.Detils.fund_name == args[0]){
          allResults.push(jsonRes);
        }
      }
      if (res.done) {
        console.log('end of data');
        await iterator.close();
        console.info(allResults);
        return Buffer.from(JSON.stringify(allResults));
      }
    }
  }

};

shim.start(new Chaincode());
