const spawn = require('child_process').spawn;
const colors = require('colors');
const exec = require('child_process').exec;
const folder = 'broken-project';

//console.log(process.argv);
//process.exit(0);

const runFile = process.argv[3] || 'index.js';

if (!process.argv[2]) {
  console.error('Usage: node index.js path/to/broken/project');
  console.error('Usage: node index.js path/to/broken/project enother.js');
  return;
}

const brokenProjectPath = process.argv[2].replace(/-p(.*)/, '$1');

console.log(brokenProjectPath);

const installModule = function(moduleName, onSuccess) {
  const ls2 = exec('npm install --save ' + moduleName, {
    cwd: brokenProjectPath
  }, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(stdout);
    console.log('Installed: '.cyan + moduleName.yellow)
    onSuccess();
    return;

    console.log('Folder switched');
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    // ------- INSIDE ---------
    exec('dir', (error, stdout, stderr) => {
      console.log('Current "' + folder + '" structure:');
      console.log(stdout);
    });
  });
};

const runMainApp = function() {
  exec('node ' + runFile, {
    cwd: brokenProjectPath
  }, (error, stdout, stderr) => {
    if (stdout) console.log(`stdout: ${stdout}`);
    if (!stderr)  {
      console.log('Works well'.green);
      process.exit(0);
      return;
    }
    data = stderr.toString();
    var m = data.match(/Error: Cannot find module '([a-z][a-z0-9-]+)'/);
    if (!m) {
      console.log(`Unrecognized error: ${data}`);
      return;
    }
    var missingModule = m[1];
    console.log('Missing module is "' + missingModule + '". Strting to install...');
    installModule(missingModule, () => {
      runMainApp();
    });
  });

}

runMainApp();