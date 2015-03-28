module.exports = function(data){
    var bot = data.bot;
    
    var test = {};
    
    test.load = function(){
        bot.api.sendChat('holai');
    };
    
    return test;
};