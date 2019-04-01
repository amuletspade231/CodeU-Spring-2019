/*
 * Copyright 2019 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 package com.google.codeu.servlets;

 import com.google.appengine.api.users.UserService;
 import com.google.appengine.api.users.UserServiceFactory;
 import com.google.codeu.data.Datastore;
 import com.google.codeu.data.Message;
 import com.google.gson.Gson;
 import com.google.gson.JsonObject;

 import java.io.IOException;
 import java.util.List;

 import javax.servlet.ServletException;
 import javax.servlet.annotation.WebServlet;
 import javax.servlet.http.HttpServlet;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;

 /**
  * A servlet for handling fetching site statistics.
  */
 @WebServlet("/charts")
 public class ChartServlet extends HttpServlet{

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
    * For page /charts, generates a request with current user and login status,
    * and forwards that request to chart.jsp
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

      List<Message> messages = datastore.getAllMessages();
      request.setAttribute("messages", messages);

      request.getRequestDispatcher("/WEB-INF/jsp/chart.jsp").forward(request,response);
   }
 }
