angular.module('ticket.controllers', ['ionic-datepicker', 'ionic', 'ti-segmented-control'])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeLogin();
            }, 1000);
        };
    })

    .controller('SearchTicketControl', function ($scope, $ionicLoading, $state, $stateParams, TicketAPI) {
        $scope.currentDate = new Date();
        $scope.from = '上海';
        $scope.to = '厦门';
        $scope.title = "选择航班日期";

        $scope.datePickerCallback = function (val) {

            if (typeof(val) === 'undefined') {
                console.log('Date not selected');
            } else {
                console.log('Selected date is : ', val);
            }
        };

        $scope.searchTickets = function () {

            $state.go('app.flightlist', {from: $scope.from, to: $scope.to});

        };

        TicketAPI.assignSharedSource($stateParams.sourceid);
    })

    .controller('FlightlistsCtrl', function ($scope, $rootScope, FlightService, $ionicLoading, $stateParams) {

        $scope.currentDate = null;
        $scope.from = $stateParams.from;
        $scope.to = $stateParams.to;

        $scope.flights = [];
        $scope.flightCount = '';
        $rootScope.$on('flights-loaded', function (event, data) {
            $scope.flights = data.flights
            $scope.flightCount = $scope.flights.length;
            $ionicLoading.hide();
        });

        $ionicLoading.show({
            template: '<ion-spinner icon=\"spiral\"></ion-spinner>'
        });
        FlightService.loadFlightsWithCitiesAndDate($scope, '上海', '厦门', '2015-08-01');

    })

    .controller('CabinListCtrl', function ($scope, $stateParams, $ionicLoading, FlightService) {
        var flightid = $stateParams.flightid;

        $scope.searchCondtion = FlightService.sharedSearchCondition();

        $scope.cabins = [];
        $scope.$on('cabins-loaded', function (event, data) {
            $scope.cabins = data.cabins
            $ionicLoading.hide();
        });

        $ionicLoading.show({
            template: '<ion-spinner icon=\"spiral\"></ion-spinner>'
        });

        FlightService.loadCabinsByFlightId($scope, flightid);
    })

    .controller('OrderCtrl', function ($scope, $stateParams, $ionicLoading, FlightService, $ionicActionSheet, $state) {
        $scope.searchCondtion = FlightService.sharedSearchCondition();

        $scope.showContactsList = function () {

            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    {text: '江李明'},
                    {text: 'qijiongnian'}
                ],
                titleText: '选择联系人',
                cancelText: '取消',
                cancel: function () {
                    // add cancel code..
                },
                buttonClicked: function (index) {
                    return true;
                }
            });
        };

        $scope.sumbitOrder = function () {
            $state.go('app.selectpaychannel');
        };

    })
    .controller('SelectPayChannelCtrl', function ($scope, $stateParams, $ionicLoading, FlightService) {

    })

    .controller('UserOrderListCtrl', function ($scope, $stateParams, OrderService, TicketAPI) {

        $scope.orders = [];
        OrderService.loadOrdersByUserId(TicketAPI.getSharedSourceId(), $scope, '未支付');

        $scope.$on('orders-loaded', function(event, data) {

            $scope.orders = data.orders;
        });

        $scope.gotoOrderDetailPage = function(orderid, status) {

        };

        $scope.selectOrderStatus = function(index) {

            var status = (index == 0 ? '已支付' : '未支付');
            OrderService.loadOrdersByUserId(TicketAPI.getSharedSourceId(), $scope, status);
        };
    })
    .controller('PassengerCtrl', function ($scope, $stateParams, $ionicLoading, $ionicActionSheet, PassengerService) {
        $scope.passenger = {type: '成人', certificateType: '身份证', addedAsContact: true};

        var passengerid = $stateParams.passengerid;

        if (passengerid != 'create') {
            PassengerService.loadPassenger($scope, passengerid);
        }

        $scope.$on('single-passenger-loaded', function(event, data) {
            $scope.passenger = data.passenger;
        });
        $scope.savePassenger = function (passengerForm) {

            if(passengerForm.$valid) {
                PassengerService.save($scope, $scope.passenger);
            }

        };

        $scope.showCertificateType = function () {
            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    {text: '身份证'},
                    {text: '护照'}
                ],
                titleText: '选择证件类型',
                cancelText: '取消',
                cancel: function () {
                },
                buttonClicked: function (index, value) {
                    $scope.passenger.certificateType = value.text;
                    return true;
                }
            });
        };

        $scope.showPassengerType = function () {
            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    {text: '成人'},
                    {text: '儿童'}
                ],
                titleText: '选择乘客类型',
                cancelText: '取消',
                cancel: function () {
                },
                buttonClicked: function (index, value) {
                    $scope.passenger.type = value.text;
                    return true;
                }
            });
        };
    })

    .controller('PassengerListCtrl', function ($scope, $stateParams, $ionicLoading, PassengerService) {
        $scope.passengers = [];

        $scope.$on('passengers-loaded', function(event, data) {
            $scope.passengers = data.passengers;
        });

        PassengerService.loadUserPassengers($scope);
    });
