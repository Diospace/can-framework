import * as fs from 'fs';
import * as path from 'path';

export function create(projectName: string) {
    if (!projectName) {
        console.error('Please specify a project name: can create <project-name>');
        return;
    }

    const root = path.join(process.cwd(), projectName);

    if (fs.existsSync(root)) {
        console.error(`Directory ${projectName} already exists.`);
        return;
    }

    console.log(`Creating project in ${root}...`);
    fs.mkdirSync(root);
    fs.mkdirSync(path.join(root, 'public'));
    fs.mkdirSync(path.join(root, 'src'));
    fs.mkdirSync(path.join(root, 'api'));
    fs.mkdirSync(path.join(root, 'build'));
    fs.mkdirSync(path.join(root, 'src', 'components'));

    // Create package.json
    const packageJson = {
        name: projectName,
        version: "0.1.0",
        scripts: {
            "dev": "can dev",
            "build": "can build",
            "serve": "can serve",
            "ssg": "can ssg",
            "disk": "can disk",
            "preview": "can preview"
        },
        "dependencies": {
            "@decaspace/can-framework": "^1.0.4"
        },
        "devDependencies": {
            "typescript": "^5.7.2",
            "@types/node": "^22.10.2",
            "tsx": "^4.0.0"
        }
    };
    fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(packageJson, null, 2));

    // Create tsconfig.json to ensure TypeScript and IDEs recognize the environment and .can files
    const tsconfigJson = {
        compilerOptions: {
            baseUrl: ".",
            paths: {
                "@/*": ["src/*"],
                "@api/*": ["api/*"],
                "@build/*": ["build/*"]
            },
            target: "ESNext",
            module: "ESNext",
            moduleResolution: "Bundler",
            lib: ["ESNext", "DOM", "DOM.Iterable"],
            useDefineForClassFields: true,
            strict: true,
            esModuleInterop: true,
            skipLibCheck: true,
            forceConsistentCasingInFileNames: true,
            allowJs: true,
            resolveJsonModule: true,
            isolatedModules: true,
            ignoreDeprecations: "5.0",
            types: ["node"]
        },
        include: ["src/**/*", "api/**/*", "build/**/*"]
    };
    fs.writeFileSync(path.join(root, 'tsconfig.json'), JSON.stringify(tsconfigJson, null, 2));

    // Create logo and favicon (SVG format)
    const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="45" fill="#42b883"/>
  <path d="M30 35 L50 70 L70 35" fill="none" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
    fs.writeFileSync(path.join(root, 'public', 'logo.svg'), logoSvg);
    fs.writeFileSync(path.join(root, 'public', 'favicon.svg'), logoSvg);

    // Create HelloWorld.can component
    const helloWorldCan = `
component HelloWorld {
    var props = ['msg'];
    var template = \`
        <div class="hello-box">
            <h2>{{msg}}</h2>
            <p>Edit <code>src/App.can</code> to start building your application.</p>
            <div class="links">
                <a href="https://github.com/can-framework" target="_blank">Documentation</a>
                <a href="https://github.com/can-framework" target="_blank">GitHub</a>
            </div>
        </div>
    \`;
}
<style scoped>
.hello-box { text-align: center; margin-top: 2rem; }
.links { margin-top: 1rem; }
.links a { color: #42b883; margin: 0 10px; text-decoration: none; font-weight: bold; }
</style>
    `;
    fs.writeFileSync(path.join(root, 'src', 'components', 'HelloWorld.can'), helloWorldCan.trim());

    // Create App.can
    const appCan = `
import { HelloWorld } from './components/HelloWorld.can';

component App {
    var message = "Welcome to Can Framework";
    var template = \`
        <div class="container">
            <img src="/logo.svg" alt="Can Logo" class="logo" />
            <HelloWorld msg="{{message}}" />
        </div>
    \`;
}
<style scoped>
.container { display: flex; flex-direction: column; align-items: center; justify-content: center; padding-top: 10vh; }
.logo { width: 120px; height: 120px; transition: transform 0.3s ease; }
.logo:hover { transform: rotate(10deg) scale(1.1); }
</style>
    `;

    // Create main.ts (The entry point logic)
    const mainTs = `
import { createApp } from '@decaspace/can-framework';
import { App } from './App.can';

const app = createApp(App);
app.mount('#app');
    `;

    // Create env.d.ts to handle .can file imports in TypeScript
    const envDtTs = `
declare module "*.can" {
    const component: any;
    export { component as App };
    export default component;
}
    `;

    const htmlMainPage=`
    <!DOCTYPE html>
      <html lang="en">
        <head>
           <meta charset="UTF-8">
           <meta name="viewport" content="width=device-width, initial-scale=1.0">
           <title>Can Framework Example</title>
           <link rel="icon" type="image/svg+xml" href="/favicon.svg">
           <style>
             body { font-family: 'Inter', sans-serif; margin: 0; background: #fafafa; }
             #app { min-height: 100vh; }
          </style>
        </head>
        <body>
        <div id="app"></div>
       </body>
      </html>
    `
    fs.writeFileSync(path.join(root, 'src', 'App.can'), appCan.trim());
    fs.writeFileSync(path.join(root, 'src', 'main.ts'), mainTs.trim());
    fs.writeFileSync(path.join(root, 'src', 'env.d.ts'), envDtTs.trim());
    fs.writeFileSync(path.join(root, 'public', 'index.html'), htmlMainPage.trim());

    console.log('Project created successfully!');
    console.log(`\ncd ${projectName}\nnpm install\nnpm run dev`);
}