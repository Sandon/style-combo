/**
 * Created by Sandon on 2017/7/2.
 */
const {URL} = require('url')
const AttributeParser = require('./lib/AttributeParser')

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
      const attrParser = new AttributeParser(propertyStr)
      const groupName = attrParser.getAttribute(GROUP_PROPERTY_NAME) || 'default'
      let styleUrl = attrParser.getAttribute('src')
      styleUrl = styleUrl.slice(1, styleUrl.length - 1)
      const container = attrParser.getAttribute(POS_PROPERTY_NAME) === POS_HEADER_VALUE
        ? styleContainer.scripts.posHeader
        : styleContainer.scripts.posFooter
      
      addUrl(container, groupName, styleUrl)
    } else {
      const attrParser = new AttributeParser(result[3])
      const groupName = attrParser.getAttribute(GROUP_PROPERTY_NAME) || 'default'
      let styleUrl = attrParser.getAttribute('href')
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
      combinedLinks += `<link href="${origin.origin}??${origin.paths.join(',')}">`
    })
  })
  
  let combinedHeaderScripts = ''
  styleContainer.scripts.posHeader.forEach((group) => {
    group.origins.forEach((origin) => {
      combinedHeaderScripts ? combinedHeaderScripts += '\n' : ''
      combinedHeaderScripts += `<script src="${origin.origin}??${origin.paths.join(',')}"></script>>`
    })
  })
  
  let combinedFooterScripts = ''
  styleContainer.scripts.posFooter.forEach((group) => {
    group.origins.forEach((origin) => {
      combinedFooterScripts ? combinedFooterScripts += '\n' : ''
      combinedFooterScripts += `<script src="${origin.origin}??${origin.paths.join(',')}"></script>`
    })
  })
  /* 3. remove all <script> and <link> elements */
  html = html.replace(reg, '')
  
  /* 4. insert combined <script> and <link> elements */
  const headEnd = /(?=<\/head>)/g
  const bodyEnd = /(?=<\/body>)/g
  html = html.replace(headEnd, combinedLinks)
  html = html.replace(headEnd, combinedHeaderScripts)
  html = html.replace(bodyEnd, combinedFooterScripts)
  
  return html
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
