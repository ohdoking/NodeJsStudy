var express = require('express');
var router = express.Router();

var mysql_pool = require('custom/mysql-custom.js')

/* GET home page. */
/*router.get('/', function(req, res, next) {
	res.render("index",{title:"방명록",user:"ohdoking"});
});
*/
router.get('/', function(req, res, next) {
	var sql = "select * from guestboard";

  mysql_pool().getConnection(function(err, connection) {
    connection.query(sql, [], function(err, rows) {

      console.log(rows);                                              
      res.render("list/list",{user:"ohdoking",title:"방명록", datas:rows});
      // res.json(rows) //결과를 바로 json 으로 리턴가능!
      connection.release();
    });
  });

});

router.post('/delete/:num', function(req, res, next) {

	var num = req.params.num;
	var pw = req.body.password;
	var sql1 = "select pw from guestboard where num = ?"
  var sql2 = "delete from guestboard where num = ?"
  var num = req.params.num;
	mysql_pool().getConnection(function(err, connection){
      connection.query(sql1, [num], function(err, row){
        
        console.log(row[0].pw);	
        console.log(pw)
        if(row[0].pw == pw){
        	connection.query(sql2, [num], function(err, row){
            console.log(row);
            // out.println("삭제되었습니다.")
            res.redirect('/');
         });
        }
        else{
        	// out.println("비밀번호가 일치 하지 않습니다.");
        	res.redirect('/read/'+num);
        }
        
         connection.release();
    
      });
   });
  

});
router.get('/write/:num', function(req, res, next) {
  var num = req.params.num;
  
  if(num == "f"){
  	var data = {}	;
  	data.name = "";
  	data.title = "";
  	data.content = "";
  	data.pw = "";
  	res.render('list/write',{inputdata:"저장", title:"방명록 쓰기",datas:data,param : num});
  }
  else{
  	console.log("update");
  	var sql = "select * from guestboard where num = ?";

	  mysql_pool().getConnection(function(err, connection) {
	    connection.query(sql, [num], function(err, row) {

	      console.log(row);   

	                                            
	      res.render("list/write",{inputdata:"수정",title:"방명록 수정", datas:row[0],param : num});
	      // res.json(rows) //결과를 바로 json 으로 리턴가능!
	      connection.release();
	    });
	  }); 
  } 
  

});

router.get('/read/:num', function(req, res, next) {
  
  var sql1 = "update guestboard set hit=hit+1 where num=?" 
  var sql2 = "select * from guestboard where num = ?";

  var num = req.params.num;
  var num1 = req.query.num1;
  console.log(num1);	
  console.log(num);
  mysql_pool().getConnection(function(err, connection){
      connection.query(sql1, [num], function(err, row){
         console.log(row);
         //res.json({'result':'OK'});
         connection.query(sql2, [num], function(err, row){
            console.log(row)
            res.render('list/read', {title:'방명록 보기', data:row[0]});
         });
         connection.release();
        
      });
   });

});


router.post('/insert/:num', function(req, res, next) {
	
	var num = req.params.num;
	var sql;
	if(num == "f"){
		sql = "insert into guestboard(title,content,name,pw) values(?,?,?,?)";
		mysql_pool().getConnection(function(err, connection) {
	    connection.query(sql, [
	    	req.body.title, 
	    	req.body.content,
	    	req.body.name,
	    	req.body.pw], function(err, row) {

	      console.log(row);
	                                                
	      res.redirect('/');
	      connection.release();
	    });
	  });

	}
	else{
		sql = "update guestboard set title = ?,content =?, name = ?, pw = ? where num = ?"
		mysql_pool().getConnection(function(err, connection) {
	    connection.query(sql, [
	    	req.body.title, 
	    	req.body.content,
	    	req.body.name,
	    	req.body.pw,
	    	num], function(err, row) {

	      console.log(row);
	                                                
	      res.redirect('/');
	      connection.release();
	    });
	  });
	}

});

module.exports = router;
