import React from 'react';
import { Root, createRoot } from 'react-dom/client';
import VueWrapper from './Vue';
import { v4 } from 'uuid';

const VueWrapperRender = VueWrapper as unknown as (props: {
  component: any;
}) => JSX.Element;

const wrapVueChildren = (children: any) => {
  // console.log('wrapVueChildren: ', children);
  if (children) {
    return {
      render: (createElement: any) => createElement('div', children),
    };
  }
  return null;
};

const makeReactContainer = (Component: any) =>
  class ReactInVue extends React.Component {
    static displayName = `ReactInVue${
      Component.displayName || Component.name || 'Component'
    }`;

    static wrappedChildren: {
      render: (createElement: any) => any;
    } | null;

    constructor(props: any) {
      super(props);

      /**
       * We create a stateful component in order to attach a ref on it. We will use that ref to
       * update component's state, which seems better than re-rendering the whole thing with
       * ReactDOM.
       */
      this.state = { ...props };
    }

    static getDerivedStateFromProps(prevProps: any, nextProps: any) {
      console.log(
        'REACT::getDerivedStateFromProps, NEXT: ',
        nextProps.children[0].children[0],
        'PREV: ',
        prevProps.children[0].children[0]
      );
      const newChildren = wrapVueChildren(nextProps.children);
      return {
        ...nextProps,
        newChildren,
      };
    }

    render() {
      const {
        children,
        newChildren,
        // Vue attaches an event handler, but it is missing an event name, so
        // it ends up using an empty string. Prevent passing an empty string
        // named prop to React.
        '': _invoker,
        ...rest
      } = (this as any).state;

      return (
        <Component {...rest}>
          {newChildren && <VueWrapperRender component={newChildren} />}
        </Component>
      );
    }
  };

const RootMap: Map<string, Root> = new Map();

export default {
  name: 'ReactInVueRawVueComp',
  props: ['component', 'passedProps'],
  render(createElement: any) {
    (this as any).createElement = createElement; // save for later
    (this as any).uuid = v4();
    return createElement('div', { ref: 'react' });
  },
  methods: {
    mountReactComponent(comp: any) {
      const s = this as any;
      // console.log('before creating NewComp');
      // console.log('Name: ', comp.name || comp.displayName);
      // console.log(comp);

      const children =
        s.$slots.default !== undefined ? { children: s.$slots.default } : {};

      const Component = makeReactContainer(
        comp
      ) as unknown as () => JSX.Element;

      let NewComp = (props: any) => (
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
    // console.log('RawVuewReactWrapper::mounted');
  },
  beforeDestroy() {
    //     ReactDOM.unmountComponentAtNode((this as any).$refs.react);
    const root = RootMap.get((this as any).uuid);
    if (root) root.unmount();
  },
  updated() {
    /**
     * AFAIK, this is the only way to update children. It doesn't seem to be possible to watch
     * `$slots` or `$children`.
     */
    const ref = (this as any).reactComponentRef as React.Component;
    const vueChildren = (this as any).$slots.default;
    // console.log('RawVuewReactWrapper::updated', vueChildren);
    if (vueChildren !== undefined) {
      ref.setState({ children: vueChildren });
    } else {
      ref.setState({ children: null });
    }
  },
  inheritAttrs: false,
  watch: {
    $attrs: {
      handler() {
        (this as any).reactComponentRef.setState({ ...(this as any).$attrs });
      },
      deep: true,
    },
    '$props.component': {
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
    '$props.passedProps': {
      handler() {
        (this as any).reactComponentRef.setState({
          ...(this as any).$props.passedProps,
        });
      },
      deep: true,
    },
  },
};
