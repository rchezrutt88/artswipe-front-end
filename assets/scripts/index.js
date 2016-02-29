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





/*######################### EXECUTING CODE ###################################*/

$(function() {

$("#getImage").on('click', function() {
  getRandomImage();
});

$("#signupForm").on('submit', function(event) {
  event.preventDefault();
  let formData = new FormData(event.target);
  signUp(formData);
  //let formData = new FormData(event.)
});


});
