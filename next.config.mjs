/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "antd",
    "rc-util",
    "@babel/runtime",
    "@ant-design/icons",
    "@ant-design/icons-svg",
    "rc-pagination",
    "rc-picker",
    "rc-tree",
    "rc-table",
  ],
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: "AIzaSyAphPE1n9777kBEnZL_gtPuTv7IaR8Jll0",
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "tuan-shopping-app.firebaseapp.com",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: "tuan-shopping-app",
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "tuan-shopping-app.appspot.com",
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "389902582248",
    NEXT_PUBLIC_FIREBASE_APP_ID: "1:389902582248:web:25fa2e736ea72a0223a45d",
  },
};

export default nextConfig;
