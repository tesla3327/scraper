const request = require('request');
const url = require('url');
const cheerio = require('cheerio');
const _ = require('lodash');

/**
 * Fetch the contents of a single web page
 */
const crawlPage = (page) => {
  return new Promise( (resolve, reject) => {

    try {
      request(page, (err, response, body) => {
        if (err) {
          reject(err);
        } else {
          resolve(body);
        }
      });
    } catch (err) {
      console.error('Failed to fetch page:', page);
      console.error(err);
      reject(err);
    }

  });
};

const crawlListOfPages = (pages) => {
  return Promise.all(
    pages.map( page => {
      return crawlPage(page).then( body => {
        return { page, body };
      });
    })
  );
};

const isValidPageUrl = (_url) => {
  return url.parse(_url).protocol === 'http:' ||
         url.parse(_url).protocol === 'https:';
};

const getHostname = (_url) => {
  let hostname = url.parse(_url).hostname;

  if (hostname && hostname[0] === 'w' && hostname[1] === 'w' && hostname[2] === 'w') {
    hostname = hostname.substr(4);
  }

  return hostname;
};

/**
 * If there is no hostname, we need to resolve
 * to the current location.
 */
const cleanupHref = (_url, host) => {
  try {
    let clean = url.parse(_url);

    // If hostname is null it should be the same as our 
    if (clean.hostname === null) {
      clean.hostname = host;
    }

    // If no protocol, add http as default
    if (clean.protocol === null) {
      clean.protocol = 'http:';
    }

    return url.format(clean);
  } catch (e) {
    console.error('Error with url:', _url);
    console.error(e);
    return '';
  }
};

const getUrlsFromPage = (host, html) => {
  const $ = cheerio.load(html);
  const nextLinks = [];

  $('a').each( (i, elem) => {
    let href = $(elem).attr('href') || '';
    href = cleanupHref(href, host);

    if (getHostname(href) === host) {
      nextLinks.push(href);
    }
  });

  // We want the first 10 unique links
  return _.uniq(nextLinks).slice(0, 10);
};

/**
 * Fetch the contents of the first 10 unique URLs
 * that are linked to on the site, and are also
 * on the same host as the site url.
 *
 * (we are crawling 1 link deep, with a max of 10 pages)
 */
const crawlSite = (site) => {
  const host = getHostname(site);

  return crawlPage(site)
    .then( getUrlsFromPage.bind(null, host) )
    .then( crawlListOfPages )
    .catch( err => console.error(err) );
};

module.exports = {
  crawlSite
};