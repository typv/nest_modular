import { Module, DynamicModule } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

@Module({})
export class DynamicLoaderModule {
  static async loadModules(moduleDir: string): Promise<DynamicModule[]> {
    const rootPath = process.cwd();
    const modulePath = path.join(rootPath, moduleDir);

    const moduleFiles = await this.findModuleFiles(modulePath, /^sotatek-.*module\.ts$/);
    const moduleNames = await this.findModuleNames(modulePath, /^sotatek-.*module\.ts$/);

    const importedModules = await Promise.all(moduleFiles.map(async file => {
      const module = await import(file);
      return module.default;
    }));

    return importedModules.map(module => ({
      module: module,
    }));
  }

  static async findModuleFiles(basePath: string, filePattern: RegExp = /^sotatek-.*module\.ts$/): Promise<string[]> {
    const results: string[] = [];

    const files = await fs.promises.readdir(basePath);

    for (const file of files) {
      const fullPath = path.join(basePath, file);
      const stat = await fs.promises.stat(fullPath);

      if (stat.isDirectory()) {
        const nestedFiles = await this.findModuleFiles(fullPath, filePattern);
        results.push(...nestedFiles);
      } else if (filePattern.test(file)) {
        results.push(fullPath);
      }
    }

    return results;
  }

  static async findModuleNames(basePath: string, filePattern: RegExp = /^sotatek-.*module\.ts$/): Promise<string[]> {
    const results: string[] = [];

    const moduleFiles = await this.findModuleFiles(basePath, filePattern);

    for (const file of moduleFiles) {
      // Extract module name from file name
      const moduleName = this.convertFileNameToModuleName(path.basename(file));
      results.push(moduleName);
    }

    return results;
  }

  static convertFileNameToModuleName(fileName: string): string {
    let moduleName = fileName.replace(/\.ts$/, '').replace(/\./g, ' ');
    moduleName = moduleName.replace(/-/g, ' ')
      .replace(/\b\w/g, firstLetter => firstLetter.toUpperCase());
    moduleName = moduleName.replace(/\s/g, '');

    return moduleName;
  }
}

