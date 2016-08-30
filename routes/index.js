
/*
 * GET home page.
 */
var crypto=require("crypto");
var User=require("../models/User");
var Post=require("../models/post");
var mongoose = require('mongoose');
/**
 * 首页部分
 * @param  req
 * @param  res
 */
exports.index=function(req,res){
	Post.find(null,function(err,posts){
		if(err){
		  posts=[];
		}
		res.render("index",{
			title:"首页",
			posts:posts	
		});
	  });
};

exports.user=function(req,res){
  User.find(req.params.user,function(err,user){
  	if(!user){
  		req.session.error="用户不存在";
  		return  res.redirect("/");
  	}
  	Post.find(user.name,function(err,posts){
  		if(err){
  			req.session.error=err;
  			return req.redirect("/");
  		}
  		res.render("user",{
  			title:user.name,
  			posts:posts
  			
  		})
  	});
  		
  });
  		
  		
}
/**
 * 发表博客
 * @param  req
 * @param  res
 */
exports.post=function(req,res){
	var currentUser=req.session.user;
	var post=new Post("",currentUser.name,req.body.post);
	post.save(function(err){
		if(err){
			req.session.error=err;
			return res.redirect("/");
		}
		req.session.success="发表成功";
	    res.redirect("/u/"+currentUser.name);
	    //上句容易出错
	// return res.redirect("/");
	})
	
}
/**
 *跳转到注册页面
 * @param  req
 * @param  res
 */
exports.reg=function(req,res){
	res.render('reg',{title:"注册页面"});
}
/**
 * 注册操作
 * @param  req
 * @param  res
 */
exports.doReg=function(req,res){
	if(req.body["password-repeat"]!=req.body["password"]){
		req.session.error="两次输入的口令不一致";
		return res.redirect("/reg");
	}
	var  md5=crypto.createHash("md5");
	var  password=md5.update(req.body.password).digest("base64");
    var  newUser=new User({
    	 name:req.body.username,
    	 password:password
    });
    User.find(newUser.name,function(err,user){
    	if(user){
    		req.session.error="该用户已经存在";
    		return res.redirect("/reg");
    	}
    	//如果不存在则添加用户
    	newUser.save(function(err){
    		if(err){
    			req.session.error=err;
    			return res.redirect("/reg");
    		}
    		req.session.user=newUser;
    		req.session.success="注册成功";
    		res.redirect("/");
    	})
    })
   }
   /**
    * 跳转到登陆页面
    * @param req
    * @param res
    */
exports.login=function(req,res){
		res.render('login',{title:"登陆页面"});
		
	}
exports.doLogin=function(req,res){
	var  md5=crypto.createHash("md5");
	var password=md5.update(req.body.password).digest("base64");
    User.find(req.body.username,function(err,user){
    	if(!user){
    		req.session.error="用户不存在";
    		return res.redirect("/login");
    	}
    	if(user.password!=password){
    		req.session.error="用户密码错误";
    		return res.redirect("/login");

    	}
    	req.session.user=user;
    	req.session.success="登录成功";
    	res.redirect("/");
    })
    }

/**
 * 跳转到博客修改页面
 * @param  req
 * @param  res
 */
 exports.update=function(req,res){
 	 var id=mongoose.Types.ObjectId(req.params.id);
    Post.findOne(id,function(err,post){	
		if(err){
  			return req.redirect("/");
  		}
  		res.render("update",{
  			title:"",
  			post:post
  			
  		})	
		 	
	})	
		
	}
 /**
  * 修改博客内容
  * @param  req
  * @param  res
  */
exports.doUpdate=function(req,res){
   var currentUser=req.session.user;
   var id=mongoose.Types.ObjectId(req.body.postId);
   var updateBlog=req.body.updateBlog;
   var user= req.body.user;
   var time=req.body.time;
   var post=new Post(id,user,updateBlog,time);
   
    post.updatePost(function(err){
        if (err){  
         return  res.redirect("/");   
        } 
        
       res.redirect("/u/"+currentUser.name);
    })
    }

/**
 * 跳转到修改页面（博客）
 * @param  req
 * @param  res
 */
 exports.update=function(req,res){
 	 var id=mongoose.Types.ObjectId(req.params.id);
    Post.findOne(id,function(err,post){	
		if(err){
  			return req.redirect("/");
  		}
  		res.render("update",{
  			title:"",
  			post:post
  			
  		})	
		 	
	})	
		
	}

/**
 * 删除博客
 * @param eq
 * @param res
 */
exports.delPost=function(req,res){
   var currentUser=req.session.user;
   var id=mongoose.Types.ObjectId(req.params.id);
    Post.delete(id,function(err,user){
        if (err){  
          req.session.error=err;
		  return res.redirect("/");
        }	
        res.redirect("/u/"+currentUser.name);	
    })
    }

   /**
    * 退出操作
    * @param  req
    * @param  res
    */
exports.logout=function(req,res){
	req.session.user=null;
	req.session.success="退出成功";
	res.redirect("/");
	
}