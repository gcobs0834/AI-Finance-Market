var express = require('express');
var router = express.Router();
var PythonShell = require('python-shell');
var mysql = require('mysql');
var sql = require('./GIselecter_sql_connecter');
var con = mysql.createConnection(sql.sqlscheme);
var Cart = require('../models/cart');




/* GET login page. */
router.get('/gis_ai', function(req, res, next) {
	console.log("gis_ai connection");
	var cart = new Cart(req.session.cart ? req.session.cart : {});


	//var selected_date = Data.date;
	var selected_date = "2017-4-17";
	var selected_type = "Daily Net Worth";
	//var data_type = Data.type;
	var data_type = "mutual_fund";
	console.log("selected type:" + selected_type + " DB type:" + data_type);

	var script_path = './py/mutual';
	if (data_type == 'etf') {
		script_path = './py/etf';
	}
	console.log("GetData:" + script_path);

	var options = {
		mode: 'text',
		pythonOptions: ['-u'],
		scriptPath: script_path,
		args: ['genRiskProfit', selected_date, selected_type]
	};

	PythonShell.run('genRiskProfit.py', options, function(err, results) {
		if (err) throw err;

		// Get Point Data
		var point_1m = results[0].toString()
		var point_3m = results[1].toString()
		var point_6m = results[2].toString()
		var point_1y = results[3].toString()
		var point_2y = results[4].toString()
		var point_3y = results[5].toString()
		var fundlist = results[6].toString()

		console.log("fundlist", fundlist);

		console.log("query done");

		// Get AI Data
		var data_type = "mutual_fund";
		var sql = "";
		if (data_type == "mutual_fund") {
			sql += "select * from fund_ai where date=4511";
		} else if (data_type == "etf") {
			sql += "select * from etf_ai_predict_sample where date=4655 order by level asc ";
		}
		con.query(sql,
			function(err, result, fields) {
				if (err) throw err;
				var arr_obj = [];
				for (var i in result) {
					var json_obj = {
						id: result[i].id,
						fund_id: result[i].fund_id,
						interval: result[i].interval,
						rate: result[i].rate_2p5,
						nav: result[i].nav,
						nav_after: result[i].nav_after

						}

					arr_obj.push(json_obj);

				}
				// console.log(arr_obj);
				// console.log("point_3y", point_3y);

				res.render('product/gis_ai.ejs', {
					point_1m: point_1m,
					point_3m: point_3m,
					point_6m: point_6m,
					point_1y: point_1y,
					point_2y: point_2y,
					point_3y: point_3y,
					date: selected_date,
					selected_type: selected_type,
					fundlist: fundlist,
					data_type: data_type,
					arr_obj: arr_obj,
					text: req.user.local.cnName,
					session: req.session,
					cart: cart,
				});
			}
		);
	});



});

module.exports = router;
