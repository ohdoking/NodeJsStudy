var express = require('express');
var router = express.Router();

var mysql      = require('mysql');
var pool = mysql.createPool({
  host     : '52.69.143.47',
  user     : 'ohdoking1',
  password : 'qmffn17',
  database : 'rainbowdiary'
});



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/test2/:user_id', function(req, res, next) {
  var par = req.params.user_id;
  console.log(par);
  var sql = "select * from User where id = ?";

   
  pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query(sql, [par], function(err, rows) {
      // And done with the connection.
      console.log(rows);                                               

      res.json(rows)
      connection.release();
    });
  });
  
});

//방명록 하나 보기
router.get('/read/:num', function(req,res,next){
   var num = req.params.num;
   console.log(num);

   var sql = "insert into User(password,userId,name) values(?,?,?)";
   var sql2 = "select * from User where id=?";

   pool.getConnection(function(err, connection) {
      // Use the connection
      connection.query(sql, [123,"ohdoking2",num], function(err, row){
         console.log(row);

         connection.query(sql2, [row.insertId], function(err, rows) {
            // And done with the connection.
                                                          //실행결과 출력, 배열로 잡아오기 때문에 [0]을 통해 겉에 []를 제거해준다.
            //res.json({"result":"OK"});
            res.json(rows)
            connection.release();
            // Don't use the connection here, it has been returned to the pool.
         });
      });
   });
});

router.post('/test', function(req, res, next) {
  res.send('post');
})

module.exports = router;
