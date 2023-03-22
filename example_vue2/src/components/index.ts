import * as tsx from "vue-tsx-support";

import HelloWorld from "./HelloWorld.vue";

interface HelloWorldProps {
  msg?: string;
}

const TypedHelloWorld = tsx.ofType<HelloWorldProps>().convert(HelloWorld);

export { TypedHelloWorld as HelloWorld };
