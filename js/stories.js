"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  
  const hostName = story.getHostName();

  // checks to see if currentUser has a favorited story that is the same as the story Id. 
  // If so, give it the class with the heart that is filled in otherwise empty heart.
  let fav;
  if(currentUser){
    fav = currentUser.favorites.filter(item => story.storyId == item.storyId).length !== 0 ? 'fas' : 'far'
  }
  
  if(currentUser){
    return $(`
      <li id="${story.storyId}">
        <span class="heart">
           <i class="${fav} fa-heart" id="heartIcon"  onclick="toggleLike('${currentUser.username}', '${story.storyId}', '${currentUser.loginToken}')"></i>
        </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
  } else {
    return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
  }
  
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");

  $favoriteStoriesList.empty();

  
  if(currentUser.favorites.length > 0) {
    
    let favStoriesArr = []
    for(let fav of currentUser.favorites) {
      favStoriesArr.push(fav.storyId)
    }
    
    $('li').each(function() {
      let id = $(this).attr('id')

      if(favStoriesArr.includes(id)) {
        $favoriteStoriesList.append($(this))
        console.log("HERE")
      }

    })
    
  } else {
    $favoriteStoriesList.append('<h4> No favorites added! </h4>')
  }
  $favoriteStoriesList.show()
}

function putMyStoriesOnPage() {
  console.debug("putMyStoriesOnPage");

  $myStoriesList.empty();

  if(currentUser.ownStories.length > 0) {
    $('li').each(function() {

      let name = $(this).children().eq(4).html()
      let id = $(this).attr('id')
      let trashcan = $(this)

      trashcan.prepend('<span class="trashcan"><i class="fas fa-trash-alt"></i></span>')
      trashcan.children().eq(0).on('click', function(){
        deleteStory(id, currentUser.loginToken)
      })
      
      if(name == `posted by ${currentUser.username}`) {
        $myStoriesList.append($(this))
      }

    })
  } else {
    $myStoriesList.append('<h4> No stories added! </h4>')
  }

  // loop through all of our stories and generate HTML for them
  $myStoriesList.show();
}


function submitStoryForm(evt) {
  console.debug("submitStoryForm", evt)
  let author = $('#author-story').val()
  let title = $('#title-story').val()
  let url = $('#url-story').val()

  StoryList.addStory(currentUser, {title, author, url})
  
}

$storyForm.on("submit", submitStoryForm)
