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
