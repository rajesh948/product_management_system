<template>
  <div class="title">Order History</div>
  <div v-if="userPurchaseHistory?.length">
    <div class="my-10" v-for="item in userPurchaseHistory" :key="item.id">
      <showSliderItemComponent :slider="false">
        <template v-slot:title>
          Order Number:
          {{ item.id }}
        </template>
        <template v-slot:content>
          <v-row>
            <v-col>
              <v-card class="bg-amber-lighten-4" elevation="1">
                <v-card-title class="text-h6">
                  Order Time: {{ getDateFormat(item.updatedAt) }}
                </v-card-title>
                <v-card-title class="text-h6">
                  TotalPrice: {{ getRupeeFormat(item.totalPrice) }}
                </v-card-title>
              </v-card>
            </v-col>

            <v-col cols="12" v-for="product in item.products" :key="product.id">
              <v-card elevation="3" color="">
                <div class="d-flex flex-no-wrap justify-space-around">
                  <v-avatar size="120" rounded="">
                    <v-img :src="getImageLink(product.image)"></v-img>
                  </v-avatar>
                  <div>
                    <v-card-title class="text-h5">
                      {{ product.name }}
                    </v-card-title>
                    <v-card-subtitle
                      >Price:
                      {{ getRupeeFormat(product.price) }}</v-card-subtitle
                    >

                    <v-card-subtitle
                      >Quantity :
                      {{ product.Cart_Product.quantity }}</v-card-subtitle
                    >
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </showSliderItemComponent>
    </div>
  </div>
  <emptyMessageComponent v-else message="Order History Not Available" />
</template>

<script>
import { ref } from "vue";
import showSliderItemComponent from "@/components/ui/show-slider-item-component.vue";
import { purchaseHistory } from "@/services";
import { getDateFormat, getImageLink, getRupeeFormat } from "@/util";
import emptyMessageComponent from "@/components/ui/empty-message-component.vue";

export default {
  components: {
    showSliderItemComponent,
    emptyMessageComponent,
  },
  setup() {
    const userPurchaseHistory = ref(null);
    (async () => {
      try {
        const purchaseData = await purchaseHistory();
        userPurchaseHistory.value = purchaseData.data;
      } catch (error) {
        console.log(error);
      }
    })();
    return { userPurchaseHistory, getDateFormat, getImageLink, getRupeeFormat };
  },
};
</script>

<style></style>
