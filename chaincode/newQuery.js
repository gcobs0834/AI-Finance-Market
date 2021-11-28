'use strict';
/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/
/*
 * Chaincode query
 */

var Fabric_Client = require('fabric-client');
var path = require('path');
var util = require('util');
var os = require('os');

//
var fabric_client = new Fabric_Client();

var channel = fabric_client.newChannel('mychannel');
var peer = fabric_client.newPeer('grpc://localhost:7051');
channel.addPeer(peer);

var store_path = path.join(__dirname, 'hfc-key-store');

var queryAll = async function(args) {

    let result = await Fabric_Client.newDefaultKeyValueStore({path: store_path})
    .then((state_store) =>{
        fabric_client.setStateStore(state_store);
        var crypto_suite = Fabric_Client.newCryptoSuite();
        var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
        crypto_suite.setCryptoKeyStore(crypto_store);
        fabric_client.setCryptoSuite(crypto_suite);
        return fabric_client.getUserContext('user1', true);
    }).then((user_from_store) => {

        if (user_from_store && user_from_store.isEnrolled()) {
            console.log('Successfully loaded user1 from persistence');
        } else {
            throw new Error('Failed to get user1.... run registerUser.js');
        }

        var request = {
            chaincodeId: 'fabcar',
            fcn: 'queryAll',
            args: args
        };
        return channel.queryByChaincode(request);
    }).then((query_responses) =>{
        if (query_responses && query_responses.length == 1) {
            if (query_responses[0] instanceof Error) {
                console.error("error from query = ", query_responses[0]);
            } else {
                let result = JSON.parse(query_responses[0])
                return result;
            }
        } else {
            throw new Error('No payloads were returned from query')
        }
    }).catch((err) => {
        console.error('Failed to query successfully :: ' + err);
    })

    return result

}

var queryOrderByType = async function(args) {

    let result = await Fabric_Client.newDefaultKeyValueStore({path: store_path})
    .then((state_store) =>{
        fabric_client.setStateStore(state_store);
        var crypto_suite = Fabric_Client.newCryptoSuite();
        var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
        crypto_suite.setCryptoKeyStore(crypto_store);
        fabric_client.setCryptoSuite(crypto_suite);
        return fabric_client.getUserContext('user1', true);
    }).then((user_from_store) => {

        if (user_from_store && user_from_store.isEnrolled()) {
            console.log('Successfully loaded user1 from persistence');
        } else {
            throw new Error('Failed to get user1.... run registerUser.js');
        }

        var request = {
            chaincodeId: 'fabcar',
            fcn: 'queryOrderByType',
            args: args
        };
        return channel.queryByChaincode(request);
    }).then((query_responses) =>{
        if (query_responses && query_responses.length == 1) {
            if (query_responses[0] instanceof Error) {
                console.error("error from query = ", query_responses[0]);
            } else {
                let result = JSON.parse(query_responses[0])
                return result;
            }
        } else {
            throw new Error('No payloads were returned from query')
        }
    }).catch((err) => {
        console.error('Failed to query successfully :: ' + err);
    })

    return result

}

var queryOrderByProductName = async function(args) {

    let result = await Fabric_Client.newDefaultKeyValueStore({path: store_path})
    .then((state_store) =>{
        fabric_client.setStateStore(state_store);
        var crypto_suite = Fabric_Client.newCryptoSuite();
        var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
        crypto_suite.setCryptoKeyStore(crypto_store);
        fabric_client.setCryptoSuite(crypto_suite);
        return fabric_client.getUserContext('user1', true);
    }).then((user_from_store) => {

        if (user_from_store && user_from_store.isEnrolled()) {
            console.log('Successfully loaded user1 from persistence');
        } else {
            throw new Error('Failed to get user1.... run registerUser.js');
        }

        var request = {
            chaincodeId: 'fabcar',
            fcn: 'queryOrderByProductName',
            args: args
        };
        return channel.queryByChaincode(request);
    }).then((query_responses) =>{
        if (query_responses && query_responses.length == 1) {
            if (query_responses[0] instanceof Error) {
                console.error("error from query = ", query_responses[0]);
            } else {
                let result = JSON.parse(query_responses[0])
                return result;
            }
        } else {
            throw new Error('No payloads were returned from query')
        }
    }).catch((err) => {
        console.error('Failed to query successfully :: ' + err);
    })

    return result

}

var queryOrderByBuyer = async function(args) {

    let result = await Fabric_Client.newDefaultKeyValueStore({path: store_path})
    .then((state_store) =>{
        fabric_client.setStateStore(state_store);
        var crypto_suite = Fabric_Client.newCryptoSuite();
        var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
        crypto_suite.setCryptoKeyStore(crypto_store);
        fabric_client.setCryptoSuite(crypto_suite);
        return fabric_client.getUserContext('user1', true);
    }).then((user_from_store) => {

        if (user_from_store && user_from_store.isEnrolled()) {
            console.log('Successfully loaded user1 from persistence');
        } else {
            throw new Error('Failed to get user1.... run registerUser.js');
        }

        var request = {
            chaincodeId: 'fabcar',
            fcn: 'queryOrderByBuyer',
            args: args
        };
        return channel.queryByChaincode(request);
    }).then((query_responses) =>{
        if (query_responses && query_responses.length == 1) {
            if (query_responses[0] instanceof Error) {
                console.error("error from query = ", query_responses[0]);
            } else {
                let result = JSON.parse(query_responses[0])
                return result;
            }
        } else {
            throw new Error('No payloads were returned from query')
        }
    }).catch((err) => {
        console.error('Failed to query successfully :: ' + err);
    })

    return result

}

var queryOrderBySeller = async function(args) {

    let result = await Fabric_Client.newDefaultKeyValueStore({path: store_path})
    .then((state_store) =>{
        fabric_client.setStateStore(state_store);
        var crypto_suite = Fabric_Client.newCryptoSuite();
        var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
        crypto_suite.setCryptoKeyStore(crypto_store);
        fabric_client.setCryptoSuite(crypto_suite);
        return fabric_client.getUserContext('user1', true);
    }).then((user_from_store) => {

        if (user_from_store && user_from_store.isEnrolled()) {
            console.log('Successfully loaded user1 from persistence');
        } else {
            throw new Error('Failed to get user1.... run registerUser.js');
        }

        var request = {
            chaincodeId: 'fabcar',
            fcn: 'queryOrderBySeller',
            args: args
        };
        return channel.queryByChaincode(request);
    }).then((query_responses) =>{
        if (query_responses && query_responses.length == 1) {
            if (query_responses[0] instanceof Error) {
                console.error("error from query = ", query_responses[0]);
            } else {
                let result = JSON.parse(query_responses[0])
                return result;
            }
        } else {
            throw new Error('No payloads were returned from query')
        }
    }).catch((err) => {
        console.error('Failed to query successfully :: ' + err);
    })

    return result

}

var queryOrderByID = async function(args) {

    let result = await Fabric_Client.newDefaultKeyValueStore({path: store_path})
    .then((state_store) =>{
        fabric_client.setStateStore(state_store);
        var crypto_suite = Fabric_Client.newCryptoSuite();
        var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
        crypto_suite.setCryptoKeyStore(crypto_store);
        fabric_client.setCryptoSuite(crypto_suite);
        return fabric_client.getUserContext('user1', true);
    }).then((user_from_store) => {

        if (user_from_store && user_from_store.isEnrolled()) {
            console.log('Successfully loaded user1 from persistence');
        } else {
            throw new Error('Failed to get user1.... run registerUser.js');
        }

        var request = {
            chaincodeId: 'fabcar',
            fcn: 'queryOrderFromID',
            args: args
        };
        return channel.queryByChaincode(request);
    }).then((query_responses) =>{
        if (query_responses && query_responses.length == 1) {
            if (query_responses[0] instanceof Error) {
                console.error("error from query = ", query_responses[0]);
            } else {
                let result = JSON.parse(query_responses[0])
                return result;
            }
        } else {
            throw new Error('No payloads were returned from query')
        }
    }).catch((err) => {
        console.error('Failed to query successfully :: ' + err);
    })

    return result

}

//query prediction

var queryPredictionByType = async function(args) {

    let result = await Fabric_Client.newDefaultKeyValueStore({path: store_path})
    .then((state_store) =>{
        fabric_client.setStateStore(state_store);
        var crypto_suite = Fabric_Client.newCryptoSuite();
        var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
        crypto_suite.setCryptoKeyStore(crypto_store);
        fabric_client.setCryptoSuite(crypto_suite);
        return fabric_client.getUserContext('user1', true);
    }).then((user_from_store) => {

        if (user_from_store && user_from_store.isEnrolled()) {
            console.log('Successfully loaded user1 from persistence');
        } else {
            throw new Error('Failed to get user1.... run registerUser.js');
        }

        var request = {
            chaincodeId: 'fabcar',
            fcn: 'queryPredictionByType',
            args: args
        };
        return channel.queryByChaincode(request);
    }).then((query_responses) =>{
        if (query_responses && query_responses.length == 1) {
            if (query_responses[0] instanceof Error) {
                console.error("error from query = ", query_responses[0]);
            } else {
                let result = JSON.parse(query_responses[0])
                return result;
            }
        } else {
            throw new Error('No payloads were returned from query')
        }
    }).catch((err) => {
        console.error('Failed to query successfully :: ' + err);
    })

    return result

}

var queryPredictionByNumber = async function(args) {

    let result = await Fabric_Client.newDefaultKeyValueStore({path: store_path})
    .then((state_store) =>{
        fabric_client.setStateStore(state_store);
        var crypto_suite = Fabric_Client.newCryptoSuite();
        var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
        crypto_suite.setCryptoKeyStore(crypto_store);
        fabric_client.setCryptoSuite(crypto_suite);
        return fabric_client.getUserContext('user1', true);
    }).then((user_from_store) => {

        if (user_from_store && user_from_store.isEnrolled()) {
            console.log('Successfully loaded user1 from persistence');
        } else {
            throw new Error('Failed to get user1.... run registerUser.js');
        }

        var request = {
            chaincodeId: 'fabcar',
            fcn: 'queryPredictionByNumber',
            args: args
        };
        return channel.queryByChaincode(request);
    }).then((query_responses) =>{
        if (query_responses && query_responses.length == 1) {
            if (query_responses[0] instanceof Error) {
                console.error("error from query = ", query_responses[0]);
            } else {
                let result = JSON.parse(query_responses[0])
                return result;
            }
        } else {
            throw new Error('No payloads were returned from query')
        }
    }).catch((err) => {
        console.error('Failed to query successfully :: ' + err);
    })

    return result

}

var queryPredictionByBondid = async function(args) {

    let result = await Fabric_Client.newDefaultKeyValueStore({path: store_path})
    .then((state_store) =>{
        fabric_client.setStateStore(state_store);
        var crypto_suite = Fabric_Client.newCryptoSuite();
        var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
        crypto_suite.setCryptoKeyStore(crypto_store);
        fabric_client.setCryptoSuite(crypto_suite);
        return fabric_client.getUserContext('user1', true);
    }).then((user_from_store) => {

        if (user_from_store && user_from_store.isEnrolled()) {
            console.log('Successfully loaded user1 from persistence');
        } else {
            throw new Error('Failed to get user1.... run registerUser.js');
        }

        var request = {
            chaincodeId: 'fabcar',
            fcn: 'queryPredictionByBondid',
            args: args
        };
        return channel.queryByChaincode(request);
    }).then((query_responses) =>{
        if (query_responses && query_responses.length == 1) {
            if (query_responses[0] instanceof Error) {
                console.error("error from query = ", query_responses[0]);
            } else {
                let result = JSON.parse(query_responses[0])
                return result;
            }
        } else {
            throw new Error('No payloads were returned from query')
        }
    }).catch((err) => {
        console.error('Failed to query successfully :: ' + err);
    })

    return result

}

var queryPredictionByFund_name = async function(args) {

    let result = await Fabric_Client.newDefaultKeyValueStore({path: store_path})
    .then((state_store) =>{
        fabric_client.setStateStore(state_store);
        var crypto_suite = Fabric_Client.newCryptoSuite();
        var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
        crypto_suite.setCryptoKeyStore(crypto_store);
        fabric_client.setCryptoSuite(crypto_suite);
        return fabric_client.getUserContext('user1', true);
    }).then((user_from_store) => {

        if (user_from_store && user_from_store.isEnrolled()) {
            console.log('Successfully loaded user1 from persistence');
        } else {
            throw new Error('Failed to get user1.... run registerUser.js');
        }

        var request = {
            chaincodeId: 'fabcar',
            fcn: 'queryPredictionByFund_name',
            args: args
        };
        return channel.queryByChaincode(request);
    }).then((query_responses) =>{
        if (query_responses && query_responses.length == 1) {
            if (query_responses[0] instanceof Error) {
                console.error("error from query = ", query_responses[0]);
            } else {
                let result = JSON.parse(query_responses[0])
                return result;
            }
        } else {
            throw new Error('No payloads were returned from query')
        }
    }).catch((err) => {
        console.error('Failed to query successfully :: ' + err);
    })

    return result

}



exports.queryOrderByType = queryOrderByType;
exports.queryOrderByBuyer = queryOrderByBuyer;
exports.queryOrderBySeller = queryOrderBySeller;
exports.queryOrderByProductName = queryOrderByProductName;
exports.queryOrderByID = queryOrderByID;
exports.queryAll = queryAll;
exports.queryPredictionByType = queryPredictionByType;
exports.queryPredictionByNumber = queryPredictionByNumber;
exports.queryPredictionByBondid = queryPredictionByBondid;
exports.queryPredictionByFund_name = queryPredictionByFund_name;
