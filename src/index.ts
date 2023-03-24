import { ReactWrapper } from "./wrappers/ReactWrapper";
import { VueWrapper } from "./wrappers/VueWrapper";
import { VuePlugin } from "./VuePlugin";
import {
  VueInReact,
  babelReactResolver as __vueraReactResolver,
} from "./resolvers/React";

import ReactInVue from "./resolvers/Vue";

export {
  ReactWrapper,
  VueWrapper,
  __vueraReactResolver,
  VuePlugin,
  VueInReact,
  ReactInVue,
};
