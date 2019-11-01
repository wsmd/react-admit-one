<h1 align="center">
  <img src="https://user-images.githubusercontent.com/2100222/67962039-ec705700-fbd2-11e9-8811-fdf436dbe831.png" width="554" />
  <br>
  <code>react-admit-one</code>
</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/react-admit-one">
    <img src="https://img.shields.io/npm/v/react-admit-one.svg" alt="Current Release" />
  </a>
  <a href="https://travis-ci.org/wsmd/react-admit-one">
    <img src="https://travis-ci.org/wsmd/react-admit-one.svg?branch=master" alt="CI Build">
  </a>
  <a href="https://coveralls.io/github/wsmd/react-admit-one?branch=master">
    <img src="https://coveralls.io/repos/github/wsmd/react-admit-one/badge.svg?branch=master" alt="Coverage Status">
  </a>
  <a href="https://github.com/wsmd/react-admit-one/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/wsmd/react-admit-one.svg" alt="Licence">
  </a>
</p>

<details>
<summary>📖 Table of Contents</summary>
<p>

- [Motivation](#motivation)
- [Getting Started](#getting-started)
- [Examples](#examples)
  - [Basic Usage](#basic-usage)
  - [Debugging](#debugging)
  - [Preventing Future Mounts after the First Instance Unmounts](#preventing-future-mounts-after-the-first-instance-unmounts)
  - [Lifecycle Callbacks](#lifecycle-callbacks)
  - [Specifying Explicit Boundaries](#specifying-explicit-boundaries)
- [API Reference](#api-reference)
  - [`admitOne(component, [options])`](#admitonecomponent-options)
  - [`<AdmitOneBoundary>`](#admitoneboundary)
- [License](#license)

</p>
</details>

## Motivation

Do you have a React component that is intended to be mounted and used only once in your application? Perhaps this component performs some sort of side-effect or has some global state, so it's expected to be mounted once.

Working with global state and side-effects, however, can be tricky and needs to be handled with caution. Have you considered what will happen if those components were accidentally mounted twice in your application? Chances are bad things will happen.

Managing those components is especially challenging if you happen to work on a very large project with a growing team. Documentation can help avoid situations like this. Additionally, those components could also implement some logic from within to prevent them from being used twice, but that sounds like a lot of work.

`react-admit-one` attempts to solve this specific problem, or preventing it from happening, by guarding those components and restricting their use (mount) to one instance only.

It's kind of an admit-one ticket that costs [less than 500 bytes](https://github.com/ai/size-limit) for your components! Not only that, but it's also built with [great developer experience](#debugging) in mind.

## Getting Started

To get started, add `react-admit-one` to your project:

```sh
# using npm
npm install --save react-admit-one

# using yarn
yarn add react-admit-one
```

Please note that `react-admit-one` requires `react@^16.8.0` as a peer dependency.

## Examples

### Basic Usage

At the core, `react-admit-one` is a higher-order component that wraps other components that are expected to be used once (or mounted one at a time) throughout the application runtime.

```jsx
import React from 'react';
import { admitOne } from 'react-admit-one';

class SideEffectComponent extends React.Component {
  // implements some global state logic or side effects
  componentDidMount() {}

  render() {
    // ...
  }
}

export default admitOne(SideEffectComponent);
```

That is pretty much everything! When `<SideEffectComponent>` is mounted, it will work as expected.

```jsx
<>
  <SideEffectComponent />
<>
```

However, subsequent attempts to mount or use this component _anywhere in the child component tree_ while the first the instance is already mounted will no longer be permitted. For example:

```jsx
<>
  <SideEffectComponent /> {/* ← WORKS */}
  <SideEffectComponent /> {/* ← DOES NOT WORK */}
<>
```

When this happens, it will result in the following:

1. The subsequent element created will not render anything by simply returning `null`.
2. In the `development` environment, an error will be printed to the console.

### Debugging

When a restricted mount is attempted, an error message will be printed to the console (not thrown) with helpful debugging information. This includes the Javascript stacktrace for both the first mounted instance, as well as the second element attempted to mount.

<div align="center">
<img src="https://user-images.githubusercontent.com/2100222/67921674-cd47da00-fb7e-11e9-9e6c-1d0342d4869d.png" width="620" />
</div>

Please note that this functionality is only intended for development and will be stripped out in production.

### Preventing Future Mounts after the First Instance Unmounts

By default, `admitOne` prevents subsequent mounts of the same component only when the first instance is already mounted. In other words, when a component wrapped with `admitOne` unmounts, future attempts of mounting the same component will be **permitted**.

This behavior can be changed so that future attempts to mounting the same component can still be prevented even after the first instance unmounts.

```js
import React from 'react';
import { admitOne } from 'react-admit-one';

class SideEffectComponent extends React.Component {
  // implements some global state logic or side effects
  componentDidMount() {}

  render() {
    // ...
  }
}

export default admitOne(SideEffectComponent, {
  // Prevents subsequent mount attempts after the first instance unmounts
  persistTrace: true,
});
```

### Lifecycle Callbacks

When a component is wrapped `admitOne`, it's possible to attach lifecycle callbacks to the instances created including the first permitted mount as well as other restricted mounts.

All lifecycle callbacks provide access to the raw React element created when the component is rendered. You can use these callbacks to attach additional behaviors or perform certain actions. For instance, throw an error when a restricted mount is made.

```js
import React from 'react';
import { admitOne } from 'react-admit-one';

class SideEffectComponent extends React.Component {
  componentDidMount() {}
  render() {
    // ...
  }
}

export default admitOne(SideEffectComponent, {
  // called when the first instance mounts
  onMount(element) {
    element.props;
    element.type === SideEffectComponent // true
  },
  // called when the first instance unmounts
  onUnmount(element) {},
  // called when subsequent mounts are attempted
  onRestrictedMount(element) { },
});
```

### Specifying Explicit Boundaries

`react-admit-one` applies its restrictions using a shared state for your entire application. This means that a component wrapped with `admitOne` is rendered in one place of the entire child component tree, it will prevent subsequent mounts anywhere else in the tree. This will also be the case if you are using multiple React roots on the same page.

In more advanced cases, you may choose to limit those restrictions to specific parts of the child component tree, but not others. Or maybe to one React root but not another.

This can be achieved by wrapping those parts of the tree with an `<AdmitOneBoundary>`.

```jsx
import React from 'react';
import { AdmitOneBoundary } from 'react-admit-one';

// A component wrapped with admitOne()
import SideEffectComponent from './SideEffectComponent';

function App() {
  return (
    <div>
      <AdmitOneBoundary>
        <SideEffectComponent /> {/* ← WORKS */}
        <SideEffectComponent /> {/* ← DOES NOT WORK */}
      </AdmitOneBoundary>
      <SideEffectComponent /> {/* ← WORKS */}
      <SideEffectComponent /> {/* ← DOES NOT WORK */}
    </div>
  );
}
```

Boundaries will apply restrictions only to the `admitOne`-components rendered below them in the tree.

You may also configure your `admitOne` components to ignore any boundaries they are rendered in.

```js
import React from 'react';
import { admitOne } from 'react-admit-one';

class WeReallyShouldBeUsingThisOnce extends React.Component {
  // implements some global state logic or side effects
  componentDidMount() {}

  render() {
    // ...
  }
}

export default admitOne(WeReallyShouldBeUsingThisOnce, {
  // Ignores any boundary restrictions
  ignoreBoundary: true,
});
```



## API Reference

### `admitOne(component, [options])`

#### Arguments <!-- omit in toc -->

- `component`: A React component to be mounted once
- `options`: (_Optional_) An object with the following interface:

```ts
interface AdmitOneOptions {
  /**
   * A callback function called on when the first instance of the component is
   * mounted.
   */
  onMount?(element: JSX.Element): void;
  /**
   * A callback function called when subsequent mount attempts occur after the
   * first instance of the component is mounted.
   */
  onRestrictedMount?(element: JSX.Element): void;
  /**
   * A callback function called when first instance of the component unmounts.
   */
  onUnmount?(element: JSX.Element): void;
  /**
   * Ignores mounting restrictions applied by any boundaries. When specified,
   * the component can only be mounted once through the entire application even
   * when mounted within a boundary. Defaults to `false`.
   */
  ignoreBoundary?: boolean;
  /**
   * Prevents subsequent mount attempts after the first instance of the component
   * unmounts. Defaults to `false`.
   */
  persistTrace?: boolean;
}
```

#### Returns <!-- omit in toc -->

A higher order component that can only be mounted once. Subsequent mount attempts after the first instance is mounted will return `null` and result in an error printed to the console (**not thrown**) in the `development` environment.

### `<AdmitOneBoundary>`

The boundary component limits the single-instance mounting restrictions only to the higher-order components created via `admitOne`, and rendered below the boundary in the tree.

#### Props <!-- omit in toc -->

- `children` The root of your component tree

## License

[MIT](https://github.com/wsmd/react-admit-one/blob/master/LICENSE)
