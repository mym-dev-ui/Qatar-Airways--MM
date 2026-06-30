/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: [
        '*.replit.dev',
        '*.repl.co',
        '*.replit.app',
    ],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
