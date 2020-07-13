import fs from 'fs';
import os from 'os';
import { cloneDeep } from 'lodash';

const path = `${os.homedir()}/Downloads/diabetes/diabetes.geojson`;
const contents = fs.readFileSync(path);

const geojson = JSON.parse(contents);

let max = 0;
let min = 0;

console.log(`Munging ${geojson.features.length} features.`);
const features = geojson.features.map((ea, i) => {
    ea.properties = ea.properties || {};
    ea.properties.lower_limit = Number(ea.properties['Lower Limi']) || null;
    ea.properties.upper_limit = Number(ea.properties['Upper Limi']) || null;
    ea.properties.percentage = Number(ea.properties['Percentage']) || null;

    delete ea.properties['Lower Limi'];
    delete ea.properties['Upper Limi'];
    delete ea.properties['Percentage'];

    if (ea.properties.percentage > max) {
        max = ea.properties.percentage;
    }


    if (ea.properties.percentage < min) {
        min = ea.properties.percentage;
    }

    if ((i + 1) % 100 === 0) console.log(`Munged ${i + 1} features...`);

    return ea;
});

console.log(`Min/Max: ${min}/${max}`);

geojson.features = features;

console.log('Writing...');
fs.writeFileSync(path.replace('diabetes.geojson', 'diabetes-munged.geojson'), JSON.stringify(geojson));
console.log('Written.');