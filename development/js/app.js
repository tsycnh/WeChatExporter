// 定义app模块，并声明其依赖的模块。
// 模块说明：ui.router: 路由模块 参考：https://ui-router.github.io/ng1/
//         WechatBackupControllers:所有控制器 定义在 js/controllers.js
var WechatBackup = angular.module('WechatBackup',['ui.router','WechatBackupControllers','WechatBackupDirectives','WechatBackupFilters','ngSanitize']);
WechatBackup.config(function ($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.otherwise('/entry');
    // 进入页面，选择Sqlite文件
    var entryState ={
        name:"entry",
        url:"/entry",
        views:{
            '':{
                templateUrl:"/templates/index.html"
            },
            'topbar@entry':{
                templateUrl:"/templates/topbar.html"
            },
            'main@entry':{
                templateUrl:"/templates/entry.html"
            }
        }
    };
    // 显示聊天列表界面，选择待导出的聊天
    var chatListState = {
        name:"chatList",
        url:"/chatList/:sqliteFilePath",
        views:{
            '':{
                templateUrl:"/templates/index.html"
            },
            'topbar@chatList':{
                templateUrl:"/templates/topbar.html"
            },
            'main@chatList':{
                templateUrl:"/templates/chatList.html"
            }
        }
    };
    // 聊天详情页面
    var chatDetailState = {
        name:"chatDetail",
        url:"/chatDetail/:tableName/:sqliteFilePath",
        views:{
            '':{
                templateUrl:"/templates/index.html"
            },
            'topbar@chatDetail':{
                templateUrl:"/templates/topbar.html"
            },
            'main@chatDetail':{
                templateUrl:"/templates/chatDetail.html"
            }
        }
    };
    // 教程页面
    var tutorialState = {
        name:"tutorial",
        url:"/tutorial",
        views:{
            '':{
                templateUrl:"/templates/index.html"
            },
            'topbar@tutorial':{
                templateUrl:"/templates/topbar.html"
            },
            'main@tutorial':{
                templateUrl:"/templates/tutorial.html"
            }
        }
    };

    // var testState = {
    //     name:"test",
    //     url:"/test",
    //     views:{
    //         '':{
    //             templateUrl:"/templates/index.html"
    //         },
    //         'topbar@test':{
    //             templateUrl:"/templates/topbar.html"
    //         },
    //         'main@test':{
    //             templateUrl:"/templates/test.html"
    //         }
    //     }
    // };
    $stateProvider.state(entryState);
    $stateProvider.state(chatListState);
    $stateProvider.state(tutorialState);
    $stateProvider.state(chatDetailState);
    // $stateProvider.state(testState);

})
.run(function($rootScope, $state, $stateParams) {
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