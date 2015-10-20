// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('ticket', ['ionic', 'ticket.controllers', 'ticket.services', 'ngMessages'])

    .config(['$httpProvider', function ($httpProvider) {
            $httpProvider.defaults.useXDomain = true;
        }
    ])
    .constant('apiBase', 'http://192.168.2.109:8080/api')
    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })

            .state('app.search', {
                url: '/search/:sourceid',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/search.html',
                        controller: 'SearchTicketControl'
                    }
                }
            })

            .state('app.browse', {
                url: '/browse',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/browse.html'
                    }
                }
            })
            .state('app.flightlist', {
                url: '/flightlist/:from/:to/:date',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/flightlists.html',
                        controller: 'FlightlistsCtrl'
                    }
                }
            })
            .state('app.single', {
                url: '/singleflight/:flightid/:from/:to',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/selectseat.html',
                        controller: 'CabinListCtrl'
                    }
                }
            })
            .state('app.order', {
                url: '/order/:cabinid',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/order.html',
                        controller: 'OrderCtrl'
                    }
                }
            })
            .state('app.selectpaychannel', {
                url: '/selectpaychannel',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/selectpaychannel.html',
                        controller: 'SelectPayChannelCtrl'
                    }
                }
            })
            .state('app.userorderlist', {
                url: '/userorderlist',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/userorderlist.html',
                        controller: 'UserOrderListCtrl'
                    }
                }
            })
            .state('app.userpassengerlist', {
                url: '/userpassengerlist',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/userpassengerlist.html',
                        controller: 'PassengerListCtrl'
                    }
                }
            })
            .state('app.passengermanangement', {
                url: '/passengermanangement/mgr/:passengerid',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/passengermanagement.html',
                        controller: 'PassengerCtrl'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/search/:sourceid');
    });
