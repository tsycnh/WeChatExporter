// 定义app模块，并声明其依赖的模块。
// 模块说明：ui.router: 路由模块 参考：https://ui-router.github.io/ng1/
//         WechatBackupControllers:所有控制器 定义在 js/controllers.js
var WechatBackup = angular.module('WechatBackup',['ui.router','WechatBackupControllers','WechatBackupDirectives','WechatBackupFilters','ngSanitize']);
WechatBackup.config(["$stateProvider","$urlRouterProvider",function ($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.otherwise('/newEntry');
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
    var soft1State ={
        name:"soft1",
        url:"/soft1",
        views:{
            '':{
                templateUrl:"/templates/index.html"
            },
            'topbar@soft1':{
                templateUrl:"/templates/topbar.html"
            },
            'main@soft1':{
                templateUrl:"/templates/soft1.html"
            }
        }
    };
    var soft2State ={
        name:"soft2",
        url:"/soft2/:documentsPath/:meInfo/:otherInfo/:roomInfo",
        views:{
            '':{
                templateUrl:"/templates/index.html"
            },
            'topbar@soft2':{
                templateUrl:"/templates/topbar.html"
            },
            'main@soft2':{
                templateUrl:"/templates/soft2.html"
            }
        }
    };
    var soft3State ={
        name:"soft3",
        url:"/soft3",
        views:{
            '':{
                templateUrl:"/templates/index.html"
            },
            'topbar@soft3':{
                templateUrl:"/templates/topbar.html"
            },
            'main@soft3':{
                templateUrl:"/templates/soft3.html"
            }
        }
    };
    var soft4State ={
        name:"soft4",
        url:"/soft4",
        views:{
            '':{
                templateUrl:"/templates/index.html"
            },
            'topbar@soft4':{
                templateUrl:"/templates/topbar.html"
            },
            'main@soft4':{
                templateUrl:"/templates/soft4.html"
            }
        }
    };
    // 显示聊天列表界面，选择待导出的聊天
    var chatListState = {
        name:"chatList",
        url:"/chatList/:documentsPath",
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
        url:"/chatDetail/:outputPath/:generateHtml/:showQqemoji/:linesPerPage",
        params:{ship:null},
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


    var newEntryState = {
        name:"newEntry",
        url:"/newEntry",
        views:{
            '':{
                templateUrl:"/templates/index.html"
            },
            'topbar@newEntry':{
                templateUrl:"/templates/topbar.html"
            },
            'main@newEntry':{
                templateUrl:"/templates/newEntry.html"
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
    $stateProvider.state(soft1State);
    $stateProvider.state(soft2State);
    $stateProvider.state(soft3State);
    $stateProvider.state(soft4State);
    $stateProvider.state(entryState);
    $stateProvider.state(chatListState);
    $stateProvider.state(chatDetailState);
    $stateProvider.state(newEntryState);
    // $stateProvider.state(testState);


}])
.run(["$rootScope","$state", "$stateParams",function($rootScope, $state, $stateParams) {
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
}]);