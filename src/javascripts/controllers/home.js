class HomeCtrl {
  constructor($rootScope, $scope, Restangular, $state, $stateParams, $location) {

    $scope.formData = {};

    if($stateParams.server) {
      $scope.formData.server = $stateParams.server;
    } else {
      $scope.formData.server = "https://n3.standardnotes.org";
    }

    var hashParams = parametersFromURL($location.hash());
    if(hashParams.server) {
      $scope.formData.email = hashParams.id;
      $scope.formData.password = hashParams.pw;
      $scope.formData.server = hashParams.server;
    } else {
      $scope.formData.email = $stateParams.id;
      $scope.formData.password = $stateParams.pw;
    }

    $scope.submitLogin = function() {
      var url = $scope.formData.server + "/auth/sign_in";
      var request = Restangular.oneUrl(url, url);
      request.email = $scope.formData.email;
      request.password = $scope.formData.password;
      request.post().then(function(response) {
        console.log("Success:", response);
        sessionStorage.setItem("jwt", response.token);
        sessionStorage.setItem("server", $scope.formData.server);
        sessionStorage.setItem("user", JSON.stringify(response.user));
        $rootScope.signedIn = true;
      })
      .catch(function(response){
        console.log("error:", response);
        $scope.formData.error = response.data.error;
      })
    }

  }
}

function parametersFromURL(url) {
  url = url.split("#").slice(-1)[0];
  var obj = {};
  url.replace(/([^=&]+)=([^&]*)/g, function(m, key, value) {
    obj[decodeURIComponent(key)] = decodeURIComponent(value);
  });
  return obj;
}

angular.module('app').controller('HomeCtrl', HomeCtrl);
