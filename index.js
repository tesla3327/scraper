const getSearchResults = require('./google');
const TextParse = require('./text-parse');
const Pagespeed = require('./pagespeed');
const Crawl = require('./crawl');

const logResultCount = (results) => {
  console.log(`Recieved ${results.length} results.`);
  return results;
};

const logResult = (result) => {
  console.log(result.hostname);
  return result;
};

const mapPageSpeedResult = (result) => {
  return Pagespeed.getResults(result.hostname)
    .then( insight => Object.assign({}, result, insight) );
};

const processResult = (result) => {
  mapPageSpeedResult( result )
    .then( logResult );
};

// getSearchResults('hello')
//   .then( logResultCount )
//   .then( results => {
//     results.forEach( processResult );
//   });

Crawl.crawlSite('http://www.sivers.org')
  .then( results => {
    console.log( results.map( result => {
      return {
        page: result.page,
        bodySize: result.body.length
      };
    }));
  });