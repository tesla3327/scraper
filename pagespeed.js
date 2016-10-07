const fetch = require('node-fetch');
const key = 'AIzaSyCr4SG3mdb7GD0bSnVJB69UvBxcbdZQ5bY';
const fs = require('fs');
const path = require('path');

/**
 * Fetches a single pagespeed insight and saves an optional screenshot to disk
 */
const fetchInsight = (url, strategy = 'mobile', screenshot = false) => {
  return fetch(`https://www.googleapis.com/pagespeedonline/v2/runPagespeed?url=http://${url}&screenshot=${screenshot ? 'true' : 'false'}&strategy=${strategy}&key=${key}`)
    .then( data => data.json() )
    .then( data => {
      let imgPath = '';
      if (screenshot && data.screenshot && data.screenshot.data) {
        const image = Buffer.from(data.screenshot.data, 'base64');
        imgPath = path.resolve(__dirname, `./images/${url}.${strategy}.jpg`);
        fs.writeFileSync( imgPath, image, 'binary');

        // Remove from json
        delete data.screenshot.data;
        data.screenshot.path = imgPath;
      }

      // Indicate progress
      console.log('.');

      return {
        insights: data,
        screenshotPath: imgPath
      };
    });
};

/**
 * Gets mobile and desktop pagespeed insights for a single url
 */
const getResults = (url, screenshot = true) => {
  return Promise.all([
    fetchInsight(url, 'mobile', screenshot),
    fetchInsight(url, 'desktop', screenshot)
  ]).then( insights => {
    return {
      mobile: insights[0],
      desktop: insights[1]
    };
  });
};

module.exports = {
  getResults,
};