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

package com.google.codeu.data;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.SortDirection;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/** Provides access to the data stored in Datastore. */
public class Datastore {

  private DatastoreService datastore;

  public Datastore() {
    datastore = DatastoreServiceFactory.getDatastoreService();
  }

  /** Stores the Message in Datastore. */
  public void storeMessage(Message message) {
    Entity messageEntity = new Entity("Message", message.getId().toString());
    messageEntity.setProperty("user", message.getUser());
    messageEntity.setProperty("text", message.getText());
    messageEntity.setProperty("recipient", message.getRecipient());
    messageEntity.setProperty("sentimentScore", message.getSentimentScore());
    messageEntity.setProperty("timestamp", message.getTimestamp());
    if(message.getImageUrl() != null) {
      messageEntity.setProperty("imageURL", message.getImageUrl());
    }
    datastore.put(messageEntity);
  }

  /**
   * Loads in messages from the query into a list
   *
   * @return a list of messages stored in the query, or empty list if the query is empty. List is sorted by time descending.
   */
  public List<Message> loadMessages(PreparedQuery results) {
    List<Message> messages = new ArrayList<>();

    for (Entity entity : results.asIterable()) {
      try {
        String idString = entity.getKey().getName();
        UUID id = UUID.fromString(idString);
        String user = (String) entity.getProperty("user");
        String text = (String) entity.getProperty("text");
        String recipient = (String) entity.getProperty("recipient");
        float sentimentScore = ((Double) entity.getProperty("sentimentScore")).floatValue();
        long timestamp = (long) entity.getProperty("timestamp");
        String imageURL = (String) entity.getProperty("imageURL");
        Message message = new Message(id, user, text, recipient, sentimentScore, timestamp, imageURL);
        messages.add(message);
      } catch (Exception e) {
        System.err.println("Error reading message.");
        System.err.println(entity.toString());
        e.printStackTrace();
      }
    }

    return messages;
  }

    /** Stores the User in Datastore. */
   public void storeUser(User user) {
    Entity userEntity = new Entity("User", user.getEmail());
    userEntity.setProperty("email", user.getEmail());
    userEntity.setProperty("aboutMe", user.getAboutMe());
    userEntity.setProperty("isTakingCommissions", user.getIsTakingCommissions());
    datastore.put(userEntity);
   }

  /**
   * Returns the User owned by the email address, or
   * null if no matching User was found.
   */
  public User getUser(String email) {

    Query query = new Query("User")
    .setFilter(new Query.FilterPredicate("email", FilterOperator.EQUAL, email));
    PreparedQuery results = datastore.prepare(query);
    Entity userEntity = results.asSingleEntity();
    if(userEntity == null) {
      return null;
    }

    String aboutMe = (String) userEntity.getProperty("aboutMe");
    boolean isTakingCommissions = (boolean) userEntity.getProperty("isTakingCommissions");
    User user = new User(email, aboutMe, Optional.of(isTakingCommissions));

    return user;
   }

  /**
   * Gets messages posted by a user, or all messages if user is null.
   *
   * @return a list of any messages posted by the user, sorted by time descending. If user is null, returns all messages in the Datastore.
   */
  public List<Message> getMessages(String recipient) {
    List<Message> messages = new ArrayList<>();
    Query query = new Query("Message");

    if (recipient != null) {
      query.setFilter(new Query.FilterPredicate("recipient", FilterOperator.EQUAL, recipient));
    }
    query.addSort("timestamp", SortDirection.DESCENDING);
    PreparedQuery results = datastore.prepare(query);
    messages = loadMessages(results);

    return messages;
  }

  /**
   * Gets messages posted by all users.
   *
   * @return a list of messages posted by all users so far, sorted by time descending.
   */
  public List<Message> getAllMessages() {
    // calling getMessages with a null user returns all messages in datastore
    return getMessages(null);
  }

  /**
   * Returns the total number of messages for all users.
   *
   * @return total number of messages across all users
   */
  public int getTotalMessageCount(){
    Query query = new Query("Message");
    PreparedQuery results = datastore.prepare(query);
    return results.countEntities(FetchOptions.Builder.withLimit(1000));
  }
}
