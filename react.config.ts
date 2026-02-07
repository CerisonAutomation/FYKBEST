/**
 * React Compiler Configuration
 *
 * The React Compiler automatically memoizes components and hooks
 * to prevent unnecessary re-renders.
 *
 * @see https://react.dev/learn/react-compiler
 */

const ReactCompilerConfig = {
  // Enable compiler in all environments
  // In production, this optimizes your code automatically
  // In development, this helps catch issues early

  // Target React version
  target: '19',

  // Sources to compile (defaults to all files)
  sources: (filename: string) => {
    // Don't compile these files/patterns
    if (filename.includes('node_modules')) return false
    if (filename.includes('.test.')) return false
    if (filename.includes('.spec.')) return false
    if (filename.includes('__tests__')) return false
    return true
  },

  // Compilation mode
  // 'strict' - Full compilation with all optimizations
  // 'partial' - Only compile safe patterns
  mode: 'strict',

  // Enable additional logging in development
  debug: process.env.NODE_ENV === 'development',

  // Report compilation errors as warnings instead of errors
  panicThreshold: 'NONE',
}

export default ReactCompilerConfig
