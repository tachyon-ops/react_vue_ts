import _Vue from 'vue';

import { ReactInVue } from './resolvers/Vue';
import { isReactComponent } from './utils/isReactComponent';

/**
 * This mixin automatically wraps all React components into Vue.
 */
export const VuePlugin = {
  install(Vue: typeof _Vue, options: any) {
    console.log('Installing Vuera VuePlugin');
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

      const wrappedComponents = mergedValue
        ? Object.entries(mergedValue).reduce(
            (acc, [k, v]) => ({
              ...acc,
              [k]: isReactComponent(v) ? ReactInVue(v as any) : v,
            }),
            {}
          )
        : mergedValue;
      return Object.assign(mergedValue, wrappedComponents) as {
        [k: string]: Vue.Component;
      };
    };
    Vue.prototype.constructor.isVue = true;
  },
};
