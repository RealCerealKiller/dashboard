class ExtensionsCtrl {
  constructor($rootScope, $scope, Restangular, $state, $stateParams) {

    let extType = "SF|Extension";

    function decodeContent(contentString) {
      var jsonString = atob(contentString.slice(3, contentString.length));
      var content = JSON.parse(jsonString);
      return content;
    }

    $scope.getInitialExtensions = function() {
      $scope.extensions = $rootScope.items.filter(function(item){
        return item.content_type == extType;
      })
      $scope.decodeExtensions();
    }

    $scope.decodeExtensions = function() {
      for(var ext of $scope.extensions) {
        if(typeof ext.content === 'string' || ext.content instanceof String) {
          ext.content = decodeContent(ext.content);
        }
      }
    }

    $scope.getInitialExtensions();

    $scope.performBackupForExt = function(ext) {
      if(!confirm("Performing an initial backup can take several minutes, depending on the number of items you have. You do not have to stick around for this process to complete.")) {
        return;
      }

      ext.requestSent = true;

      var url = $scope.buildURL("items/backup");
      var request = Restangular.oneUrl(url, url);
      request.uuid = ext.uuid;
      request.post().then(function(response){
        ext.requestSent = false;
        ext.requestReceived = true;
        console.log("Perform backup success: ", response);
      })
      .catch(function(response){
        ext.requestSent = false;
        alert("There was an error performing this backup. Please try again. Error: " + response.plain());
        console.log("Perform backup error:", response);
      })
    }

    $scope.formData = {url: ""};
    $scope.addExtension = function() {
      var content = {
        url: $scope.formData.url
      };

      var encodedContent = "000" + btoa(JSON.stringify(content));
      var ext = {content_type: extType, content: encodedContent};

      var url = $scope.buildURL("items")
      var request = Restangular.oneUrl(url, url);
      request.item = ext;
      request.post().then(function(response){
        console.log("response:", response);
        $scope.extensions.push(response.plain().item);
        $scope.decodeExtensions();
      })
      .catch(function(response){
        console.log("error adding ext:", response);
      })
    }

  }
}

angular.module('app').controller('ExtensionsCtrl', ExtensionsCtrl);
