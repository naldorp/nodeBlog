exports.article = require("./article");
exports.user = require("./user");

exports.index = function(req,res,next){
   req.collections.articles.find({isPublished: true}, {sort:{_id:-1}}).toArray(function(err,articles){
      if(err) return next(err);
      res.render('index',{articles:articles});
   });
};