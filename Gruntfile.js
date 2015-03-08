module.exports = function (grunt) {
    grunt.initConfig({
        'curl-dir': {
            'node_modules/plugapi/src/': [
                'https://raw.githubusercontent.com/ananimals/plugAPI-custom/master/src/bufferObject.js',
                'https://raw.githubusercontent.com/ananimals/plugAPI-custom/master/src/client.js',
                'https://raw.githubusercontent.com/ananimals/plugAPI-custom/master/src/cookie.js',
                'https://raw.githubusercontent.com/ananimals/plugAPI-custom/master/src/eventObjectTypes.js',
                'https://raw.githubusercontent.com/ananimals/plugAPI-custom/master/src/logger.js',
                'https://raw.githubusercontent.com/ananimals/plugAPI-custom/master/src/room.js',
                'https://raw.githubusercontent.com/ananimals/plugAPI-custom/master/src/utils.js',
            ]
        },
        exec: {
            build: '(cd node_modules/plugapi; grunt)'
        }
    });
    
    grunt.loadNpmTasks('grunt-curl');
    grunt.loadNpmTasks('grunt-exec');
    
    grunt.registerTask('default', ['curl-dir', 'exec']);
};