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
                hostname: "images.unsplash.com", // untuk hero image
            },
            {
                protocol: "https",
                hostname: "qcizbglhafqgrphobbly.supabase.co", // Tambahkan hostname Supabase di sini
            },
        ],
    },
};

export default nextConfig;