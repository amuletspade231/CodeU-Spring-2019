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

import java.util.UUID;

/** A single message posted by a user. */
public class Message {

  private UUID id;
  private UUID parent;
  private String user;
  private String text;
  private String recipient;
  private long timestamp;
  private float sentimentScore;
  private static String imageURL;
  
  /**
   * Constructs a new {@link Message} posted by {@code user} for {@code recipient}
   * with {@code text} content and {@code sentimentScore} sentiment scoring of the content.
   * If the message is a reply, {@code parent} will match the ID of its parent, otherwise null.
   * The recipient may be that same as the user if the user is posting on their own page.
   * Generates a random ID and uses the current system time for the creation time.
   */

  public Message(String user, String text, String recipient, float sentimentScore, String imageURL) {
    this(UUID.randomUUID(), new UUID( 0L , 0L ), user, text, recipient, sentimentScore, System.currentTimeMillis(), imageURL);
  }
    
  //Constructor for a reply
  public Message(UUID parent, String user, String text, String recipient, float sentimentScore) {
    this(UUID.randomUUID(), parent, user, text, recipient, sentimentScore, System.currentTimeMillis(), null);
  }

  public Message(UUID id, UUID parent, String user, String text, String recipient, float sentimentScore, long timestamp, String imageURL) {
    this.id = id;
    this.parent = parent;
    this.user = user;
    this.text = text;
    this.recipient = recipient;
    this.sentimentScore = sentimentScore;
    this.timestamp = timestamp;
    this.imageURL = imageURL;
  }

  public UUID getId() {
    return id;
  }

  public UUID getParent() {
    return parent;
  }

  public String getUser() {
    return user;
  }

  public String getText() {
    return text;
  }

  public float getSentimentScore() {
    return sentimentScore;
  }

  public long getTimestamp() {
    return timestamp;
  }

  public String getRecipient() {
    return recipient;
  }
    
  public String getImageUrl() { 
    return imageURL; 
  }
    
  public void setImageUrl(String newImage) { 
    imageURL = newImage; 
  }

}
