module.exports = {
    "apps":[{
        "name":"nodeGame",
        "script":"src/servers/server.js",
        instances : "2",
        exec_mode : "cluster",
        watch:true,
        "env":{
        },
        "env_production":{
            "NODE_ENV":"production"
        }
    },{
        "name":"nodejob",
        "script":"/www/nodejob/auto-sign/cronindex.js",
        instances : "2",
        exec_mode : "cluster",
        watch:true,
        "env":{
        },
        "env_production":{
            "NODE_ENV":"production"
        }
    }],
    "deploy":{
        "production":{
            "user":"root",
            "host":["hw"],
            "ref":"origin/main",
            "repo":"git@github.com:choukin/nodegamedemo.git",
            "path":"/www/",
            "ssh_options":"StrictHostKeyChecking=no",
            "post-setup":"ls -la",
            "pre-deploy-local":"echo '本地要执行的命令'",
            "pre-deploy":"echo '开始部署'",
            "post-deploy":"npm install && npm run build && pm2 start",
            "env":{
                "NODE_ENV":"production"
            }
        }
    }    
}    