# API Documentation

## Table of Contents

- [Overview](#overview)
- [Modules](#modules)
- [Functions](#functions)
- [Classes](#classes)
- [Dependencies](#dependencies)
- [Code Metrics](#code-metrics)

## Overview

This documentation covers 25 files with 5,143 lines of code.

### Statistics

- **Total Files**: 25
- **Total Lines**: 5,143
- **Total Functions**: 25
- **Total Classes**: 21

### Languages

- **TypeScript**: 25 files

## Modules

### `index.ts`

**Language**: TypeScript  
**Lines**: 71  
**Complexity**: 6

**Exports**:
- `main`

**Imports**:
- `./utils/logger.js`
- `./utils/config.js`
- `./core/bob-integration/index.js`

### `utils/logger.ts`

**Language**: TypeScript  
**Lines**: 192  
**Complexity**: 12

**Exports**:
- `createLogger`
- `Logger`
- `logger`

**Imports**:
- `chalk`
- `../types/index.js`

### `utils/index.ts`

**Language**: TypeScript  
**Lines**: 10  
**Complexity**: 2

### `utils/errors.ts`

**Language**: TypeScript  
**Lines**: 180  
**Complexity**: 8

**Exports**:
- `isAppError`
- `isBobAPIError`
- `isRateLimitError`
- `formatError`
- `AppError`
- `BobAPIError`
- `RateLimitError`
- `AuthenticationError`
- `BobcoinExhaustedError`
- `AnalysisError`
- `ParseError`
- `FileAccessError`
- `ValidationError`
- `ConfigError`
- `InputError`

### `utils/config.ts`

**Language**: TypeScript  
**Lines**: 162  
**Complexity**: 34

**Exports**:
- `loadEnv`
- `loadConfig`
- `validateCredentials`
- `getConfig`
- `isWatsonxAIAvailable`
- `isWatsonxOrchestrateAvailable`

**Imports**:
- `dotenv`
- `../types/index.js`
- `./errors.js`
- `./logger.js`

### `types/index.ts`

**Language**: TypeScript  
**Lines**: 378  
**Complexity**: 2

**Exports**:
- `AppError`
- `BobAPIError`
- `AnalysisError`
- `ValidationError`
- `ConfigSchema`

**Imports**:
- `zod`

### `cli/index.ts`

**Language**: TypeScript  
**Lines**: 203  
**Complexity**: 13

**Imports**:
- `commander`
- `chalk`
- `../core/code-analyzer/cli.js`
- `../core/doc-generator/cli.js`
- `../core/task-automator/cli.js`
- ... and 1 more

### `core/task-automator/types.ts`

**Language**: TypeScript  
**Lines**: 264  
**Complexity**: 2

### `core/task-automator/index.ts`

**Language**: TypeScript  
**Lines**: 35  
**Complexity**: 1

**Exports**:
- `TaskAutomator`
- `createTaskAutomator`
- `runTaskAutomator`
- `TaskType`
- `TaskPriority`
- `TaskStatus`
- `AutomationStrategy`
- `TaskConfig`
- `TaskExecutionOptions`
- `TaskResult`
- `TaskChange`
- `TaskError`
- `TaskMetrics`
- `CodeReviewOptions`
- `RefactorOptions`
- `TestGenerationOptions`
- `BugFixOptions`
- `FeatureOptions`
- `OptimizationOptions`
- `SecurityAuditOptions`
- `DependencyUpdateOptions`
- `TaskTemplate`
- `TaskQueueItem`
- `SchedulerConfig`
- `AutomationReport`

### `core/task-automator/cli.ts`

**Language**: TypeScript  
**Lines**: 211  
**Complexity**: 35

**Exports**:
- `runTaskAutomator`

**Imports**:
- `chalk`
- `./automator.js`
- `../../utils/logger.js`
- `./types.js`

### `core/task-automator/cli-runner.ts`

**Language**: TypeScript  
**Lines**: 131  
**Complexity**: 16

**Imports**:
- `./cli.js`
- `./types.js`

### `core/task-automator/automator.ts`

**Language**: TypeScript  
**Lines**: 805  
**Complexity**: 80

**Exports**:
- `createTaskAutomator`
- `TaskAutomator`

**Imports**:
- `crypto`
- `../../utils/logger.js`
- `../../utils/errors.js`
- `../bob-integration/client.js`
- `../code-analyzer/index.js`
- ... and 3 more

### `core/doc-generator/types.ts`

**Language**: TypeScript  
**Lines**: 208  
**Complexity**: 2

### `core/doc-generator/index.ts`

**Language**: TypeScript  
**Lines**: 29  
**Complexity**: 1

**Exports**:
- `DocGenerator`
- `createDocGenerator`
- `runDocGenerator`
- `DocGenerationOptions`
- `GeneratedDoc`
- `APIDocumentation`
- `ModuleDoc`
- `FunctionDoc`
- `ClassDoc`
- `InterfaceDoc`
- `TypeDoc`
- `ParameterDoc`
- `ReturnDoc`
- `PropertyDoc`
- `MethodDoc`
- `ConstructorDoc`
- `DocSection`
- `TOCEntry`
- `DocMetadata`

### `core/doc-generator/generator.ts`

**Language**: TypeScript  
**Lines**: 572  
**Complexity**: 40

**Exports**:
- `createDocGenerator`
- `DocGenerator`

**Imports**:
- `fs/promises`
- `path`
- `../../utils/logger.js`
- `../../utils/errors.js`
- `../code-analyzer/index.js`
- ... and 2 more

### `core/doc-generator/cli.ts`

**Language**: TypeScript  
**Lines**: 106  
**Complexity**: 11

**Exports**:
- `runDocGenerator`

**Imports**:
- `chalk`
- `./generator.js`
- `../../utils/logger.js`
- `./types.js`

### `core/doc-generator/cli-runner.ts`

**Language**: TypeScript  
**Lines**: 103  
**Complexity**: 14

**Imports**:
- `./cli.js`

### `core/code-analyzer/types.ts`

**Language**: TypeScript  
**Lines**: 200  
**Complexity**: 2

### `core/code-analyzer/ts-parser.ts`

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

### `core/code-analyzer/index.ts`

**Language**: TypeScript  
**Lines**: 11  
**Complexity**: 1

### `core/code-analyzer/cli.ts`

**Language**: TypeScript  
**Lines**: 112  
**Complexity**: 10

**Exports**:
- `runCodeAnalyzer`

**Imports**:
- `./analyzer.js`
- `../../utils/logger.js`
- `chalk`

### `core/code-analyzer/analyzer.ts`

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

### `core/bob-integration/types.ts`

**Language**: TypeScript  
**Lines**: 92  
**Complexity**: 2

### `core/bob-integration/index.ts`

**Language**: TypeScript  
**Lines**: 11  
**Complexity**: 1

### `core/bob-integration/client.ts`

**Language**: TypeScript  
**Lines**: 238  
**Complexity**: 12

**Exports**:
- `createBobClient`
- `BobClient`

**Imports**:
- `../../utils/logger.js`
- `../../utils/errors.js`
- `./types.js`


## Functions

### Functions in `index.ts`

#### `export async function main()`

**Location**: Line 13  
**Complexity**: 3  
**Exported**: Yes  
**Async**: Yes

### Functions in `utils/logger.ts`

#### `export function createLogger()`

**Location**: Line 187  
**Complexity**: 1  
**Exported**: Yes  
**Async**: No

### Functions in `utils/errors.ts`

#### `export function isAppError()`

**Location**: Line 146  
**Complexity**: 1  
**Exported**: Yes  
**Async**: No

#### `export function isBobAPIError()`

**Location**: Line 153  
**Complexity**: 1  
**Exported**: Yes  
**Async**: No

#### `export function isRateLimitError()`

**Location**: Line 160  
**Complexity**: 1  
**Exported**: Yes  
**Async**: No

#### `export function formatError()`

**Location**: Line 167  
**Complexity**: 3  
**Exported**: Yes  
**Async**: No

### Functions in `utils/config.ts`

#### `export function loadEnv()`

**Location**: Line 13  
**Complexity**: 3  
**Exported**: Yes  
**Async**: No

#### `export function loadConfig()`

**Location**: Line 26  
**Complexity**: 2  
**Exported**: Yes  
**Async**: No

#### `export function validateCredentials()`

**Location**: Line 89  
**Complexity**: 20  
**Exported**: Yes  
**Async**: No

#### `export function getConfig()`

**Location**: Line 133  
**Complexity**: 1  
**Exported**: Yes  
**Async**: No

#### `export function isWatsonxAIAvailable()`

**Location**: Line 142  
**Complexity**: 5  
**Exported**: Yes  
**Async**: No

#### `export function isWatsonxOrchestrateAvailable()`

**Location**: Line 153  
**Complexity**: 5  
**Exported**: Yes  
**Async**: No

### Functions in `core/task-automator/cli.ts`

#### `export async function runTaskAutomator()`

**Location**: Line 19  
**Complexity**: 19  
**Exported**: Yes  
**Async**: Yes

#### `function getPriorityColor()`

**Location**: Line 159  
**Complexity**: 5  
**Exported**: No  
**Async**: No

#### `function getStatusColor()`

**Location**: Line 175  
**Complexity**: 5  
**Exported**: No  
**Async**: No

#### `function getChangeIcon()`

**Location**: Line 193  
**Complexity**: 6  
**Exported**: No  
**Async**: No

### Functions in `core/task-automator/automator.ts`

#### `export function createTaskAutomator()`

**Location**: Line 800  
**Complexity**: 1  
**Exported**: Yes  
**Async**: No

### Functions in `core/doc-generator/generator.ts`

#### `export function createDocGenerator()`

**Location**: Line 567  
**Complexity**: 1  
**Exported**: Yes  
**Async**: No

### Functions in `core/doc-generator/cli.ts`

#### `export async function runDocGenerator()`

**Location**: Line 13  
**Complexity**: 10  
**Exported**: Yes  
**Async**: Yes

#### `function formatBytes()`

**Location**: Line 95  
**Complexity**: 2  
**Exported**: No  
**Async**: No

### Functions in `core/code-analyzer/ts-parser.ts`

#### `export function createTypeScriptParser()`

**Location**: Line 289  
**Complexity**: 1  
**Exported**: Yes  
**Async**: No

### Functions in `core/code-analyzer/cli.ts`

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

### Functions in `core/code-analyzer/analyzer.ts`

#### `export function createAnalyzer()`

**Location**: Line 520  
**Complexity**: 1  
**Exported**: Yes  
**Async**: No

### Functions in `core/bob-integration/client.ts`

#### `export function createBobClient()`

**Location**: Line 233  
**Complexity**: 1  
**Exported**: Yes  
**Async**: No


## Classes

### Classes in `utils/logger.ts`

#### `export class Logger`

**Location**: Line 41  
**Exported**: Yes  
**Methods**: 11  
**Properties**: 2

### Classes in `utils/errors.ts`

#### `export class AppError`

**Location**: Line 8  
**Exported**: Yes  
**Methods**: 1  
**Properties**: 0

#### `export class BobAPIError`

**Location**: Line 33  
**Exported**: Yes  
**Methods**: 0  
**Properties**: 0

#### `export class RateLimitError`

**Location**: Line 43  
**Exported**: Yes  
**Methods**: 0  
**Properties**: 0

#### `export class AuthenticationError`

**Location**: Line 57  
**Exported**: Yes  
**Methods**: 0  
**Properties**: 0

#### `export class BobcoinExhaustedError`

**Location**: Line 67  
**Exported**: Yes  
**Methods**: 0  
**Properties**: 0

#### `export class AnalysisError`

**Location**: Line 77  
**Exported**: Yes  
**Methods**: 0  
**Properties**: 0

#### `export class ParseError`

**Location**: Line 87  
**Exported**: Yes  
**Methods**: 0  
**Properties**: 0

#### `export class FileAccessError`

**Location**: Line 102  
**Exported**: Yes  
**Methods**: 0  
**Properties**: 0

#### `export class ValidationError`

**Location**: Line 116  
**Exported**: Yes  
**Methods**: 0  
**Properties**: 0

#### `export class ConfigError`

**Location**: Line 126  
**Exported**: Yes  
**Methods**: 0  
**Properties**: 0

#### `export class InputError`

**Location**: Line 136  
**Exported**: Yes  
**Methods**: 0  
**Properties**: 0

### Classes in `types/index.ts`

#### `export class AppError`

**Location**: Line 319  
**Exported**: Yes  
**Methods**: 0  
**Properties**: 0

#### `export class BobAPIError`

**Location**: Line 330  
**Exported**: Yes  
**Methods**: 0  
**Properties**: 0

#### `export class AnalysisError`

**Location**: Line 337  
**Exported**: Yes  
**Methods**: 0  
**Properties**: 0

#### `export class ValidationError`

**Location**: Line 344  
**Exported**: Yes  
**Methods**: 0  
**Properties**: 0

### Classes in `core/task-automator/automator.ts`

#### `export class TaskAutomator`

**Location**: Line 31  
**Exported**: Yes  
**Methods**: 17  
**Properties**: 2

### Classes in `core/doc-generator/generator.ts`

#### `export class DocGenerator`

**Location**: Line 20  
**Exported**: Yes  
**Methods**: 13  
**Properties**: 1

### Classes in `core/code-analyzer/ts-parser.ts`

#### `export class TypeScriptParser`

**Location**: Line 12  
**Exported**: Yes  
**Methods**: 9  
**Properties**: 1

### Classes in `core/code-analyzer/analyzer.ts`

#### `export class CodeAnalyzer`

**Location**: Line 25  
**Exported**: Yes  
**Methods**: 14  
**Properties**: 1

### Classes in `core/bob-integration/client.ts`

#### `export class BobClient`

**Location**: Line 22  
**Exported**: Yes  
**Methods**: 11  
**Properties**: 3


## Dependencies

### Dependency Graph

Total dependencies: 58

**`index.ts`** imports:
- `./utils/logger.js`
- `./utils/config.js`
- `./core/bob-integration/index.js`

**`utils/logger.ts`** imports:
- `chalk`
- `../types/index.js`

**`utils/config.ts`** imports:
- `dotenv`
- `../types/index.js`
- `./errors.js`
- `./logger.js`

**`types/index.ts`** imports:
- `zod`

**`cli/index.ts`** imports:
- `commander`
- `chalk`
- `../core/code-analyzer/cli.js`
- `../core/doc-generator/cli.js`
- `../core/task-automator/cli.js`
- `../core/task-automator/types.js`

**`core/task-automator/cli.ts`** imports:
- `chalk`
- `./automator.js`
- `../../utils/logger.js`
- `./types.js`

**`core/task-automator/cli-runner.ts`** imports:
- `./cli.js`
- `./types.js`

**`core/task-automator/automator.ts`** imports:
- `crypto`
- `../../utils/logger.js`
- `../../utils/errors.js`
- `../bob-integration/client.js`
- `../code-analyzer/index.js`
- `../doc-generator/index.js`
- `../../utils/config.js`
- `./types.js`

**`core/doc-generator/generator.ts`** imports:
- `fs/promises`
- `path`
- `../../utils/logger.js`
- `../../utils/errors.js`
- `../code-analyzer/index.js`
- `./types.js`
- `../code-analyzer/types.js`

**`core/doc-generator/cli.ts`** imports:
- `chalk`
- `./generator.js`
- `../../utils/logger.js`
- `./types.js`

**`core/doc-generator/cli-runner.ts`** imports:
- `./cli.js`

**`core/code-analyzer/ts-parser.ts`** imports:
- `ts-morph`
- `../../utils/logger.js`
- `./types.js`

**`core/code-analyzer/cli.ts`** imports:
- `./analyzer.js`
- `../../utils/logger.js`
- `chalk`

**`core/code-analyzer/analyzer.ts`** imports:
- `glob`
- `fs/promises`
- `path`
- `../../utils/logger.js`
- `../../utils/errors.js`
- `./ts-parser.js`
- `./types.js`

**`core/bob-integration/client.ts`** imports:
- `../../utils/logger.js`
- `../../utils/errors.js`
- `./types.js`


## Code Metrics

### Complexity

- **Average**: 14.92
- **Maximum**: 80
- **Minimum**: 0

### Maintainability

- **Index**: 64.37
- **Score**: B
- **Complexity Factor**: 14.92
- **Volume**: 63404.93

### Quality

- **Documentation Coverage**: 50.0%
- **Code Smells**: 0
- **Duplicate Code**: 0%
