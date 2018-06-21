const home = ({ title, domain, css, content, ga, copyRightYear }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="initial-scale=1,maximum-scale=1,minimum-scale=1,width=device-width,user-scalable=no">
  <meta name="renderer" content="webkit">
  <meta name="theme-color" content="#ffffff">
  <title> ${ title } </title>
  <meta name="description" content="写代码是那么美好的事情">
  <meta name="keywords" content="排序,正则表达式,程序员,算法,软件开发,AJAX,Algorithm,Android,Bash,book,C++,Code Review,Coding,CSS,Database,Debug,ebook,Erlang,Game,Go,Google,HTML,IE,Java,Javascript,jQuery,Linus Torvalds,Linux,Mac,MySQL,Oracle,OS,Perl,PHP,Programmer,programming,language,Python,Ruby,SQL,Ubuntu,UI,Unix,vim,Web,AWS,lambda,serverless">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">
  <link rel="shortcut icon" type="image/png" href="/favicon.png"/>

  <style>${css}</style>
  <script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', '${ga}', 'auto');
    ga('send', 'pageview');
  </script>
</head>
<body>
  ${content}
  <footer class="footer">
    Copyright ©${copyRightYear} <a href="http://${domain}"> ${domain}</a> | Powered by <a href="https://github.com/***REMOVED***/Cici">Cici</a> with <a href="https://github.com/***REMOVED***/YoYo">YoYo</a> as comment engine
  </footer>
<body>
</html>
`

const post = ({ title, domain, css, content, ga, copyRightYear }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="initial-scale=1,maximum-scale=1,minimum-scale=1,width=device-width,user-scalable=no">
  <meta name="renderer" content="webkit">
  <meta name="theme-color" content="#ffffff">
  <link rel="shortcut icon" type="image/png" href="/favicon.png"/>
  <title> ${title} </title>
  <style>${css}</style>
  <script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', '${ga}', 'auto');
    ga('send', 'pageview');
  </script>
</head>
<body>
  ${content}
  <div id="YoYo"></div>
  <script src="https://yoyo-client-production.s3.amazonaws.com/dist/index.js"></script>
  <footer class="footer">
    <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
    <!-- 底部 -->
    <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-8958230776887606"
       data-ad-slot="9975352781"
       data-ad-format="auto"></ins>
    <script>
      (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
    Copyright ©${copyRightYear} <a href="http://${domain}"> ${domain}</a> | Powered by <a href="https://github.com/***REMOVED***/Cici">Cici</a> with <a href="https://github.com/***REMOVED***/YoYo">YoYo</a> as comment engine
  </footer>
<body>
</html>
`

module.exports = {
  home,
  post,
}

