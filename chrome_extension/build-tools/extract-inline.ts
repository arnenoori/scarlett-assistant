import { glob } from 'glob';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { djb2 } from './hash';

async function removeInlineScriptAndStyle(directory: string) {
  console.log('Removing Inline Scripts and Styles');
  const scriptRegx = /<script[^>]*>([\s\S]+?)<\/script>/g;
  const styleRegx = /<style[^>]*>([\s\S]+?)<\/style>/g;

  const files = glob.sync('**/*.html', { cwd: directory, dot: true, absolute: false });

  for (const file of files) {
    const filePath = join(directory, file);
    console.log(`Edit file: ${filePath}`);
    let f = await readFile(filePath, { encoding: 'utf-8' });

    let script;
    while ((script = scriptRegx.exec(f))) {
      const inlineScriptContent = script[1]
        .replace('__sveltekit', 'const __sveltekit')
        .replace(
          'document.currentScript.parentElement',
          'document.body.firstElementChild'
        );
      const fn = `/script-${djb2(inlineScriptContent)}.js`;
      f = f.replace(
        script[0],
        `<script type="module" src="${fn}"></script>`
      );
      await writeFile(`${directory}${fn}`, inlineScriptContent);
      console.log(`Inline script extracted and saved at: ${directory}${fn}`);
    }

    let style;
    while ((style = styleRegx.exec(f))) {
      const inlineStyleContent = style[1];
      const fn = `/style-${djb2(inlineStyleContent)}.css`;
      f = f.replace(
        style[0],
        `<link rel="stylesheet" href="${fn}" />`
      );
      await writeFile(`${directory}${fn}`, inlineStyleContent);
      console.log(`Inline style extracted and saved at: ${directory}${fn}`);
    }

    await writeFile(filePath, f);
  }
}

await removeInlineScriptAndStyle('../dist');