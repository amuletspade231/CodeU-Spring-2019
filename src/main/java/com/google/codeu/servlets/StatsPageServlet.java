package com.google.codeu.servlets;

import com.google.gson.JsonObject;
import com.google.codeu.data.Datastore;

import java.io.IOException;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * A servlet for handling fetching site statistics.
 */
@WebServlet("/stats")
public class StatsPageServlet extends HttpServlet{

  private Datastore datastore;

  @Override
  public void init() {
    datastore = new Datastore();
  }
  
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response)
    throws IOException {
    
    response.setContentType("application/json");

    int messageCount = datastore.getTotalMessageCount();

    JsonObject jsonObject = new JsonObject();
    jsonObject.addProperty("messageCount", messageCount);
    response.getOutputStream().println(jsonObject.toString()); 
  }
}

