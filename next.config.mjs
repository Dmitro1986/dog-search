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
};

export default withNextIntl(nextConfig);
