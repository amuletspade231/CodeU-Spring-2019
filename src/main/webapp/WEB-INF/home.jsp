<% boolean isUserLoggedIn = (boolean) request.getAttribute("isUserLoggedIn"); %>

<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>CodeU Starter Project</title>
    <link rel="stylesheet" href="/css/indexcss.css">
  </head>
  <body>
    <nav>
      <ul id="navigation">
        <li><a href="/home">Home</a></li>

    <%
      if (isUserLoggedIn) {
        String username = (String) request.getAttribute("username");
    %>
        <li><a href="/user-page.html?user=<%= username %>">Your Page</a></li>
        <li><a href="/feed.html">Public Feed</a></li>
        <li><a href="/logout">Logout</a></li>
    <% } else {   %>
       <li><a href="/login">Login</a></li>
    <% } %>

      </ul>
    </nav>
    <h1>Team 30 Starter Project</h1>
    <div id="content">
      <br>
      <p>Welcome to Team 30's Starter Project page. Our names are DJ, Amanda, Gloria, and Kevin!
      </p>
      <p>We designed a basic social media web app for artists to showcase and discuss about their art with other fellow artists as well.</p>
      <p>Click the links above to login and visit your page.
      You can post messages on your page, and you can visit other user pages if you have
      their URL.</p>
    </div>
  </body>
</html>
