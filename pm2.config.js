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
            "ref":"origin/main",
            "repo":"git@github.com:choukin/nodegamedemo.git",
            "path":"/www/",
            "ssh_options":"StrictHostKeyChecking=no",
            "post-setup":"ls -la && npm install",
            "pre-deploy-local":"echo '本地要执行的命令'",
            "post-deploy":"npm run build && pm2 start pm2.config.js --watch -i 3",
            "env":{
                "NODE_ENV":"production"
            }
        }
    }
}