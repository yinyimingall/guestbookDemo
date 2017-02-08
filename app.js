// 引入所有你需要的模块
var http = require("http");
var path = require("path");
var express = require("express");
var logger = require('morgan');
var bodyParser = require("body-parser");
// 创建一个Express app
var app = express();
// 第一行告诉Express视图存在一个views文件中
// 下一行表明视图将使用xtpl引擎
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "xtpl");
// 创建一个全局的数组用于储存所有的条目
var entries = [];
// 使这个条目数组可以在所有视图中访问
app.locals.entries = entries;
// 使用Morgan来记录每次request请求
app.use(logger("dev"));
// 填充一个req.body变量如果用户提交了表单的话（扩展项是必须的）
app.use(bodyParser.urlencoded({ extended: false }));
// 当访问了网站根目录，就渲染主页（位于views/index.xtpl）
app.get("/", function(request, response) {
    response.render("index", {title: "留言板"});
});
// 渲染“新条目”页面（位于views/index.xtpl）当get访问这个URL的时候
app.get("/new-entry", function(request, response) {
    response.render("new-entry");
});
// 定义一个路由处理，当你POST到“new-entry”这个URL的时候与GET形成一个鲜明的对比
app.post("/new-entry", function(request, response) {
    // 如果用户提交的表单没有标题或者内容，则返回一个400的错误
    if (!request.body.title || !request.body.body) {
        response.status(400).send("Entries must have a title and a body.");
        return;
    }
    // 添加一个新的条目到entries
    entries.push({
        title: request.body.title,
        content: request.body.body,
        published: new Date()
    });
    console.log(entries[0].title + entries[0].content);
    // 重定向到主页来查看你的新条目
    response.redirect("/");
});
// 渲染404页面，因为你请求了未知资源
app.use(function(request, response) {
    response.status(404).render("404");
});
// 在3000端口启动服务器
http.createServer(app).listen(3000, function() {
    console.log("Guestbook app started on port 3000.");
});
