const puppeteer = require('puppeteer');
const fs = require('fs');

const browser = puppeteer.launch(
  {timeout:20000, args:['--aggressive-cache-discard','--disable-cache', '--disable-application-cache']}
);

if (process.argv.length !== 3) {
  console.error('Enter Output File Name: (1 Argument)');
  process.exit(1);
}
else {
	fileName = String(process.argv[2]);
}


var log = [];
const links = require('./fox.js');


var articles = links.foxnews;
var progress = 0;

function record(url) {
	var objects = [];
	var errs = [];
	var startTime = Date.now();
	return new Promise(async function (resolve, reject) {
		browser.then(browser => {
			return browser.newPage();
		}).then(async page => {
			page.on('requestfinished', request => {
				const response = request.response();
	      		const page_url = url;
	      		const request_url = request.url();
	      		const request_headers = request.headers();
	     	 	const response_headers = response.headers();
	      		const response_status = response.status();
	      		const response_addr = response.remoteAddress();
	      		// console.log(response_addr);

	      		if (response_status > 399) {
					errs.push({
			      	page_url,
			        request_url,
			        request_headers,
			        response_headers,
			        response_status,
			        response_addr,
					});
	      		}
	      		else {
					objects.push({
			      	page_url,
			        request_url,
			        request_headers,
			        response_headers,
			        response_status,
			        response_addr,
					});
	      		}
			});
			page.on('request', request => {
				request.continue();
			});

			
			page.on('pageerror', (err) => {
				console.log("Page Error");
			});

		try {
			await page.setRequestInterception(true);
            await page.goto(url, {
	      	waitUntil: 'networkidle2', timeout: 30000
	    	});
		}
		catch (err) {
			console.log("Page Timed Out");
		}
		progress++;
		await page.close();
		console.log("-- Page Complete --");
	    console.log((articles.length - progress) + " Left");
	    console.log("Time (ms): " + (Date.now() - startTime));

	    // try to disconnect the browser
	    if (progress == articles.length) {
	    	// await browser.disconnect();
	    }
		resolve([objects, errs]);

		}).catch(err => {
			reject(err);
		});
	});
};

// add error handling for runthrough 
async function runThrough() {
	return new Promise(async function(resolve, reject) {
	
	for (var i = 0; i < articles.length; i++) {
		// the -1 is very important - do not change
		if (i == articles.length - 1) {
			resolve();
		}
		await record(articles[i]).then(function(value) {
			// console.log("Progress: " + float(progress)/ articles.length + " %")
			log.push(value)});
	}
});
}

async function main() {
	try {
	await runThrough().then(function() {
		var x = JSON.stringify(log, null, 2);
			fs.writeFile(fileName, x, (err) => {
		  	// console.log(JSON.stringify(obj)); 
		    // In case of a error throw err. 
		    if (err) console.log("Write Err"); 
		    });
	});
}
catch (err) {
	console.log("ignore");
	}
finally {
	console.log("-- PROCESS COMPLETE --");
	console.log("-- STANDBY FOR EXIT --");
	setTimeout(function(){process.exit(1)}, 7000);
}
}

main();



