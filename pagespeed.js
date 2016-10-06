const fetch = require('node-fetch');
const key = 'AIzaSyCr4SG3mdb7GD0bSnVJB69UvBxcbdZQ5bY';
const fs = require('fs');
const path = require('path');

const getResults = (url, title, strategy = 'mobile', screenshot = false) => {
  return fetch(`https://www.googleapis.com/pagespeedonline/v2/runPagespeed?url=${url}&screenshot=${screenshot ? 'true' : 'false'}&strategy=${strategy}&key=${key}`)
    .then( data => data.json() )
    .then( data => {
      if (screenshot) {
        const image = Buffer.from(data.screenshot.data, 'base64');
        fs.writeFileSync( './images/' + title + '.jpg', image, 'binary');
      }
      return data;
    });
};

module.exports = {
  getResults,
};