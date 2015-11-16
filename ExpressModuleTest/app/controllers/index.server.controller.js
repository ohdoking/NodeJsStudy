exports.render = function(req, res){
	// res.send("hi ohdoking world");

	if(req.session.lastVisit){
		console.log(req.session.lastVisit)
	}

	req.session.lastVisit = new Date();
	
	res.render('index',{
		title : "hi ohdoking",
		userFullName : req.user ? req.user.fullName : ''
	});
};