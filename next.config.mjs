/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin workspace root agar tidak crash saat "Applying modifyConfig from Vercel"
  // (Next 16 di Vercel: findRootDirAndLockFiles bisa balikin undefined).
  outputFileTracingRoot: process.cwd(),
  turbopack: {
    root: process.cwd(),
  },
  serverExternalPackages: ["@libsql/client"],
};

export default nextConfig;