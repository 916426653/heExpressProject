//引入操作数据库的模块
var mongodb = require("./db");

function User(user) {
	this.name = user.name;
	this.password = user.password;
}

/***
 * 查找对象
 * @param username
 * @param callback
 */
User.find = function(username, callback) {
		mongodb.open(function(err, db) {
			if (err) {

				return callback(err);
			}
			db.collection("users", function(err, collection) {
				if (err) {
					mongodb.close();
					return callback(err);
				}
				collection.findOne({
					name: username
				}, function(err, doc) {
					mongodb.close();
					if (doc) {
						var user = new User(doc);
						callback(err, user);
					} else {

						callback(err, null);
					}

				})

			})
		})
	}
	/**
	 * save 保存对象
	 * @param callback
	 */
User.prototype.save = function save(callback) {
	var user = {
		name: this.name,
		password: this.password
	};
	mongodb.open(function(err, db) {
		if (err) {
			mongodb.close();
			return callback(err);
		}
     db.collection("users",function(err,collection){
		collection.ensureIndex("name", {
			unique: true
		});
		collection.insert(user, {
			safe: true
		}, function(err) {
			mongodb.close();
			callback(err);
		})
	})
     })
}

/**
 * 对外的接口
 */
module.exports = User;