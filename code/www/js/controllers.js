angular.module('songhop.controllers', ['ionic', 'songhop.services'])


/*
Controller for the discover page
*/
.controller('DiscoverCtrl', function($scope, $ionicLoading, $timeout, User, Recommendations) {

	var showLoading = function() {
		$ionicLoading.show({
			template: "<i class='ion-loading-c'></i>",
			noBackdrop: true
		})
	}

	var hideLoading = function() {
		$ionicLoading.hide();
	}

	showLoading();

	Recommendations.init()
    .then(function(){

      $scope.currentSong = Recommendations.queue[0];

      return Recommendations.playCurrentSong();

    })
    .then(function(){
      // turn loading off
      hideLoading();
      $scope.currentSong.loaded = true;
    });

    $scope.sendFeedback = function (bool) {

	    // set the current song to one of our three songs
	    var randomSong = Math.round(Math.random() * ($scope.songs.length - 1));

	    // update current song in scope
	    $scope.currentSong = angular.copy($scope.songs[randomSong]);

	}

	$scope.sendFeedback = function (bool) {

	    if (bool) User.addSongToFavorites($scope.currentSong);

	    // set variable for the correct animation sequence
	    $scope.currentSong.rated = bool;
	    $scope.currentSong.hide = true;

	    // set variable for the correct animation sequence
	    Recommendations.nextSong();

	     $timeout(function() {
	      $scope.currentSong = Recommendations.queue[0];
	      $scope.currentSong.loaded = false;
	    }, 250);

	    Recommendations.playCurrentSong().then(function() {
	      $scope.currentSong.loaded = true;
	    });
	  }


	  //catching next img with 1px-width/height and opacity of 0.1
	  $scope.nextAlbumImg = function(i) {
	    if (Recommendations.queue.length > 2) {
	      return Recommendations.queue[i].image_large;
	      $scope.currentSong.loaded = false;
	    }

	    return '';
	  }
})


/*
Controller for the favorites page
*/
.controller('FavoritesCtrl', function($scope, User, $window) {
	$scope.favorites = User.favorites;
	$scope.username = User.username;

	$scope.logout = function() {
	    User.destroySession();

	    // instead of using $state.go, we're going to redirect.
	    // reason: we need to ensure views aren't cached.
	    $window.location.href = 'index.html';
	  }

	$scope.removeSong = function(song, index) {
	    User.removeSongFromFavorites(song, index);
	}

	$scope.openSong = function(song) {
		$window.open(song.open_url, "_system");
	}
})


/*
Controller for our tab bar
*/
.controller('TabsCtrl', function($scope, Recommendations, User) {
	
	$scope.favCount = User.favoriteCount;

	$scope.enteringFavorites = function(){
		User.newFavorites = 0;
		Recommendations.haltAudio();
	}

	$scope.leavingFavorites = function() {
	    Recommendations.init();
	}

})

.controller('SplashCtrl', function($scope, User) {
	// attempt to signup/login via User.auth
  $scope.submitForm = function(username, signingUp) {
    User.auth(username, signingUp).then(function(){
      // session is now set, so lets redirect to discover page
      $state.go('tab.discover');

    }, function() {
      // error handling here
      alert('Hmm... try another username.');

    });
  }
});