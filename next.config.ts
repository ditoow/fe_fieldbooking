import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "qcizbglhafqgrphobbly.supabase.co",
            },
            {
                protocol: "https",
                hostname: "ruvikuwgtggtcmksafts.supabase.co",
            },
        ],
    },
    experimental: {
        cpus: 2,
    },
};

export default nextConfig;