
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
          const replyDiv = buildMessageDiv(reply, "50px");
          replyThread.appendChild(replyDiv);
        });
      });
  return replyThread;
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

  const replyHeaderDiv = document.createElement('div');
  replyHeaderDiv.classList.add('message-header');
  replyHeaderDiv.appendChild(document.createTextNode('Replies'));

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
        if (replyThread.hasChildNodes())
          messageDiv.appendChild(replyHeaderDiv);
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
