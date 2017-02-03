class BaseCtrl {
  constructor($rootScope, $state) {

    $rootScope.getServer = function() {
      return sessionStorage.getItem("server");
    }

    $rootScope.buildURL = function(path) {
      return $rootScope.getServer() + "/" + path;
    }

    $rootScope.signedIn = sessionStorage.getItem("jwt");

    $rootScope.signout = function() {
      sessionStorage.clear();
      $rootScope.signedIn = false;
      window.location.reload();
    }
  }
}

angular.module('app').controller('BaseCtrl', BaseCtrl);
