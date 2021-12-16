/*!

=========================================================
* Nuxt Argon Dashboard Laravel - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nuxt-argon-dashboard-laravel
* Copyright Creative Tim (https://www.creative-tim.com) & UPDIVISION (https://www.updivision.com)

* Coded by www.creative-tim.com & www.binarcode.com & www.updivision.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

const pkg = require("./package");
console.log("ENV", process.env.NODE_ENV);
const { default: isDemo } = require("./plugins/isDemo");

module.exports = {
  env: {
    apiUrl: process.env.API_BASE_URL,
    baseUrl: process.env.NUXT_APP_BASE_URL,
    isDemo: process.env.IS_DEMO,
    apiKey: process.env.API_KEY,
  },
  ssr: false,
  router: {
    base: "/login",
    linkExactActiveClass: "active"
  },
  meta: {
    ogType: false,
    ogDescription: false,
    author: false,
    ogTitle: false,
    description: false,
    viewport: false,
    charset: false,
   },
  /*
   ** Headers of the page
   */
  head: {
    title: "Smart halal investor Club Admin Dashboard",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content:
          "Smart halal investor Club Admin Dashboard"
      },
      {
        name: "keywords",
        content:
          "Halal Investment, Investor, shic, Smart Halal Investor Club, Investment Club"
      },
      {
        itemprop: "name",
        content: "Smart halal investor Club Admin Dashboard"
      },
      {
        itemprop: "description",
        content:
          "Smart halal investor Club where you can invest in an halal way"
      },
      {
        itemprop: "image",
        content:
          "https://smarthalalinvestorclub.com/_nuxt/img/shic-logo.5e57c7b.svg"
      },
    ],
    link: [
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700"
      },
      {
        rel: "stylesheet",
        href: "https://use.fontawesome.com/releases/v5.6.3/css/all.css",
        integrity:
          "sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/",
        crossorigin: "anonymous"
      }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },

  /*
   ** Global CSS
   */
  css: [
    "assets/css/nucleo/css/nucleo.css",
    "assets/sass/argon.scss",
    "~assets/css/style.css"
  ],

  router: {
    // middleware: ['auth']
  },
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "~/plugins/dashboard/dashboard-plugin",
    { src: "~/plugins/dashboard/world-map", ssr: false },
    {
      src: '~plugins/vue-js-modal.js',
      ssr: false,
    },
    "~/plugins/dashboard/JsonApi.js",
    "~/plugins/isDemo.js",
    "~/plugins/axios.js",
    {
      src: '~/plugins/persistedState.client.js',
    },
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    "@nuxtjs/pwa",
    "@nuxtjs/auth",
    "@nuxtjs/toast"
  ],

  /*
   ** Notification toast module configuration
   ** See https://github.com/nuxt-community/modules/tree/master/packages/toast?ref=madewithvuejs.com
   */
  toast: {
    position: "top-right",
    duration: 5000,
    keepOnHover: true,
    fullWidth: false,
    fitToScreen: true,
    className: "vue-toast-custom",
    closeOnSwipe: true,
    register: [
      // Register custom toasts
      // @todo add custom messages as they come : login failed, register failed etc
      {
        name: "my-error",
        message: "Oops...Something went wrong",
        options: {
          type: "error"
        }
      }
    ]
  },

  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    // http://209.97.136.114/api/v1
    baseURL: process.env.NODE_ENV === 'development' ? 'http://209.97.136.114/api/v1' : 'https://apiv1.smarthalalinvestorclub.com/api/v1',
    headers: {
      common: {
        'Access-Control-Allow-Origin': '*',
      },
    },
  },

  /*
   ** Build configuration
   */
  build: {
    transpile: ["vee-validate/dist/rules"],
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
    extractCSS: process.env.NODE_ENV === "production",
    babel: {
      plugins: [
        [
          "component",
          {
            libraryName: "element-ui",
            styleLibraryName: "theme-chalk"
          }
        ]
      ]
    }
  }
};
