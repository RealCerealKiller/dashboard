(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

angular.module('app', ['ui.router', 'restangular']).config(function (RestangularProvider) {
  RestangularProvider.setDefaultHeaders({ "Content-Type": "application/json" });
  RestangularProvider.setFullRequestInterceptor(function (element, operation, route, url, headers, params, httpConfig) {
    var token = sessionStorage.getItem("jwt");
    if (token) {
      headers = _.extend(headers, { Authorization: "Bearer " + token });
    }

    return {
      element: element,
      params: params,
      headers: headers,
      httpConfig: httpConfig
    };
  });
});
var BaseCtrl = function BaseCtrl($rootScope, $state) {
  _classCallCheck(this, BaseCtrl);

  $rootScope.getServer = function () {
    return sessionStorage.getItem("server");
  };

  $rootScope.buildURL = function (path) {
    return $rootScope.getServer() + "/" + path;
  };

  $rootScope.signedIn = sessionStorage.getItem("jwt");

  $rootScope.signout = function () {
    sessionStorage.clear();
    $rootScope.signedIn = false;
    window.location.reload();
  };
};

angular.module('app').controller('BaseCtrl', BaseCtrl);
;
var DashboardCtrl = function DashboardCtrl($rootScope, $scope, Restangular, $stateParams) {
  _classCallCheck(this, DashboardCtrl);

  $scope.user = JSON.parse(sessionStorage.getItem("user"));

  $scope.sync = function () {
    var url = $rootScope.buildURL("items/sync");
    Restangular.oneUrl(url, url).post().then(function (response) {
      $scope.setItems(response.retrieved_items);
      $scope.syncToken = response.sync_token;
    }).catch(function (response) {
      console.log("Error: ", response);
    });
  };

  $scope.sync();

  $scope.selectAll = function () {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = $scope.subItems[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;

        item.checked = !item.checked;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  };

  $scope.deselect = function (items) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = items[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var item = _step2.value;

        item.checked = false;
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  };

  $scope.pageSize = 200;

  $scope.setItems = function (items) {
    $scope.items = items;
    $scope.currentItemsIndex = 0;
    $scope.paginate();
  };

  $scope.paginate = function () {
    $scope.subItems = $scope.items.slice($scope.currentItemsIndex, $scope.currentItemsIndex + $scope.pageSize);
  };

  $scope.paginatePrev = function () {
    $scope.currentItemsIndex -= $scope.pageSize;
    if ($scope.currentItemsIndex < 0) {
      $scope.currentItemsIndex = 0;
    }
    $scope.paginate();
  };

  $scope.paginateNext = function () {
    if ($scope.currentItemsIndex + $scope.pageSize >= $scope.items.length) {
      $scope.currentItemsIndex = $scope.items.length - $scope.pageSize;
    } else {
      $scope.currentItemsIndex += $scope.pageSize;
    }
    $scope.paginate();
  };

  $scope.deleteSelectedWithSync = function () {
    var selected = $scope.subItems.filter(function (item) {
      return item.checked;
    });

    if (!confirm('Are you sure you want to delete and sync ' + selected.length + ' items?')) {
      return;
    }

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = selected[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var item = _step3.value;

        item.deleted = true;
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    var url = $rootScope.buildURL("items/sync");
    var request = Restangular.oneUrl(url, url);
    request.items = selected;
    request.sync_token = $scope.syncToken;
    console.log("request items", request.items);
    request.post().then(function (response) {
      $scope.deselect(selected);
      $scope.showDelete = false;
      var savedItems = response.saved_items;
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = savedItems[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var savedItem = _step4.value;

          var localItem = _.find($scope.items, { uuid: savedItem.uuid });
          _.merge(localItem, savedItem);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }).catch(function (response) {
      console.log("Error syncing:", response);
    });
  };

  $scope.destroySelected = function () {
    var selected = $scope.subItems.filter(function (item) {
      return item.checked;
    });
    if (!confirm('Are you sure you want to delete and destroy ' + selected.length + ' items?')) {
      return;
    }

    $scope.destroyItems(selected);
  };

  $scope.destroyAll = function () {
    if (!confirm('Danger: you are about to permanently delete all your items. Are you sure you want to delete and destroy ' + $scope.items.length + ' items?')) {
      return;
    }

    $scope.destroyItems($scope.items);
  };

  $scope.destroyItems = function (items) {
    var url = $rootScope.buildURL("items");
    var request = Restangular.oneUrl(url, url);
    request.uuids = items.map(function (item) {
      return item.uuid;
    });
    request.remove().then(function (response) {
      $scope.deselect(items);
      console.log("destroy response", response);
      $scope.items = _.difference($scope.items, items);
      $scope.subItems = _.difference($scope.subItems, items);
    }).catch(function (response) {
      console.log("destroy error:", response);
    });
  };
};

angular.module('app').controller('DashboardCtrl', DashboardCtrl);
;
var HomeCtrl = function HomeCtrl($rootScope, $scope, Restangular, $state, $stateParams) {
  _classCallCheck(this, HomeCtrl);

  $scope.formData = {};

  if ($stateParams.server) {
    $scope.formData.server = $stateParams.server;
  } else {
    $scope.formData.server = "https://n3.standardnotes.org";
  }

  $scope.formData.email = $stateParams.id;
  $scope.formData.password = $stateParams.pw;

  $scope.submitLogin = function () {
    var url = $scope.formData.server + "/auth/sign_in";
    var request = Restangular.oneUrl(url, url);
    request.email = $scope.formData.email;
    request.password = $scope.formData.password;
    request.post().then(function (response) {
      console.log("Success:", response);
      sessionStorage.setItem("jwt", response.token);
      sessionStorage.setItem("server", $scope.formData.server);
      sessionStorage.setItem("user", JSON.stringify(response.user));
      $rootScope.signedIn = true;
    }).catch(function (response) {
      console.log("error:", response);
      $scope.formData.error = response.data.error;
    });
  };
};

angular.module('app').controller('HomeCtrl', HomeCtrl);
;angular.module('app').config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

  $stateProvider.state('base', {
    abstract: true
  }).state('home', {
    url: '/?server&id&pw',
    parent: 'base',
    views: {
      'content@': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  // 404 Error
  .state('404', {
    parent: 'base',
    views: {
      'content@': {
        templateUrl: 'errors/404.html'
      }
    }
  });

  // Default fall back route
  $urlRouterProvider.otherwise(function ($injector, $location) {
    var state = $injector.get('$state');
    state.go('404');
    return $location.path();
  });

  // enable HTML5 Mode for SEO
  $locationProvider.html5Mode(true);
});


},{}]},{},[1]);
