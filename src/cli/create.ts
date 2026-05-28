import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

/**
 * Scaffolds a new Can project.
 * @param projectName The name of the directory to create.
 * @param templatesDir The absolute path to the framework's template assets.
 * @param frameworkVersion The version of the framework to inject into package.json.
 */
export function create(projectName: string, templatesDir: string, frameworkVersion: string) {
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

    try {
        // 1. Copy the entire templates directory to the new project root.
        // This handles creating all subdirectories (api, build, src, etc.) automatically.
        fs.cpSync(templatesDir, root, { recursive: true });

        // 2. Personalize the package.json with the new project name and framework version
        const packageJsonPath = path.join(root, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
            const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
            pkg.name = projectName;
            
            // Ensure the project depends on the current version of the framework
            if (pkg.dependencies && pkg.dependencies['@decaspace/can-framework']) {
                pkg.dependencies['@decaspace/can-framework'] = `^${frameworkVersion}`;
                // If running in local dev mode, point to the local framework folder
                if (process.env.CAN_LOCAL_DEV === 'true') {
                    const frameworkRoot = path.resolve(templatesDir, '../..');
                    pkg.dependencies['@decaspace/can-framework'] = `file:${frameworkRoot}`;
                } else {
                    pkg.dependencies['@decaspace/can-framework'] = `^${frameworkVersion}`;
                }
            }
            fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));
        }

        // 3. Optional: Automatically run npm install
        console.log('\x1b[36m%s\x1b[0m', '>>> Installing dependencies...');
        try {
            execSync('npm install', { 
                cwd: root, 
                stdio: 'inherit' 
            });
            console.log('\n\x1b[32mProject created and dependencies installed successfully!\x1b[0m');
            console.log(`\nTo start developing:\n  cd ${projectName}\n  npm run dev`);
        } catch (installError) {
            console.warn('\x1b[33m%s\x1b[0m', '\nWarning: Automatic npm install failed.');
            console.log(`Please run: cd ${projectName} && npm install`);
        }

    } catch (err) {
        console.error(`\x1b[31m[CLI Error]:\x1b[0m Failed to scaffold project:`, err);
        // Cleanup partial directory on failure to avoid leaving "ghost" folders
        if (fs.existsSync(root)) fs.rmSync(root, { recursive: true, force: true });
    }
}