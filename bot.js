var prompt = require('prompt');
var plugapi = require('plugapi');

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

var bot = {};

bot.init = function(){
    console.log('Please enter the login credentials for the bot:');
    
    prompt.get(credentials_schema, function(err, result){
        if(err){ console.log(err); return; }
        
        bot.email = result.email;
        bot.password = result.password;
        bot.room = result.room;
        
        bot.login();
    });
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
        }
    })();
};

bot.prompt_room = function(){
    console.log('Which room do you want the bot to join?');
    prompt.get(room_schema, function(err, result){
        if(err){ console.log(err); return; }
        
        bot.room = result.room;
        bot.connect();
    });
};

bot.connect = function(){
    bot.api.connect(bot.room);
};

prompt.start();

bot.init();