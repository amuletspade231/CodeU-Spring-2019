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

import com.google.appengine.api.blobstore.BlobInfo;
import com.google.appengine.api.blobstore.BlobInfoFactory;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.images.ImagesService;
import com.google.appengine.api.images.ImagesServiceFactory;
import com.google.appengine.api.images.ServingUrlOptions;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.cloud.language.v1.Document;
import com.google.cloud.language.v1.Document.Type;
import com.google.cloud.language.v1.LanguageServiceClient;
import com.google.cloud.language.v1.Sentiment;
import com.google.codeu.data.Datastore;
import com.google.codeu.data.Message;
import com.google.gson.Gson;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;
import java.util.Map;

/** Handles fetching and saving {@link Message} instances. */
@WebServlet("/messages")
public class MessageServlet extends HttpServlet {

  private Datastore datastore;

  @Override
  public void init() {
    datastore = new Datastore();
  }

  /**
   * Responds with a JSON representation of {@link Message} data for a specific user. Responds with
   * an empty array if the user is not provided.
   */
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

    response.setContentType("application/json");

    String recipient = request.getParameter("recipient");

    String parent = request.getParameter("parent");

    if (recipient == null || recipient.equals("")) {
      // Request is invalid, return empty array
      response.getWriter().println("[]");
      return;
    }

    List<Message> messages;

    String gallery = request.getParameter("gallery");

    boolean isGalleryRequest = (gallery != null && gallery.equals("true"));
    if (isGalleryRequest) {
      messages = datastore.getGallery(recipient);
    } else {
      // a parentless message is a top-level post, not a reply
      if (parent == null || parent.equals("")) {
        messages = datastore.getMessages(recipient);
      } else {
        messages = datastore.getReplies(parent);
      }
    }
    Gson gson = new Gson();
    String json = gson.toJson(messages);
    response.getWriter().println(json);
  }

  /** Stores a new {@link Message}. */
  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

    UserService userService = UserServiceFactory.getUserService();
    if (!userService.isUserLoggedIn()) {
      response.sendRedirect("/");
      return;
    }
    String username = userService.getCurrentUser().getEmail();

    String recipient = request.getParameter("recipient");

    String userText = Jsoup.clean(request.getParameter("text"), Whitelist.none());

    String regex = "(https?://\\S+\\.(png|jpg|gif))";
    String replacement = "<img src=\"$1\" />";

    String youtube_regex = "(https://www.youtube.com/watch\\?v=(\\S*))";
    String youtube_replacement = "<iframe width=\"560\" height=\"315\" "+
   "src=\"https://www.youtube.com/embed/$2\" frameborder=\"0\" "+
   "allow=\"accelerometer; autoplay; encrypted-media; gyroscope; "+
   "picture-in-picture\" allowfullscreen></iframe>";

    String textWithImagesReplaced = userText.replaceAll(regex, replacement);
    String result = textWithImagesReplaced.replaceAll(youtube_regex, youtube_replacement);
    float sentimentScore = getSentimentScore(result);
    String imageURL = null;

    try {
      BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
      Map<String, List<BlobKey>> blobs = blobstoreService.getUploads(request);
      List<BlobKey> blobKeys = blobs.get("image");
      if (blobKeys != null && !blobKeys.isEmpty()) {
        BlobKey blobKey = blobKeys.get(0);
        BlobInfo blobInfo = new BlobInfoFactory().loadBlobInfo(blobKey);
        if (blobInfo.getSize() != 0) {
          ImagesService imagesService = ImagesServiceFactory.getImagesService();
          ServingUrlOptions options = ServingUrlOptions.Builder.withBlobKey(blobKey);
          imageURL = imagesService.getServingUrl(options);
        } else {
          blobstoreService.delete(blobKey);
        }
      }
    } catch(IllegalStateException e) {
      // This exception occurs when the user tries to post a reply.
      // This happens because replies don't go through Blobstore, so the above code throws this
      // exception. This is a bit of a hack just to fix replies, but this exception is "expected"
      // so we aren't going to do anything other than log here.
      // If image uploads suddenly stop working, we should take a closer look at this exception,
      // which might be hiding other problems.
      // We could also add upload support to replies, at which point we wouldn't need this hack.
      System.out.println("Caught IllegalStateException in Message Servlet while uploading image." +
          " This is probably because the user posted a reply, which doesn't support uploads.");
    }

    String parent = request.getParameter("parent");

    if (parent == null || parent.equals("")) {
      Message message = new Message(username, result, recipient, sentimentScore, imageURL);
      datastore.storeMessage(message);
    } else {
      Message reply = new Message(UUID.fromString(parent), username, result, recipient, sentimentScore);
      datastore.storeReply(reply);
    }
    response.sendRedirect("/users/" + recipient);
  }
  /**
   * Analyzes a message's text for its positive/negative sentiment.
   *
   * @return the sentiment score of the message
   */
  private float getSentimentScore(String text) throws IOException {
    Document doc = Document.newBuilder()
        .setContent(text).setType(Type.PLAIN_TEXT).build();

    LanguageServiceClient languageService = LanguageServiceClient.create();
    Sentiment sentiment = languageService.analyzeSentiment(doc).getDocumentSentiment();
    languageService.close();

    return sentiment.getScore();
  }
}
