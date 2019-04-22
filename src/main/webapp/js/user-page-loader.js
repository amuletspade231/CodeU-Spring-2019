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

/** Generates a random GUID for HTML elements. */
function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

/** Sets the page title based on the URL parameter username. */
function setPageTitle() {
  document.getElementById('page-title').innerText = parameterUsername;
  document.title = parameterUsername + ' - User Page';
}

function fetchImageUploadUrlAndShowForm() {
  fetch('/image-upload-url?recipient=' + parameterUsername)
      .then((response) => {
        return response.text();
      })
      .then((imageUploadUrl) => {
        const messageForm = document.getElementById('message-form');
        messageForm.action = imageUploadUrl;
        messageForm.classList.remove('hidden');
        document.getElementById('about-me-form').classList.remove('hidden');
        document.getElementById('commissions-toggle').classList.remove('hidden');
      });
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
 * Toggles the reply thread of a message.
 * @param {String} threadID
 * @param {String} toggleID
 * @param {String} toggleMode
 */
function toggleReplies(threadID, toggleID, toggleMode) {
  if (toggleMode == "Hide Replies") {
    document.getElementById(threadID).classList.add('hidden'); //hide replies
    document.getElementById(toggleID).innerHTML = "Show Replies";
  } else {
    document.getElementById(threadID).classList.remove('hidden'); //show replies
    document.getElementById(toggleID).innerHTML = "Hide Replies";
  }
}

/**
 * Fetches all of the image posts made by the viewed user.
 */
function fetchGallery() {
  const url = "/messages?recipient=" + parameterUsername + "&gallery=true";
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
          const messageDiv = buildMessageDiv(message, "0px");
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
        if (loginStatus.isLoggedIn &&
            loginStatus.username == parameterUsername) {
          fetchImageUploadUrlAndShowForm();
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
          const messageDiv = buildMessageDiv(message, "0px");
          messagesContainer.appendChild(messageDiv);
        });
      });
}

/**
 * Fetches replies and adds them to their parent message.
 * @param {Message} message
 */
function fetchReplies(message) {

  //create reply thread
  const replyThread = document.createElement('div');
  replyThread.classList.add('reply-thread');
  replyThread.classList.add('hidden');
  replyThread.id = guidGenerator();
  var threadID = replyThread.id;

  //create reply toggles
  const replyToggle = document.createElement('button');
  replyToggle.classList.add('reply-toggle');
  replyToggle.id = guidGenerator();
  var toggleID = replyToggle.id;
  replyToggle.classList.add('hidden');
  replyToggle.innerHTML = "Show Replies";

  replyToggle.addEventListener("click", function() {
    toggleReplies(threadID, toggleID, replyToggle.innerHTML);
  });

  const linebreak = document.createElement('br');

  //create container for reply thread and toggle
  const replyContainer = document.createElement('div');
  replyContainer.classList.add('reply-container');
  replyContainer.appendChild(linebreak);
  replyContainer.appendChild(replyToggle);
  replyContainer.appendChild(replyThread);

  //actually fetching the replies
  const url = '/messages?parent=' + message.id.toString()
                      + '&recipient=' + message.user;
  fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((messages) => {
        messages.forEach((reply) => {
          if (reply.text != "") {
            replyToggle.classList.remove('hidden');
            const replyDiv = buildMessageDiv(reply, "50px");
            replyThread.appendChild(replyDiv);
          }
        });
      });

  return replyContainer;
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
      aboutMe = '';
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
 * @param {String} margin
 * @return {Element}
 */
function buildMessageDiv(message, margin) {
  const headerDiv = document.createElement('div');
  headerDiv.classList.add('message-header');

  const userPageLink = document.createElement('a');
  userPageLink.appendChild(document.createTextNode(message.user));
  userPageLink.setAttribute('href', '/users/' + message.user);

  headerDiv.appendChild(userPageLink);
  headerDiv.appendChild(document.createTextNode(' - '));
  headerDiv.appendChild(
      document.createTextNode(new Date(message.timestamp).toLocaleString('en-US')));
  headerDiv.appendChild(document.createTextNode(' - [Sentiment: ' + message.sentimentScore + ']'));

  const bodyDiv = document.createElement('div');
  if(message.imageURL){
    message.text += "<br/>";
    message.text += "<img src=\"" + message.imageURL + "\" />";
  }
  bodyDiv.classList.add('message-body');
  bodyDiv.innerHTML = message.text;

  const messageDiv = document.createElement('div');
  messageDiv.style.marginLeft = margin;
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
  textArea.placeholder='Add a comment...';

  const linebreak = document.createElement('br');

  const input = document.createElement('input');
  input.type = 'submit';
  input.value = 'Comment';

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
  fetchGallery();
  fetchAboutMe();
  fetchIsTakingCommissions();
}
