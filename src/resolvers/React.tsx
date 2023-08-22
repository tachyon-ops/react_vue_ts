import React from 'react';

import { isReactComponent } from '../utils/isReactComponent';
import { VueWrapper as VueWrapperRaw } from '../wrappers/VueWrapper';

const VueWrapper = VueWrapperRaw as unknown as () => JSX.Element;

export function VueInReact(component: any) {
  return isReactComponent(component)
    ? component
    : (props: any) => <VueWrapper {...props} component={component} />;
}

/**
 * This function gets imported by the babel plugin. It wraps a suspected React element and, if it
 * isn't a valid React element, wraps it into a Vue container.
 */
export function babelReactResolver(component: any, props: any, children: any) {
  return isReactComponent(component)
    ? React.createElement(component, props, children)
    : React.createElement(
        VueWrapper,
        Object.assign({ component }, props),
        children
      );
}
