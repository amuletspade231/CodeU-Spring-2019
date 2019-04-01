<!DOCTYPE html>
<html>
  <head>
    <title>User Page</title>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="/css/user-page.css">
    <script src="/js/user-page-loader.js"></script>
  </head>
  <body onload="buildUI();">
    <%@include file="/WEB-INF/jspf/navigation.jspf" %>
    <div id="outercontainer">
    <h1 id="page-title">User Page</h1>

    <div id="about-me-container">Loading...</div>
      <div id="about-me-form" class="hidden">
      <form action="/about" method="POST">

        <br/>
        <textarea id = "about-input" name="about-me" placeholder="about me" rows=4 required></textarea>
        <br/>
        <input type="submit" value="Submit">
      </form>
    </div>

    <br/>

    <form id="message-form" action="/messages" method="POST" class="hidden">
      Enter a new message:
      <br/>

      <textarea name="text" id="message-input"></textarea>
      <br/>
      <input type="submit" value="Submit">
    </form>
    <hr/>
  </div>

    <div id="message-container">Loading...</div>

  </body>
</html>
