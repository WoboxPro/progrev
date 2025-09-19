export default {
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/seo'
  ],
  site: {
    url: 'https://tvojservis.ru'
  },
  css: [
    'maplibre-gl/dist/maplibre-gl.css'
  ],
  vite: {
    resolve: {
      alias: {
        'mapbox-gl': 'maplibre-gl'
      }
    }
  }
}


