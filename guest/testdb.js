var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '52.69.143.47',
  user     : 'ohdoking1',
  password : 'qmffn17',
  database : 'rainbowdiary'
});

connection.connect();

connection.query('SELECT * FROM User', function(err, rows, fields) {
  if (err) throw err;

	for (var i in rows) {
	  console.log('The ID is: ', rows[i].userId);
	};
  
});

connection.end();