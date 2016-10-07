const scrapeIt = require('scrape-it');
const _ = require('lodash');
const url = require('url');

const matchUrl = /\/url\?q=(.+)\&sa/;
const convertUrl = (_url) => {
  const regResults = matchUrl.exec(_url);
  return regResults ? regResults[1] : '';
};

const parse = {
  results: {
    listItem: '.g',
    data: {
      title: 'h3',
      url: {
        selector: 'h3 a',
        attr: 'href',
        convert: convertUrl
      },
      description: 'span.st',
    }
  }
};

const addHostName = (result) => {
  return Object.assign(
    {},
    result,
    { hostname: url.parse(result.url).hostname }
  );
};

const getSearchResults = (terms) => {
  const searchTerms = terms.split(/\s+/).join('+');
  const searchUrl = `http://www.google.com/search?q=${searchTerms}`;
  return scrapeIt( searchUrl, parse )
    .then( results => results.results )
    .then( results => results.filter( result => result.title ) )
    .then( results => results.filter( result => result.title !== '' ) )
    .then( results => results.filter( result => result.url ) )
    .then( results => results.filter( result => result.url !== '' ) )
    .then( results => results.map( addHostName ) )
    .then( results => _.uniqBy( results, 'hostname' ) );
};

module.exports = getSearchResults;