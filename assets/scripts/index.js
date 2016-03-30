'use strict';

// user require with a reference to bundle the file and use it in this file
// var example = require('./example');

// use require without a reference to ensure a file is bundled
let map = require('./map.js');

//TODO remember to change this when deployed...
let baseUrl = 'http://localhost:3000';

let artData;
let userData;
let userVote;

let parseImageUrl = function(rawUrl) {
  let lessRaw = rawUrl.replace('/html/', '/art/').replace('.html', '.jpg');
  return lessRaw;
};

let postImage = function(rawUrl) {
  let imageUrl = parseImageUrl(rawUrl);
  $(".image-container").append("<img src=" + imageUrl + " class='img-rounded' id='art' alt='http://www.wga.hu/' width='30%' height='100%'>");
};

let clearImage = function() {
  $(".image-container").empty();
};

let setHeader = function() {
$("#title").text(artData.title);
};

//helper method for updating buttons on sign in...
//only works if user signed in and art exists
let setUserVote = function () {

  if(!userData || !artData) {
    throw 'user or art not set';
  }

  let userID = userData.id;
  let votes = artData.votes;


  for (let i = 0; i < votes.length; i++) {

    if(userID === votes[i].voter_id) {
      userVote = votes[i];
    }
  }
};

let setButtonStates = function() {


  if (!userVote) {
    $("#likeButton").removeClass("btn-success").addClass("btn-success-outline");
    $("#dislikeButton").removeClass("btn-danger").addClass("btn-danger-outline");
  }

  else {

    switch(userVote.vote) {

      case true:
        $("#likeButton").removeClass("btn-success-outline").addClass("btn-success");
        $("#dislikeButton").removeClass("btn-danger").addClass("btn-danger-outline");
        break;

      case false:
        $("#likeButton").removeClass("btn-success").addClass("btn-success-outline");
        $("#dislikeButton").removeClass("btn-danger-outline").addClass("btn-danger");
        break;
    }
  }

};

let getRandomImage = function() {

  //two methods: one for signed in, one for not:
  //TODO refactor into two functions?

  if (userData) {
    return $.ajax({
      headers: {
        Authorization: 'Token token=' + userData.token,
      },
      type: "GET",
      url: baseUrl + "/arts/random"
    }).done(function(responseData) {
      console.log(responseData);
      artData = responseData.art;
      userVote = responseData.art.my_vote;

      clearImage();
      postImage(responseData.art.url);

      setButtonStates();
      setHeader();

    }).fail(function(jqxhr) {
      console.error(jqxhr);
    });
  } else {
    return $.ajax({
      type: "GET",
      url: baseUrl + "/arts/random"
    }).done(function(responseData) {
      console.log(responseData);

      artData = responseData.art;

      clearImage();
      postImage(responseData.art.url);

      setHeader();

    }).fail(function(jqxhr) {
      console.error(jqxhr);
    });
  }

};





/*TODO
add method for retrieving art by id! Get method! YAY?

Should this reference the global artData varable or take an art id
as an argument?
*/
// let getVotesOnArt = function() {
//
//   $.ajax({
//     headers: {
//       Authorization: 'Token token=' + userData.token,
//     },
//     type: "GET",
//     url: baseUrl + '/arts/' + artData.id + '/votes'
//   }).done(function(responseData) {
//     console.log(responseData)
//   }).fail(function(jqxhr) {
//     console.error(jqxhr)
//   })
// };
let signIn = function(formData) {

  //TODO handle cases where user already signed in

  if (userData) {
    throw 'user already signed in';
  }

  $.ajax({
    type: "POST",
    url: baseUrl + '/sign-in',
    contentType: false,
    processData: false,
    data: formData,
  }).done(function(responseData) {
    console.log(responseData);

    userData = responseData.user;
    let userEmail = responseData.user.email;

    try{
      setUserVote();
    }
    catch (e) {
      console.error(e);
    }

    setButtonStates();

    //display user email in navbar
    $("#leftBar").append("<li><p class='navbar-text'>Signed in as " + userEmail + "</p></li>");

    //hide modal
    $("#signinModal").modal("hide");



  }).fail(function(jQXHR) {
    console.log(jQXHR);
  });
};


let signUp = function(formData) {
  $.ajax({
    type: "POST",
    url: baseUrl + "/sign-up",
    contentType: false,
    processData: false,
    data: formData,
  }).done(function(responseData) {
    console.log(responseData);

    //automatically logs you in...
    // formData.delete('credentials[password_confirmation]');
    signIn(formData);

    //hide modal
    $("#signupModal").modal("hide");

  }).fail(function(jqxhr) {
    console.error(jqxhr);
  });
};


let signOut = function() {

  console.log(userData.token);
  $.ajax({
    headers: {
      Authorization: 'Token token=' + userData.token,
    },
    type: "DELETE",
    url: baseUrl + "/sign-out/" + userData.id,

  }).done(function(responseData) {
    console.log(responseData);
    //remove user details from nav bar
    $("#leftBar").empty();
    //clear userData
    userData = undefined;
    userVote = undefined;
    setButtonStates();

  }).fail(function(jQXHR) {
    console.log(jQXHR);
  });
};

//TODO throw error for no art

//TODO THIS
//TODO change to query string instead of data?
let patchVote = function(bool) {
  if(!userData) {
    throw 'no user signed in';
  }
  $.ajax({
    headers: {
      Authorization: 'Token token=' + userData.token,
    },
    type: "PATCH",
    url: baseUrl + '/arts/' + artData.id + '/toggle-vote',
    data: {
      patchVote: bool.toString()
    }
  }).done(function(responseData) {
    console.log(responseData);
    userVote = responseData.vote;
    setButtonStates();
  }).fail(function(jQXHR) {
    console.error(jQXHR);
  });

};

let deleteVote = function() {
  if(!userData) {
    throw 'no user signed in';
  }

  $.ajax({
    headers: {
      Authorization: 'Token token=' + userData.token,
    },
    type: "DELETE",
    url: baseUrl + '/arts/' + artData.id + '/clear-vote',
  }).done(function(responseData) {
    console.log(responseData);
    userVote = undefined;
    setButtonStates();
  }).fail(function(jQXHR) {
    console.error(jQXHR);
  });

};


//TODO Refactor likeArt() and dislikeArt() into one method
let postUpVote = function() {
  if (!userData) {
    throw 'no user signed in';
  }

  $.ajax({
    headers: {
      Authorization: 'Token token=' + userData.token,
    },
    type: "POST",
    url: baseUrl + '/arts/' + artData.id + '/up-vote',
  }).done(function(responseData) {
    console.log(responseData);
    userVote = responseData.vote;
    setButtonStates();
  }).fail(function(jQXHR) {
    console.error(jQXHR);
  });
};

let postDownVote = function() {
  if (!userData) {
    throw 'no user signed in';
  }
  $.ajax({
    headers: {
      Authorization: 'Token token=' + userData.token,
    },
    type: "POST",
    url: baseUrl + '/arts/' + artData.id + '/down-vote'
  }).done(function(responseData) {
    userVote = responseData.vote;
    setButtonStates();
    console.log(responseData);
  }).fail(function(jQXHR) {
    console.error(jQXHR);
  });
};

let onLike = function() {

  if(!userData) {
    throw 'No user signed in';
  }
  if(!artData) {
    throw 'No art displayed';
  }

  if(!userVote) {
    postUpVote();
  }

  else if(userVote.vote) {
    deleteVote();
  }

  else if(!userVote.vote) {
    patchVote(true);
  }
};

let onDislike = function() {

  if(!userData) {
    throw 'No user signed in';
  }
  if (!artData) {
    throw 'No art displayed';
  }

  if(!userVote) {
    postDownVote();
  }

  else if(userVote.vote) {
    patchVote(false);
  }

  else if(!userVote.vote) {
    deleteVote();
  }
};


/*######################### EXECUTING CODE ###################################*/

$(function() {

  map.initializeMap();


  $("#getImage").on('click', function() {
    getRandomImage().then(responseData => map.codeAddress(responseData.art.location));
  });

  // //to retrieve votes on imageUrl
  // $("#votesButton").on('click', getVotesOnArt);

  //for sign-up
  $("#signupForm").on('submit', function(event) {
    event.preventDefault();
    let formData = new FormData(event.target);
    signUp(formData);
    //let formData = new FormData(event.)
  });

  //For sign-in
  $("#signinForm").on('submit', function(event) {
    event.preventDefault();
    let formData = new FormData(event.target);
    signIn(formData);

  });

  //for sign-out
  $("#signoutbtn").on('click', function() {
    if (!userData) {
      throw "no user signed in";
    }
    signOut();
  });

  //on "like"
  $("#likeButton").on('click', onLike);
  //"on dislike"
  $("#dislikeButton").on('click', onDislike);

});
