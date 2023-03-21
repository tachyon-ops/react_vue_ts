<template>
  <div id="app">
    <p>Hello World!</p>
    <button v-on:click="toggleShow">Toggle</button>
    <TestInVue v-if="show" foo="Hi from VUE">
      <div>This is a children from VUE00</div>
    </TestInVue>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ReactInVue } from 'vuera-ts';
// import { ReactInVue } from '../vuera';
import { Test } from '../reactui/HelloWorld';

const TestInVue = ReactInVue(Test);

export default defineComponent({
  name: 'app',
  components: {
    TestInVue,
  },
  data: function () {
    return {
      show: true,
    };
  },
  methods: {
    toggleShow: function () {
      this.show = !this.show;
    },
  },
});
</script>
