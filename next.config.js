/** @type {import('next').NextConfig} */
const nextConfig = {
  // Désactiver les optimisations coûteuses en dev
  reactStrictMode: false,
  
  // Optimiser la compilation
  swcMinify: true,
  
  // Optimiser les imports
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js', '@supabase/ssr'],
  },

  // Exclure le projet ai-story-forge du build
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ['**/ai-story-forge/**', '**/node_modules/**'],
        aggregateTimeout: 300,
      }
    }
    
    // Optimiser la compilation
    config.optimization = {
      ...config.optimization,
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false,
    }
    
    return config
  },
}

module.exports = nextConfig
