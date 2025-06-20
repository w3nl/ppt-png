# Copilot Instructions

## Philosophy

- **Pure Functions**: Favor pure functions (no side effects, no mutation, deterministic) as advocated by Eric Elliott.
- **Test-Driven Development (TDD)**: Write tests first, code in small, testable increments, following Uncle Bob’s TDD cycle.
- **Extreme Programming (XP)**: Embrace simplicity, communication, feedback, and courage. Prefer small, frequent, high-quality changes.
- **Framework Agnostic**: Do not use any frameworks or libraries unless explicitly requested. Use only standard JavaScript (ESM).
- **JSDoc**: All functions, classes, and modules must be documented with JSDoc for type safety and clarity.
- **Design Patterns**: Use classic, well-known patterns (factory, strategy, observer, etc.) only when they add clarity or testability.
- **Clean Code**: Prioritize readability, maintainability, and simplicity. Avoid cleverness for its own sake.
- **Testability**: All code should be easily testable. Avoid hidden dependencies and global state.
- **Small Iterations**: Make small, incremental changes. Each change should be easy to review and test.
- **No Frameworks**: Do not use React, Vue, Angular, or any other framework. No build tools unless explicitly requested.

## Coding Guidelines

- Use **ES Modules** (`import`/`export`).
- Use **pure functions** wherever possible.
- Use **const** and **let** (never `var`).
- Use **arrow functions** for short, stateless functions.
- Use **descriptive names** for variables, functions, and classes.
- **No mutation** of input arguments.
- **No side effects** in pure functions.
- **No global state** unless absolutely necessary (and then, document it).
- **JSDoc** for every function, class, and exported symbol.
- **Write a test** for every new function or feature (see `/src/*.test.js` for examples).
- **Keep files small** and focused on a single responsibility.
- **No magic numbers**—use named constants.
- **No unnecessary abstractions**—keep it simple.

## Example Function

```js
/**
 * Adds two numbers (pure function).
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export const add = (a, b) => a + b
```

## Example Test

```js
import assert from 'node:assert/strict'
import { add } from './add.js'

assert.equal(add(2, 3), 5)
```

## When in Doubt

- **Ask for clarification** if requirements are unclear.
- **Prefer simplicity** over cleverness.
- **Write tests** for all edge cases.
- **Document** all exported symbols with JSDoc.

---

**Summary:**  
Write clean, pure, framework-agnostic JavaScript (ESM) with JSDoc and tests.  
Favor small, testable, incremental changes.  
No frameworks, no unnecessary abstractions, no side effects.

---

