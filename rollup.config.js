// 将CommonJS模块转换为ES6
import commonjs from '@rollup/plugin-commonjs';
// 处理 .vue SFC 文件
import vue from 'rollup-plugin-vue';
// 通过合理的浏览器支持进行转译/填充
import buble from '@rollup/plugin-buble';
// 压缩打包
import { terser } from 'rollup-plugin-terser'; 
// 将标头添加到已编译的JS文件中
import banner from 'rollup-plugin-banner'; 
// 填充Nodejs相关模块
import nodePolyfills from 'rollup-plugin-node-polyfills';
// 可删除注释，修剪尾部空格，压缩空行并规范JavaScript文件中的行尾
import cleanup from 'rollup-plugin-cleanup';

const path = require('path');

const globals = {
    vue: 'Vue',
    'vue-i18n': 'VueI18n',
    'vue-router': 'VueRouter',
};

export default {
    input: './src/main.js',
    external: [
        'vue',
        'vue-i18n',
        'vue-router',
    ],
    plugins: [
        commonjs(),
        nodePolyfills(),
        vue({
			css: true, // Dynamically inject css as a <style> tag
			template: {
				isProduction: true, // Force productiom mode
			},
        }),
        buble(), // Transpile to ES5
        banner({
			file: path.join(__dirname, 'rollup.banner.txt'),
        }),
        cleanup({
			comments: 'none',
			sourcemap: false,
			maxEmptyLines: 0,
		}),
    ],
    output: [{
            format: 'cjs',
            file: './lib/index.cjs.js',
            name: 'VueCobraRouter',
            exports: 'named',
            globals,
        },
        {
            file: './lib/index.es.js',
            format: 'es',
        },
        {
            format: 'umd',
            file: './lib/index.umd.js',
            name: 'VueCobraRouter',
            exports: 'named',
            globals,
        },
        {
            format: 'iife',
            file: './lib/index.min.js',
            name: 'VueCobraRouter',
            exports: 'named',
			globals,
            plugins: [ terser() ],
		},
    ],
};