const scrapeIt = require('scrape-it');

const matchUrl = /\/url\?q=(.+)\&sa/;
const convertUrl = (url) => {
  const captured = matchUrl.exec(url);
  return captured ? captured[1] : '';
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

const getSearchResults = (terms) => {
  const searchTerms = terms.split(/\s+/).join('+');
  const searchUrl = `http://www.google.com/search?q=${searchTerms}`;
  return scrapeIt( searchUrl, parse )
    .then( results => results.results )
    .then( results => results.filter( result => result.title !== '' ) )
    .then( results => results.filter( result => result.url !== '' ) );
};

module.exports = getSearchResults;