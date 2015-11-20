(function() {

  angular.module('general.service', []).factory('general', ['appConfig', '$http', '$q', '$timeout', general]);

  function general(appConfig, $http, $q, $timeout) {
    var factory = {
          getAcceptedPhotos : getAcceptedPhotos,
          getApprovedPhotos : getApprovedPhotos,
          getRejectedPhotos : getRejectedPhotos,
          approvePhoto      : approvePhoto,
          rejectPhoto       : rejectPhoto,
          acceptPhoto       : acceptPhoto,
          removePhoto       : removePhoto,
          setPhotoToApprovalStatus : setPhotoToApprovalStatus,
          getLocations : getLocations
        };

    return factory;

    function getAcceptedPhotos(lastId, locations) {
      var deferred = $q.defer(),
          url = appConfig.url+"/api/accepts/photos/100/"+lastId+"/"+JSON.stringify(locations);
      $http({
        method: 'POST',
        url: url
      }).success(function(data) {
        deferred.resolve(data);
      }).error(function() {
        deferred.reject('There was an error');
      });

      return deferred.promise;
    }

    function getApprovedPhotos(lastId, locations) {
      console.log(JSON.stringify(locations));
      var deferred = $q.defer(),
          url = appConfig.url+"/api/accepts/approvedphotos/100/"+lastId+"/"+JSON.stringify(locations);
      $http({
        method: 'POST',
        url: url
      }).success(function(data) {
        deferred.resolve(data);
      }).error(function() {
        deferred.reject('There was an error');
      });

      return deferred.promise;
    }

    function getRejectedPhotos(lastId) {
      var deferred = $q.defer(),
          url = appConfig.url+"/api/rejects/photos/100/"+lastId;
      $http({
        method: 'POST',
        url: url
      }).success(function(data) {
        deferred.resolve(data);
      }).error(function() {
        deferred.reject('There was an error');
      });

      return deferred.promise;
    }

    function approvePhoto(id) {
      var deferred = $q.defer(),
          url = appConfig.url+"/api/accepts/store/"+id;
      $http({
        method: 'POST',
        url: url,
      }).success(function(data) {
        deferred.resolve(data);
      }).error(function() {
        deferred.reject('There was an error');
      });

      return deferred.promise;
    }

    function rejectPhoto(id) {
      console.log(id);
      var deferred = $q.defer(),
          url = appConfig.url+"/api/accepts/transfer/"+id;
      $http({
        method: 'POST',
        url: url,
      }).success(function(data) {
        deferred.resolve(data);
      }).error(function() {
        deferred.reject('There was an error');
      });

      return deferred.promise;
    }

    function acceptPhoto(id) {
      var deferred = $q.defer(),
          url = appConfig.url+"/api/rejects/transfer/"+id;
      $http({
        method: 'POST',
        url: url,
      }).success(function(data) {
        deferred.resolve(data);
      }).error(function() {
        deferred.reject('There was an error');
      });

      return deferred.promise;
    }

    function removePhoto(id) {
      var deferred = $q.defer(),
          url = appConfig.url+"/api/rejects/"+id;
      $http({
        method: 'DELETE',
        url: url,
      }).success(function(data) {
        deferred.resolve(data);
      }).error(function() {
        deferred.reject('There was an error');
      });

      return deferred.promise;
    }

    function setPhotoToApprovalStatus(table, id) {
      var deferred = $q.defer(),
          url = appConfig.url+"/api/"+table+"/approve/"+id;

      $http({
        method: 'POST',
        url: url,
      }).success(function(data) {
        deferred.resolve(data);
      }).error(function() {
        deferred.reject('There was an error');
      });

      return deferred.promise;
    }

    function getLocations() {
      var deferred = $q.defer(),
          url = appConfig.url+"/api/accepts/locations";

      $http({
        method: 'GET',
        url: url,
      }).success(function(data) {
        deferred.resolve(data);
      }).error(function() {
        deferred.reject('There was an error');
      });

      return deferred.promise;
    }
  }
})();
