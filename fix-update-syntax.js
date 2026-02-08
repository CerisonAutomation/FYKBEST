const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, 'app/api/profiles/route.ts')
let content = fs.readFileSync(filePath, 'utf8')

// Fix the syntax error
const targetPattern = `.update({ ...updateData, updated_at: new Date().toISOString() } as any)
        ...updateData,
        updated_at: new Date().toISOString(),
      })`

const replacementPattern = `.update({ ...updateData, updated_at: new Date().toISOString() } as any)`

content = content.replace(targetPattern, replacementPattern)

fs.writeFileSync(filePath, content, 'utf8')
console.log('File updated successfully')
