"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  $favoriteStoriesList.hide()
  $myStoriesList.hide()
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  
  
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $favoriteStoriesList.hide()
  $navUserProfile.text(`${currentUser.username}`).show();
  $navSubmit.show()
  $navFavorites.show()
  $navMyStories.show()
}

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt)
  $storyForm.show()
  $allStoriesList.show()
  $favoriteStoriesList.hide()
}

$navSubmit.on("click", navSubmitClick)

// Shows user's favorite stories
function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt)
  putStoriesOnPage()
  $allStoriesList.hide()
  $storyForm.hide()
  $allStoriesList.hide()
  $myStoriesList.hide()
  putFavoritesOnPage()
}

$navFavorites.on("click", navFavoritesClick)

// Shows user stories
function navMyStoriesClick(evt) {
  console.debug("navMyStoriesClick", evt)
  putStoriesOnPage()
  $allStoriesList.hide()
  $storyForm.hide()
  $favoriteStoriesList.hide()
  putMyStoriesOnPage()
}

$navMyStories.on("click", navMyStoriesClick)




