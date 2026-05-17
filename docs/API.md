# API Documentation

## Table of Contents

- [Overview](#overview)
- [Modules](#modules)
- [Functions](#functions)
- [Classes](#classes)
- [Dependencies](#dependencies)
- [Code Metrics](#code-metrics)

## Overview

This documentation covers 34 files with 7,631 lines of code.

### Statistics

- **Total Files**: 34
- **Total Lines**: 7,631
- **Total Functions**: 173
- **Total Classes**: 26

### Languages

- **TypeScript**: 34 files

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

### `utils/progress.ts`

**Language**: TypeScript  
**Lines**: 281  
**Complexity**: 33

**Exports**:
- `createProgress`
- `withProgress`
- `ProgressIndicator`

**Imports**:
- `chalk`

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
**Lines**: 11  
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

### `server/index.ts`

**Language**: TypeScript  
**Lines**: 460  
**Complexity**: 24

**Exports**:
- `DashboardServer`

**Imports**:
- `express`
- `cors`
- `path`
- `url`
- `../utils/logger.js`
- ... and 3 more

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

### `watsonx/orchestrate/types.ts`

**Language**: TypeScript  
**Lines**: 162  
**Complexity**: 2

### `watsonx/orchestrate/index.ts`

**Language**: TypeScript  
**Lines**: 10  
**Complexity**: 1

**Exports**:
- `OrchestrateClient`
- `createOrchestrateClient`

### `watsonx/orchestrate/client.ts`

**Language**: TypeScript  
**Lines**: 516  
**Complexity**: 15

**Exports**:
- `createOrchestrateClient`
- `OrchestrateClient`

**Imports**:
- `../../utils/logger.js`
- `../../utils/errors.js`
- `./types.js`

### `watsonx/ai/types.ts`

**Language**: TypeScript  
**Lines**: 153  
**Complexity**: 3

### `watsonx/ai/index.ts`

**Language**: TypeScript  
**Lines**: 10  
**Complexity**: 1

**Exports**:
- `WatsonxAIClient`
- `createWatsonxAIClient`

### `watsonx/ai/client.ts`

**Language**: TypeScript  
**Lines**: 478  
**Complexity**: 40

**Exports**:
- `createWatsonxAIClient`
- `WatsonxAIClient`

**Imports**:
- `../../utils/logger.js`
- `../../utils/errors.js`
- `./types.js`

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
**Lines**: 819  
**Complexity**: 80

**Exports**:
- `createTaskAutomator`
- `TaskAutomator`

**Imports**:
- `crypto`
- `../../utils/logger.js`
- `../../utils/errors.js`
- `../../utils/progress.js`
- `../bob-integration/client.js`
- ... and 4 more

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
**Lines**: 612  
**Complexity**: 40

**Exports**:
- `createDocGenerator`
- `DocGenerator`

**Imports**:
- `fs/promises`
- `path`
- `../../utils/logger.js`
- `../../utils/errors.js`
- `../../utils/progress.js`
- ... and 3 more

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
**Lines**: 25  
**Complexity**: 1

**Exports**:
- `analyzeCode`

**Imports**:
- `./analyzer.js`
- `./types.js`

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
**Lines**: 563  
**Complexity**: 50

**Exports**:
- `createAnalyzer`
- `CodeAnalyzer`

**Imports**:
- `glob`
- `fs/promises`
- `path`
- `../../utils/logger.js`
- `../../utils/errors.js`
- ... and 3 more

### `core/bob-integration/types.ts`

**Language**: TypeScript  
**Lines**: 92  
**Complexity**: 2

### `core/bob-integration/index.ts`

**Language**: TypeScript  
**Lines**: 11  
**Complexity**: 1

### `core/bob-integration/http-client.ts`

**Language**: TypeScript  
**Lines**: 271  
**Complexity**: 18

**Exports**:
- `createHTTPClient`
- `BobHTTPClient`

**Imports**:
- `../../utils/logger.js`
- `../../utils/errors.js`
- `./types.js`

### `core/bob-integration/client.ts`

**Language**: TypeScript  
**Lines**: 278  
**Complexity**: 21

**Exports**:
- `createBobClient`
- `BobClient`

**Imports**:
- `../../utils/logger.js`
- `../../utils/errors.js`
- `./http-client.js`
- `./types.js`


## Functions

### Functions in `index.ts`

#### `export async function main()`

**Location**: Line 13  
**Complexity**: 3  
**Exported**: Yes  
**Async**: Yes

### Functions in `utils/progress.ts`

#### `export function createProgress()`

**Location**: Line 255  
**Complexity**: 1  
**Exported**: Yes  
**Async**: No

#### `export async function withProgress()`

**Location**: Line 262  
**Complexity**: 2  
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

### Functions in `watsonx/orchestrate/client.ts`

#### `export function createOrchestrateClient()`

**Location**: Line 511  
**Complexity**: 1  
**Exported**: Yes  
**Async**: No

### Functions in `watsonx/ai/client.ts`

#### `export function createWatsonxAIClient()`

**Location**: Line 473  
**Complexity**: 1  
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

**Location**: Line 814  
**Complexity**: 1  
**Exported**: Yes  
**Async**: No

### Functions in `core/doc-generator/generator.ts`

#### `export function createDocGenerator()`

**Location**: Line 607  
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

### Functions in `core/code-analyzer/index.ts`

#### `export async function analyzeCode()`

**Location**: Line 16  
**Complexity**: 1  
**Exported**: Yes  
**Async**: Yes

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

**Location**: Line 558  
**Complexity**: 1  
**Exported**: Yes  
**Async**: No

### Functions in `core/bob-integration/http-client.ts`

#### `export function createHTTPClient()`

**Location**: Line 266  
**Complexity**: 1  
**Exported**: Yes  
**Async**: No

### Functions in `core/bob-integration/client.ts`

#### `export function createBobClient()`

**Location**: Line 273  
**Complexity**: 1  
**Exported**: Yes  
**Async**: No


## Classes

### Classes in `utils/progress.ts`

#### `export class ProgressIndicator`

**Location**: Line 42  
**Exported**: Yes  
**Methods**: 10  
**Properties**: 5

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

### Classes in `server/index.ts`

#### `export class DashboardServer`

**Location**: Line 18  
**Exported**: Yes  
**Methods**: 13  
**Properties**: 2

### Classes in `watsonx/orchestrate/client.ts`

#### `export class OrchestrateClient`

**Location**: Line 23  
**Exported**: Yes  
**Methods**: 18  
**Properties**: 2

### Classes in `watsonx/ai/client.ts`

#### `export class WatsonxAIClient`

**Location**: Line 24  
**Exported**: Yes  
**Methods**: 19  
**Properties**: 3

### Classes in `core/task-automator/automator.ts`

#### `export class TaskAutomator`

**Location**: Line 32  
**Exported**: Yes  
**Methods**: 17  
**Properties**: 2

### Classes in `core/doc-generator/generator.ts`

#### `export class DocGenerator`

**Location**: Line 21  
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

**Location**: Line 26  
**Exported**: Yes  
**Methods**: 14  
**Properties**: 1

### Classes in `core/bob-integration/http-client.ts`

#### `export class BobHTTPClient`

**Location**: Line 51  
**Exported**: Yes  
**Methods**: 6  
**Properties**: 3

### Classes in `core/bob-integration/client.ts`

#### `export class BobClient`

**Location**: Line 22  
**Exported**: Yes  
**Methods**: 11  
**Properties**: 5


## Dependencies

### Dependency Graph

Total dependencies: 82

**`index.ts`** imports:
- `./utils/logger.js`
- `./utils/config.js`
- `./core/bob-integration/index.js`

**`utils/progress.ts`** imports:
- `chalk`

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

**`server/index.ts`** imports:
- `express`
- `cors`
- `path`
- `url`
- `../utils/logger.js`
- `../utils/config.js`
- `../core/bob-integration/index.js`
- `../core/code-analyzer/index.js`

**`cli/index.ts`** imports:
- `commander`
- `chalk`
- `../core/code-analyzer/cli.js`
- `../core/doc-generator/cli.js`
- `../core/task-automator/cli.js`
- `../core/task-automator/types.js`

**`watsonx/orchestrate/client.ts`** imports:
- `../../utils/logger.js`
- `../../utils/errors.js`
- `./types.js`

**`watsonx/ai/client.ts`** imports:
- `../../utils/logger.js`
- `../../utils/errors.js`
- `./types.js`

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
- `../../utils/progress.js`
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
- `../../utils/progress.js`
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

**`core/code-analyzer/index.ts`** imports:
- `./analyzer.js`
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
- `../../utils/progress.js`
- `./ts-parser.js`
- `./types.js`

**`core/bob-integration/http-client.ts`** imports:
- `../../utils/logger.js`
- `../../utils/errors.js`
- `./types.js`

**`core/bob-integration/client.ts`** imports:
- `../../utils/logger.js`
- `../../utils/errors.js`
- `./http-client.js`
- `./types.js`


## Code Metrics

### Complexity

- **Average**: 15.29
- **Maximum**: 80
- **Minimum**: 0

### Maintainability

- **Index**: 62.98
- **Score**: B
- **Complexity Factor**: 15.29
- **Volume**: 98422.02

### Quality

- **Documentation Coverage**: 50.0%
- **Code Smells**: 0
- **Duplicate Code**: 0%
