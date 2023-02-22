import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chatbot_container');

let loadInterval;

function loader(element){
  element.textContent = '.';
  loadInterval = setInterval(() => {
    if (element.textContent === '.......') {
      element.textContent = '';
    }
  }, 330)
}

function typeText(element, text) {
  let index = 0;
  let interval = setInterval(() => {
    if(index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 30)
}

function generateRandomID() {
  const time = Date.now();
  const randomNumber = Math.random();
  const hexString = randomNumber.toString(16);
  return 'id-${time}-${hexString}';
}

function chatStripe (isAI, value, uniqueID) {
  return (
    `
    <div class="wrapper ${isAI && 'ai'}">
    <div class="chat">
    <div className="profile">
    <img
    src="${isAI ? bot : user}"
    src="${isAI ? 'bot' : 'user'}"
    />
    </div>
    <div class="message" id=${uniqueID}>${value}</div>
    </div>
    </div>
    `
  )
}

const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
  form.reset();
  const uniqueID = generateRandomID;
  chatContainer.innerHTML += chatStripe(true," ",uniqueID);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  const messageDiv = document.getElementById(uniqueID);
  loader(messageDiv);
  const response = await fetch('https://localhost:5000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })
  clearInterval(loadInterval);
  messageDivDiv.innerHTML = '';

  if(response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();
    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();
    messageDiv.innerHTML = "Oh no, something went wrong.";
    alert(err);
  }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
})