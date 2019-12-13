module.exports = {
    // ...其它 vue-cli 插件选项...
    pwa:process.env.NODE_ENV === 'production' ? {}: {
      name: 'vue-ts',
      themeColor: '#4DBA87',
      msTileColor: '#000000',
      appleMobileWebAppCapable: 'yes',
      appleMobileWebAppStatusBarStyle: 'black',
  
      // 配置 workbox 插件
      workboxPluginMode: 'InjectManifest',
      workboxOptions: {
        // InjectManifest 模式下 swSrc 是必填的。
        swSrc: 'sw.js',
        // ...其它 Workbox 选项...
      }
    }
  }