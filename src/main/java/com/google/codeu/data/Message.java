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
  private String user;
  private String text;
  private String recipient;
  private long timestamp;
  private float sentimentScore;

  /**
   * Constructs a new {@link Message} posted by {@code user} for {@code recipient}
   * with {@code text} content and {@code sentimentScore} sentiment scoring of the content.
   * The recipient may be that same as the user if the user is posting on their own page.
   * Generates a random ID and uses the current system time for the creation time.
   */
  public Message(String user, String text, String recipient, float sentimentScore) {
    this(UUID.randomUUID(), user, text, recipient, sentimentScore, System.currentTimeMillis());
    this.parent = this.id;
  }
 //Constructor for a reply
 public Message(UUID parent, String user, String text, String recipient, float sentimentScore) {
   this(UUID.randomUUID(), parent, user, text, recipient, sentimentScore, System.currentTimeMillis());
 }

  public Message(UUID id, UUID parent, String user, String text, String recipient, float sentimentScore, long timestamp) {
    this.id = id;
    this.parent = parent;
    this.user = user;
    this.text = text;
    this.recipient = recipient;
    this.sentimentScore = sentimentScore;
    this.timestamp = timestamp;
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
}
