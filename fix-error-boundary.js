const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, 'components/king-app/MainApp.tsx')
let content = fs.readFileSync(filePath, 'utf8')

// Replace all ErrorBoundary fallbacks with static JSX
content = content.replace(
  /fallback={(error) => \(.*?\)}/s,
  'fallback={<div className="min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-950 text-white flex items-center justify-center"><div className="text-center max-w-md mx-auto p-8"><div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4"><span className="text-2xl">😵</span></div><h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h2><p className="text-slate-400 mb-6">An error occurred while rendering this component.</p><button onClick={() => window.location.reload()} className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-xl transition-colors">Try Again</button></div></div>}'
)

fs.writeFileSync(filePath, content, 'utf8')
console.log('Fixed ErrorBoundary fallbacks')
