'use strict';

angular.module('app', [
  'ui.router',
  'restangular'
])

.config(function (RestangularProvider) {
  RestangularProvider.setDefaultHeaders({"Content-Type": "application/json"});
  RestangularProvider.setFullRequestInterceptor(function(element, operation, route, url, headers, params, httpConfig) {
    var token = sessionStorage.getItem("jwt");
    if(token) {
      headers = _.extend(headers, {Authorization: "Bearer " + token});
    }

    return {
      element: element,
      params: params,
      headers: headers,
      httpConfig: httpConfig
    };
  });
})
;class BaseCtrl {
  constructor($rootScope, $state) {

    $rootScope.user = JSON.parse(sessionStorage.getItem("user"));

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
;class DashboardCtrl {
  constructor($rootScope, $scope, Restangular, $stateParams, $timeout) {

    $scope.deleteData = {};

    $scope.sync = function() {
      var url = $rootScope.buildURL("items/sync");
      Restangular.oneUrl(url, url).post().then(function(response){
        $scope.setItems(response.retrieved_items);
        $scope.syncToken = response.sync_token;
      })
      .catch(function(response){
        console.log("Error: ", response);
      })
    }

    $scope.sync();

    $scope.selectAll = function() {
      for(var item of $scope.subItems) {
        item.checked = !item.checked;
      }
    }

    $scope.deselect = function(items) {
      for(var item of items) {
        item.checked = false;
      }
    }

    $scope.pageSize = 200;

    $scope.setItems = function(items) {
      $rootScope.items = items;
      $scope.currentItemsIndex = 0;
      $scope.paginate();
    }

    $scope.paginate = function() {
      $scope.subItems = $rootScope.items.slice($scope.currentItemsIndex, $scope.currentItemsIndex + $scope.pageSize);
    }

    $scope.paginatePrev = function() {
      $scope.currentItemsIndex -= $scope.pageSize;
      if($scope.currentItemsIndex < 0) {
        $scope.currentItemsIndex = 0;
      }
      $scope.paginate();
    }

    $scope.paginateNext = function() {
      if($scope.currentItemsIndex + $scope.pageSize >= $rootScope.items.length) {
        $scope.currentItemsIndex = $rootScope.items.length - $scope.pageSize;
      } else {
        $scope.currentItemsIndex += $scope.pageSize;
      }
      $scope.paginate();
    }

    $scope.deleteSelectedWithSync = function() {
      let selected = $scope.subItems.filter(function(item){return item.checked});

      if(!confirm(`Are you sure you want to delete and sync ${selected.length} items?`)) {
        return;
      }

      for(var item of selected) {
        item.deleted = true;
      }

      var url = $rootScope.buildURL("items/sync");
      var request = Restangular.oneUrl(url, url);
      request.items = selected;
      request.sync_token = $scope.syncToken;
      console.log("request items", request.items);
      request.post().then(function(response){
        $scope.deselect(selected);
        $scope.deleteData.showDelete = false;
        var savedItems = response.saved_items;
        for(var savedItem of savedItems) {
          var localItem = _.find($rootScope.items, {uuid: savedItem.uuid});
          _.merge(localItem, savedItem);
        }
      })
      .catch(function(response){
        console.log("Error syncing:", response);
      })
    }

    $scope.destroySelected = function() {
      let selected = $scope.subItems.filter(function(item){return item.checked});
      if(!confirm(`Are you sure you want to delete and destroy ${selected.length} items?`)) {
        return;
      }

      $scope.destroyItems(selected)
    }

    $scope.destroyAll = function() {
      if(!confirm(`Danger: you are about to permanently delete all your items. Are you sure you want to delete and destroy ${$rootScope.items.length} items?`)) {
        return;
      }

      $scope.destroyItems($rootScope.items)
    }

    $scope.destroyItems = function(items) {
      var url = $rootScope.buildURL("items");
      var request = Restangular.oneUrl(url, url);
      request.uuids = items.map(function(item){return item.uuid});
      request.remove().then(function(response){
        $scope.deselect(items);
        $scope.deleteData.showDelete = false;
        $rootScope.items = _.difference($rootScope.items, items);
        $scope.subItems = _.difference($scope.subItems, items);
      })
      .catch(function(response){
        console.log("destroy error:", response);
      })
    }

  }
}

angular.module('app').controller('DashboardCtrl', DashboardCtrl);
;class ExtensionsCtrl {
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
      let extUrl = $scope.formData.url;

      if(extUrl.indexOf("type=sn") != -1) {
        alert("You are attempting to register a Standard Notes extension in Standard File. You should register this URL using the Standard Notes app instead.");
        return;
      }

      var content = {
        url: extUrl
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
;class HomeCtrl {
  constructor($rootScope, $scope, Restangular, $state, $stateParams) {

    $scope.formData = {};

    if($stateParams.server) {
      $scope.formData.server = $stateParams.server;
    } else {
      $scope.formData.server = "https://n3.standardnotes.org";
    }

    $scope.formData.email = $stateParams.id;
    $scope.formData.password = $stateParams.pw;

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

angular.module('app').controller('HomeCtrl', HomeCtrl);
;angular.module('app')
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $stateProvider
      .state('base', {
        abstract: true,
      })

      .state('home', {
        url: '/?server&id&pw',
        parent: 'base',
        views: {
          'content@' : {
            templateUrl: 'templates/home.html',
            controller: 'HomeCtrl'
          }
        }
      })

      // 404 Error
      .state('404', {
        parent: 'base',
        views: {
          'content@' : {
            templateUrl: 'errors/404.html'
          }
        }
      });

      // Default fall back route
      $urlRouterProvider.otherwise(function($injector, $location){
         var state = $injector.get('$state');
         state.go('404');
         return $location.path();
      });

      // enable HTML5 Mode for SEO
      $locationProvider.html5Mode(true);

  });
