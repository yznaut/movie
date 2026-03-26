// Function to show only the selected page
function showPage(pageId) {
  document.querySelectorAll('main > div').forEach(div => div.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

// Initialize to login page
showPage('loginPage');

// Password strength indicator
const passwordInput = document.getElementById('signupPassword');
const passwordStrengthDiv = document.getElementById('passwordStrength');

if (passwordInput) {
  passwordInput.addEventListener('input', () => {
    const pw = passwordInput.value;
    let strength = 0;
    if (pw.length >= 8) strength++;
    if (/[0-9]/.test(pw)) strength++;
    if (/[^A-Za-z0-9]/.test(pw)) strength++;
    passwordStrengthDiv.innerText = `Strength: ${strength}/3`;
  });
}

// Sign Up
document.getElementById('signupForm').onsubmit = (e) => {
  e.preventDefault();
  const username = document.getElementById('signupUsername').value;
  const password = document.getElementById('signupPassword').value;
  const confirm = document.getElementById('signupConfirmPassword').value;

  if (password !== confirm) {
    alert('Passwords do not match');
    return;
  }
  if (password.length < 8 || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
    alert('Password does not meet requirements');
    return;
  }
  localStorage.setItem('user_' + username, JSON.stringify({password}));
  alert('Sign Up successful! Please sign in.');
  showPage('loginPage');
};

// Sign In
document.getElementById('loginForm').onsubmit = (e) => {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  const userData = localStorage.getItem('user_' + username);
  if (userData) {
    const user = JSON.parse(userData);
    if (user.password === password) {
      localStorage.setItem('currentUser', username);
      loadUserData();
      showPage('homePage');
    } else {
      alert('Incorrect password');
    }
  } else {
    alert('User not found');
  }
};

// Load user data
function loadUserData() {
  const username = localStorage.getItem('currentUser');
  document.getElementById('profileUsername').innerText = username;

  const watching = JSON.parse(localStorage.getItem('watching_' + username)) || [];
  const watched = JSON.parse(localStorage.getItem('watched_' + username)) || [];

  const watchingList = document.getElementById('watchingList');
  const watchedList = document.getElementById('watchedList');

  watchingList.innerHTML = '';
  watchedList.innerHTML = '';

  watching.forEach((movie, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${movie.title}</strong> (${movie.genre || 'Genre'}) - ${movie.date}
      <button onclick="finishMovie(${index})">Finish</button>
      <button onclick="deleteMovie('watching', ${index})">Delete</button>`;
    watchingList.appendChild(li);
  });

  watched.forEach((movie, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${movie.title}</strong> (${movie.genre || 'Genre'}) - ${movie.date} <br />
      Date Finished: ${movie.dateFinished} <br />
      Rating: ${'★'.repeat(movie.rating)}${'☆'.repeat(5 - movie.rating)} <br />
      Comment: ${movie.comment} <br />
      <button onclick="deleteMovie('watched', ${index})">Delete</button>`;
    watchedList.appendChild(li);
  });
}

// Add movie to currently watching
document.getElementById('addWatchingForm').onsubmit = (e) => {
  e.preventDefault();
  const title = document.getElementById('movieTitle').value;
  const genre = document.getElementById('movieGenre').value;
  const date = document.getElementById('movieDate').value;
  const username = localStorage.getItem('currentUser');

  const movies = JSON.parse(localStorage.getItem('watching_' + username)) || [];
  movies.push({title, genre, date});
  localStorage.setItem('watching_' + username, JSON.stringify(movies));
  loadUserData();
  document.getElementById('addWatchingForm').reset();
};

// Finish movie
function finishMovie(index) {
  const username = localStorage.getItem('currentUser');
  const watching = JSON.parse(localStorage.getItem('watching_' + username)) || [];
  const watched = JSON.parse(localStorage.getItem('watched_' + username)) || [];

  const movie = watching.splice(index,1)[0];
  movie.dateFinished = new Date().toISOString().slice(0,10);
  // Initialize rating and comment
  movie.rating = 0;
  movie.comment = '';

  localStorage.setItem('watching_' + username, JSON.stringify(watching));
  watched.push(movie);
  localStorage.setItem('watched_' + username, JSON.stringify(watched));
  loadUserData();
}

// Delete movie
function deleteMovie(listType, index) {
  const username = localStorage.getItem('currentUser');
  const listKey = listType === 'watching' ? 'watching_' + username : 'watched_' + username;
  const list = JSON.parse(localStorage.getItem(listKey)) || [];
  list.splice(index,1);
  localStorage.setItem(listKey, JSON.stringify(list));
  loadUserData();
}

// Logout
function logout() {
  localStorage.removeItem('currentUser');
  showPage('loginPage');
}
