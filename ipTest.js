var ip = require('whatismyip');
var options = {
  url: 'http://checkip.dyndns.org/',
  truncate: '',
  timeout: 60000,
  matchIndex: 0
};

ip.whatismyip(options, function(err, data){
  if (err === null) {
    console.log(data);
  }
});