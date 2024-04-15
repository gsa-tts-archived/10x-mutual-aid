const fs = require('fs');
const { parse } = require('csv-parse/sync');

module.exports = async function() {
  // Read and parse the first CSV file
  const csv1 = fs.readFileSync('./_data/Stantec_MABD_Export.csv', 'utf8');
  const data1 = parse(csv1, {
    columns: true,
    skip_empty_lines: true
  });

  // Read and parse the second CSV file
  const csv2 = fs.readFileSync('./_data/Mutual_Aid_Supply_Side_Contacts.csv', 'utf8');
  const data2 = parse(csv2, {
    columns: true,
    skip_empty_lines: true
  });

  // Organize contacts by organization and states
  let contactsByState = [];

  data2.forEach(contact => {
    contact['States Covered'].split(', ').forEach(state => {
      state = state.trim();
      const orgName = contact['Mutual Aid Org'].trim();
      let entry = contactsByState.find(entry => entry.state === state && entry.orgName === orgName);
      if (!entry) {
        entry = { state: state, orgName: orgName, contacts: [] };
        contactsByState.push(entry);
      }
      entry.contacts.push(contact);
    });
  });


  return {
    stantecMABD: data1,
    contactsByState
  };
};