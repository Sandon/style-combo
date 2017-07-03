/**
 * Created by Sandon on 2017/7/2.
 */
const styleCombo =  require('../index')
const path = require('path')
const fs = require('fs')
const util = require('util')

const readFile = util.promisify(fs.readFile)

readFile(path.join(__dirname, './html/index.html'), 'utf-8').then((html) => {
  styleCombo(html)
})
