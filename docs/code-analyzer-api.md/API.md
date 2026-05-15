# API Documentation

## Table of Contents

- [Overview](#overview)
- [Modules](#modules)
- [Functions](#functions)
- [Classes](#classes)
- [Dependencies](#dependencies)
- [Code Metrics](#code-metrics)

## Overview

This documentation covers 5 files with 1,142 lines of code.

### Statistics

- **Total Files**: 5
- **Total Lines**: 1,142
- **Total Functions**: 4
- **Total Classes**: 2

### Languages

- **TypeScript**: 5 files

## Modules

### `types.ts`

**Language**: TypeScript  
**Lines**: 200  
**Complexity**: 2

### `ts-parser.ts`

**Language**: TypeScript  
**Lines**: 294  
**Complexity**: 17

**Exports**:
- `createTypeScriptParser`
- `TypeScriptParser`

**Imports**:
- `ts-morph`
- `../../utils/logger.js`
- `./types.js`

### `index.ts`

**Language**: TypeScript  
**Lines**: 11  
**Complexity**: 1

### `cli.ts`

**Language**: TypeScript  
**Lines**: 112  
**Complexity**: 10

**Exports**:
- `runCodeAnalyzer`

**Imports**:
- `./analyzer.js`
- `../../utils/logger.js`
- `chalk`

### `analyzer.ts`

**Language**: TypeScript  
**Lines**: 525  
**Complexity**: 49

**Exports**:
- `createAnalyzer`
- `CodeAnalyzer`

**Imports**:
- `glob`
- `fs/promises`
- `path`
- `../../utils/logger.js`
- `../../utils/errors.js`
- ... and 2 more


## Functions

### Functions in `ts-parser.ts`

#### `export function createTypeScriptParser()`

**Location**: Line 289  
**Complexity**: 1  
**Exported**: Yes  
**Async**: No

### Functions in `cli.ts`

#### `export async function runCodeAnalyzer()`

**Location**: Line 13  
**Complexity**: 7  
**Exported**: Yes  
**Async**: Yes

#### `async function main()`

**Location**: Line 92  
**Complexity**: 1  
**Exported**: No  
**Async**: Yes

### Functions in `analyzer.ts`

#### `export function createAnalyzer()`

**Location**: Line 520  
**Complexity**: 1  
**Exported**: Yes  
**Async**: No


## Classes

### Classes in `ts-parser.ts`

#### `export class TypeScriptParser`

**Location**: Line 12  
**Exported**: Yes  
**Methods**: 9  
**Properties**: 1

### Classes in `analyzer.ts`

#### `export class CodeAnalyzer`

**Location**: Line 25  
**Exported**: Yes  
**Methods**: 14  
**Properties**: 1


## Dependencies

### Dependency Graph

Total dependencies: 13

**`ts-parser.ts`** imports:
- `ts-morph`
- `../../utils/logger.js`
- `./types.js`

**`cli.ts`** imports:
- `./analyzer.js`
- `../../utils/logger.js`
- `chalk`

**`analyzer.ts`** imports:
- `glob`
- `fs/promises`
- `path`
- `../../utils/logger.js`
- `../../utils/errors.js`
- `./ts-parser.js`
- `./types.js`


## Code Metrics

### Complexity

- **Average**: 15.80
- **Maximum**: 49
- **Minimum**: 0

### Maintainability

- **Index**: 69.42
- **Score**: B
- **Complexity Factor**: 15.80
- **Volume**: 11599.69

### Quality

- **Documentation Coverage**: 50.0%
- **Code Smells**: 0
- **Duplicate Code**: 0%
