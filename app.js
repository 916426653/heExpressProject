/**
 * 路由规则和改造ejs引擎
 */
var express=require("express"),
routes=require('./routes'),
http=require('http'),
engine=require('./expand_modules/ejs'),
util=require('util'),
path=require('path'),
connect=require('connect'),
MongoStore=require('connect-mongo')(connect),
settings=require('./settings');

var app=express();

//改造ejs引擎
app.engine('ejs',engine);
app.configure(function(){
	app.set('port',process.env.PORT||3000)
	app.set('views',__dirname+'/views');
	app.set('view engine','ejs');
	app.set('view options',{
		layout:true
	});

app.locals._layoutFile='layout'
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
//使用cookie中间件
app.use(express.cookieParser());
//会话中间件，存放在mongodb中
app.use(express.session({
	secret:settings.cookieSecret,
	store:new MongoStore({
	db:settings.db
	})

}));

app.use(function(req,res,next){
	var err=req.session.error,
	msg=req.session.success;
	delete req.session.error;
	delete req.session.success;
	res.locals.message='';
	if(err)  res.locals.message='<div class ="alert alert-error">'+err+'</div>';
	if(msg)  res.locals.message='<div class ="alert alert-error">'+msg+'</div>';
	next();
});

app.use(function(req,res,next){
	res.locals({	
	user:req.session.user })
	next();
})
app.use(app.router);
app.use(express.static(path.join(__dirname,'public')));	
});
app.configure('develoment',function(){
	
app.use(express.error.errorHandler());

});
app.get('/',routes.index);
app.get('/u/:user',routes.user);
app.post('/post',routes.post);
app.get('/d/:user/:id',routes.delPost);
app.get('/update/:user/:id',routes.update);
app.post('/doUpdate',routes.doUpdate);
app.get('/reg',routes.reg);
app.post('/reg',routes.doReg);
app.get('/login',routes.login);
app.post('/login',routes.doLogin);
app.get('/logout',routes.logout);
http.createServer(app).listen(app.get('port'),function(){
	console.log('listening on port '+app.get('port'));

});
