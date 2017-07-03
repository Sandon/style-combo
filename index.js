/**
 * Created by Sandon on 2017/7/2.
 */

let reg = /<(\/?)(script|link)(\s*([^>\s]*?)\s*=\s*([^>\s]*?)\s*)*(\/?)>/g
reg = /<(\/?)(script|link)([^>]*?)(\/?)>/g
reg = /<(\/?)(script|link)((?![^>]*(async|defer|nocombo))([^>]*))(\/?)>/g
const domainReg = /^http(s?):\/\/.+\//g

module.exports = module.exports.default = (html) => {
  let allStyle = {links: {}, scripts: {}}
  /* 1. find all <script> and <link> elements */
  let result
  reg.lastIndex = 0
  while ((result = reg.exec(html)) !== null) {
    console.log(result)
    if ('/' === result[1])
      continue
    
    if ('script' === result[2]) {
      const url = getAttribute(result[3], 'src')
      const host = getHost(url)
      
    } else {
      let url = getAttribute(result[3], 'href')
    }
  }
  
  /* 2. remove all <script> and <link> elements */
  html.replace(reg, '')
  
  /* 3. insert combined <script> and <link> elements */
}

/**
 * find the value according to ${key} from ${str}
 * @param str
 * @param key
 * @returns any (String: the value; undefined: when ${key} don't exist; null: when ${key} exist, but don't have value)
 */
function getAttribute (str, key) {
  let ret
  str.replace(/\s+(?==)|(?<==)\s+/g, '').split(' ').find((item) => {
    if (!item)
      return false
    let arr = item.split('=')
    if (key === arr[0].trim()) {
      ret = arr.length === 2 ? arr[1].trim() : null
      return true
    }
  })
  return ret
}

function getHost (url) {
  domainReg.lastIndex = 0
  let result = domainReg.exec(url)
  if (!result) {
    return result
  } else {
    return result[0]
  }
}
