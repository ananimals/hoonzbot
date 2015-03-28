var prompt = require('prompt');
var plugapi = require('plugapi');
var fs = require('fs');

prompt.message = '';
prompt.delimiter = '';

var credentials_schema = {
    properties: {
        email: {
            description: 'Email:'.cyan.bold,
            pattern: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: 'Please enter a valid email adress'.red.bold,
            required: true
        },
        password: {
            description: 'Password:'.cyan.bold,
            hidden: true,
            required: true
        }
    }
};

var room_schema = {
    properties: {
        room: {
            description: 'Room:'.cyan.bold,
            required: true
        }
    }
};

var modules = Array('test');

function bot_join(data){
    if(data.length > 0){
        console.log('Bot successfully joined https://plug.dj/' + data);
    }

    for(var i = 0; i < modules.length; i++){
        bot.load_module(modules[i]);
        console.log(modules[i]);
    }
}

var bot = {};
var modules = {};

bot.events = Array();
bot.core_events = [{
    'event': 'roomJoin',
    'action': bot_join
}];
bot.connected = false;                  // If this is true, the bot is IN the room specified in bot.room; This becomes true on joinRoom

bot.init = function(){
    bot.load_module('config');

    console.log('Please enter the login credentials for the bot:');

    prompt.get(credentials_schema, function(err, result){
        if(err){ console.log(err); return; }
        
        bot.email = result.email;
        bot.password = result.password;

        bot.login();
    });
};

bot.load_json = function(file){
    var obj = JSON.parse(fs.readFileSync('./json/' + file + '.json', 'utf8'));

    return obj;
};

bot.load_module = function(module_name){
    var params = { "bot" : bot };

    modules[module_name] = require("./modules/" + module_name + ".js")(params);
    modules[module_name].load();
};

bot.modules_loaded = function(check_modules){
    for(var module in check_modules){
        if(!(check_modules[module] in modules)){
            return false;
        }
    }
    
    return true; 
};

bot.unload_module = function(module_name){     // FIXIT AINT WORKING
    //console.log(core.modules[module_name]);
    
    modules[module_name].unload();
    delete modules[module_name];
    
    console.log("Module: " + module_name + " unloaded.");
};

bot.login = function(){
    new plugapi({
        "email": bot.email,
        "password": bot.password
    }, function(api){
        bot.api = api;
    });
    
    var i = 0;
    
    process.stdout.write('Connecting');
    
    (function check(){
        if(bot.api === undefined){
            if(i++ < 10){
                process.stdout.write('.');
                setTimeout(check, 1000);
            } else {
                console.log('\nCould not login with the credentials you supplied.');
                bot.init();
            }
        } else {
            process.stdout.write('\n');
            bot.prompt_room();
            bot.register_events(bot.core_events);
        }
    })();
};

bot.prompt_room = function(){
    console.log('Which room do you want the bot to join?');
    prompt.get(room_schema, function(err, result){
        if(err){ console.log(err); return; }
        
        bot.connect(result.room);
    });
};

bot.connect = function(room){
    bot.api.connect(room);
};

bot.hook = function(event, action){
    bot.api.on(event, action);
};

bot.unhook = function(event, action){
    bot.api.off(event, action);
};

bot.register_events = function(events){
    var pair, i;

    for (i = 0; i < events.length; i++){
        pair = events[i];
        bot.hook(pair["event"], pair["action"]);
        
        bot.events.push(events[i]);
    }
};

bot.unregister_events = function(events){
    var pair, i;

    for (i = 0; i < events.length; i++){
        pair = events[i];
        bot.unhook(pair["event"], pair["action"]);
        
        bot.events.splice(bot.events.indexOf(events[i]), 1);
    }
};

prompt.start();

bot.init();