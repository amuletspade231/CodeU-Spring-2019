package com.google.codeu.servlets;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.codeu.data.Datastore;
import com.google.codeu.data.Message;
import com.google.codeu.data.User;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/*
 * Handles fetching and saving user data from the server side and forwarding
 * the request to the user JSP page.
 */
@WebServlet("/users/*")
public class UserServlet extends HttpServlet {
  private Datastore datastore;

  @Override
  public void init() {
    datastore = new Datastore();
  }

  /*
   * On page /users/<username>, gets user info from the user service factory
   * and datastore. Then, it adds all data to a request that gets forwarded to
   * the user JSP page.
   */
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response)
    throws IOException, ServletException {
    // Confirm that current user is logged in

    UserService userService = UserServiceFactory.getUserService();

    boolean isUserLoggedIn = userService.isUserLoggedIn();
    request.setAttribute("isUserLoggedIn", isUserLoggedIn);
    if (isUserLoggedIn) {
      String user = userService.getCurrentUser().getEmail();
      request.setAttribute("user", user);
    }

    // Confirm that user is valid

    String requestUrl = request.getRequestURI();
    String username = requestUrl.substring("/users/".length());

    if (username == null || username.equals("")) {
      response.getWriter().println(username + " is null");
      return;
    }
    request.setAttribute("username", username);

    // Fetch user messages

    List<Message> messages = datastore.getMessages(username);
    request.setAttribute("messages", messages);

    request.getRequestDispatcher("/WEB-INF/jsp/user-page.jsp").forward(request,response);
  }
}
