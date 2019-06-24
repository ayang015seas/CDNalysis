
if (process.argv.length !== 4) {
  console.error('Expected two arguments!');
  process.exit(1);
}
else {
  input = String(process.argv[2]);
  fileName = String(process.argv[3]);
}


const fs = require('fs');
var hostFile = fs.readFileSync(input, 'utf8').split("BREAK_SIG");
var data = JSON.parse(hostFile);
var fileName;

