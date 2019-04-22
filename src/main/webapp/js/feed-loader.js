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

/** Generates a random GUID for HTML elements. */
function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

// Fetch messages and add them to the page.
function fetchMessages(){
  const url = '/feed-json';
  fetch(url).then((response) => {
    return response.json();
  }).then((messages) => {
    const messageContainer = document.getElementById('message-container');
    if(messages.length == 0){
      messageContainer.innerHTML = '<p>There are no posts yet.</p>';
    }
    else{
      messageContainer.innerHTML = '';
    }
    messages.forEach((message) => {
      const messageDiv = buildMessageDiv(message, "0px");
      messageContainer.appendChild(messageDiv);
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

// Fetch data and populate the UI of the page.
function buildUI(){
  fetchMessages();
}
