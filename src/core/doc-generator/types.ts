/**
 * Type definitions for Documentation Generator
 */

/**
 * Documentation generation options
 */
export interface DocGenerationOptions {
  source: string;
  output: string;
  format: 'markdown' | 'html' | 'json';
  includeExamples?: boolean;
  includeDiagrams?: boolean;
  includePrivate?: boolean;
  template?: string;
  title?: string;
  description?: string;
}

/**
 * Generated documentation
 */
export interface GeneratedDoc {
  path: string;
  content: string;
  format: string;
  generatedAt: Date;
  metadata: DocMetadata;
}

/**
 * Documentation metadata
 */
export interface DocMetadata {
  title: string;
  description?: string;
  version?: string;
  author?: string;
  generatedBy: string;
  timestamp: Date;
}

/**
 * API documentation
 */
export interface APIDocumentation {
  modules: ModuleDoc[];
  types: TypeDoc[];
  functions: FunctionDoc[];
  classes: ClassDoc[];
  interfaces: InterfaceDoc[];
}

/**
 * Module documentation
 */
export interface ModuleDoc {
  name: string;
  path: string;
  description: string;
  exports: string[];
  imports: string[];
  examples?: CodeExample[];
}

/**
 * Type documentation
 */
export interface TypeDoc {
  name: string;
  description: string;
  properties: PropertyDoc[];
  examples?: CodeExample[];
  file: string;
  line: number;
}

/**
 * Interface documentation
 */
export interface InterfaceDoc {
  name: string;
  description: string;
  properties: PropertyDoc[];
  extends?: string[];
  examples?: CodeExample[];
  file: string;
  line: number;
}

/**
 * Property documentation
 */
export interface PropertyDoc {
  name: string;
  type: string;
  description: string;
  required: boolean;
  default?: string;
  readonly?: boolean;
}

/**
 * Function documentation
 */
export interface FunctionDoc {
  name: string;
  description: string;
  parameters: ParameterDoc[];
  returns: ReturnDoc;
  throws?: string[];
  examples?: CodeExample[];
  deprecated?: boolean;
  since?: string;
  file: string;
  line: number;
}

/**
 * Parameter documentation
 */
export interface ParameterDoc {
  name: string;
  type: string;
  description: string;
  required: boolean;
  default?: string;
}

/**
 * Return documentation
 */
export interface ReturnDoc {
  type: string;
  description: string;
}

/**
 * Class documentation
 */
export interface ClassDoc {
  name: string;
  description: string;
  constructor: ConstructorDoc;
  methods: MethodDoc[];
  properties: PropertyDoc[];
  extends?: string;
  implements?: string[];
  examples?: CodeExample[];
  file: string;
  line: number;
}

/**
 * Constructor documentation
 */
export interface ConstructorDoc {
  description: string;
  parameters: ParameterDoc[];
  examples?: CodeExample[];
}

/**
 * Method documentation
 */
export interface MethodDoc {
  name: string;
  description: string;
  parameters: ParameterDoc[];
  returns: ReturnDoc;
  visibility: 'public' | 'private' | 'protected';
  static: boolean;
  async: boolean;
  examples?: CodeExample[];
}

/**
 * Code example
 */
export interface CodeExample {
  title?: string;
  description?: string;
  code: string;
  language: string;
}

/**
 * Documentation section
 */
export interface DocSection {
  title: string;
  content: string;
  level: number;
  subsections?: DocSection[];
}

/**
 * Table of contents entry
 */
export interface TOCEntry {
  title: string;
  anchor: string;
  level: number;
  children?: TOCEntry[];
}

// Made with Bob
