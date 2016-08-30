/**
 * 数据库的连接
 */
//连接配置
var settings=require("../settings");
//得到DB对象
var  Db=require("mongodb").Db;
//得到连接对象
var Connection=require("mongodb").Connection;
//得到一个服务
var Server=require("mongodb").Server;
//创建一个连接
module.exports=new Db(settings.db,new Server(settings.host,Connection.DEFAULT_PORT,{}));
