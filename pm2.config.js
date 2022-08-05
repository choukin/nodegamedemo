module.exports = {
    "apps":[{
        "name":"nodeGame",
        "script":"src/servers/server.js",
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
            "ref":"github/main",
            "repo":"git@github.com:choukin/nodegamedemo.git",
            "path":"/www/",
            "ssh_options":"StrictHostKeyChecking=no",
            "post-setup":"ls -la",
            "pre-deploy-local":"echo '本地要执行的命令'",
            "post-deploy":"npm install && npm run build && pm2 startOrRestart pm2.config.js --env production",
            "env":{
                "NODE_ENV":"production"
            }
        }
    }
}