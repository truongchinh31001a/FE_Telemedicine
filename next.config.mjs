/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        allowedDevOrigins: ['http://192.168.1.30:3000'], // địa chỉ IP local bạn đang dùng
    },
};

export default nextConfig;
