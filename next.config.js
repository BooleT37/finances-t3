/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["ru"],
    defaultLocale: "ru",
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/data",
        permanent: true,
      },
    ];
  },
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
  transpilePackages: [
    "geist",
    "antd",
    "@ant-design",
    "rc-util",
    "rc-tree",
    "rc-table",
    "rc-pagination",
    "rc-picker",
    "rc-notification",
    "rc-tooltip",
  ],
  experimental: {
    outputFileTracingIncludes: {
      "/api/parse-pdf-expenses": [
        "./node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs",
      ],
    },
  },
};
export default config;
