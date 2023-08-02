<template>
  <div class="title">Shopping Cart</div>

  <div v-if="cartProducts" class="w-50 px-5 mx-auto justify-center">
    <v-row v-if="cartProducts.length" class="bg-grey-lighten-2">
      <v-col col="12">
        <v-card>
          <v-card-title class="text-h5">
            TotalPrice: {{ getRupeeFormat(totalPrice) }}
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12" v-for="cart in cartProducts" :key="cart.createdAt">
        <v-card color="">
          <div class="d-flex flex-no-wrap justify-space-around">
            <v-avatar size="125" rounded="">
              <v-img :src="getImageLink(cart.product.image)"></v-img>
            </v-avatar>
            <div>
              <v-card-title class="text-h5">
                {{ cart.product.name }}
              </v-card-title>
              <v-card-subtitle
                >Price:
                {{ getRupeeFormat(cart.product.price) }}</v-card-subtitle
              >
              <v-card-actions>
                <v-btn
                  class=""
                  variant="outlined"
                  size=""
                  @click="onIncreaseQuantity(cart.product.id)"
                >
                  +
                </v-btn>
                <v-card-subtitle>{{ cart.quantity }}</v-card-subtitle>
                <v-btn
                  class="ms-2"
                  variant="outlined"
                  size=""
                  @click="onDecreaseQuantity(cart.product.id)"
                >
                  -
                </v-btn>
              </v-card-actions>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col class="d-flex justify-end">
        <v-btn @click="onCheckoutCart">Checkout</v-btn></v-col
      >
    </v-row>
    <v-row v-else class="d-flex flex-no-wrap justify-space-around">
      <v-chip class="text-h3 ma-16 pa-16 font-weight-black" variant="plain">
        Add Product to Cart
      </v-chip>
      <v-btn @click="onGotoHome">Add Product</v-btn>
    </v-row>
  </div>
  <div v-else class="d-flex ma-15 justify-center">
    <v-progress-circular
      indeterminate
      color=""
      :size="92"
      :width="6"
    ></v-progress-circular>
  </div>
</template>

<script>
import {
  addProductToCart,
  checkoutCart,
  getMyCartProduct,
  removeProductFromCart,
} from "@/services";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getImageLink, getRupeeFormat } from "@/util";

export default {
  setup() {
    const router = useRouter();
    const cartProducts = ref(null);
    const totalPrice = ref(null);
    const setCartProduct = async () => {
      try {
        const cartProduct = await getMyCartProduct();
        cartProducts.value = cartProduct.data;
        totalPrice.value = cartProducts.value.reduce((total, value) => {
          return total + value.product.price * value.quantity;
        }, 0);
      } catch (error) {
        console.log(error);
      }
    };
    setCartProduct();

    const onGotoHome = () => {
      router.push({ name: "home" });
    };

    const onIncreaseQuantity = async (productId) => {
      try {
        const result = await addProductToCart(productId);

        if (result.status === 201) {
          setCartProduct();
        }
      } catch (error) {
        console.log(error);
      }
    };
    const onDecreaseQuantity = async (productId) => {
      try {
        await removeProductFromCart(productId);
        setCartProduct();
      } catch (error) {
        console.log(error);
      }
    };

    const onCheckoutCart = async () => {
      try {
        checkoutCart();
        onGotoHome();
      } catch (error) {
        console.log(error);
      }
    };
    return {
      cartProducts,
      getImageLink,
      getRupeeFormat,
      onGotoHome,
      totalPrice,
      onIncreaseQuantity,
      onDecreaseQuantity,
      onCheckoutCart,
    };
  },
};
</script>
