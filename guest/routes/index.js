var express = require('express');
var router = express.Router();
var test = require('custom/test.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	var par = req.query.number;
	var par2 = par+1;
	console.log(req.query);
  //res.render('index', { title: test(par2,par) });
  res.json(req.query);
});

module.exports = router;
