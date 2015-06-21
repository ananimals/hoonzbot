module.exports = function(data){
    var bot = data.bot;

    var config = {};

    config.load = function(){
        this.cfg = bot.load_json('config');
    };
    
    config.unload = function(){
        this.cfg = null;
    };

    config.get = function(module, key){
        return this.cfg[module][key];
    };

    return config;
};