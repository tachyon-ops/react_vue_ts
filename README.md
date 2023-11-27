# Vuera in TypeScript

This is the `vuera` lib from `akxcv` (amazing effort man!). Check it [Vuera GH](https://github.com/akxcv/vuera).

Due to inactivity in `vuera` part, I've decided to move forward with `vuera-ts` and maintain it for my professional work.

## Usage

Check `./webpack_vue2` example. I prefer to control myself how files are loaded, so the project is a simple vue2 project build from scratch using `webpack v5` .
In a nutshell:

### Install

`yarn add vuera-ts`

### Usage

```tsx
import { ReactInVue } from "vuera-ts";
import { TestComp } from "./react_ui";

const TestCompInVue = ReactInVue(TestComp);
```

Then you can use `TestCompInVue` in your Vue component. Register it in `Vue.components` then add it to your `template` like so:

```jsx
<TestCompInVue foo="bar from Vue">
  This is a children from Vue - it updates on Hot Reload! :D
</TestCompInVue>
```

## Library specific

### Clone the project

`git clone git@github.com:tachyon-ops/react_vue_ts.git`

### Install lib

`yarn`

### Build

`yarn build`

### Publish

`yarn publish`

## TODO

- [ ] Setup `webpack_vue3` example
- [ ] Setup `webpack_react` example
- [ ] Check if Vue in react works (I am not very motivated to do it)

## Contributors

I really enjoy people recognizing others. Therefore, whoever contributes to our project will have a mention here :)
I am very grateful!

- [Juan Lago @juanparati](https://github.com/juanparati)
