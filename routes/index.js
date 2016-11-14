exports.article = require("./article");
exports.user = require("./user");

exports.index = function(req,res,next){
    req.models.Article.find({isPublished: true},null,{sort: {_id:-1}},function(err,articles){
       if(err) return next(err);
       res.render('index',{articles: articles});
    });
}