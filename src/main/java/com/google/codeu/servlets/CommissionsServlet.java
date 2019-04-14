package com.google.codeu.servlets;

import java.io.IOException;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.util.Optional;
import java.util.stream.Collectors;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.codeu.data.Datastore;
import com.google.codeu.data.RegexExample;
import com.google.codeu.data.User;


/**
 * Handles fetching and saving user data.
 */
@WebServlet("/commissions")
public class CommissionsServlet extends HttpServlet{
  private Datastore datastore;

  @Override
  public void init() {
    datastore = new Datastore();
  }

  /**
  * Responds with the commissions setting for a particular user.
  */
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response)
    throws IOException {

    response.setContentType("text/html");

    UserService userService = UserServiceFactory.getUserService();
    if (!userService.isUserLoggedIn()) {
     	response.sendRedirect("/home");
     	return;
    }

    String userEmail = userService.getCurrentUser().getEmail();
    User user = datastore.getUser(userEmail);

    response.getOutputStream().print(user.getIsTakingCommissions());
  }

  @Override
  /**
   * Handles setting the user's commission status in the datastore, from the
   * request generated by setCommissions() in user-page-loader.js
   */
  public void doPost(HttpServletRequest request, HttpServletResponse response)
    throws IOException {

    UserService userService = UserServiceFactory.getUserService();
    if (!userService.isUserLoggedIn()) {
     	response.sendRedirect("/home");
     	return;
    }

    String userEmail = userService.getCurrentUser().getEmail();
    User user = datastore.getUser(userEmail);
    boolean commissions = request.getParameter("commissionsToggle").equals("true");
    String aboutMe = (user != null ?
                      user.getAboutMe() :
                      "");

    user = new User(userEmail, aboutMe, Optional.of(commissions));

    datastore.storeUser(user);

    response.sendRedirect("/users/" + userEmail);
  }
}