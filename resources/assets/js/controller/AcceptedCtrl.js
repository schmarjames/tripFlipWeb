(function() {

  angular.module('AcceptedCtrl', []).controller('AcceptedCtrl', ['$rootScope', '$scope', '$filter', '$location', '$state', '$modal', 'general', 'Flash', AcceptedCtrl]);

  function AcceptedCtrl($rootScope, $scope, $filter, $location, $state, $modal, general, Flash) {
    var init;
    var vm = this;

    vm.filteredAccepts = [];
    vm.searchKeywords = "";
    vm.row = "";
    vm.numPerPageOpt = [3, 5, 10, 20, 100];
    vm.numPerPage = vm.numPerPageOpt[2];
    vm.currentPage = 1;
    vm.currentPageAccepts = [];
    vm.newShow = {};
    vm.next = false;
    vm.accepts = [];
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
            general.getAcceptedPhotos(vm.lastPhotoId, vm.filters.location).then(vm.processPhotoData);
          }
        }
        return start = (page - 1) * vm.numPerPage, end = start + vm.numPerPage, vm.currentPageAccepts = vm.filteredAccepts.slice(start, end);
    };

    vm.search = function() {
        return vm.filteredAccepts = $filter("filter")(vm.accepts, vm.searchKeywords), vm.onFilterChange();
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
        return vm.row !== rowName ? (vm.row = rowName, vm.filteredAccepts = $filter("orderBy")(vm.acceptss, rowName), vm.onOrderChange()) : void 0;
    };

    vm.approvePhoto = function(id, idx) {
      if ($rootScope.currentUser.permission_type === 1) {
          general.approvePhoto(id).then(function(data) {
            console.log(data);
            var message = data;
            Flash.create('success', message);
            // remove this photo from the vm.accepted array
            delete vm.accepts[idx];
            currentPage = vm.currentPage;

            //reset table
            vm.search();
            vm.currentPage = currentPage;
          });
      }

      else if ($rootScope.currentUser.permission_type === 2) {
          general.setPhotoToApprovalStatus("accepts", id).then(function(data) {
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
      var approved = (vm.newFilters.approved == 0) ? false : true,
          location = (vm.newFilters.selectedLocation !== undefined) ? vm.newFilters.selectedLocation.originalObject : undefined;

      if (approved !== vm.filters.approved || location !== null) {
          vm.filters.approved = approved;
          vm.filters.location.country = (location != undefined) ? location.country : "";
          vm.filters.location.stateRegion = (location != undefined) ? location.stateRegion : "";
          vm.filters.location.city = (location != undefined) ? location.city : "";
          vm.lastPhotoId = null;
          vm.accepts = [];

          if (approved) {
            // query approved photos
            general.getApprovedPhotos(vm.lastPhotoId, vm.filters.location).then(vm.processPhotoData);
          } else {
            // query all photos
            general.getAcceptedPhotos(vm.lastPhotoId, vm.filters.location).then(vm.processPhotoData);
          }
      }
    };

    vm.rejectPhoto = function(id, idx) {
      if ($rootScope.currentUser.permission_type === 1) {
        general.rejectPhoto(id).then(function(data) {
          console.log(data);
          var message = data;
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

    vm.processPhotoData = function(data) {
      var photo_url = "";
      var accepts = data.acceptedPhotos;
      vm.totalApproves = data.totalApproves;

      for (var i=0; i<accepts.length; i++) {
        accepts[i].photo_data = JSON.parse(accepts[i].photo_data);
        photo_url = "https://farm" + accepts[i].photo_data.farm + ".staticflickr.com/" + accepts[i].photo_data.server + "/" + accepts[i].photo_data.id + "_" + accepts[i].photo_data.secret + ".jpg";
        console.log(data);
        accepts[i].approved = (accepts[i].approved !== null) ? Boolean(accepts[i].approved) : false;
        accepts[i].photo_data = photo_url;
        accepts[i].index = i;

        if (i === (accepts.length-1)) {
          vm.lastPhotoId = accepts[i].id;
        }
        console.log(photo_url);
      }

      if (vm.accepts.length === 0) {
          vm.accepts = accepts;
      } else {
          vm.accepts = vm.accepts.concat(accepts);
      }
      vm.pageTotal = vm.accepts.length / vm.numPerPage;
      vm.search();
    };

    general.getAcceptedPhotos(vm.lastPhotoId, vm.filters.location).then(vm.processPhotoData);
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
