/**
 * Created by Sandon on 2017/7/9.
 */
module.exports = class AttributeParser {
  constructor (str) {
    this.data = {}
    
    str = str.replace(/\s+(?==)/g, '')
    str = str.split('').reverse().join('')
    str = str.replace(/\s+(?==)/g, '')
    str = str.split('').reverse().join('')
    str = str.replace(/\s+/g, ' ')
    str.split(' ').forEach((item) => {
      if (!item)
        return
      let arr = item.split('=')
      this.data[arr[0]] = arr[1] || null
    })
  }
  /**
   * find the value according to ${key}
   * @param key
   * @returns any (String: the value; undefined: when ${key} don't exist; null: when ${key} exist, but don't have value)
   */
  getAttribute (key) {
    return this.data[key]
  }
}
