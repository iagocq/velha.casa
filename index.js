import { globby } from 'globby';
import pug from 'pug';
import { minify as minifyHtml } from 'html-minifier';
import CleanCSS from 'clean-css';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';

const options = {};
const css = new CleanCSS(options);

const dirs = {
    templates: 'templates',
    statics: 'static',
    out: 'out',
    includes: 'includes'
};

const htmlOptions = {
    collapseWhitespace: true,
    minifyCSS: true,
};

const templates = await globby(`${dirs.templates}/**/*.pug`);
const statics = await globby(`${dirs.statics}/*`);

templates.forEach(v => {
    let out = v.replace(`${dirs.templates}/`, `${dirs.out}/`).replace('.pug', '.html');
    let rendered = pug.renderFile(v, { basedir: dirs.includes });
    let dir = out.split('/').slice(0, -1).join('/');
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }
    writeFileSync(out, minifyHtml(rendered, htmlOptions));
    console.log(v);
});

statics.forEach(v => {
    let out = v.replace(`${dirs.statics}/`, `${dirs.out}/`);
    var content = readFileSync(v);
    if (out.endsWith('.css')) {
        content = css.minify(content).styles;
    }
    writeFileSync(out, content);
});
