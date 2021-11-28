const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const validator = require('express-validator');
const MongoStore  = require('connect-mongo')(session);

//webpage routes
const index = require('./routes/index');
const userRoutes = require('./routes/user');
const productSearch = require('./routes/productSearch');
const market = require('./routes/market');
const twoFaTest = require('./routes/2fa')
const chain = require('./routes/chain');
const admin = require('./routes/admin');
var board = require('./routes/board');
const adminProduct = require('./routes/product');
// var checkout = require('./routes/checkout');

const gis_ai = require('./routes/GIselecter_ai');
const correlation_cal = require('./routes/GIselecter_cor');

const app = express();

const fs = require('fs');
const multer = require('multer');


//mongodb setup

mongoose.connect('mongodb://localhost/aif');
const db = mongoose.connection;

//Middlewares
require('./config/passport');

// view engine setup
app.engine('.hbs', expressHbs({
    defaultLayout: 'layout',
    extname: '.hbs'
}));
app.set('view engine', 'ejs');
app.set('view engine', '.hbs');
// helpers for the handlebar templating platform
handlebars = expressHbs.create({
    helpers: {
        perRowClass: function(numProducts){
            if(parseInt(numProducts) === 1){
                return'col-md-12 col-xl-12 col m12 xl12 product-item';
            }
            if(parseInt(numProducts) === 2){
                return'col-md-6 col-xl-6 col m6 xl6 product-item';
            }
            if(parseInt(numProducts) === 3){
                return'col-md-4 col-xl-4 col m4 xl4 product-item';
            }
            if(parseInt(numProducts) === 4){
                return'col-md-3 col-xl-3 col m3 xl3 product-item';
            }

            return'col-md-6 col-xl-6 col m6 xl6 product-item';
        },
        menuMatch: function(title, search){
            if(!title || !search){
                return'';
            }
            if(title.toLowerCase().startsWith(search.toLowerCase())){
                return'class="navActive"';
            }
            return'';
        },
        getTheme: function(view){
            return`themes/${config.theme}/${view}`;
        },
        formatAmount: function(amt){
            if(amt){
                return numeral(amt).format('0.00');
            }
            return'0.00';
        },
        amountNoDecimal: function(amt){
            if(amt){
                return handlebars.helpers.formatAmount(amt).replace('.', '');
            }
            return handlebars.helpers.formatAmount(amt);
        },
        getStatusColor: function (status){
            switch(status){
            case'Paid':
                return'success';
            case'Approved':
                return'success';
            case'Approved - Processing':
                return'success';
            case'Failed':
                return'danger';
            case'Completed':
                return'success';
            case'Shipped':
                return'success';
            case'Pending':
                return'warning';
            default:
                return'danger';
            }
        },
        checkProductOptions: function (opts){
            if(opts){
                return'true';
            }
            return'false';
        },
        currencySymbol: function(value){
            if(typeof value === 'undefined' || value === ''){
                return'$';
            }
            return value;
        },
        objectLength: function(obj){
            if(obj){
                return Object.keys(obj).length;
            }
            return 0;
        },
        checkedState: function (state){
            if(state === 'true' || state === true){
                return'checked';
            }
            return'';
        },
        selectState: function (state, value){
            if(state === value){
                return'selected';
            }
            return'';
        },
        isNull: function (value, options){
            if(typeof value === 'undefined' || value === ''){
                return options.fn(this);
            }
            return options.inverse(this);
        },
        toLower: function (value){
            if(value){
                return value.toLowerCase();
            }
            return null;
        },
        formatDate: function (date, format){
            return moment(date).format(format);
        },
        ifCond: function (v1, operator, v2, options){
            switch(operator){
            case'==':
                return(v1 === v2) ? options.fn(this) : options.inverse(this);
            case'!=':
                return(v1 !== v2) ? options.fn(this) : options.inverse(this);
            case'===':
                return(v1 === v2) ? options.fn(this) : options.inverse(this);
            case'<':
                return(v1 < v2) ? options.fn(this) : options.inverse(this);
            case'<=':
                return(v1 <= v2) ? options.fn(this) : options.inverse(this);
            case'>':
                return(v1 > v2) ? options.fn(this) : options.inverse(this);
            case'>=':
                return(v1 >= v2) ? options.fn(this) : options.inverse(this);
            case'&&':
                return(v1 && v2) ? options.fn(this) : options.inverse(this);
            case'||':
                return(v1 || v2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
            }
        },
        isAnAdmin: function (value, options){
            if(value === 'true' || value === true){
                return options.fn(this);
            }
            return options.inverse(this);
        }
    }
});


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));


 /*bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());
/* Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
//intialize session
app.use(session({
	secret:'aitwfinance',
	resave:false,
	saveUninitialized:false,
	store : new MongoStore({
		mongooseConnection: mongoose.connection,
	}),
	cookie:{
		maxAge: 180 * 60 * 1000//ms 一分鐘到期
	}
	}));
app.use(function(req, res, next){
	req.handlebars = handlebars;
	next();
});

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req, res, next) {
	res.locals.login = req.isAuthenticated();
	res.locals.session = req.session;
	next();
});


app.use(function(req, res, next){
    req.db = db;
    next();
});

app.use('/', chain);
app.use('/user', userRoutes);
app.use('/', index);
app.get('/market', market);
app.use('/', twoFaTest);
app.use('/', admin);
app.use('/', board);
app.use('/', adminProduct);
app.get('/productSearch', productSearch);
app.use('/', gis_ai);
app.use('/mutual_FundResult', correlation_cal)



// catch 404 and forward to error handler;
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// error handler
//development error handler
//will print stacktrace
if (app.get('env') === 'development'){
	app.use(function(err, req, res, next){
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error:err
		});
	});
}

//production error handler
//no stactraces leaked to user
app.use(function(err, req, res, next){
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error:{}
	});
});


module.exports = app;
