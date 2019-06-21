// open run1.txt 

// input arguments 

var latitude;
var longitude;
var input;
var fileName; 

if (process.argv.length !== 6) {
  console.error('Expected Latitude, Longitude, Input File, Output File');
  process.exit(1);
}
else {
  latitude = parseFloat(process.argv[2]);
  longitude = parseFloat(process.argv[3]);
  input = String(process.argv[4]);
  fileName = String(process.argv[5]);
}

// how the string order needs to go: 

var CDN  = [
  [".clients.turbobytes.com", "Turbobytes"],
  [".akamai.net", "Akamai"],
  [".edgekey.net", "Akamai"],
  [".edgesuite.net","Akamai"],
  [".cdn.bitgravity.com", "Bitgravity"],
  [".akamaiedge.net", "Akamai"],
  [".deploy.static.akamaitechnologies.com", "Akamai"],
  [".llnwd.net", "Limelight"],
  [".systemcdn.net", "EdgeCast"],
  [".cdn77.net", "CDN77"],
  [".edgecastcdn.net", "EdgeCast"],
  [".hwcdn.net", "Highwinds"],
  [".panthercdn.com", "CDNetworks"],
  [".simplecdn.net", "Simple CDN"],
  [".instacontent.net", "Mirror Image"],
  [".mirror-image.net", "Mirror Image"],
  [".cap-mii.net", "Mirror Image"],
  [".footprint.net", "Level3"],
  [".ay1.b.yahoo.com", "Yahoo"],
  [".yimg.", "Yahoo"],
  [".google.", "Google"],
  ["googlesyndication.", "Google"],
  ["youtube.", "Google"],
  [".googleusercontent.com", "Google"],
  [".l.doubleclick.net", "Google"],
  [".internapcdn.net", "Internap"],
  [".cloudfront.net", "Amazon Cloudfront"],
  [".netdna-cdn.com", "MaxCDN"],
  [".netdna-ssl.com", "MaxCDN"],
  [".netdna.com", "MaxCDN"],
  [".cotcdn.net", "Cotendo"],
  [".cachefly.net", "Cachefly"],
  ["bo.lt", "BO.LT"],
  [".cloudflare.com", "Cloudflare"],
  [".afxcdn.net", "afxcdn.net"],
  [".lxdns.com", "ChinaNetCenter"],
  [".att-dsa.net", "AT&T"],
  [".vo.msecnd.net", "Windows Azure"],
  [".voxcdn.net", "Voxel"],
  [".bluehatnetwork.com", "Blue Hat Network"],
  [".swiftcdn1.com", "SwiftCDN"],
  [".rncdn1.com", "Reflected Networks"],
  [".cdngc.net", "CDNetworks"],
  [".gccdn.net", "CDNetworks"],
  [".gccdn.cn", "CDNetworks"],
  [".fastly.net", "Fastly"],
  [".gslb.taobao.com", "Taobao"],
  [".gslb.tbcache.com", "Alimama"],
  [".ccgslb.com", "ChinaCache"],
  [".ccgslb.net", "ChinaCache"],
  [".c3cache.net", "ChinaCache"],
  [".chinacache.net", "ChinaCache"],
  [".c3cdn.net", "ChinaCache"],
  [".akadns.net", "Akamai"],
  [".cdn.telefonica.com", "Telefonica"],
  [".azioncdn.net", "Azion"],
  [".anankecdn.com.br", "Ananke"],
  [".kxcdn.com", "KeyCDN"],
  [".lswcdn.net", "LeaseWeb CDN"],
  [".cdn.amazon.com", "Amazon CDN"],
  [".cdn.amazon.co.uk", "Amazon CDN"],
  [".nyucd.net", "Coral Cache"],
  ["cdn1.graphiq.com", "Cloudflare"],
  ["cdn2.pubexchange.com", "Cloudflare"],
  ["cdn.districtm.ca", "Cloudflare"],
  ["cdn.engine.4dsply.com", "Cloudflare"],
  ["cdn.onesignal.com", "Cloudflare"],
  ["cdn.prizma.tv", "Cloudflare"],
  ["cdn.tinypass.com", "Cloudflare"],
  ["cdn.tynt.com", "Cloudflare"],
  ["lightboxcdn.com", "Cloudflare"],
  ["cdn.optimizely.com", "Optimizely"],
  ["cdn.krxd.net, Fastly"],
  ]

const fs = require('fs');
const geoip = require('geoip-lite');
const geolib = require('geolib');

var hostFile = fs.readFileSync(input, 'utf8').split("BREAK_SIG");
var data = JSON.parse(hostFile);
var fileName;
var results = [];

function getHostName (str) {
  // taken from http://beardscratchers.com/journal/using-javascript-to-get-the-hostname-of-a-url
  try{
    var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
    return str.match(re)[1].toString();
  } catch (err) {
    //probably data uri which we dont care abt
    //console.log(str)
    return null;
  }
}

function stringCheck(response, target) {
	var server = (String(target)).toLowerCase();
	var lower = String(response);
	if (lower.includes(server)) {
		return true;
	}
	else {
		return false;
	}
}

function codeCheck(status, range) {
	if ((parseInt(status) < (range + 100)) && (parseInt(status) > (range - 1))) {
		return true;
	}
	else {
		return false;
	}
}

function determineCDN(url) {
	const result = getHostName(url);
	if (result == null || result == undefined) {
		return false;
	}
	else {
	  for (var i = 0; i < CDN.length; i++) {
	  	const lower = url.toLowerCase();
	  	// console.log(lower);
	    if ((lower.search(CDN[i][0])) != -1 || 
	    	(lower.search(CDN[i][0])) != -1) {
	      return true;
	    }
	  }
	  return false;
	}
}

function distanceCheck(ipString, lat, long) {
	if (ipString == undefined) {
		return null;
	}
	var str = ipString.toString();
	if (str.indexOf("[") == 0) {
		str = (str.substring(1, str.length - 1));
	}
	// console.log(str);
	var locationData = geoip.lookup(str);
	if (locationData == null || locationData.ll == null) {
		return null;
	}
	else {
		var lat1 = locationData.ll[0];
		var long1 = locationData.ll[1];
		if (locationData.country == 'US' && locationData.city.length > 0) {
			/*
			console.log(locationData.city)
			console.log("Lat1: " + lat1);
			console.log("Long1: " + long1);
			*/
			return (geolib.getDistance({latitude: lat, longitude: long}, 
			 	{latitude: lat1, longitude: (-1 * long1)}));
		}
		else {
			return null;
		}
	}
}

// HELPER FUNCTIONS END 

function processAll(response) {
	for (var i = 0; i < data.length; i++) {
		processPage(data[i]);
	}
}

function processPage(page) {
	const responses = page[0];
	if (page[0] == null || page[0] == undefined) {
		return;
	}

	const err = page[1];
	const pageurl = page[0][0].page_url;

	// counters
	var xamz = 0;
	var xedge = 0;
	var xcdn = 0;
	var xamzcf = 0;
	var xms = 0;

	var xHit = 0;
	var xMiss = 0;
	var xCache = 0;

	var sAkai = 0;
	var sCloud = 0;
	var sAmaz = 0;
	var reqCDN = 0;

	var redirects = 0;
	var clientErr = 0;
	var servErr = 0;

	var totalDistance = 0;
	var distanceObjs = 0;

	var totalErr = 0;
	if (page[1].length == undefined) {
		totalErr = 0;
	}
	else {
		totalErr = page[1].length;
	}
	var totalObj = responses.length;

	for (var i = 0; i < responses.length; i++) {
		const data = responses[i];
		if (data == null || data == undefined) {
			continue;
		}
	    const req_header = data.request_headers;
	    const resp_header = data.response_headers;
	    const req_address = data.request_url; 
	    const resp_stat = data.response_status;
	    const resp_ip = data.response_addr.ip;
	    const respString = (JSON.stringify(resp_header).toLowerCase());
	    const servString = (String(resp_header.server)).toLowerCase();

		if (stringCheck(respString, 'x-amz')) {
			if (stringCheck(respString, 'x-amz-cf')) {
				xamzcf++;
			}
			else {
				xamz++;
			}
		}
		if (stringCheck(respString, 'x-edgeconnect')) {
			xedge++;
		}
		if (stringCheck(respString, 'x-CDN')) {
			xcdn++;
		}
		if (stringCheck(respString, 'x-msedge')) {
			xms++;
		}
		// xcache checks
		if (stringCheck(respString, '"x-cache":"hit')) {
			xHit++;
		}
		if (stringCheck(respString, '"x-cache":"miss')) {
			xMiss++;
		}
		if (stringCheck(respString, '"x-cache-hits":"')) {
			xCache++;
		}


		// server checks 
		if (stringCheck(servString, 'cloudfront')) {
			sCloud++;
		}
		if (stringCheck(servString, 'amazons3')) {
			sAmaz++;
		}
		if (stringCheck(servString, 'akamai')) {
			sAkai++;
		}

		// check reqHeader CDN 
		if (determineCDN(req_address)) {
			reqCDN++;
		}

		// response status checks
		if (codeCheck(resp_stat, 300)) {
			redirects++;
		}
		if (codeCheck(resp_stat, 400)) {
			clientErr++;
		}
		if (codeCheck(resp_stat, 500)) {
			servErr++;
		}

		var distance = distanceCheck(resp_ip, latitude, longitude);
		if (distance != null) {
			// console.log(distance);
			totalDistance += distance;
			distanceObjs++;
		}
	}
	var avgDistance = totalDistance / (distanceObjs * 1000);

		var result = {Page: pageurl, Objects: totalObj, Request_CDN: reqCDN,
			Errors: {Redirects: redirects, TotalErrors: totalErr, Client: clientErr, Server: servErr},
			Servers: {Amazon: sAmaz, Cloudfront: sCloud, Akamai: sAkai},
			X_Tags: {X_Edge: xedge, X_CDN: xcdn, X_Amz: xamz, X_Amzcf: xamzcf, X_Ms: xms},
			X_Cache: {X_Hit: xHit, X_Miss: xMiss, X_Cache_Hit: xCache},
			Distance: {Total: totalDistance, Objs: distanceObjs, Avg: avgDistance},
		}
		console.log(result);
		results.push(result);
		return result;
}

processAll(data);

// write to file 
fs.writeFileSync(fileName, JSON.stringify(results), (err) => {
  if(err) {
    console.log("Error While Writing");
  }
});


