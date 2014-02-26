var program = require('commander');

program
    .version('1.0.0')
    .option('-u, --unit', 'Run unit tests.')
    .option('-f, --functional', 'Run functional tests.')
    .on('--help', function(){
        console.log('Executes the mocha testsuite.');
        console.log('');
    })
   .parse(process.argv)
;

if(!program.unit && !program.functional) {
    console.log();
    console.log('Specify if you want to run unit tests (-u) or functional tests (-f).');
    console.log('Run help (-h) for detailed instructions.');
    console.log();
}

if(program.unit) {
     require('child_process').exec(__dirname + '/../node_modules/.bin/mocha -u tdd -R spec --recursive -c ' + __dirname + '/../tests/unit', standardOutput);
}

 if(program.functional) {
require('child_process').exec(__dirname + '/../node_modules/.bin/mocha -u bdd -R spec --recursive -c ' + __dirname + '/../tests/functional', standardOutput);
}

/**
 * Standard output.
 *
 * @method standardOutput
 * @param {Object} error
 * @param {String} stdout the cli standard output
 * @param {String} stderr output of errors
 */
function standardOutput(error, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
}