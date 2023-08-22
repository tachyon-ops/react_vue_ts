import React, { PropsWithChildren } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { v4 } from 'uuid';
import { defineComponent } from 'vue';

import { VueWrapper } from './VueWrapper';

const makeReactContainer = <
  P extends PropsWithChildren,
  T extends { key?: number }
>(
  Component: any
): any => {
  class ReactInVue extends React.Component {
    static displayName = `ReactInVue${
      Component.displayName || Component.name || 'Component'
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
          render: (createElement: any) => createElement('div', children),
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
        '': _invoker,
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

interface ReactState {}
interface ReactProps extends PropsWithChildren {}

export const ReactWrapper = defineComponent({
  name: 'ReactInVueRawVueComp',
  props: ['component', 'passedProps'],
  data() {
    return {
      renderComponent: true,
      uuid: v4(),
    } as unknown as {
      createElement: any;
      uuid: string;
      renderComponent: boolean;
      reactComponentRef: React.Component<ReactProps, ReactState>;
      root: Root;
    };
  },
  render(createElement: any) {
    this.createElement = createElement;
    return createElement('div', { ref: 'react' });
  },
  methods: {
    mountReactComponent<T>(comp: T) {
      const children =
        this.$slots.default !== undefined
          ? { children: this.$slots.default }
          : {};

      // if (!comp.functional) {
      const Component = makeReactContainer(comp) as unknown as any;
      const NewComp = (props: any) => (
        <Component
          {...props}
          ref={(ref: any) => (this.reactComponentRef = ref)}
        />
      );

      this.root = createRoot(this.$refs.react as any);
      this.root.render(
        <NewComp
          {...this.$props.passedProps}
          {...this.$attrs}
          {...this.$listeners}
          {...children}
        />
      );
      RootMap.set(this.uuid, this.root);
    },
  },
  mounted() {
    this.mountReactComponent(this.$props.component);
  },
  beforeDestroy() {
    const root = RootMap.get(this.uuid);
    if (root) root.unmount();
  },
  updated() {
    /**
     * AFAIK, this is the only way to update children. It doesn't seem to be possible to watch
     * `$slots` or `$children`.
     */
    if (this.$slots.default !== undefined) {
      this.reactComponentRef.setState({
        children: this.$slots.default,
      });
    } else {
      if (this.reactComponentRef) {
        if (this.reactComponentRef.shouldComponentUpdate) {
          this.reactComponentRef.shouldComponentUpdate(
            { children: null },
            this.reactComponentRef.state,
            this.reactComponentRef.context
          );
        }
        if (this.reactComponentRef.setState) {
          this.reactComponentRef.setState({
            children: null,
          });
        }
      }
    }
  },
  reactRef(): any {
    // TODO: any reference to the inner React component will break the type (user could force it himself)
    // but there might be a way to make it generic, since we do receive the component as a function argument
    return this.reactComponentRef;
  },
  inheritAttrs: false,
  watch: {
    // $attrs: {
    //   handler() {
    //     if (this.reactComponentRef) {
    //       if (this.reactComponentRef.props) {
    //         this.reactComponentRef.props = { ...this.$attrs };
    //       }
    //       if (this.reactComponentRef.setState) {
    //         this.reactComponentRef.setState({
    //           ...this.$attrs,
    //         });
    //       }
    //     }
    //   },
    //   deep: true,
    // },
    // '$props.component': {
    //   handler(newValue: any) {
    //     this.mountReactComponent(newValue);
    //   },
    // },
    // $listeners: {
    //   handler() {
    //     if (this.reactComponentRef) {
    //       if (this.reactComponentRef.props) {
    //         this.reactComponentRef.props = {
    //           ...this.$listeners,
    //         };
    //       }
    //       if (this.reactComponentRef.setState) {
    //         this.reactComponentRef.setState({
    //           ...this.$listeners,
    //         });
    //       }
    //     }
    //   },
    //   deep: true,
    // },
    // '$props.passedProps': {
    //   handler() {
    //     if (this.reactComponentRef) {
    //       if (this.reactComponentRef.props) {
    //         this.reactComponentRef.props = {
    //           ...this.passedProps,
    //         };
    //       }
    //       if (this.reactComponentRef.setState) {
    //         this.reactComponentRef.setState({
    //           ...this.passedProps,
    //         });
    //       }
    //     }
    //   },
    //   deep: true,
    // },

    $attrs: {
      handler() {
        if (this.reactComponentRef) {
          console.log('$attrs updated', this.$attrs);
          if (this.reactComponentRef.shouldComponentUpdate) {
            this.reactComponentRef.shouldComponentUpdate(
              { ...this.$attrs },
              this.reactComponentRef.state,
              this.reactComponentRef.context
            );
          }
          if (this.reactComponentRef.setState) {
            this.reactComponentRef.setState({
              ...this.$attrs,
            });
          }
        }
      },
      deep: true,
    },
    '$props.component': {
      handler(newValue: any) {
        this.mountReactComponent(newValue);
      },
    },
    $listeners: {
      handler() {
        if (this.reactComponentRef) {
          if (this.reactComponentRef.shouldComponentUpdate) {
            this.reactComponentRef.shouldComponentUpdate(
              { ...this.$listeners },
              this.reactComponentRef.state,
              this.reactComponentRef.context
            );
          }
          if (this.reactComponentRef.setState) {
            this.reactComponentRef.setState({
              ...this.$listeners,
            });
          }
        }
      },
      deep: true,
    },
    '$props.passedProps': {
      handler() {
        if (this.reactComponentRef && this.passedProps) {
          if (this.reactComponentRef.shouldComponentUpdate) {
            this.reactComponentRef.shouldComponentUpdate(
              { ...this.passedProps },
              this.reactComponentRef.state,
              this.reactComponentRef.context
            );
          }
          if (this.reactComponentRef.setState) {
            this.reactComponentRef.setState({
              ...this.passedProps,
            });
          }
        }
      },
      deep: true,
    },
  },
});
