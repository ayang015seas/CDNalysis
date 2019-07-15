
const fs = require('fs');


if (process.argv.length !== 3) {
  console.error('Enter Input and Output (2 arguments)');
  process.exit(1);
}
else {
	input = String(process.argv[2])
}

var hostFile = fs.readFileSync(input, 'utf8').split("BREAK_SIG");
var data = JSON.parse(hostFile);
console.log(data.length);