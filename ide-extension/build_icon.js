const fs = require('fs');
const path = require('path');
const pngToIcoModule = require('png-to-ico');
const pngToIco = pngToIcoModule.default || pngToIcoModule;

const input = path.join(__dirname, 'icons', 'can.png');
const output = path.join(__dirname, 'icons', 'can.ico');

console.log(`Converting ${input} to ${output}...`);

pngToIco(input)
    .then(buf => {
        fs.writeFileSync(output, buf);
        console.log('Success! Icon generated.');
    })
    .catch(err => {
        if (err.code === 'ESIZE') {
            console.error('Error: The input image must be square (width = height). Please resize ide-extension/icons/can.png.');
        } else {
            console.error('Error generating icon:', err);
        }
    });