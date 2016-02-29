'use strict';

// user require with a reference to bundle the file and use it in this file
// var example = require('./example');

// use require without a reference to ensure a file is bundled
require('./example');

let artData;

let getImageUrl = function (userID) {
  $.ajax()
}

let postImage = function (rawUrl) {
  let imageUrl = parseImageUrl(rawUrl);
  $(".image-container").append("<img src=" + imageUrl + " class='img-rounded' alt='http://www.wga.hu/' width='50%' height='50%'>")
}

let parseImageUrl = function (rawUrl) {
  let lessRaw = rawUrl.replace('/html/', '/art/').replace('.html', '.jpg')
  return lessRaw
}


$("#getImage").on('click', function() {
  postImage("http://www.wga.hu/html/h/hitchcoc/thebride.html")
});
