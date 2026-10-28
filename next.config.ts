import type { NextConfig } from 'next';
const repo = 'northstar-academy';
const config: NextConfig = {output:'export', trailingSlash:true, basePath: process.env.GITHUB_PAGES === 'true' ? `/${repo}` : '', images:{unoptimized:true}};
export default config;
