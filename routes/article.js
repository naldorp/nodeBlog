exports.list = function(req,res,next){
  req.collections.articles.find().toArray(function(error,articles){
     if(error) return next(error);
     res.send({articles: articles});
  });
};

exports.add = function(req,res,next){
  if(!req.body.article) return next(new Error("No article data."));
  var article = req.body.article;
  article.isPublished = false,
  req.collections.articles.insert(article,function(err,response){
      if(err) return next(err);
      res.send(response);
  })
};

exports.edit = function(req,res,next){
  if(!req.params.id) return next(new Error("No article id"));
  
  req.collections.articles.updateById(req.params.id, {$set:req.body.article},function(err,count){
     if(err) return next(err);
     res.send({affectedCount: count});
  });
};

exports.del = function(req,res,next){
    if(!req.params.id) return next(new Error("No article id"));
    
    req.collections.articles.removeById(req.params.id,function(err,count){
        if(err) return next(err);
        res.send({affectedCount: count});
    });
}

exports.post = function(req,res,next){
    if(!req.body.title)
        res.render('post');
}

exports.postArticle = function(req,res,next){
    if(!req.body.title || !req.body.text){
        return res.render('post',{error: "Fill title and text."});
    }
    var article = {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags.split(',')
    };
    req.collections.articles.insert(article,function(err,response){
        if(err) return next(err);
        res.render('post', {error: 'Article was added. Publish it on Admin Page'});
    });
}

exports.admin = function(req,res,next){
    req.collections.articles.find({},{sort:{_id:-1}}).toArray(function(err,articles){
        if(err) return next(err);
        res.render('admin',{articles:articles});
    });
}