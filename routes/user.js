exports.list = function(req,res,next){
  res.send('a resource');
};

exports.login = function(req,res,next){
  res.render('login');
};

exports.logout = function(req,res,next){
  req.session.destroy();
  res.redirect('/');
};

exports.auth = function(req,res,next){
  if(!req.body.email || !req.body.password)
    return res.render('login',{error: 'Please enter your email and password'});
    
  req.collections.users.findOne({
    email: req.body.email,
    password: req.body.password
  },function(err,user){
    if(err) return next(err);
    if(!user) return res.render('login',{error: "invalid email or password"});
    req.session.user = user;
    req.session.admin = user.isAdmin;
    res.redirect('/admin');
  })
};
