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

var articles = 
["https://www.foxnews.com/politics/trump-launches-campaign-machine-with-massive-war-chest-despite-polling-lag",
"https://www.foxnews.com/politics/trump-puts-army-secretary-in-charge-of-pentagon-after-shanahan-drops-out-of-contention-for-secdef",
"https://www.foxnews.com/politics/trump-launches-campaign-machine-with-massive-war-chest-despite-polling-lag",
"https://www.foxnews.com/politics/manafort-transferred-to-ny-federal-prison-as-he-awaits-trial-on-state-charges",
"https://www.infowars.com/medical-ids-enemy-of-privacy-liberty-and-health/",
"https://www.infowars.com/facebook-internet-of-money-to-control-bill-pay-access-to-public-transportation/",
"https://www.infowars.com/aoc-claims-us-is-running-concentration-camps-on-southern-border/",
"https://www.infowars.com/trump-ice-will-remove-millions-of-illegal-immigrants-from-u-s/",
"https://www.huffpost.com/entry/daniela-lourdes-falanga-arcigay-italy-transgender-trans-women-rights-italy_n_5ce6bd19e4b0db9c2994713f",
"https://www.huffpost.com/entry/medicare-for-all-poll-democrats_n_5d08264de4b0886dd15db364",
"https://www.huffpost.com/entry/texas-governor-vetoes-bill-that-would-help-sex-trafficking-victims-get-out-of-prison_n_5d08f8d9e4b0f7b744272a9e",
"https://www.huffpost.com/entry/sebastian-gorka-trump-access-hollywood-groping-democrat_n_5d08f69fe4b0f7b74427206a",
"http://www.msnbc.com/rachel-maddow-show/why-trumps-new-vow-use-ice-deport-millions-matters",
"https://www.msnbc.com/rachel-maddow/watch/trump-flips-out-over-nyt-report-on-new-us-aggression-with-russia-62136901919",
"https://www.msnbc.com/morning-joe/watch/amid-sagging-poll-numbers-trump-begins-re-election-62145605984",
"https://www.msnbc.com/hardball/watch/-wow-that-s-about-10-hands-have-dayton-voters-benefited-from-trump-tax-cuts-62135365510",
"https://www.cnn.com/2019/06/19/politics/donald-trump-election-2020-democrats/index.html",
"https://www.cnn.com/2019/06/18/politics/donald-trump-term-limit/index.html",
"https://www.cnn.com/2019/06/18/politics/trump-central-park-five-wont-apologize/index.html",
"https://www.cnn.com/2019/06/18/politics/fact-check-trump-clinton-emails/index.html",
"https://www.apnews.com/0e23bba94a1640af86e916f76791cf0d",
"https://www.apnews.com/4d952f9b4c684899960fe85d807434d6",
"https://www.apnews.com/cc1b2e6310fc4a31808058c7c0c72d79",
"https://www.apnews.com/2b48f2b8799f4063ba2a7c95bfe1ee95",
"https://www.buzzfeednews.com/article/elaminabdelmahmoud/morning-update-big-day-for-men-in-suits-and-blue-ties",
"https://www.buzzfeednews.com/article/briannasacks/a-driver-allegedly-swerved-to-hit-and-kill-a-pregnant-mom",
"https://www.buzzfeednews.com/article/kadiagoba/hope-hicks-silent-white-house-judiciary-committee",
"https://www.buzzfeednews.com/article/paulmcleod/surprise-hospital-billing-legislation-senate",
"https://en.wikipedia.org/wiki/5G",
];


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

