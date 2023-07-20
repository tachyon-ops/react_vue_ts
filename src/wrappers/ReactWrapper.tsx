import React from "react";
import { Root, createRoot } from "react-dom/client";
import { VueWrapper } from "./VueWrapper";
import { v4 } from "uuid";

const makeReactContainer = (Component: any) =>
  class ReactInVue extends React.Component {

    public reactRef : React.RefObject<unknown>;

    static displayName = `ReactInVue${
      Component.displayName || Component.name || "Component"
    }`;

    constructor(props: any) {
      super(props);

      /**
       * Attach internal reference, so calls to child methods are allowed.
       */
      this.reactRef = React.createRef();

      /**
       * We create a stateful component in order to attach a ref on it. We will use that ref to
       * update component's state, which seems better than re-rendering the whole thing with
       * ReactDOM.
       */
      (this as any).state = { ...props };
    }

    wrapVueChildren(children: any) {
      // console.log("wrapVueChildren: ", children);
      if (children)
        return {
          render: (createElement: any) => createElement("div", children),
        };
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
      const wrappedChildren = this.wrapVueChildren(children);

      const VueWrapperRender = VueWrapper as unknown as (props: {
        component: any;
      }) => JSX.Element;

      if ("ReactInVueTestAA" === ReactInVue.displayName) {
        // console.log("THIS IS IT!", Component.render);
      }

      // console.log("wrappedChildren: ", wrappedChildren);

      return (
        <Component ref={this.reactRef} {...rest}>
          {wrappedChildren && <VueWrapperRender component={wrappedChildren} />}
        </Component>
      );
    }
  } as unknown as () => JSX.Element;

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
      // console.log("before creating NewComp");
      // console.log("Name: ", comp.name || comp.displayName);
      // console.log(comp);

      const children =
        s.$slots.default !== undefined ? { children: s.$slots.default } : {};

      // if (!comp.functional) {
      const Component = makeReactContainer(comp);
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
      (this as any).reactComponentRef.setState({ children: null });
    }
  },
  reactRef() : any {
    return (this as any).reactComponentRef;
  },
  inheritAttrs: false,
  watch: {
    $attrs: {
      handler() {
        (this as any).reactComponentRef.setState({
          ...(this as any).$attrs,
        });
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
        (this as any).reactComponentRef.setState({
          ...(this as any).$listeners,
        });
      },
      deep: true,
    },
    "$props.passedProps": {
      handler() {
        (this as any).reactComponentRef.setState({
          ...(this as any).$props.passedProps,
        });
      },
      deep: true,
    },
  },
};
