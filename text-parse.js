const nlp = require('nlp_compromise');

const findPeople = (text) => {
  // Extract people data
  const people = nlp.text(text).people();

  // Filter out for first, middle and last names
  const peopleWithNames = people.filter( person => {
    return person.firstName !== null;
  })
  .map( person => {
    return {
      firstName: person.firstName,
      middleName: person.middleName || '',
      lastName: person.lastName || ''
    };
  });

  return peopleWithNames;
};

const findOrganizations = (text) => {
  // Extract org data
  return nlp.text(text).organizations();
};

const findNamedEntities = (text) => {
  return nlp.text(text).topics();
};

module.exports = {
  findPeople,
  findOrganizations,
  findNamedEntities
};

