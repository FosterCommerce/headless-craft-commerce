import https from 'https';

// Whether the environment is local or staging/production based on Craft's .env
const isDev = process.env.CRAFT_ENVIRONMENT === 'dev';

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'server',
  ssr: true,

  // Source files directory
  srcDir: 'src/',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Dot All 2022',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/axios.js',
    '~/plugins/api.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/stylelint-module',
    '@nuxtjs/tailwindcss',
  ],

  // Set the port to 3000
  server: {
    host: '0.0.0.0',
    strictPort: true,
    port: 3000,
  },

  // Nuxt http options : https://http.nuxtjs.org/options
  axios: {
    proxyHeaders: false,
    credentials: true,
    proxy: true,
		httpsAgent: new https.Agent({
			rejectUnauthorized: !isDev,
		}),
  },

  proxy: {
		// This will proxy https://<nuxt host>/api/... to https://craft host/... _without_ the /api part.
		'/api': { target: process.env.CRAFT_BASE_URL, pathRewrite: { '^/api': '' }, secure: !isDev},
		// This will proxy https://<nuxt host>/graphql to https://<craft host>/graphql. The proxy module will include
		// the /graphql path unless it's explicitly removed with pathRewrite.
		'/graphql': { target: process.env.CRAFT_BASE_URL, secure: !isDev },
    '/*sitemap.xml': process.env.CRAFT_BASE_URL,
    '/*sitemap.xsl': process.env.CRAFT_BASE_URL,
    '/sitemap.xml': process.env.CRAFT_BASE_URL,
    '/sitemap.xsl': process.env.CRAFT_BASE_URL,
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxt/image',
    '@nuxtjs/proxy'
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // extend the webpack config
    extend(config) {
      config.resolve.alias.vue = 'vue/dist/vue.common';
      config.module.rules.push({
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      });
    },
  },

  // Environment configuration
  env: {
    currentEnv: process.env.CRAFT_ENVIRONMENT || 'dev',
    baseUrl: process.env.CRAFT_BASE_URL,
    stripePublicKey: process.env.STRIPE_PUB_KEY,
    ppClientId: process.env.PAYPAL_CLIENT_ID,
  },

  // server-only-runtime-config
  privateRuntimeConfig: {
    graphQLBearerToken: process.env.CRAFT_API_TOKEN,
    axios: {
      retry: 4,
    }
  },

  // Client runtime config
  publicRuntimeConfig: {
    baseURL: process.env.CRAFT_BASE_URL,
    axios: {
      retry: true,
    }
  }
}
