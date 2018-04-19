/**
 * Created by david on 6/14/16.
 */
'use strict';
angular.module('cca-client').controller('CurrentUserCtrl', function($scope, localStorageService, $timeout) {
    $scope.user = null;
    $timeout(function() {
    	$scope.user = localStorageService.get('currentuser');
    	if ($scope.user != null) {
	        $scope.user.hasProfilePicture = false;
	        if ($scope.user.profilePictureThumb != null && $scope.user.profilePictureThumb != undefined) {
	            $scope.user.hasProfilePicture = true;
	            $scope.profilePicture = $scope.user.profilePictureThumb;
	        }
	    }
    }, 1000);
});
