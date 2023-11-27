import React, {
  ForwardedRef,
  PropsWithChildren,
  ReactNode,
  createRef,
  forwardRef,
} from "react";
import { Root, createRoot } from "react-dom/client";
import { VueWrapper } from "./VueWrapper";
import { v4 } from "uuid";
import { CreateElement, VNodeChildren } from "vue";

type ReactInVueProps<T extends object> = PropsWithChildren & {
  "": unknown;
} & T;

const makeReactContainer = <E extends Element>(
  Component: (<T>(props: T) => JSX.Element) & { displayName?: string },
  ref: ForwardedRef<E>
) => {
  const ReactInVue = <T extends object>(props: ReactInVueProps<T>) => {
    const WrapVueChildren = (children: ReactNode | undefined | undefined) => {
      const vueChild = {
        render: (createElement: CreateElement) =>
          createElement("div", children as VNodeChildren),
      };
      return children ? vueChild : null;
    };

    const {
      children,
      // Vue attaches an event handler, but it is missing an event name, so
      // it ends up using an empty string. Prevent passing an empty string
      // named prop to React.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      "": _invoker,
      ...rest
    } = props;
    const wrappedChildren = WrapVueChildren(children);

    const VueWrapperRender = VueWrapper as unknown as (props: {
      component: unknown;
    }) => JSX.Element;

    if ("ReactInVueTestAA" === ReactInVue.displayName) {
      // console.log("THIS IS IT!", Component.render);
    }

    // console.log("wrappedChildren: ", wrappedChildren);

    return (
      <Component ref={ref} {...rest}>
        {WrapVueChildren && <VueWrapperRender component={wrappedChildren} />}
      </Component>
    );
  };
  ReactInVue.displayName = `ReactInVue${
    Component.displayName || Component.name || "Component"
  }`;

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
      // console.log("before creating NewComp");
      // console.log("Name: ", comp.name || comp.displayName);
      // console.log(comp);

      const children =
        s.$slots.default !== undefined ? { children: s.$slots.default } : {};

      // if (!comp.functional) {
      const Component = makeReactContainer(comp, s.reactComponentRef);
      const NewComp = (props: any) => <Component {...props} />;

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
  reactRef(): any {
    // TODO: any reference to the inner React component will break the type (user could force it himself)
    // but there might be a way to make it generic, since we do receive the component as a function argument
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
