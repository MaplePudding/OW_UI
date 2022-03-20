const path = require('path');
const webpack = require('webpack');
const WebpackBarPlugin = require('webpackbar');
const getBabelConfig = require('./getBabelConfig');

const rootPath = path.join(__dirname, '../..')
module.exports = function(){
   return{
     mode: 'production',
     bail:true,
     devtool: 'source-map',
     entry: './index.ts',
     output:{
       filename: 'semi-ui.min.js',
       path: path.join(__dirname, 'dist/umd'),
       library: 'OWUI',
       libraryTarget: 'umd'
     },
     module:{
       rules:[
         {
           test: /\.(tsx|ts)$/,
           use: [
             {
               loader: 'ts-loader'
             }
           ],
           exclude: /node_modules/
         },
         {
           test: /\.(jsx|js)$/,
           include:[path.join(rootPath, 'packages/ow-ui')],
           use:[
             {
               loader: 'babel-loader',
               options: getBabelConfig()
             }
           ],
           exclude: /node_modules/
         },
         {
           test: /\.css$/,
           use:[
             {
               loader: 'css-loader'
             }
           ],
           exclude: /node_modules/
         }
       ],
     },
     plugins:[
       new webpack.DefinePlugin({
         'process.env': { NODE_ENV: '"production"', PUBLIC_URL: undefined }
       }),
       new WebpackBarPlugin()
     ],
     performance: { maxEntrypointSize: 10485760, maxAssetSize: 5242880 },
     resolve: {
       extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
     },
     externals:{
       react: {
         root: 'React',
         commonjs2: 'react',
         commonjs: 'react',
         amd: 'react'
       },
       'react-dom': {
         root: 'ReactDOM',
         commonjs2: 'react-dom',
         commonjs: 'react-dom',
         amd: 'react-dom'
       }
     }
   }
}