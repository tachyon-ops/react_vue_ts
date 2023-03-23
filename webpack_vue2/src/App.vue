<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    {{ getName() }}
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld";
import { NAME } from "./react_ui";

export default {
  name: "App",
  components: {
    HelloWorld,
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
