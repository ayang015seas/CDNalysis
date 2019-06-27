// let's try adblocker 

const puppeteer = require('puppeteer');
const fs = require('fs');

const browser = puppeteer.launch(
  {devtools: true,
  	timeout:20000, headless: true,
  	args:['--disable-extensions-except=adblock-unpacked',
                  '--load-extension=adblock-unpacked/','--aggressive-cache-discard','--disable-cache', '--disable-application-cache']}
);

if (process.argv.length !== 4) {
  console.error('Enter Input and Output (2 arguments)');
  process.exit(1);
}
else {
	// input = String(process.argv[2])
	fileName = String(process.argv[3]);
}

// var hostFile = fs.readFileSync(input, 'utf8').split("BREAK_SIG");
// var data = JSON.parse(hostFile);

var log = [];

// var articles = data;
var articles = [
"https://www.stanforddaily.com/2019/06/26/5-lessons-ive-learned-from-my-transition-so-far/",
"https://www.stanforddaily.com/2019/06/24/op-ed-letter-of-support-for-dr-jose-montoya/",
"https://www.stanforddaily.com/2019/06/16/the-lies-that-uphold-the-system-operation-varsity-blues/",
"https://www.stanforddaily.com/2019/06/16/rosen-both-sides-of-the-story/",
"https://www.stanforddaily.com/2019/06/16/francis-on-unlearning/",
"https://www.stanforddaily.com/2019/06/16/zhao-the-last-one/",
"https://www.stanforddaily.com/2019/06/16/keller-what-drives-the-daily/",
"https://www.stanforddaily.com/2019/06/16/pragada-anecdotes-from-my-sports-life/",
"https://www.stanforddaily.com/2019/06/16/knowles-one-last-pitch/",
"https://www.stanforddaily.com/2019/06/16/brassil-home/",
"https://www.stanforddaily.com/2019/06/15/op-ed-to-stanford-re-suicide/",
"https://www.stanforddaily.com/2019/06/12/the-lonely-american-dream/",
"https://www.stanforddaily.com/2019/06/11/editorial-board-best-of-the-year/",
"https://www.stanforddaily.com/2019/06/11/life-in-lore-history-and-students-at-work/",
"https://www.stanforddaily.com/2019/06/11/the-dualist-the-ruined-image/",
"https://www.stanforddaily.com/2019/06/10/the-warm-welcome-of-bay-area-paganism/",
"https://www.stanforddaily.com/2019/06/07/what-i-learned-from-senator-gillibrand/",
"https://www.stanforddaily.com/2019/06/07/opining-on-opinions-a-volume-in-review/",
"https://www.stanforddaily.com/2019/06/07/de-cd-the-dualist-do-we-have-to-fix-the-world/",
"https://www.stanforddaily.com/2019/06/04/de-mp-an-ode-to-student-voices/",
"https://www.stanforddaily.com/2019/06/04/dead-week-and-drowning-ducks-an-account-of-academic-inspiration/",
"https://www.stanforddaily.com/2019/06/03/de-mp-my-year-of-righteousness-and-row-living/",
"https://www.stanforddaily.com/2019/06/03/op-ed-on-the-abortion-debate/",
"https://www.stanforddaily.com/2019/05/31/letter-to-the-editor-responding-to-queer-cohesion/",
"https://www.stanforddaily.com/2019/05/31/letter-to-the-community-rotten-and-wrong-stanford-is/",
"https://www.stanforddaily.com/2019/05/31/this-house-would-replace-the-us-government-with-a-military-junta/",
"https://www.stanforddaily.com/2019/05/30/letter-to-the-editor-economics-visiting-scholar/",
"https://www.stanforddaily.com/2019/05/30/trapped-in-tijuana-human-rights-violations-under-trumps-remain-in-mexico-policy/",
"https://www.stanforddaily.com/2019/05/29/on-flakiness-part-four-counting-on-people/",
"https://www.stanforddaily.com/2019/05/28/campus-worker-profile-week-nine/",
"https://www.stanforddaily.com/2019/05/24/frankly-speaking-no-4-greek-life-at-stanford/",
"https://www.stanforddaily.com/2019/05/23/student-run-inaugural-disability-studies-conference-showcases-the-need-for-disability-studies-on-campus/",
"https://www.stanforddaily.com/2019/05/23/the-sorry-state-of-stanford-dorms/",
"https://www.stanforddaily.com/2019/05/22/on-flakiness-part-three-flakiness-and-obligation/",
"https://www.stanforddaily.com/2019/05/21/mobilizing-an-immediate-response-to-campus-food-insecurity/",
"https://www.stanforddaily.com/2019/05/21/once-a-pun-a-time-true-mean/",
"https://www.stanforddaily.com/2019/05/21/san-francisco-made-the-right-call-by-banning-facial-recognition-technology-for-now/",
"https://www.stanforddaily.com/2019/05/20/campus-worker-profile-week-8/",
"https://www.stanforddaily.com/2019/05/20/op-ed-data-is-just-one-point-in-the-real-story-of-sexual-assault/",
"https://www.stanforddaily.com/2019/05/20/instagram-and-your-life-story/",
"https://www.stanforddaily.com/2019/05/17/greater-care-in-retraction/",
"https://www.stanforddaily.com/2019/05/17/letter-to-the-editor-on-invited-speakers/",
"https://www.stanforddaily.com/2019/05/16/letter-to-the-editor-the-real-lesson-of-the-college-admissions-debacle/",
"https://www.stanforddaily.com/2019/05/15/letter-to-the-editor-regarding-recent-daily-coverage/",
"https://www.stanforddaily.com/2019/05/15/the-tragedy-of-gerald-neesh-act-iii/",
"https://www.stanforddaily.com/2019/05/15/de-mw-the-bent-on-flakiness-part-two/",
"https://www.stanforddaily.com/2019/05/14/the-tragedy-of-gerald-neesh-act-ii/",
"https://www.stanforddaily.com/2019/05/14/once-a-pun-a-time-armed/",
"https://www.stanforddaily.com/2019/05/14/did-we-do-wrong-by-yusi-zhao/",
"https://www.stanforddaily.com/2019/05/13/a-call-for-environmental-rights-not-just-advocacy/",
"https://www.stanforddaily.com/2019/05/13/if-you-dont-like-scr-come-see-andrew-klavan/",
"https://www.stanforddaily.com/2019/05/13/campus-worker-profile-week-seven/",
"https://www.stanforddaily.com/2019/05/10/op-ed-which-is-it-fraud-or-privilege/",
"https://www.stanforddaily.com/2019/05/10/the-unbearable-loneliness-of-being-jewish-in-america/",
"https://www.stanforddaily.com/2019/05/10/submit-to-frankly-speaking-3-does-greek-life-at-stanford-do-more-harm-or-more-good/",
"https://www.stanforddaily.com/2019/05/09/frankly-speaking-2-are-conservatives-at-stanford-marginalized/",
"https://www.stanforddaily.com/2019/05/07/letter-to-the-community-summer-break-is-time-for-sworn-to-refuse/",
"https://www.stanforddaily.com/2019/05/07/it-crossed-the-line/",
"https://www.stanforddaily.com/2019/05/06/op-ed-stanford-jewish-voice-for-peaces-statement-on-eli-valley-art-exhibition/",
]

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



