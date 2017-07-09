/**
 * Created by Sandon on 2017/7/8.
 */
/*const url = require('url');
const myURL =
  url.parse('https://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash');*/

const { URL } = require('url');
const myURL = new URL('https://www.demo.com/path/style1.csc') // new URL('https://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash');

console.log(myURL)

