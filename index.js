/**
 * Created by Sandon on 2017/7/2.
 */
const {URL} = require('url')

const reg = /<(\/?)(script|link)((?![^>]*(async|defer|nocombo))[^>]*)(\/?)>/g
// const domainReg = /^(http(s?):\/\/.+\/)(.+)(\?|^)/g

const POS_PROPERTY_NAME = 'data-sc-pos'
const POS_FOOTER_VALUE = 'footer'
const POS_HEADER_VALUE = 'header'
const GROUP_PROPERTY_NAME = 'data-sc-group'

module.exports = module.exports.default = (html) => {
  let styleContainer = {
    links: [
    ],
    scripts: {
      posHeader: [],
      posFooter: []
    }
  }
  /* 1. find all <script> and <link> elements */
  let result
  reg.lastIndex = 0
  while ((result = reg.exec(html)) !== null) {
    if ('/' === result[1])
      continue
    
    if ('script' === result[2]) {
      const len = result[0].length
      const end = result[0][len - 2] === '/' ? len -2 : len - 1
      const propertyStr = result[0].slice(8, end)
      const groupName = getAttribute(propertyStr, GROUP_PROPERTY_NAME) || 'default'
      let styleUrl = getAttribute(propertyStr, 'src')
      styleUrl = styleUrl.slice(1, styleUrl.length - 1)
      const container = getAttribute(propertyStr, POS_PROPERTY_NAME) === POS_HEADER_VALUE
        ? styleContainer.scripts.posHeader
        : styleContainer.scripts.posFooter
      
      addUrl(container, groupName, styleUrl)
    } else {
      const groupName = getAttribute(result[3], GROUP_PROPERTY_NAME) || 'default'
      let styleUrl = getAttribute(result[3], 'href')
      styleUrl = styleUrl.slice(1, styleUrl.length - 1)
      const container = styleContainer.links
      
      addUrl(container,groupName, styleUrl)
    }
  }
  
  /* 2. construct combined <script> and <link> */
  let combinedLinks = ''
  styleContainer.links.forEach((group) => {
    group.origins.forEach((origin) => {
      combinedLinks ? combinedLinks += '\n' : ''
      combinedLinks += `<link href="${origin.origin}/??${origin.paths.join(',')}">`
    })
  })
  
  let combinedHeaderScripts = ''
  styleContainer.scripts.posHeader.forEach((group) => {
    group.origins.forEach((origin) => {
      combinedHeaderScripts ? combinedHeaderScripts += '\n' : ''
      combinedHeaderScripts += `<script src="${origin.origin}/??${origin.paths.join(',')}"></script>>`
    })
  })
  
  let combinedFooterScripts = ''
  styleContainer.scripts.posFooter.forEach((group) => {
    group.origins.forEach((origin) => {
      combinedFooterScripts ? combinedFooterScripts += '\n' : ''
      combinedFooterScripts += `<script src="${origin.origin}??${origin.paths.join(',')}"></script>`
    })
  })
  console.log(combinedLinks)
  console.log(combinedHeaderScripts)
  console.log(combinedFooterScripts)
  /* 3. remove all <script> and <link> elements */
  //html.replace(reg, '')
  
  /* 4. insert combined <script> and <link> elements */
}

/**
 * find the value according to ${key} from ${str}
 * @param str
 * @param key
 * @returns any (String: the value; undefined: when ${key} don't exist; null: when ${key} exist, but don't have value)
 */
function getAttribute (str, key) {
  let ret
  str = str.replace(/\s+(?==)/g, '')
  str = str.split('').reverse().join('')
  str = str.replace(/\s+(?==)/g, '')
  str = str.split('').reverse().join('')
  str = str.replace(/\s+/g, ' ')
  str.split(' ').find((item) => {
    if (!item)
      return false
    let arr = item.split('=')
    if (key === arr[0]) {
      ret = arr.length === 2 ? arr[1] : null
      return true
    }
  })
  return ret
}

function addUrl (container, groupName, styleUrl) {
  styleUrl = new URL(styleUrl)
  const stylePathName = styleUrl.pathname.slice(1)
  const styleOrigin = styleUrl.origin + '/'
  
  const group = container.find((group) => group.groupName === groupName)
  if (!group) {
    container.push({
      groupName: groupName,
      origins: [{
        origin: styleOrigin,
        paths: [
          stylePathName
        ]
      }]
    })
    return
  }
  
  const origin = group.origins.find((origin) => origin.origin === styleOrigin)
  if (!origin) {
    group.origins.push({
      origin: styleOrigin,
      paths: [
        stylePathName
      ]
    })
  }
  
  origin.paths.push(stylePathName)
}
