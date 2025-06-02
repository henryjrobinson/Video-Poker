/**
 * Custom Vite plugin to forcibly exclude test files and directories
 * from production builds
 */
export default function excludeTestImports() {
  const testPatterns = [
    'test-runner',
    'test-hands',
    'pattern-calculator.test',
    'edge-cases.test',
    '.spec.',
    '.test.',
    '__tests__',
    '/tests/',
    '@jest'
  ];

  return {
    name: 'exclude-test-imports',
    resolveId(id) {
      // Check if the current import should be excluded
      if (process.env.NODE_ENV === 'production') {
        for (const pattern of testPatterns) {
          if (id.includes(pattern)) {
            // Provide an empty module for this import
            return { id: 'virtual:empty-module' };
          }
        }
      }
      return null;
    },
    load(id) {
      // Return empty module for virtual module
      if (id === 'virtual:empty-module') {
        return 'export default {}; export const runTests = () => ({});';
      }
      return null;
    }
  };
}
