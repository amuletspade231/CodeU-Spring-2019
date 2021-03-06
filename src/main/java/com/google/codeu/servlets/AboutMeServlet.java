package com.google.codeu.servlets;

import java.io.IOException;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse; 

import java.util.Optional;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.codeu.data.Datastore;
import com.google.codeu.data.RegexExample;
import com.google.codeu.data.User;


/**
 * Handles fetching and saving user data.
 */

@WebServlet("/about")
public class AboutMeServlet extends HttpServlet{
  private Datastore datastore;

  @Override
  public void init() {
    datastore = new Datastore();
  }

  /**
  * Responds with the "about me" section for a particular user.
  */
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response)
    throws IOException {

    response.setContentType("text/html");

    String username = request.getParameter("username");

    if(username == null || username.equals("")) {
      // Request is invalid, return empty response
      return;
    }
    User userData = datastore.getUser(username);
    if(userData == null || userData.getAboutMe() == null) {
      return;
    }

    response.getOutputStream().println(userData.getAboutMe());
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response)
    throws IOException {

    UserService userService = UserServiceFactory.getUserService(); 
    if (!userService.isUserLoggedIn()) {
     	response.sendRedirect("/");
     	return;
    }

    String userEmail = userService.getCurrentUser().getEmail();
    User user = datastore.getUser(userEmail);

    String aboutMe = request.getParameter("about-me");
    Optional<Boolean> isTakingCommissions;
    isTakingCommissions = (user == null ?
                          Optional.empty() :
                          Optional.of(user.getIsTakingCommissions()));

    user = new User(userEmail, aboutMe, isTakingCommissions);

    datastore.storeUser(user);

    response.sendRedirect("/users/" + userEmail);
  }
}
