/**
 * Documentation Generator Module
 * 
 * Generates comprehensive documentation from code analysis
 */

export { DocGenerator, createDocGenerator } from './generator.js';
export { runDocGenerator } from './cli.js';
export type {
  DocGenerationOptions,
  GeneratedDoc,
  APIDocumentation,
  ModuleDoc,
  FunctionDoc,
  ClassDoc,
  InterfaceDoc,
  TypeDoc,
  ParameterDoc,
  ReturnDoc,
  PropertyDoc,
  MethodDoc,
  ConstructorDoc,
  DocSection,
  TOCEntry,
  DocMetadata,
} from './types.js';

// Made with Bob
