import AWS from 'aws-sdk';
import mbxUploads from '@mapbox/mapbox-sdk/services/uploads';
import os from 'os';
import dotenv from 'dotenv';
import fetch from 'isomorphic-fetch';
dotenv.config();

const uploadsClient = mbxUploads({ accessToken: process.env.MAPBOX_ACCESS_TOKEN });

const homedir = os.homedir();
const file = `${homedir}/Downloads/diabetes/diabetes-munged.geojson`;
let url = null;

async function run() {
    try {
        const credentialsReq = await uploadsClient.createUploadCredentials().send();
        const { body: credentials } = credentialsReq;
        console.log(credentials);

        if (!url) {
            const putFileOnS3 = (file) => {
                const s3 = new AWS.S3({
                    accessKeyId: credentials.accessKeyId,
                    secretAccessKey: credentials.secretAccessKey,
                    sessionToken: credentials.sessionToken,
                    region: 'us-east-1'
                });
                return s3.putObject({
                    Bucket: credentials.bucket,
                    Key: credentials.key,
                    Body: fs.createReadStream(file)
                }).promise();
            };
            
            console.log('Putting on S3:', file);
            await putFileOnS3(file);
            url = credentials.url;
        }

        console.log('Initiating MB upload for:', url);
        const uploadReq = await fetch(`https://api.mapbox.com/uploads/v1/${process.env.MAPBOX_USERNAME}?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                tileset: `${process.env.MAPBOX_USERNAME}.diabetes-us`,
                url,
                name: 'diabetes-us'
            })
        });
        const uploadRes = await uploadReq.json();
        console.log(uploadRes);
    } catch(e) {
        console.log('Something went wrong.', e);
    }
}

run();