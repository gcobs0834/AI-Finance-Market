var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Product=require('./product');

var MessageSchema = new mongoose.Schema({
  name:[{ type:String, trim:true }],
  message:{type:String, required:true, trim:true},
  comments:[{ type:Schema.Types.ObjectId, ref:'Comment'}],
  created_at:{type:Date, default:Date.now},
  updated_at:{type:Date, default:Date.now},
  _Product:[{ type:String, trim:true}],
});

mongoose.model('Message', MessageSchema);
var message = mongoose.model('Message');

//回覆
var CommentSchema = new mongoose.Schema({
  name:[{ type:String,trim:true }],
  _Message:{ type:Schema.Types.ObjectId, required:true, trim:true, ref:'Message'},
  comment:{ type:String, required:true},
  created_at:{ type:Date, default:Date.now},
  updated_at:{ type:Date, default:Date.now},
});

mongoose.model('Comment', CommentSchema);
var comment = mongoose.model('Comment');


module.exports.comment = comment;
module.exports.message = message;
