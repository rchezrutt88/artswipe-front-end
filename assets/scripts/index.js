'use strict';

// user require with a reference to bundle the file and use it in this file
// var example = require('./example');

// use require without a reference to ensure a file is bundled
require('./example');

//TODO remember to change this when deployed...
let baseUrl ='http://localhost:3000'

let artData;
let userData;

let parseImageUrl = function (rawUrl) {
  let lessRaw = rawUrl.replace('/html/', '/art/').replace('.html', '.jpg')
  return lessRaw
}

let postImage = function (rawUrl) {
  let imageUrl = parseImageUrl(rawUrl);
  $(".image-container").append("<img src=" + imageUrl + " class='img-rounded' alt='http://www.wga.hu/' width='20%' height='20%'>")
}

let clearImage = function() {
  $(".image-container").empty();
};

let getRandomImage = function () {

  $.ajax({
    type: "GET",
    url: baseUrl + "/arts/random"
  }).done(function(responseData) {
    console.log(responseData)
    artData = responseData.art
    clearImage()
    postImage(responseData.art.url)
  }).fail(function(jqxhr) {
    console.error(jqxhr)
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
  }).fail(function(jqxhr) {
    console.error(jqxhr);
  });
};

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

    //display user email in navbar
    $("#leftBar").append("<li><p class='navbar-text'>Signed in as " + userEmail + "</p></li>");

    //hide modal
    $("#signinModal").modal("hide");


  }).fail(function(jQXHR) {
    console.log(jQXHR);
  });
};


let signOut = function() {
  //REQUIRES A TOKEN HEADER
  // if (!userData) {
  //   throw "no user signed in"
  // }
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
  }).fail(function(jQXHR) {
    console.log(jQXHR);
  });
};




/*######################### EXECUTING CODE ###################################*/

$(function() {

$("#getImage").on('click', function() {
  getRandomImage();
});

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

});
