/**
 * TypeScript Parser using ts-morph
 */

import { Project, SourceFile, SyntaxKind } from 'ts-morph';
import { logger } from '../../utils/logger.js';
import type { FunctionInfo, ClassInfo, PropertyInfo } from './types.js';

/**
 * TypeScript file parser
 */
export class TypeScriptParser {
  private project: Project;

  constructor() {
    this.project = new Project({
      skipAddingFilesFromTsConfig: true,
      compilerOptions: {
        target: 99, // ESNext
        module: 99, // ESNext
      },
    });
  }

  /**
   * Parse a TypeScript file
   */
  async parseFile(filePath: string): Promise<{
    functions: FunctionInfo[];
    classes: ClassInfo[];
    imports: string[];
    exports: string[];
    complexity: number;
  }> {
    try {
      const sourceFile = this.project.addSourceFileAtPath(filePath);
      
      const functions = this.extractFunctions(sourceFile);
      const classes = this.extractClasses(sourceFile);
      const imports = this.extractImports(sourceFile);
      const exports = this.extractExports(sourceFile);
      const complexity = this.calculateComplexity(sourceFile);

      // Remove file from project to free memory
      this.project.removeSourceFile(sourceFile);

      return {
        functions,
        classes,
        imports,
        exports,
        complexity,
      };
    } catch (error) {
      logger.error('Failed to parse TypeScript file', {
        filePath,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Extract function information
   */
  private extractFunctions(sourceFile: SourceFile): FunctionInfo[] {
    const functions: FunctionInfo[] = [];

    // Function declarations
    sourceFile.getFunctions().forEach(func => {
      functions.push({
        name: func.getName() || 'anonymous',
        line: func.getStartLineNumber(),
        endLine: func.getEndLineNumber(),
        parameters: func.getParameters().map(param => ({
          name: param.getName(),
          type: param.getType().getText(),
          optional: param.isOptional(),
          defaultValue: param.getInitializer()?.getText(),
        })),
        returnType: func.getReturnType().getText(),
        isAsync: func.isAsync(),
        isExported: func.isExported(),
        complexity: this.calculateFunctionComplexity(func.getBody()?.getText() || ''),
      });
    });

    // Arrow functions and function expressions assigned to variables
    sourceFile.getVariableDeclarations().forEach(varDecl => {
      const initializer = varDecl.getInitializer();
      if (initializer && (
        initializer.getKind() === SyntaxKind.ArrowFunction ||
        initializer.getKind() === SyntaxKind.FunctionExpression
      )) {
        const func = initializer.asKind(SyntaxKind.ArrowFunction) || 
                     initializer.asKind(SyntaxKind.FunctionExpression);
        if (func) {
          functions.push({
            name: varDecl.getName(),
            line: varDecl.getStartLineNumber(),
            endLine: varDecl.getEndLineNumber(),
            parameters: func.getParameters().map(param => ({
              name: param.getName(),
              type: param.getType().getText(),
              optional: param.isOptional(),
              defaultValue: param.getInitializer()?.getText(),
            })),
            returnType: func.getReturnType().getText(),
            isAsync: func.isAsync(),
            isExported: varDecl.getVariableStatement()?.isExported() || false,
            complexity: this.calculateFunctionComplexity(func.getBody().getText()),
          });
        }
      }
    });

    return functions;
  }

  /**
   * Extract class information
   */
  private extractClasses(sourceFile: SourceFile): ClassInfo[] {
    const classes: ClassInfo[] = [];

    sourceFile.getClasses().forEach(cls => {
      const methods: FunctionInfo[] = cls.getMethods().map(method => ({
        name: method.getName(),
        line: method.getStartLineNumber(),
        endLine: method.getEndLineNumber(),
        parameters: method.getParameters().map(param => ({
          name: param.getName(),
          type: param.getType().getText(),
          optional: param.isOptional(),
          defaultValue: param.getInitializer()?.getText(),
        })),
        returnType: method.getReturnType().getText(),
        isAsync: method.isAsync(),
        isExported: false,
        complexity: this.calculateFunctionComplexity(method.getBody()?.getText() || ''),
      }));

      const properties: PropertyInfo[] = cls.getProperties().map(prop => ({
        name: prop.getName(),
        type: prop.getType().getText(),
        visibility: this.getVisibility(prop.getScope()),
        isStatic: prop.isStatic(),
        isReadonly: prop.isReadonly(),
      }));

      classes.push({
        name: cls.getName() || 'anonymous',
        line: cls.getStartLineNumber(),
        endLine: cls.getEndLineNumber(),
        methods,
        properties,
        isExported: cls.isExported(),
        extendsClass: cls.getExtends()?.getText(),
        implementsInterfaces: cls.getImplements().map(i => i.getText()),
      });
    });

    return classes;
  }

  /**
   * Extract imports
   */
  private extractImports(sourceFile: SourceFile): string[] {
    const imports: string[] = [];

    sourceFile.getImportDeclarations().forEach(importDecl => {
      const moduleSpecifier = importDecl.getModuleSpecifierValue();
      imports.push(moduleSpecifier);
    });

    return imports;
  }

  /**
   * Extract exports
   */
  private extractExports(sourceFile: SourceFile): string[] {
    const exports: string[] = [];

    // Named exports
    sourceFile.getExportDeclarations().forEach(exportDecl => {
      exportDecl.getNamedExports().forEach(namedExport => {
        exports.push(namedExport.getName());
      });
    });

    // Exported functions
    sourceFile.getFunctions().forEach(func => {
      if (func.isExported()) {
        exports.push(func.getName() || 'default');
      }
    });

    // Exported classes
    sourceFile.getClasses().forEach(cls => {
      if (cls.isExported()) {
        exports.push(cls.getName() || 'default');
      }
    });

    // Exported variables
    sourceFile.getVariableStatements().forEach(varStmt => {
      if (varStmt.isExported()) {
        varStmt.getDeclarations().forEach(decl => {
          exports.push(decl.getName());
        });
      }
    });

    return exports;
  }

  /**
   * Calculate file complexity
   */
  private calculateComplexity(sourceFile: SourceFile): number {
    let complexity = 1; // Base complexity

    // Count decision points
    const text = sourceFile.getFullText();
    
    // Control flow statements
    complexity += (text.match(/\bif\b/g) || []).length;
    complexity += (text.match(/\belse\b/g) || []).length;
    complexity += (text.match(/\bfor\b/g) || []).length;
    complexity += (text.match(/\bwhile\b/g) || []).length;
    complexity += (text.match(/\bcase\b/g) || []).length;
    complexity += (text.match(/\bcatch\b/g) || []).length;
    complexity += (text.match(/\b&&\b/g) || []).length;
    complexity += (text.match(/\b\|\|\b/g) || []).length;
    complexity += (text.match(/\?\./g) || []).length; // Optional chaining
    complexity += (text.match(/\?\?/g) || []).length; // Nullish coalescing

    return complexity;
  }

  /**
   * Calculate function complexity
   */
  private calculateFunctionComplexity(code: string): number {
    let complexity = 1; // Base complexity

    // Count decision points
    complexity += (code.match(/\bif\b/g) || []).length;
    complexity += (code.match(/\belse\b/g) || []).length;
    complexity += (code.match(/\bfor\b/g) || []).length;
    complexity += (code.match(/\bwhile\b/g) || []).length;
    complexity += (code.match(/\bcase\b/g) || []).length;
    complexity += (code.match(/\bcatch\b/g) || []).length;
    complexity += (code.match(/\b&&\b/g) || []).length;
    complexity += (code.match(/\b\|\|\b/g) || []).length;
    complexity += (code.match(/\?\./g) || []).length;
    complexity += (code.match(/\?\?/g) || []).length;

    return complexity;
  }

  /**
   * Get visibility from scope
   */
  private getVisibility(scope: any): 'public' | 'private' | 'protected' {
    if (!scope) return 'public';
    const scopeStr = String(scope);
    if (scopeStr.includes('Private')) return 'private';
    if (scopeStr.includes('Protected')) return 'protected';
    return 'public';
  }

  /**
   * Dispose of the project
   */
  dispose(): void {
    // Clean up project resources
    this.project = new Project({
      skipAddingFilesFromTsConfig: true,
    });
  }
}

/**
 * Create a TypeScript parser instance
 */
export function createTypeScriptParser(): TypeScriptParser {
  return new TypeScriptParser();
}

// Made with Bob
