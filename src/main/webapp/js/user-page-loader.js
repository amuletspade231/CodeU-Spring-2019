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
 * When the commissions toggle is clicked, sets the user's
 * isTakingCommissions attribute accordingly.
 */
function setCommissions() {
  const checkbox = document.getElementById("commissions-checkbox");
  const url = "/commissions";
  console.log(checkbox.checked);
  //send a POST request to CommissionsServlet.doPost
  let bodyData = new URLSearchParams();
  bodyData.append("commissionsToggle", checkbox.checked);
  fetch(url, {
    method: "POST",
    body: bodyData,
  });
}

/**
 * Switches between displaying all posts and displaying the gallery.
 * @param {String} tabName
 */
function switchTab(tabName) {
  if (tabName == 'gallery') {
    document.getElementById('maincontent').classList.add('hidden');
    document.getElementById('gallery').classList.remove('hidden');
  } else {
    document.getElementById('gallery').classList.add('hidden');
    document.getElementById('maincontent').classList.remove('hidden');
  }
}

/**
 * Fetches all of the image posts made by the viewed user.
 */
function fetchGallery() {
  const url = "/messages?username=" + parameterUsername + "&gallery=true";
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((messages) => {
      const messagesContainer = document.getElementById('gallery-message-container');
      if (messages.length == 0) {
        messagesContainer.innerHTML = '<p>This user has no gallery posts yet.</p>';
      } else {
        messagesContainer.innerHTML = '';
        messages.forEach((message) => {
          const messageDiv = buildMessageDiv(message);
          messagesContainer.appendChild(messageDiv);
        });
      }
    });
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
  const url = '/messages?username=' + parameterUsername;
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

/**
 * Gets the text of the user's About Me and populates a div with it.
 */
function fetchAboutMe() {
  const url = '/about?username=' + parameterUsername;
  fetch(url).then((response) => {
    return response.text();
  }).then((aboutMe) => {
    const aboutMeContainer = document.getElementById('about-me-container');
    if(aboutMe == '') {
      aboutMe = 'Enter information about yourself.';
    }
    aboutMeContainer.innerHTML = aboutMe;
  });
}

/**
 * Gets the user's commission status and sets the slider's default value to it.
 */
 function fetchIsTakingCommissions() {
   const url = "/commissions";
   fetch(url).then((response) => {
     return response.text();
   }).then((isTakingCommissions) => {
     let commissionsToggle = document.getElementById("commissions-checkbox");
     let slider = document.getElementById("commissions-slider");
     commissionsToggle.checked = (isTakingCommissions === "true");
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

  return messageDiv;
}

/** Fetches data and populates the UI of the page. */
function buildUI() {
  setPageTitle();
  showMessageFormIfLoggedIn();
  fetchMessages();
  fetchGallery();
  fetchAboutMe();
  fetchIsTakingCommissions();
}
