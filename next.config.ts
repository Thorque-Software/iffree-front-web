import type { NextConfig } from "next";

let nextConfig: NextConfig = {};

if (process.env.ENV == "prod") {
    nextConfig = {
        basePath: '/app',
        assetPrefix: '/app/',
        output: 'standalone',
        // Otras configuraciones...
    }
}

export default nextConfig;
