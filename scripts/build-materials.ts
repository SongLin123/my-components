/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
import { build } from 'vite';
import pluginVue from '@vitejs/plugin-vue';
import pluginVueJsx from '@vitejs/plugin-vue-jsx';
import { resolvePackagePath, readFile, wirteFile } from './util';
// import { pushMaterialToCDN } from '../packages/mock-cdn';
import type { InlineConfig } from 'vite';
import * as TJS from 'typescript-json-schema';
import { readdirSync } from 'fs';

type TMaterialInfo = {
  name:string,
  version:string,
  data: Record<string,string|null> 
}

function buildTypeSchema(opts: { dirName: string }) {
  const { dirName } = opts;
  const basePath = resolvePackagePath(dirName);
  const filePath = resolvePackagePath(dirName, 'src', 'types.ts');
  const distPath = resolvePackagePath(dirName, 'dist', 'props.schema.json');
  const settings: TJS.PartialArgs = {
    // required: true,
    // titles: true
  };
  const compilerOptions: TJS.CompilerOptions = {
    strictNullChecks: true
  };
  const program = TJS.getProgramFromFiles(
    [filePath],
    compilerOptions,
    basePath
  );
  const schema = TJS.generateSchema(program, 'MaterialProps', settings);
  const schemaStr = JSON.stringify(schema, null, 2);
  wirteFile(distPath, schemaStr);
}

function getBuildConfig(opts: {
  name: string;
  version: string;
  dirName: string;
  libName: string;
}): InlineConfig {
  const { dirName, libName } = opts;
  const config: InlineConfig = {
    plugins: [pluginVue(), pluginVueJsx()],
    build: {
      target: 'esnext',
      minify: false,
      emptyOutDir: true,
      outDir: resolvePackagePath(dirName, 'dist'),
      lib: {
        name: libName,
        entry: resolvePackagePath(dirName, 'src', 'index.ts'),
        formats: ['es'],
        fileName: () => 'index.esm.js'
      },
      rollupOptions: {
        preserveEntrySignatures: 'strict',
        external: ['vue', '@vue/components'],
        output: {
          globals: {
            vue: 'Vue',
            '@vue/components': 'MyVueComponents'
          },
          assetFileNames: 'index[extname]'
        }
      }
    }
  };
  return config;
}

function readMaterialInfo(materialDirName: string):TMaterialInfo {
  const pkgFile = resolvePackagePath(materialDirName, 'package.json');
  const pkg = require(pkgFile);
  const cssFile = resolvePackagePath(materialDirName, 'dist', 'index.css');
  const esmFile = resolvePackagePath(materialDirName, 'dist', 'index.esm.js');
  const propsSchemaFile = resolvePackagePath(
    materialDirName,
    'dist',
    'props.schema.json'
  );

  const css = readFile(cssFile);
  const esm = readFile(esmFile);
  const propsSchema = readFile(propsSchemaFile);
  const name: string = pkg?.name || '';
  const version: string = pkg?.version || '';
  return {
    name,
    version,
    data: { css, esm, propsSchema }
  };
}

function pushMaterialToCDN(info:TMaterialInfo){
  console.log(info)
}

async function main() {
  console.log('执行物料编译...');

  const sources = await readdirSync(resolvePackagePath('material'));

  const materialList = sources.map((itemName) => ({
    name: require(`../packages/material/${itemName}/package.json`).name,
    version: require(`../packages/material/${itemName}/package.json`).version,
    dirName: `material/${itemName}`,
    libName: itemName
      .replace(/-(\w)/g, (match, p1) => p1.toUpperCase())
      .replace(/^\w/, (match) => match.toUpperCase())
  }));

  for (const opts of materialList) {
    console.log(`开始编译物料 ${opts.dirName}  版本v${opts.version}`);
    const config = getBuildConfig(opts);
    await build(config);
    await buildTypeSchema({ dirName: opts.dirName });
    console.log(`推送物料${opts.dirName} 版本v${opts.version}到模拟CDN...`);
    const info = readMaterialInfo(opts.dirName);

    await pushMaterialToCDN(info);
  }
}

main();
