(function() {

  angular.module('RejectedCtrl', []).controller('RejectedCtrl', ['$rootScope', '$scope', '$filter', '$location', '$state', '$modal', 'general', 'Flash', RejectedCtrl]);

  function RejectedCtrl($rootScope, $scope, $filter, $location, $state, $modal, general, Flash) {
    var init;
    var vm = this;

    vm.filteredRejects = [];
    vm.searchKeywords = "";
    vm.row = "";
    vm.numPerPageOpt = [3, 5, 10, 20, 100];
    vm.numPerPage = vm.numPerPageOpt[2];
    vm.currentPage = 1;
    vm.currentPageRejects = [];
    vm.newShow = {};
    vm.next = false;
    vm.rejects = [];
    vm.lastPhotoId = null;
    vm.pageTotal = 0;

    vm.locations = null;
    vm.newFilters = {};
    vm.filters = {
      approved : false,
      location : {
        country : "",
        stateRegion : "",
        city : ""
      }
    };

    vm.totalApproves = 0;

    vm.select = function(page) {
        var end, start;

        if (page > (vm.pageTotal-5)) {
            if (vm.filters.approved) {
              general.getApprovedPhotos(vm.lastPhotoId, vm.filters.location).then(vm.processPhotoData);
            } else {
              general.getRejectedPhotos(vm.lastPhotoId, vm.filters.location).then(vm.processPhotoData);
            }
        }
        return start = (page - 1) * vm.numPerPage, end = start + vm.numPerPage, vm.currentPageRejects = vm.filteredRejects.slice(start, end);
    };

    vm.search = function() {
        return vm.filteredRejects = $filter("filter")(vm.rejects, vm.searchKeywords), vm.onFilterChange();
    };

    vm.onFilterChange = function() {
        return vm.select(vm.currentPage), vm.currentPage = vm.currentPage, vm.row = "";
    };

    vm.onNumPerPageChange = function() {
        return vm.select(1), vm.currentPage = 1;
    };

    vm.onOrderChange = function() {
        return vm.select(1), vm.currentPage = 1;
    };

    vm.order = function(rowName) {
        return vm.row !== rowName ? (vm.row = rowName, vm.filteredRejects = $filter("orderBy")(vm.rejectss, rowName), vm.onOrderChange()) : void 0;
    };

    vm.acceptPhoto = function(id, idx) {
      if ($rootScope.currentUser.permission_type === 1) {
        general.acceptPhoto(id).then(function(data) {
          console.log(data);
          var message = data;
          Flash.create('success', message);
          // remove this photo from the vm.rejects array
          delete vm.rejects[idx];
          currentPage = vm.currentPage;

          //reset table
          vm.search();
          vm.currentPage = currentPage;
        });
      }

      else if ($rootScope.currentUser.permission_type === 2) {
        general.setPhotoToApprovalStatus("rejects", id).then(function(data) {
          console.log(data);
          var message = data.message;
          vm.totalApproves = data.total;
          Flash.create('success', message);
          // remove this photo from the vm.accepted array
          delete vm.accepts[idx];
          currentPage = vm.currentPage;

          //reset table
          vm.search();
          vm.currentPage = currentPage;
        });
      }

    };

    vm.filterTable = function() {
      console.log(vm.newFilters);
      var approved = Boolean(vm.newFilters.approved),
          location = (vm.newFilters.selectedLocation !== undefined) ? vm.newFilters.selectedLocation.originalObject : undefined;

      if (approved !== vm.filters.approved || location !== null) {
          vm.filters.approved = approved;
          vm.filters.location.country = (location != undefined) ? location.country : "";
          vm.filters.location.stateRegion = (location != undefined) ? location.stateRegion : "";
          vm.filters.location.city = (location != undefined) ? location.city : "";
          vm.lastPhotoId = null;
          vm.rejects = [];

          if (approved) {
            // query approved photos
            general.getApprovedPhotos(vm.lastPhotoId, vm.filters.location).then(vm.processPhotoData);
          } else if (!approved || approved == "undefined") {
            // query all photos
            general.getRejectedPhotos(vm.lastPhotoId, vm.filters.location).then(vm.processPhotoData);
          }
      }
    };

    vm.removePhoto = function(id, idx) {
      if ($rootScope.currentUser.permission_type === 1) {
          general.removePhoto(id).then(function(data) {
            console.log(data);
            var message = data;
            Flash.create('success', message);
            // remove this photo from the vm.rejects array
            delete vm.rejects[idx];
            currentPage = vm.currentPage;

            //reset table
            vm.currentPage = currentPage;
            vm.search();
          });
      }
    };

    vm.processPhotoData = function(data) {
      console.log(data);
      var photo_url = "";
      var rejects = data.rejectedPhotos;
      vm.totalApproves = data.totalApproves;

      for (var i=0; i<=rejects.length; i++) {
        if (rejects[i] !== undefined) {
          rejects[i].photo_data = JSON.parse(rejects[i].photo_data);
          photo_url = "https://farm" + rejects[i].photo_data.farm + ".staticflickr.com/" + rejects[i].photo_data.server + "/" + rejects[i].photo_data.id + "_" + rejects[i].photo_data.secret + ".jpg";

          rejects[i].approved = (rejects[i].approved !== null) ? Boolean(rejects[i].approved) : false;
          rejects[i].photo_data = photo_url;
          rejects[i].index = i;

          if (i === (rejects.length-1)) {
            vm.lastPhotoId = rejects[i].id;
          }
          console.log(photo_url);
        }
      }

      if (vm.rejects.length === 0) {
          vm.rejects = rejects;
      } else {
          vm.rejects = vm.rejects.concat(rejects);
      }
      vm.pageTotal = vm.rejects.length / vm.numPerPage;
      vm.search();
    };

    general.getRejectedPhotos(vm.lastPhotoId, vm.filters.location).then(vm.processPhotoData);
    general.getLocations().then(function(data) {
      console.log(data);
      vm.locations = data.locations;
    });

    (init = function() {
        console.log("INIT");
        return vm.search(), vm.select(vm.currentPage);
    });
  }
})();
