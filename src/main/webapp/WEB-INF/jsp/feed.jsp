<!DOCTYPE html>
<html>
  <head>
    <title>Message Feed</title>
    <link rel="stylesheet" href="/css/feedcss.css">
    <link rel="stylesheet" href="/css/main.css">
    <script src="/js/feed-loader.js"></script>
  </head>
  <body onload="buildUI()">
    <div id="header">
      <div id="headbanner">
        <%@include file="/WEB-INF/jspf/navigation.jspf" %>
        <div id="title">
          <h1>DABBLE</h1>
        </div>
      </div>
    </div>
    <div id="bottomcontainer">
      <div id="content">
        <h1 id="feedname">Message Feed</h1>
        <hr/>
      <div id="message-container">Loading...</div>
      </div>
    </div>
    <!-- <div class="clearfloat"></div> -->
    

  </body>
</html>
