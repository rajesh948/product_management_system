<template>
  <headerComponent />
  <router-view></router-view>
</template>

<script>
import headerComponent from "@/components/common/header-component.vue";
import { defineComponent } from "vue";
import "@/util/data-filler/data-filler-to-store";

export default defineComponent({
  components: {
    headerComponent,
  },
  name: "App",
});
</script>
