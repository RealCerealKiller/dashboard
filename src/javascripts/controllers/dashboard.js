class DashboardCtrl {
  constructor($rootScope, $scope, Restangular, $stateParams) {

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
        $scope.showDelete = false;
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
        console.log("destroy response", response);
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
