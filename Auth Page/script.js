const AUTH_KEYWORDS = ['banar', 'baanar'];
const AUTH_FLAG_KEY = 'bestFriendAuth';
const FAILURE_MESSAGES = [
  "Na Na Na, phir se try kijiye! 🙃",
  "Pagal, kya kar rahi hai.",
  "Are wo B se start hota hai na."
];

let attemptCount = 0;

const form = document.getElementById('authForm');
const input = document.getElementById('authInput');
const messageEl = document.getElementById('authMessage');
const resetBtn = document.getElementById('resetHint');
const page = document.querySelector('.page');
const submitBtn = form ? form.querySelector('button') : null;

(function bootstrap() {
  if (!form || !input) {
    return;
  }

  if (sessionStorage.getItem(AUTH_FLAG_KEY) === 'true') {
    redirectToMain();
    return;
  }

  setTimeout(() => input.focus(), 150);

  form.addEventListener('submit', onSubmit);
  if (resetBtn) {
    resetBtn.addEventListener('click', resetForm);
  }
})();

function onSubmit(event) {
  event.preventDefault();
  const rawValue = (input.value || '').trim();
  const normalized = rawValue.toLowerCase();

  if (!rawValue) {
    showMessage('Pehle naam to type kijiye! 😊', false);
    shakeCard();
    input.focus();
    return;
  }

  if (AUTH_KEYWORDS.includes(normalized)) {
    handleSuccess(rawValue);
    return;
  }

  const hint = FAILURE_MESSAGES[attemptCount % FAILURE_MESSAGES.length];
  attemptCount += 1;
  showMessage(hint, false);
  toggleReset(true);
  shakeCard();
  input.value = '';
  input.focus();
}

function handleSuccess(typedName) {
  attemptCount = 0;
  sessionStorage.setItem(AUTH_FLAG_KEY, 'true');
  showMessage(`Badtameez😤`);
  toggleReset(false);
  if (page) {
    page.classList.add('page--success');
  }
  form.classList.add('card__form--success');
  if (submitBtn) {
    submitBtn.disabled = true;
  }
  input.disabled = true;
  setTimeout(redirectToMain, 900);
}

function showMessage(text, isSuccess) {
  if (!messageEl) return;
  if (!text) {
    messageEl.textContent = '';
    messageEl.classList.remove('card__message--visible', 'card__message--success', 'card__message--error');
    return;
  }
  messageEl.textContent = text;
  messageEl.classList.add('card__message--visible');
  if (isSuccess) {
    messageEl.classList.remove('card__message--error');
    messageEl.classList.add('card__message--success');
  } else {
    messageEl.classList.remove('card__message--success');
    messageEl.classList.add('card__message--error');
  }
}

function shakeCard() {
  const card = document.querySelector('.card');
  if (!card) return;
  card.classList.remove('card--shake');
  void card.offsetWidth;
  card.classList.add('card--shake');
}

function toggleReset(show) {
  if (!resetBtn) return;
  resetBtn.hidden = !show;
}

function resetForm() {
  attemptCount = 0;
  toggleReset(false);
  showMessage('', false);
  input.value = '';
  input.disabled = false;
  if (submitBtn) {
    submitBtn.disabled = false;
  }
  input.focus();
}

function redirectToMain() {
  window.location.replace('../index.html');
}
