import { defineComponent } from 'vue';

import { ReactWrapper } from '../wrappers/ReactWrapper';

type CompType<T extends {}> = (props: T) => JSX.Element | undefined;

type GlobalComponentConstructor<Props = {}, Slots = {}> = {
  new (): {
    $props: Props;
    $slots: Slots;
  };
};

export function ReactInVue<T extends {}>(component: CompType<T>) {
  return defineComponent({
    components: { ReactWrapper },
    props: ['passedProps'],
    inheritAttrs: false,
    render(createElement: Vue.CreateElement) {
      return createElement(
        'react-wrapper',
        {
          props: {
            component,
            passedProps: (this as any).$props.passedProps,
          },
          attrs: (this as any).$attrs,
          on: (this as any).$listeners,
        },
        (this as any).$slots.default
      );
    },
    methods: {
      reactRef(): React.RefObject<CompType<T>> {
        return (this.$children[0] as any).reactComponentRef.reactRef.current;
      },
    },
  }) as unknown as GlobalComponentConstructor<T>;
}
