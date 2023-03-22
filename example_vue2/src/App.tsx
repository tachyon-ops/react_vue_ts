import Vue, { PropType, VNode } from "vue";
import { HelloWorld } from "./components";

import "./app.css";

export default Vue.extend({
  props: {
    message: [String, Function] as PropType<string | (() => string)>,
  },
  render(): VNode {
    return (
      <div id="app">
        <img alt="Vue logo" src="./assets/logo.png" width="25%" />
        <HelloWorld
          msg={typeof this.message === "string" ? this.message : this.message()}
        />
      </div>
    );
  },
});
