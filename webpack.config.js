const path = require('path');
const webpack = require('webpack');

module.exports= {
    
    entry:'./public/js/app.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, './public/dist')
    },
    module: {
        rules: [
          {
            // JS
            test: /\.m?js$/, // expresion regular que busca todos los archivos JS
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }
        ]
      },
    
}
  
  