<template>
  <v-card class="ma-5" elevation="2">
    <v-card-actions
      @click="show = !show"
      class="d-flex cursor-pointer text-h5 font-weight-bold bg-lime-lighten-2 justify-center"
    >
      <slot name="title"> </slot>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>
        <slot name="content"> </slot>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
import { ref } from "vue";
export default {
  props: {
    slider: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const show = ref(props.slider);
    return { show };
  },
};
</script>
