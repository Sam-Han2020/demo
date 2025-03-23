const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        client: {
            overlay: false
        }
    },
    css: {
        loaderOptions: {
            scss: {
                implementation: require('sass')
            }
        }
    }
})
