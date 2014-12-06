"use strict";
/*
    app.js, main Angular application script
    define your module and controllers here
*/

angular.module('ProductReviews', ['ui.bootstrap'])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'iEbFanZNfJ3E8MDp0sKFWMxNfnZQpv03Dl6SzOQa';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'DoXGShdLmqdDJd3G8AyJ5GcG3Zdf7jfciUio4jUN';
    })
    .controller('ReviewsController', function($scope, $http) {
        var reviewsUrl = 'https://api.parse.com/1/classes/reviewschallenge';

        // get all reviews
        $scope.refreshReviews = function () {
            $scope.loading = true;
            $scope.isEmpty = true;
            $http.get(reviewsUrl + '?order=-score')
                .success(function (responseData) {
                    $scope.reviews = responseData.results;
                    if (responseData.results.length > 0) {
                        $scope.isEmpty = false;
                    }
                })
                .error(function (err) {
                    console.log(err);
                })
                .finally(function () {
                    $scope.loading = false;
                });
        }; // refreshReviews()

        // get initial reviews on page load
        $scope.refreshReviews();

        // initialize a new review on the scope for new review form
        $scope.newReview = {
            rating: 0,
            name: '',
            title: '',
            body: '',
            score: 0
        };

        $scope.addReview = function (review) {
            $scope.inserting = true;
            $http.post(reviewsUrl, review)
                .success(function (responseData) {
                    review.objectId = responseData.objectId;

                    // add new review
                    $scope.reviews.push(review);

                    // reset newReview to clear form
                    $scope.newReview = {
                        rating: 0,
                        name: '',
                        title: '',
                        body: '',
                        score: 0
                    }
                })
                .error(function (err) {
                    console.log(err);
                })
                .finally(function () {
                    $scope.inserting = false;
                    // update list with new review
                    $scope.refreshReviews();
                });
        }; // addReview()

        $scope.updateReview = function (review) {
            $scope.updating = true;
            $http.put(reviewsUrl + '/' + review.objectId, review)
                .success(function (responseData) {

                })
                .error(function (err) {
                    console.log(err);
                })
                .finally(function () {
                    $scope.updating = false;
                });
        }; // updateReview()

        $scope.incrementVotes = function (review, amount) {
            $scope.updating = true;
            if (review.score + amount >= 0) {
                $http.put(reviewsUrl + '/' + review.objectId, {
                    votes: {
                        __op: 'Increment',
                        amount: amount
                    }
                })
                    .success(function (responseData) {
                        console.log(responseData);
                        review.score = responseData.votes;
                    })
                    .error(function (err) {
                        console.log(err);
                    })
                    .finally(function () {
                        $scope.updating = false;
                    });
            }
        }; // incrementVotes()

        $scope.deleteReview = function(review) {
            $scope.updating = true;
            $http.delete(reviewsUrl + '/' + review.objectId)
                .success(function() {
                    $scope.refreshReviews();
                })
                .error(function(err) {
                    console.log(err);
                })
                .finally(function() {
                    $scope.updating = false;
                });
        };
    });