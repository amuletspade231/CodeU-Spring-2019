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

// Get ?user=XYZ parameter value
const full_url = new String(window.location.href);
var prefix = "/users/";
var parameterUsername = full_url.substring(full_url.indexOf(prefix) + prefix.length);

/** Sets the page title based on the URL parameter username. */
function setPageTitle() {
  document.getElementById('page-title').innerText = parameterUsername;
  document.title = parameterUsername + ' - User Page';
}

/**
 * Shows the message form if the user is logged in.
 * Shows the about me form and commissions toggle if the user is viewing their own page.
 */
function showMessageFormIfLoggedIn() {
  fetch('/login-status')
      .then((response) => {
        return response.json();
      })
      .then((loginStatus) => {
        if (loginStatus.isLoggedIn) {
          const messageForm = document.getElementById('message-form');
          messageForm.classList.remove('hidden');
          messageForm.action = '/messages?recipient=' + parameterUsername;
          if (loginStatus.username == parameterUsername) {
            document.getElementById('about-me-form').classList.remove('hidden');
            document.getElementById('commissions-toggle').classList.remove('hidden');
          }
        }
      });
}

/** Fetches messages and add them to the page. */
function fetchMessages() {
  const url = '/messages?recipient=' + parameterUsername;
  fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((messages) => {
        const messagesContainer = document.getElementById('message-container');
        if (messages.length == 0) {
          messagesContainer.innerHTML = '<p>This user has no posts yet.</p>';
        } else {
          messagesContainer.innerHTML = '';
        }
        messages.forEach((message) => {
          const messageDiv = buildMessageDiv(message);
          messagesContainer.appendChild(messageDiv);
        });
      });
}

/** Fetches replies and adds them to their parent message. */
function fetchReplies(message) {
  const replyThread = document.createElement('div');
  replyThread.classList.add('reply-thread');

  const url = '/messages?parent=' + message.id.toString()
                      + '&recipient=' + message.user;
  fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((messages) => {
        messages.forEach((reply) => {
          const replyDiv = buildMessageDiv(reply);
          replyThread.appendChild(replyDiv);
        });
      });
  return replyThread;
}

function fetchAboutMe(){
  const url = '/about?username=' + parameterUsername;
  fetch(url).then((response) => {
    return response.text();
  }).then((aboutMe) => {
    const aboutMeContainer = document.getElementById('about-me-container');
    if(aboutMe == ''){
      aboutMe = 'Enter information about yourself.';
    }

    aboutMeContainer.innerHTML = aboutMe;

  });
}


/**
 * Builds an element that displays the message.
 * @param {Message} message
 * @return {Element}
 */
function buildMessageDiv(message) {
  const headerDiv = document.createElement('div');
  headerDiv.classList.add('message-header');
  headerDiv.appendChild(document.createTextNode(
      message.user + ' - ' +
      new Date(message.timestamp) +
      ' [' + message.sentimentScore + ']'));

  const bodyDiv = document.createElement('div');
  bodyDiv.classList.add('message-body');
  bodyDiv.innerHTML = message.text;

  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message-div');
  messageDiv.appendChild(headerDiv);
  messageDiv.appendChild(bodyDiv);

  fetch('/login-status')
      .then((response) => {
        return response.json();
      })
      .then((loginStatus) => {
        if (loginStatus.isLoggedIn) {
          const replyForm = buildReplyForm(message);
          messageDiv.appendChild(replyForm);
        }

        const replyThread = fetchReplies(message);
        messageDiv.appendChild(replyThread);
      });

  return messageDiv;
}

/**
 * Builds a reply form for the message.
 * @param {Message} message
 * @return {Element}
 */
function buildReplyForm(message) {
  const textArea = document.createElement('textarea');
  textArea.name = 'text';

  const linebreak = document.createElement('br');

  const input = document.createElement('input');
  input.type = 'submit';
  input.value = 'Submit';

  const replyForm = document.createElement('form');
  replyForm.action = '/messages?parent=' + message.id.toString()
                      + '&recipient=' + message.user;
  replyForm.method = 'POST';
  replyForm.appendChild(textArea);
  replyForm.appendChild(linebreak);
  replyForm.appendChild(input);

  return replyForm;
}

/** Fetches data and populates the UI of the page. */
function buildUI() {
  setPageTitle();
  showMessageFormIfLoggedIn();
  fetchMessages();
  fetchAboutMe();

}
