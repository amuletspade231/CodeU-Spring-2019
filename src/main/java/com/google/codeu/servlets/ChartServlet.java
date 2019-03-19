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

 import com.google.gson.JsonObject;
 import com.google.codeu.data.Datastore;
 import com.google.codeu.data.Message;
 import com.google.gson.Gson;

 import java.io.IOException;
 import java.util.List;

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
    * Converts the returned value to JSON and prints the JSON out as a response.
    *
    * @return a list of all of the messages
    */
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
      response.setContentType("application/json");
      List<Message> msgList = datastore.getMessages(null);
      Gson gson = new Gson();
      String json = gson.toJson(msgList);
      response.getWriter().println(json);
   }
 }
