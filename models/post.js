//引入操作数据库的模块
var mongodb = require("./db");
function Post(_id,username, post, time) {
	this._id=_id;
	this.user= username;
	this.post = post;
	if (time) {
		this.time = time;
	} else {
	  var  myDate=new Date();
		//this.time =myDate;
	 this.time =myDate.getFullYear()+"/"+(myDate.getMonth()+1)+"/"
    +myDate.getDate()+"  "+myDate.getHours()+":"+myDate.getMinutes()+":"+myDate.getSeconds() ;
	}

}

/***
 *读取指定用户下的博客内容
 */
Post.find = function(username, callback) {
		mongodb.open(function(err, db) {
			if (err) {
				return callback(err);
			}
			db.collection("posts", function(err, collection) {
				if (err) {
					mongodb.close();
					return callback(err);
				}

				var query = {};
				if (username) {
					query.user = username;

				}

				collection.find(query).sort({
					time: -1
				}).toArray(function(err, docs) {
					mongodb.close();

					if (err) {
						callback(err, null);
					}
					var posts = [];
					docs.forEach(function(doc, index) {
						var post = new Post(doc._id,doc.user, doc.post, doc.time);
						posts.push(post);
					})
					callback(null, posts);
				})

			})
		})
	}
	/**
	 * save 保存对象
	 * @param callback
	 */
Post.prototype.save = function save(callback) {
	var post = {
		user: this.user,
		post: this.post,
		time: this.time
	};
	mongodb.open(function(err, db) {
		if (err) {
			mongodb.close();
			return callback(err);
		}
		db.collection("posts", function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
            //为user建立索引
			collection.ensureIndex("user");
			collection.insert(post, {
				safe: true
			}, function(err) {
				mongodb.close();
				callback(err, post);
			})
		})
	})
}


	/**
	 * delete 删除对象
	 * @param id
	 * @param callback
	 */
Post.delete = function (id ,callback) {
	    mongodb.open(function(err,db){  
        if (err){  
            return callback(err);   
        }  

        var query = {_id: id};  
         console.log("删除:"+id); 
        db.collection('posts', function(err, collection){  
            if (err){  
                mongodb.close();   
                return callback(err);   
            }  

            collection.remove(query,{safe:true},function(err,result){  
                mongodb.close();  
                if (err){  
                    return callback(err);   
                }  
                console.log("删除成功。");  
                callback(null);   
            }) ;  
        });      
    });  
}

	/**
	 * 修改对象
	 * @param id
	 * @param callback
	 */
Post.prototype.updatePost = function (callback) {
	var post = {
		 _id: this._id,
		user: this.user,
		post: this.post,
		time: this.time
	};
	    mongodb.open(function(err,db){  
        if (err){  
            return callback(err);   
        }  

        // console.log("修改:"); 
        db.collection('posts', function(err, collection){  
            if (err){  
                mongodb.close();   
                return callback(err);   
            }  

         collection.update({_id:post._id}, post, {upsert:true,multi:false} , function(err, post){  
                mongodb.close();  
                if (err){  
                    return callback(err);   
                }  
                console.log("修改成功。");  
                callback(null);   
            }) ;  
        });      
    });  
}
/***
 *获取指定_id的博客
 */
Post.findOne = function(id, callback) {
		mongodb.open(function(err, db) {
			if (err) {
				return callback(err);
			}
			db.collection("posts", function(err, collection) {
				if (err) {
					mongodb.close();
					return callback(err);
				}

			collection.findOne({
					_id: id
				}, function(err, doc) {
					mongodb.close();
					if (doc) {
						var post = new Post(doc._id,doc.user, doc.post, doc.time);
						callback(err, post);
					} else {

						callback(err, null);
					}

				})

			})
		})
	}
/**
 * 对外的接口
 */
module.exports = Post;