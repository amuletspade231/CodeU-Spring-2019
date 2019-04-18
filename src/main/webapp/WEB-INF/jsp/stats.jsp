<!DOCTYPE html>
<html>
  <head>
    <title>Stats</title>
    <link rel="stylesheet" href="/css/main.css">
    <script src = "js/stats-loader.js"> </script>
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
    <div id="content">
      <h1>Site Statistics</h1>
      <hr/>
      <div id="stats-container">Loading...</div>
    </div>
  </body>
</html>
