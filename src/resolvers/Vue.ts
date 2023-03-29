import { AsyncComponent, Component } from "vue";
import { ReactWrapper } from "../wrappers/ReactWrapper";

export default function VueResolver<T>(component: (props: T) => any) {
  return {
    components: { ReactWrapper },
    props: ["passedProps"],
    inheritAttrs: false,
    render(createElement: Vue.CreateElement) {
      return createElement(
        "react-wrapper",
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
  } as unknown as Component<any, any, any, T> | AsyncComponent<any, any, any, T>;
}
