import { defineComponent } from "vue";

import { ReactWrapper } from "../wrappers/ReactWrapper";

type CompType<T extends object> = (props: T) => JSX.Element | undefined;

type GlobalComponentConstructor<Props = object, Slots = object> = {
  new (): {
    $props: Props;
    $slots: Slots;
  };
};

export function ReactInVue<T extends object>(component: CompType<T>) {
  return defineComponent({
    components: { ReactWrapper },
    props: ["passedProps"],
    inheritAttrs: false,
    render(createElement: Vue.CreateElement) {
      return createElement(
        "react-wrapper",
        {
          props: {
            component,
            passedProps: (this.$props as any).passedProps,
          },
          attrs: this.$attrs,
          on: this.$listeners,
        },
        this.$slots.default
      );
    },
    methods: {
      reactRef(): React.RefObject<CompType<T>> {
        return (this.$children[0] as any).reactComponentRef.reactRef.current;
      },
    },
  }) as unknown as GlobalComponentConstructor<T>;
}
