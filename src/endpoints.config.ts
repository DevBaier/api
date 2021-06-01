const dotenv = require('dotenv');
let path;
if(process.env.NODE_ENV === 'production') {
  path = {path: 'dist' + '/.env'};
} else {
  path = {path: __dirname + '/.env'};
}
const result = dotenv.config(path);
if (result.error) {
  throw result.error;
}
const { parsed: envs } = result;
//console.log(envs);
module.exports = envs;