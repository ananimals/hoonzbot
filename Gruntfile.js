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
            build: '(cd node_modules/plugapi; grunt)',
            setup: '(cd node_modules/plugapi; npm install; cd ..; grunt build)'
        }
    });
    
    grunt.loadNpmTasks('grunt-curl');
    grunt.loadNpmTasks('grunt-exec');
    
    grunt.registerTask('build', ['curl-dir', 'exec:build']);
    grunt.registerTask('default', ['exec:setup']);
};