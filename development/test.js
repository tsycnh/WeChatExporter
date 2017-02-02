angular.module('ConsoleUIApp', ['ui.router','ui.bootstrap'])
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/home");

        $stateProvider
            .state('home', {
                url: "/home",
                templateUrl: "views/home.html",
                controller: 'HomeCtrl'
            })
            .state('testing', {
                url: "/testing",
                templateUrl: "views/testing.html",
                controller: 'TestingCtrl'
            })
    })

    .run(function($rootScope, growl, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$on("$stateChangeSuccess",  function(event, toState, toParams, fromState, fromParams) {
            // to be used for back button //won't work when page is reloaded.
            $rootScope.previousState_name = fromState.name;
            $rootScope.previousState_params = fromParams;
        });
        //back button function called from back button's ng-click="back()"
        $rootScope.back = function() {
            $state.go($rootScope.previousState_name,$rootScope.previousState_params);
        };
    });