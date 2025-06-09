import nextIntlPlugin from 'next-intl/plugin';

const withNextIntl = nextIntlPlugin('./src/i18n/request.ts');

const nextConfig = {
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Webpack конфигурация для решения проблем с SSR и flowise-embed-react
  webpack: (config, { isServer }) => {
    // Настройки для клиентской части
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }
    
    // Исключаем проблемные модули из серверного bundle
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push({
        'flowise-embed-react': 'commonjs flowise-embed-react'
      });
    }
    
    return config;
  },
  
  // Экспериментальные настройки для улучшения производительности
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons']
  },
};

export default withNextIntl(nextConfig);
