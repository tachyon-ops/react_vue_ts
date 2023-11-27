import _Vue from "vue";

import isReactComponent from "./utils/isReactComponent";
import VueResolver from "./resolvers/Vue";

/**
 * This mixin automatically wraps all React components into Vue.
 */
export const VuePlugin = {
  install(Vue: typeof _Vue) {
    console.log("Installing Vuera VuePlugin");
    /**
     * We define a custom merging strategy for the `components` field. This strategy really just
     * wraps all the React components while leaving Vue components as is.
     */
    const originalComponentsMergeStrategy =
      Vue.config.optionMergeStrategies.components;

    Vue.config.optionMergeStrategies.components = function (
      parent: { [k: string]: Vue.Component },
      ...args: any
    ) {
      const mergedValue = originalComponentsMergeStrategy(parent, ...args);

      const reducer = Object.entries(mergedValue).reduce(
        (acc, [k, v]) => ({
          ...acc,
          [k]: isReactComponent(v) ? VueResolver(v as any) : v,
        }),
        {}
      );
      const wrappedComponents = mergedValue ? reducer : mergedValue;
      return Object.assign(mergedValue, wrappedComponents) as {
        [k: string]: Vue.Component;
      };
    };
    Vue.prototype.constructor.isVue = true;
  },
};
