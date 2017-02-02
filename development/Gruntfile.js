module.exports = function(grunt){
    // 项目配置
    // 下面的只是配置
    grunt.initConfig({
        pkg:grunt.file.readJSON("./package.json"),
    //    具体任务
        copy:{
            main:{

                files:[
                    // 拷贝除了imgs文件夹，除了icon-test文件夹
                    // /** 表示除了文件夹及其内部的所有东西
                    // /*表示文件夹内的所有东西，文件夹还是会被拷贝
                    {expand:true,src:["./imgs/**","!./imgs/icon-test/**"],dest:"../build/"},
                    {expand:true,src:["./framework/**","./templates/**","./css/**"],dest:"../build/"},
                    {expand:true,src:["./index.html","./package.json"],dest:"../build/"},
                    {expand:true,src:["./js/**"],dest:"../build/"}
                ]
            }
        },
        clean:{
            options:{
                force:true
            },
            build:["../build/"]

        },
        uglify: {
            //文件头部输出信息
            options: {
                banner: '/* <%= pkg.name %> <%= pkg.description %> <%= pkg.version %> */\n',
                footer: '\n/* <%= grunt.template.today("yyyy-mm-dd") %> by StanleyTian */',
                stripBanners: true
            },
            my_target: {
                files: [
                    {
                        expand: true,
                        //相对路径
                        cwd: 'js/',
                        src: '*.js',
                        dest: '../build/js/',
                        rename: function (dest, src) {
                            var folder = src.substring(0, src.lastIndexOf('/'));
                            var filename = src.substring(src.lastIndexOf('/'), src.length);
                            //  var filename=src;
                            filename = filename.substring(0, filename.lastIndexOf('.'));
                            var fileresult=dest + folder + filename + '.min.js';
                            grunt.log.writeln("现处理文件："+src+"  处理后文件："+fileresult);
                            return fileresult;
                            //return  filename + '.min.js';
                        }
                    }
                ]
            }
        },
        watch:{
            scripts:{
                files:"./js/*.js",
                tasks:'uglify'
            }
        },
        fuck:{
            a:[1,2,3],
            b:"gooood",
            c:false,
        }

    });

    //实际的任务都在这下面，loadNpmTasks是载入npm上的grunt插件，registerTask里面都是用户自定义的任务，本质上和npm上的task没有区别
    // 加载插件
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');



    //grunt.registerTask("default",["watch"]);
    grunt.registerTask('copyCommonFiles',function () {
        grunt.log.writeln("copy common files");
        grunt.task.run(['clean:build','copy:main']);

    });
    grunt.registerTask('copySensitiveFiles',function () {
        grunt.log.writeln("copy sensitive files");

    });
    grunt.registerTask('buildWithNwb',function () {
        grunt.log.writeln("build with nwb tool");

    });
    //grunt.registerMultiTasks();
    grunt.registerTask('dist',['copyCommonFiles','copySensitiveFiles','buildWithNwb']);
};