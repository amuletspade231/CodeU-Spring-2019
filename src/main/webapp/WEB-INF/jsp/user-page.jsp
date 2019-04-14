<!DOCTYPE html>
<html>
  <head>
    <title>User Page</title>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="/css/user-page.css">
    <script src="/js/user-page-loader.js"></script>
  </head>
  <body onload="buildUI();">
    <div id="header">

      <div id="navii"><%@include file="/WEB-INF/jspf/navigation.jspf" %></div>
      <div id="dabbletitle">
        <h1>DABBLE</h1>
      </div>
      <p id="textdir"> Place art banner here...</p>
    </div>
    <div id="outercontainer">
      <div id="sidebar">
        <div id="commissions-toggle" class="hidden">
          <label class="switch">
            <input type="checkbox">
            <span class="slider"></span>
          </label>
        </div> 
        <img id= "profilepic" src = "http://nationalinsightnews.com/wp-content/uploads/2018/06/cat.jpg"/>
        <div id="name"> 
          <h3>CAT GIRLLL</h3>
          <a href="user-page.jsp" id="page-title">User Page</a>
          <p>Official Dabble account of the World's Favorite Cat.</p>
        </div>
        <!--<h1 id="page-title"> TITLE ME SOMTHING </h1>-->
        <div id="about-me-container">Loading...</div>
        <div id="about-me-form" class="hidden">
          <form action="/about" method="POST">
            <textarea id = "about-input" name="about-me" placeholder="about me" rows=4 required></textarea>
            <br/>
            <input type="submit" value="Submit">
          </form>
        </div>
        <br/>
        Compose a Post:
        <form id="message-form" method="POST" class="hidden" enctype="multipart/form-data">
          <textarea name="text" id="message-input"></textarea>
          <br/>
          Add an image to your message:
          <input type="file" name="image">
          <br/>
          <input type="submit" value="Submit">
        </form>
      </div>
      <div id="naviposts">
        <a href="">Posts</a> <a href="">Gallery</a>
      </div>
      <!--<div class="clear"></div>-->
      <div id="maincontent">
        <div id="message-container">Loading...</div>
        <hr/>
      </div>
    </div>
  </body>
</html>
