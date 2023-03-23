<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <TestInVue foo="from VUE">
      <div>A vue children in the middle of a React comp</div>
    </TestInVue>
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import { ReactInVue } from "vuera-ts";
import HelloWorld from "./components/HelloWorld";
import { NAME, Test } from "./react_ui";

const TestInVue = ReactInVue(Test);

export default {
  name: "App",
  components: {
    HelloWorld,
    TestInVue,
  },
  methods: {
    getName() {
      return NAME;
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
