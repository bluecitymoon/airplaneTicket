/**
 * Created by jerry on 29/7/15.
 */

angular.module('ticket.services', [])

    .factory('FlightService', function ($http, apiBase) {
        var searchCondtion = {};
        return {

            loadFlightsWithCitiesAndDate: function ($scope, startoffCity, landingCity, flightDate) {
                $http({
                    url: apiBase + '/flights'
                }).success(function (response, status, headers, config) {
                    searchCondtion.from = startoffCity;
                    searchCondtion.to = landingCity;

                    $scope.$emit('flights-loaded', {flights: response});

                }).error(function (response, status, headers, config) {

                    $scope.$emit('flights-loaded', {flights: []});
                });
            },

            loadCabinsByFlightId: function ($scope, flightid) {
                $http({
                    url: apiBase + '/cabinInformations'
                }).success(function (response, status, headers, config) {
                    console.debug(response);
                    $scope.$emit('cabins-loaded', {cabins: response});

                }).error(function (cabins, status, headers, config) {

                    $scope.$emit('cabins-loaded', {cabins: []});
                });
            },

            sharedSearchCondition: function () {
                return searchCondtion;
            }

        };
    })

    .factory('OrderService', function ($http, apiBase) {
        return {
            loadOrdersByUserId: function (userid, $scope, status) {
                $http({
                    url: apiBase + '/orderInformations/status/' + status
                }).success(function (response, status, headers, config) {

                    $scope.$emit('orders-loaded', {orders: response});

                }).error(function (response, status, headers, config) {

                });
            }
        };
    })

    .factory('PassengerService', function ($http, apiBase, TicketAPI) {
        return {
            save: function ($scope, passenger) {
                passenger.userId = TicketAPI.getSharedSourceId();
                $http({
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    url: apiBase + '/passengers',
                    data: passenger
                }).success(function (response, status, headers, config) {

                    //$scope.$emit('orders-loaded', {orders: response});
                    console.debug(response);

                }).error(function (response, status, headers, config) {

                });
            },

            loadUserPassengers: function($scope) {

                $http({
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    url: apiBase + '/passengers/user/' + TicketAPI.getSharedSourceId()
                }).success(function (response, status, headers, config) {

                    $scope.$emit('passengers-loaded', {passengers: response});

                }).error(function (response, status, headers, config) {

                });
            },

            loadPassenger: function($scope, passengerid) {
                $http({
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    url: apiBase + '/passengers/' + passengerid
                }).success(function (response, status, headers, config) {

                    $scope.$emit('single-passenger-loaded', {passenger: response});

                }).error(function (response, status, headers, config) {

                });
            }

        };
    })

    .factory('TicketAPI', function ($http) {
        var sourceid = '';
        return {
            getSharedSourceId: function () {
                return sourceid;
            },
            assignSharedSource: function (inSourceid) {
                sourceid = inSourceid;
            }
        };
    });