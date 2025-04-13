const fs = require('fs');
const path = require('path'); // Corrected path module import
const csv = require('csv-parser');

const loadAllowedEmails = () => {
    return new Promise((resolve, reject) => {
        const allowedEmails = [];
        fs.createReadStream(path.join(__dirname, '../whitelist.csv'))
            .pipe(csv())
            .on('data', (row) => {
                allowedEmails.push(row.email);
            })
            .on('end', () => {
                resolve(allowedEmails);
            })
            .on('error', reject);
    });
};

module.exports = loadAllowedEmails;
