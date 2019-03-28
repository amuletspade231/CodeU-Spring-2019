package com.google.codeu.servlets;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.codeu.data.Datastore;
import com.google.codeu.data.Message;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Handles fetching all messages for the public feed.
 */
@WebServlet("/feed")
public class FeedServlet extends HttpServlet{

  private Datastore datastore;

  @Override
  public void init() {
    datastore = new Datastore();
  }

 /**
  * Responds with a JSON representation of Message data for all users.
  */
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response)
    throws IOException, ServletException {

    UserService userService = UserServiceFactory.getUserService();

    boolean isUserLoggedIn = userService.isUserLoggedIn();
    request.setAttribute("isUserLoggedIn", isUserLoggedIn);

    if (isUserLoggedIn) {
      String user = userService.getCurrentUser().getEmail();
      request.setAttribute("user", user);
    }

    List<Message> messages = datastore.getAllMessages();
    request.setAttribute("messages", messages);

    request.getRequestDispatcher("/jsp/feed.jsp").forward(request,response);
  }
}
