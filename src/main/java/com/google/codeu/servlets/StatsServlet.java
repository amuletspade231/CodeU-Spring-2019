package com.google.codeu.servlets;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.codeu.data.Datastore;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * A servlet for handling fetching site statistics.
 */
@WebServlet("/stats")
public class StatsServlet extends HttpServlet{

  private Datastore datastore;

  @Override
  /**
   * Called automatically once when the servlet is first created,
   * to create and store a Datastore instance.
   */
  public void init() {
    datastore = new Datastore();
  }

  @Override
  /**
   * On page /stats, gets total message count from the datastore and outputs it
   * as bare-bones JSON format: {"messageCount": messageCount}.
   */
  public void doGet(HttpServletRequest request, HttpServletResponse response)
    throws IOException, ServletException {

    UserService userService = UserServiceFactory.getUserService();

    boolean isUserLoggedIn = userService.isUserLoggedIn();
    request.setAttribute("isUserLoggedIn", isUserLoggedIn);

    if (isUserLoggedIn) {
      String user = userService.getCurrentUser().getEmail();
      request.setAttribute("user", user);
    }

    request.getRequestDispatcher("/jsp/stats.jsp").forward(request,response);
  }
}
