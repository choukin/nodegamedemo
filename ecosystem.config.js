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
    }]
}    