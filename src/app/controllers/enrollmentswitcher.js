angular.module('cca-client').controller('EnrollmentSwitcherCtrl', function($scope, $state, Messages, localStorageService, $timeout){
	$scope.activeEnrollmentYear = null;

	$scope.switch = function() {
		$scope.schoolyears = localStorageService.get("enrollmentyear");
		var schoolyears = [];
		_.forEach($scope.schoolyears, function(item, index){
			item.isActive = false;
			if (item.id == $scope.activeEnrollmentYear) {
				item.isActive = true;
			}
			schoolyears.push(item);
			$state.reload();
		});
		localStorageService.set('enrollmentyear',schoolyears);
	}

	$timeout(function() {
		$scope.schoolyears = localStorageService.get("enrollmentyear");
		$scope.activeEnrollmentYear = _.find($scope.schoolyears, function(o) { return o.isActive; });
		$scope.activeEnrollmentYear = $scope.activeEnrollmentYear.id;
	}, 3000);
});