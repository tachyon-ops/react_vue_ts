import React from "react";
import { createRoot, Root } from "react-dom/client";
import { v4 } from "uuid";

import { VueWrapper } from "./VueWrapper";

const makeReactContainer = (Component: any) => {
  class ReactInVue extends React.Component {
    static displayName = `ReactInVue${
      Component.displayName || Component.name || "Component"
    }`;

    constructor(props: any) {
      super(props);

      /**
       * Attach internal reference, so calls to child methods are allowed.
       */

      /**
       * We create a stateful component in order to attach a ref on it. We will use that ref to
       * update component's state, which seems better than re-rendering the whole thing with
       * ReactDOM.
       */
      (this as any).state = { ...props };
    }

    wrapVueChildren(children: any) {
      if (children) {
        return {
          render: (createElement: any) => createElement("div", children),
        };
      }
      return null;
    }

    render() {
      const {
        children,
        // Vue attaches an event handler, but it is missing an event name, so
        // it ends up using an empty string. Prevent passing an empty string
        // named prop to React.
        "": _invoker,
        ...rest
      } = (this as any).state;

      const { forwardedRef } = this.props as any;

      const wrappedChildren = this.wrapVueChildren(children);
      const VueWrapperRender = VueWrapper as unknown as (props: {
        component: any;
      }) => JSX.Element;

      return (
        <Component ref={forwardedRef as any} {...rest}>
          {wrappedChildren && <VueWrapperRender component={wrappedChildren} />}
        </Component>
      );
    }
  }

  return ReactInVue;
};

const RootMap: Map<string, Root> = new Map();

export const ReactWrapper = {
  name: "ReactInVueRawVueComp",
  props: ["component", "passedProps"],
  render(createElement: any) {
    (this as any).createElement = createElement; // save for later
    (this as any).uuid = v4();
    return createElement("div", { ref: "react" });
  },
  methods: {
    mountReactComponent(comp: any) {
      const s = this as any;
      const children =
        s.$slots.default !== undefined ? { children: s.$slots.default } : {};

      // if (!comp.functional) {
      const Component = makeReactContainer(comp) as unknown as any;
      const NewComp = (props: any) => (
        <Component {...props} ref={(ref: any) => (s.reactComponentRef = ref)} />
      );

      const root = createRoot(s.$refs.react);
      root.render(
        <NewComp
          {...s.$props.passedProps}
          {...s.$attrs}
          {...s.$listeners}
          {...children}
        />
      );
      RootMap.set((this as any).uuid, root);
    },
  },
  mounted() {
    (this as any).mountReactComponent((this as any).$props.component);
  },
  beforeDestroy() {
    // ReactDOM.unmountComponentAtNode((this as any).$refs.react);
    const root = RootMap.get((this as any).uuid);
    if (root) root.unmount();
  },
  updated() {
    /**
     * AFAIK, this is the only way to update children. It doesn't seem to be possible to watch
     * `$slots` or `$children`.
     */
    if ((this as any).$slots.default !== undefined) {
      (this as any).reactComponentRef.setState({
        children: (this as any).$slots.default,
      });
    } else {
      if ((this as any).reactComponentRef) {
        if ((this as any).reactComponentRef.props) {
          (this as any).reactComponentRef.props.children = null;
        }
        if ((this as any).reactComponentRef.setState) {
          (this as any).reactComponentRef.setState({
            children: null,
          });
        }
      }

      (this as any).reactComponentRef.setState({ children: null });
    }
  },
  reactRef(): any {
    // TODO: any reference to the inner React component will break the type (user could force it himself)
    // but there might be a way to make it generic, since we do receive the component as a function argument
    return (this as any).reactComponentRef;
  },
  inheritAttrs: false,
  watch: {
    $attrs: {
      handler() {
        if ((this as any).reactComponentRef) {
          if ((this as any).reactComponentRef.props) {
            (this as any).reactComponentRef.props = { ...(this as any).$attrs };
          }
          if ((this as any).reactComponentRef.setState) {
            (this as any).reactComponentRef.setState({
              ...(this as any).$attrs,
            });
          }
        }
      },
      deep: true,
    },
    "$props.component": {
      handler(newValue: any) {
        (this as any).mountReactComponent(newValue);
      },
    },
    $listeners: {
      handler() {
        if ((this as any).reactComponentRef) {
          if ((this as any).reactComponentRef.props) {
            (this as any).reactComponentRef.props = {
              ...(this as any).$listeners,
            };
          }
          if ((this as any).reactComponentRef.setState) {
            (this as any).reactComponentRef.setState({
              ...(this as any).$listeners,
            });
          }
        }
      },
      deep: true,
    },
    "$props.passedProps": {
      handler() {
        if ((this as any).reactComponentRef) {
          if ((this as any).reactComponentRef.props) {
            (this as any).reactComponentRef.props = {
              ...(this as any).$passedProps,
            };
          }
          if ((this as any).reactComponentRef.setState) {
            (this as any).reactComponentRef.setState({
              ...(this as any).$passedProps,
            });
          }
        }
      },
      deep: true,
    },
  },
};
