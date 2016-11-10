exports.list = function(req,res,next){
  res.send('a resource');
};

exports.login = function(req,res,next){
  res.render('login');
};

exports.logout = function(req,res,next){
  res.redirect('/');
};

exports.auth = function(req,res,next){
  res.redirect('/admin');  
};
