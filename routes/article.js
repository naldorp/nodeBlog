exports.list = function(req,res,next){
  req.models.Article.list(function(error,articles){
     if(error) return next(error);
     res.send({articles: articles});
  });
};

exports.add = function(req,res,next){
  if(!req.body.article) return next(new Error("No article data."));
  var article = req.body.article;
  article.isPublished = false,
  req.models.Article.create(article,function(err,response){
      if(err) return next(err);
      res.send(response);
  })
};

exports.edit = function(req,res,next){
  if(!req.params.id) return next(new Error("No article id"));
  
  req.models.Article.findByIdAndUpdate(
      req.params.id,
      {$set:req.body.article},
      function(err,doc){
          if(err) return next(err);
          res.send(doc);
      }
  );
};

exports.del = function(req,res,next){
    if(!req.params.id) return next(new Error("No article id"));
    
    req.models.Article.findById(req.params.id,function(err,article){
       if(err) return next(err);
       if(!article) return next(new Error('article not found'));
       article.remove(function(err,doc){
           if(err) return next(err);
           res.send(doc);
       })
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
    req.models.Article.create(article,function(err,response){
        if(err) return next(err);
        res.render('post', {error: 'Article was added. Publish it on Admin Page'});
    });
}

exports.admin = function(req,res,next){
    req.models.Articles.list(function(err,articles){
        if(err) return next(err);
        res.render('admin',{articles:articles});
    });
}