import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;