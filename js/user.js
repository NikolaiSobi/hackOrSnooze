"use strict";

// global to hold the User instance of the currently-logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/login
 */

/** Handle login form submission. If login ok, sets up the user instance */

async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  // grab the username and password
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // User.login retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.login(username, password);

  $loginForm.trigger("reset");

  //hide the forms after logging in
  $loginForm.hide()
  $signupForm.hide()

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();
}

$loginForm.on("submit", login);

/** Handle signup form submission. */

async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // User.signup retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.signup(username, password, name);

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();

  $signupForm.trigger("reset");
}

$signupForm.on("submit", signup);

/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */

async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */

function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

/******************************************************************************
 * General UI stuff about users
 */

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */

function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");
  putStoriesOnPage()
  $allStoriesList.show();

  updateNavOnLogin();
}

//Submit story

async function favoriteStory(user, storyId, token ) {
  console.debug("favoriteStory")

  const res = await axios.post(`https://hack-or-snooze-v3.herokuapp.com/users/${user}/favorites/${storyId}`, {
    token: token
  })
  
  return user
}

async function unFavoriteStory(user, storyId, token) {
  console.debug("unFavoriteStory")

  try {
    const res = await axios.delete(`https://hack-or-snooze-v3.herokuapp.com/users/${user}/favorites/${storyId}`, {
      params: {token}
    })
    
    return user
    
  } catch (error) {
    console.error(error)
  }
  
}

async function deleteStory(storyId, token) {
  console.debug("deleteStory")
  
  const res = await axios.delete(`https://hack-or-snooze-v3.herokuapp.com/stories/${storyId}`, {
    params: {token}
  })
  return res.data.message
}

function toggleLike(user, storyId, token) {
  console.debug("toggleLike")

  const heartIcon = $(`#${storyId}`).find("#heartIcon")

  if(heartIcon.hasClass("far fa-heart")) {
    favoriteStory(user, storyId, token)
    heartIcon.removeClass("far fa-heart").addClass("fas fa-heart")
    
  } else {
    unFavoriteStory(user, storyId, token)
    heartIcon.removeClass("fas fa-heart").addClass("far fa-heart")
    
  }

}
