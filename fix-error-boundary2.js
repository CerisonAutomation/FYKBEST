const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, 'components/king-app/MainApp.tsx')
let content = fs.readFileSync(filePath, 'utf8')

// Find the ErrorBoundary with function fallback and replace with static fallback
content = content
  .split('\n')
  .map((line) => {
    if (line.includes('ErrorBoundary') && line.includes('fallback={(error)')) {
      return '      <ErrorBoundary fallback={<div className="text-center text-red-500">Something went wrong</div>}'
    }
    return line
  })
  .join('\n')

fs.writeFileSync(filePath, content, 'utf8')
console.log('Fixed ErrorBoundary function fallback')
