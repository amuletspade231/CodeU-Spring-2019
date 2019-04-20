<!DOCTYPE html>
<html>
  <head>
    <title>User Page</title>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="/css/user-page.css">
    <link rel="stylesheet" href="/css/main.css">
    <script src="/js/user-page-loader.js"></script>
  </head>
  <body onload="buildUI();">
    <div id="header">
      <div id="headbanner">
        <%@include file="/WEB-INF/jspf/navigation.jspf" %>
        <div id="title">
          <h1>DABBLE</h1>
        </div>
      </div>
    </div>
    <br/><br/><br/>
    <div id="outercontainer">

      <div id="sidebar">

        <p id= "profilepic" src=""></p>

        <div id="commissions-toggle" class="hidden">
          <label class="switch">
            <input type="checkbox" id="commissions-checkbox" onclick="setCommissions()">
            <span class="slider" id="commissions-slider"></span>
            <p>Taking Commissions?</p>
          </label>
        </div>

        <div id="name">
          <a href="user-page.jsp" id="page-title">User Page</a>
        </div>

        <div id="about-me-container">Loading...</div>
        <div id="about-me-form" class="hidden">
          <form action="/about" method="POST">
            <br/>
            <textarea id = "about-input" name="about-me" placeholder="Enter your name &#10;and information about yourself on different lines..." rows=4 required></textarea>
            <br/>
            <input type="submit" value="Submit">
          </form>
        </div>

      </div>
      <br/>
      <div id="naviposts">
          <button id="posts-button" onclick="switchTab('posts')">All Posts</button> <button id="gallery-button" onclick="switchTab('gallery')">Gallery</button>
      </div>
      <br/>
      <div id="maincontent">
        <form id="message-form" method="POST" class="hidden" enctype="multipart/form-data">
          <textarea name="text" id="message-input" placeholder="Go on...Share your art&#10;Compose a text..."></textarea>
          <br/>
          Add an image to your message:
          <input type="file" name="image"> <input type="submit" value="Post">
          <br/>
        </form>
        <hr/>
        <div id="message-container">Loading...</div>
      </div>
      <div id="gallery" class="hidden">
        <div id="gallery-message-container"></div>
      </div>
    </div>
  </body>
</html>
