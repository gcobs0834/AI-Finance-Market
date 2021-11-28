var express = require('express');
var router = express.Router();
var path = require("path");
var PythonShell = require('python-shell');


router.post('/', function(req, res, next) {
	var Data = req.body.Selection;
	Data = JSON.parse(Data);


	var finalCommand = {
		fundList: Data.fundList,
		reqTopic: "/frontEnd/RPfilter/ProCor",
		SelectDate: Data.date,
		user: 'admin',
		type: Data.type,
		corNum: Data.corNum,
		profitNum: Data.profitNum,
		aum_selected: Data.aum_selected

	};

	console.log(JSON.stringify(finalCommand));

	// Use the data type as parameters
	var data_type = Data.data_type;
	console.log("ProCor Filter:Data type:" + data_type);
	var script_path = './py/mutual';
	if (data_type == 'mutual_fund') {
		console.log("ProCor Filter using the mutual fund script." + script_path);
	} else if (data_type == 'etf') {
		script_path = './py/etf';
		console.log("ProCor Filter using the etf script." + script_path);
	}

	var options = {
		mode: 'text',
		pythonOptions: ['-u'],
		scriptPath: script_path,
		args: ['ProCorFilter', JSON.stringify(finalCommand)]
	};

	PythonShell.run('Filter_ProCor.py', options, function(err, results) {
		if (err) throw err;
		// results[0]=fundNameList  results[3]=corMatrix   results[1]=resultSet  results[2]=FundNameStr
		console.log("dump return date: " + Data.date);


		res.json({
			"results": results,
			"SelectDate": Data.date,
		});
		console.log(results);


	});

});
module.exports = router;
