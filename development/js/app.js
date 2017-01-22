// 定义app模块，并声明其依赖的模块。
// 模块说明：ui.router: 路由模块 参考：https://ui-router.github.io/ng1/
//         WechatBackupControllers:所有控制器 定义在 js/controllers.js
var WechatBackup = angular.module('WechatBackup',['ui.router','WechatBackupControllers','WechatBackupDirectives']);
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
    // var sampleCuttingState = {
    //     name:"sampleCutting",
    //     url:"/sampleCutting",
    //     views:{
    //         '':{
    //             templateUrl:"/templates/index.html"
    //         },
    //         'topbar@sampleCutting':{
    //             templateUrl:"/templates/topbar.html"
    //         },
    //         'main@sampleCutting':{
    //             templateUrl:"/templates/sampleCutting.html"
    //         }
    //     }
    // };
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
    // $stateProvider.state(testState);

});