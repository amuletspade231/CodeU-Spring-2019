<!DOCTYPE html>
<html>
  <head>
    <title>Message Feed</title>
    <link rel="stylesheet" href="/css/main.css">
    <link rel="stylesheet" href="/css/user-page.css">
    <script src="/js/feed-loader.js"></script>
  </head>
  <body onload="buildUI()">
      <%@include file="/WEB-INF/jspf/navigation.jspf" %>
    <div id="content">
      <h1>Message Feed</h1>
      <hr/>
      <div id="message-container">Loading...</div>
    </div>
  </body>
</html>
