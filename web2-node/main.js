// node.js에서 사용하는 모듈 가져오기.
// 가져온 모듈을 변수를 통해서 사용한다.
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring')
var template = require('./lib/template.js')
var path = require('path');
var sanitizeHtml = require('sanitize-html');


var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  console.log(pathname);

  if (pathname === '/') {
    if (queryData.id === undefined) {
      fs.readdir('./data', function (err, filelist) {
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(filelist);
        var html = template.html(title, list,
          `<h2>${title}</h2>${description}`,
          `<a href = "/create" >Create</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    } else {
      fs.readdir('./data', function (err, filelist) {
        // 사용자 입력으로부터 들어오는 오염된 정보를 필터링.
        //'../'과 같은 경로 탐색을 이용한 공격을 방어
        // 내부 시스템이 공개되는 것을 막을 수 있다.
        var filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
          var title = queryData.id;

          var sanitizedTitle = sanitizeHtml(title);
          var sanitizedDescription = sanitizeHtml(description, {
            allowedTags: ['h1'],
          });

          var list = template.list(filelist);
          var html = template.html(sanitizedTitle, list,
            `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
            `<a href="/create">Create</a>
             <a href="/update?id=${sanitizedTitle}">update</a>
             <form action="/delete_process" method="post">
              <input type="hidden" name="id" value="${sanitizedTitle}">
              <input type="submit" value="delete">
             </form>`
          );
          response.writeHead(200);
          response.end(html);
        });
      });
    }
  } else if (pathname === '/create') {
    fs.readdir('./data', function (err, filelist) {
      var title = 'WEB - create';
      var list = template.list(filelist);
      var html = template.html(title, list, `
        <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </P>
        </form>
      `, '');
      response.writeHead(200);
      response.end(html);
    });
  } else if (pathname === '/create_process') {
    var body = '';
    request.on('data', function (data) {
      body = body + data;
    });
    request.on('end', function () {
      //url 뒤에 달려있는 쿼리문을 파싱(분석)해준다.
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
        response.writeHead(302, {
          Location: `/?id=${title}`
        });
        response.end();
      })
    });
  } else if (pathname === '/update') {
    fs.readdir('./data', function (err, filelist) {
      var filteredId = path.parse(queryData.id).base;
      fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
        var title = queryData.id;
        var list = template.list(filelist);
        var html = template.html(title, list,
          `
          <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="title" value="${title}"></input>
            <p>
              <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
              <input type="submit">
            </P>
          </form>
          `,
          `<a href="/create">Create</a> <a href="/update/?id=${title}">update</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  } else if (pathname === '/update_process') {
    var body = '';
    request.on('data', function (data) {
      body = body + data;
    });
    request.on('end', function () {
      //url 뒤에 달려있는 쿼리문을 파싱(분석)해준다.
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, function (err) {
        fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
          response.writeHead(302, {
            Location: `/?id=${title}`
          });
          response.end();
        })
      });
    });
  } else if (pathname === '/delete_process') {
    var body = '';
    request.on('data', function (data) {
      body = body + data;
    });
    request.on('end', function () {
      //url 뒤에 달려있는 쿼리문을 파싱(분석)해준다.
      var post = qs.parse(body);
      var id = post.id;
      var filteredId = path.parse(id).base;
      fs.unlink(`data/${filteredId}`, function (err) {
        response.writeHead(302, {
          Location: `/`
        });
        response.end();
      });
    });
  } else {
    response.writeHead(404);
    response.end('Not Found');
  }
});
app.listen(3000);