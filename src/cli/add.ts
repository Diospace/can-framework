import * as fs from 'fs';
import * as path from 'path';

/**
 * Generates a new resource (component or api route).
 * @param typeOrName The type of resource ('api', 'component') or the component name.
 * @param name The name of the resource if type was specified.
 */
export async function add(typeOrName: string, name?: string) {
    if (!typeOrName) {
        console.error('\x1b[31m[CLI Error]:\x1b[0m Please specify a name: can add [type] <name>');
        return;
    }

    const cwd = process.cwd();

    // Basic safety check: ensure we are inside a Can project root
    if (!fs.existsSync(path.join(cwd, 'package.json'))) {
        console.error('\x1b[31m[CLI Error]:\x1b[0m Command must be run from the project root.');
        return;
    }

    // Determine if we are adding an API route or a Component
    if (typeOrName === 'api') {
        if (!name) {
            console.error('\x1b[31m[CLI Error]:\x1b[0m Please specify an api route name: can add api <name>');
            return;
        }
        return addApiRoute(name, cwd);
    }

    // Default to component if type is explicitly 'component' or omitted
    const componentName = typeOrName === 'component' ? name : typeOrName;
    if (!componentName) {
        console.error('\x1b[31m[CLI Error]:\x1b[0m Please specify a component name.');
        return;
    }

    return addComponent(componentName, cwd);
}

/**
 * Logic for generating a .can component
 */
function addComponent(name: string, cwd: string) {
    // Enforce PascalCase convention for component names
    const componentName = name.charAt(0).toUpperCase() + name.slice(1);
    const componentsDir = path.join(cwd, 'src', 'components');
    const filePath = path.join(componentsDir, `${componentName}.can`);

    // Ensure components directory exists
    if (!fs.existsSync(componentsDir)) {
        fs.mkdirSync(componentsDir, { recursive: true });
    }

    if (fs.existsSync(filePath)) {
        console.error(`\x1b[31m[CLI Error]:\x1b[0m Component ${componentName}.can already exists.`);
        return;
    }

    const boilerplate = `component ${componentName} {
    var template = \`
        <div class="${componentName.toLowerCase()}-container">
            <h1>${componentName} Component</h1>
        </div>
    \`;
}

<style scoped>
.${componentName.toLowerCase()}-container {
    padding: 1rem;
    border: 1px solid #eee;
    border-radius: 8px;
}
</style>
`;

    fs.writeFileSync(filePath, boilerplate);
    console.log(`\x1b[32mSuccessfully created component:\x1b[0m src/components/${componentName}.can`);

    // --- Auto-registration Logic ---
    const appFile = path.join(cwd, 'src', 'App.can');
    if (fs.existsSync(appFile)) {
        let appContent = fs.readFileSync(appFile, 'utf-8');
        
        // 1. Inject Import Statement
        const importStmt = `import { ${componentName} } from './components/${componentName}.can';`;
        if (!appContent.includes(importStmt)) {
            const lines = appContent.split('\n');
            const lastImportIndex = lines.reduce((acc, line, i) => line.trim().startsWith('import ') ? i : acc, -1);
            lines.splice(lastImportIndex + 1, 0, importStmt);
            appContent = lines.join('\n');
        }

        // 2. Inject component tag into the template
        const componentTag = `<${componentName} />`;
        if (!appContent.includes(componentTag)) {
            const templateRegex = /var template = `([\s\S]*?)`;/;
            const match = appContent.match(templateRegex);
            if (match) {
                const templateBody = match[1];
                const lastDivIndex = templateBody.lastIndexOf('</div>');
                if (lastDivIndex !== -1) {
                    const updatedBody = templateBody.slice(0, lastDivIndex).trimEnd() + 
                                       `\n            ${componentTag}\n        ` + 
                                       templateBody.slice(lastDivIndex);
                    appContent = appContent.replace(templateBody, updatedBody);
                    fs.writeFileSync(appFile, appContent);
                    console.log(`\x1b[32mSuccessfully registered component in:\x1b[0m src/App.can`);
                }
            }
        }
    }
}

/**
 * Logic for generating an API route
 */
function addApiRoute(name: string, cwd: string) {
    const apiDir = path.join(cwd, 'api');
    // API routes are usually lowercase/kebab-case
    const routeName = name.toLowerCase();
    const filePath = path.join(apiDir, `${routeName}.ts`);

    if (!fs.existsSync(apiDir)) {
        fs.mkdirSync(apiDir, { recursive: true });
    }

    if (fs.existsSync(filePath)) {
        console.error(`\x1b[31m[CLI Error]:\x1b[0m API route ${routeName}.ts already exists.`);
        return;
    }

    const boilerplate = `/**
 * API Route: /api/${routeName}
 */
export default async function handler(req: any, res: any) {
    res.json({
        success: true,
        message: "Hello from ${routeName} api route!"
    });
}`;

    fs.writeFileSync(filePath, boilerplate);
    console.log(`\x1b[32mSuccessfully created API route:\x1b[0m api/${routeName}.ts`);

    // --- Auto-registration Logic ---
    const indexFile = path.join(cwd, 'api', 'index.ts');
    if (fs.existsSync(indexFile)) {
        let indexContent = fs.readFileSync(indexFile, 'utf-8');
        
        // Generate a valid camelCase name for the handler variable
        const handlerName = routeName.replace(/-([a-z])/g, (g) => g[1].toUpperCase()) + 'Handler';

        // 1. Inject Import Statement after the last existing import
        if (!indexContent.includes(`from './${routeName}'`)) {
            const lines = indexContent.split('\n');
            const lastImportIndex = lines.reduce((acc, line, i) => line.trim().startsWith('import ') ? i : acc, -1);
            lines.splice(lastImportIndex + 1, 0, `import ${handlerName} from './${routeName}';`);
            indexContent = lines.join('\n');
        }

        // 2. Inject Route Registration after the specific mounting comment
        const registration = `            app.use('/api/${routeName}', ${handlerName});`;
        if (!indexContent.includes(registration)) {
            indexContent = indexContent.replace(
                /\/\/ 2\. Mount API Routes/,
                `// 2. Mount API Routes\n${registration}`
            );
            fs.writeFileSync(indexFile, indexContent);
            console.log(`\x1b[32mSuccessfully registered route in:\x1b[0m api/index.ts`);
        }
    }
}