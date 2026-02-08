const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, 'app/api/profiles/route.ts')
let content = fs.readFileSync(filePath, 'utf8')

// Fix syntax error
content = content.replace('.insert({ as any', '.insert({')
content = content.replace('      })', '      } as any)')

fs.writeFileSync(filePath, content, 'utf8')
console.log('File updated successfully')
