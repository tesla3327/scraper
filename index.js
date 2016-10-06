const getSearchResults = require('./google');
const TextParse = require('./text-parse');
const Pagespeed = require('./pagespeed');

getSearchResults('hello')
  .then( results => {
    console.log(`Received ${results.length} results.`);
    // const longDesc = results.map( result => result.description )
    //                     .join(' ');

    // const people = TextParse.findPeople(longDesc);
    // const orgs = TextParse.findOrganizations(longDesc);
    // const entities = TextParse.findNamedEntities(longDesc);

    results.forEach( result => {
      Pagespeed.getResults(result.url, result.title, 'mobile', true)
        .then( () => console.log(`Pagespeed data for: ${result.url} - ${result.title}`) );
    });

  });

Pagespeed.getResults('http://news.ycombinator.com', 'mobile', true);