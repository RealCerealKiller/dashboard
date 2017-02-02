class BaseCtrl {
  constructor($rootScope, $state) {

    $rootScope.getServer = function() {
      return sessionStorage.getItem("server");
    }

    $rootScope.buildURL = function(path) {
      return $rootScope.getServer() + "/" + path;
    }

    $rootScope.signout = function() {
      sessionStorage.clear();
      $state.go("home");
      window.location.reload();
    }
  }
}

angular.module('app').controller('BaseCtrl', BaseCtrl);
