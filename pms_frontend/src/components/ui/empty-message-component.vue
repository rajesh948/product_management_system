<template>
  <v-container class="my-12">
    <v-row>
      <v-col class="d-flex justify-center">
        <v-chip class="text-h5 ma-10 font-weight-black" variant="plain">
          {{ message }}
        </v-chip>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: {
    message: {
      type: String,
      default: "Empty Box",
    },
  },
};
</script>
