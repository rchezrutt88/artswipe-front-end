# ArtSwipe

## What It Is

ArtSwipe is a web app that, in a playful twist on dating apps like Tinder, allows users with a mere click to either "like" or "dislike" masterpieces of portraiture from the Western canon. A user's vote on a portrait is then saved and reflected in the status of the like and dislike buttons. A user may subsequently change or delete their vote.

## How It Works

ArtSwipe is a simple app.

ArtSwipe's [back-end](https://github.com/rchezrutt88/artswipe-back-end) is hosted on heroku.

When the user clicks "Get Image", the server selects a random art entry from the database. The entry is returned to the front-end, which posts the image by the associated url pointing to the image on [Web Gallery of Art](http://www.wga.hu/).

When a user clicks the "like" or "dislike" button, the app determines whether to make a post, patch, or delete request to the server. If a user likes or dislikes an image that they have not yet voted on, a POST request is made to the server and a vote is created. If a user has already voted on an image but changes their vote, a PATCH request is made to the server. Finally, if the user has already liked or disliked an image and then clicks the same button, the button is untoggled and a DELETE request is made to the server to remove the vote.

## The Approach Taken

 I first created a front-end that was capable of parsing urls from the Web Gallery of Art dataset and displaying the image associated with an art entry. I next wrote a back-end consisting of users, art, and votes. To associate these models, I used the [ThumbsUp](https://github.com/bouchard/thumbs_up) gem, which permitted me to declare that art model "acts_as_voteable" and user model "acts_as_voter".

## Unsolved Problems

 - [ ] Include simple bootstrap status bar to display likes/dislike ratio of portraits. (Very achievable!)
 - [ ] Integrating the [FACE++ facial recognition API](http://www.faceplusplus.com/), allowing users to filter portraits by gender and permiting the cropping of images to just the face.
 - [ ] Some kind of date parsing that would interpret the irregularly formatted dates in the WGA dataset and permit users to filter images by age (Mona Lisa, Age: 499).
 - [ ] Integrating some kind of geo API that would parse the current location of the art and allow the user to filter by their distance from the museum (Mona Lisa, Distance: 3435 miles).
 - [ ] Make more mobile friendly, including true swiping functionality on touch screens.
 - [ ] Revamp navbar: `LOGO - - - - - - - - "email" login logout`.
 - [ ] Change like/dislike buttons to thumbs up/thumbs down.
 - [ ] Implement change password...
 - [ ] calls to google geocoder and face++ on backend

## An Extremely Detailed and Professional Wireframe of my Front-End

![A Professional Wireframe](https://github.com/rchezrutt88/artswipe-front-end/raw/master/FineArtTinder.png)
