<template>
  <v-container fluid>
    <div class="title">Products</div>

    <v-alert
      width="500"
      v-if="isShowAlert"
      class="set-right"
      closable
      text="product add successfully !"
      type="success"
    ></v-alert>

    <v-sheet class="d-flex align-center justify-end mt-n9 mr-16">
      <!-- searching -->
      <v-card-title class="w-50">
        <v-text-field
          class="my-5"
          v-model="searchValue"
          density="compact"
          variant="solo"
          label="Search"
          append-inner-icon="mdi-magnify"
          single-line
          hide-details
          @input="onSearching"
        ></v-text-field>
      </v-card-title>

      <!-- category element -->
      <v-btn color="">
        {{ selectedCategoryField.name }}
        <v-menu activator="parent">
          <v-list>
            <v-list-item
              v-for="item in categoryField"
              :key="item.id"
              :value="item.id"
            >
              <v-list-item-title @click="onSelectCategory(item)">{{
                item.name
              }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>

      <!-- sorting element -->
      <v-btn class="ms-3" color="">
        {{ selectedSortField }}
        <v-menu activator="parent">
          <v-list>
            <v-list-item
              v-for="(item, index) in sortingField"
              :key="index"
              :value="index"
            >
              <v-list-item-title @click="onSorting(item.title)">{{
                item.title
              }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>

      <!-- order btn -->
      <v-btn
        class="ms-3"
        @click="onSortingOrder(sortOrder)"
        density="comfortable"
        :icon="sortingOrderIcon"
      ></v-btn>
    </v-sheet>

    <!-- product element -->
    <v-container fluid>
      <v-row v-if="allProduct">
        <v-col v-for="product in allProduct" :key="product.id" cols="12" md="4">
          <productBoxComponent :product="product" @showAlert="showAlert" />
        </v-col>
        <v-col v-if="!allProduct.length" class="d-flex ma-15 justify-center">
          <v-chip class="text-h3 ma-16 pa-16 font-weight-black" variant="plain">
            No Filter Results.
          </v-chip>
        </v-col>
      </v-row>
      <loaderComponent v-else />
    </v-container>
  </v-container>
</template>
<script>
import productBoxComponent from "@/components/ui/product-box-component";
import loaderComponent from "@/components/ui/loader-component";
import { computed, ref } from "vue";
import {
  getAllCategory,
  getAllProduct,
  getProductsByCategory,
} from "@/services";
export default {
  components: {
    productBoxComponent,
    loaderComponent,
  },
  setup() {
    const allProduct = ref(null);
    const selectedSortField = ref("Sorting");
    const selectedCategoryField = ref({ id: 0, name: "Category" });
    const sortOrder = ref("asc");
    const isShowAlert = ref(false);
    const searchValue = ref("");
    const categoryField = ref(null);

    const sortingField = [
      { title: "name" },
      { title: "price" },
      { title: "description" },
    ];

    (async () => {
      try {
        const categoryList = await getAllCategory();

        categoryField.value = categoryList.data;
        categoryField.value.unshift({ id: 0, name: "All Product" });
      } catch (error) {
        console.log(error);
      }
    })();

    const setAllProducts = async () => {
      try {
        if (selectedCategoryField.value.id) {
          const productsByCategory = await getProductsByCategory(
            selectedCategoryField.value.id,
            `?sort={"product.${selectedSortField.value}":"${sortOrder.value}"}&search=${searchValue.value}`
          );

          allProduct.value = productsByCategory.data.data.map(
            (item) => item.product
          );
        } else {
          const products = await getAllProduct(
            `?sort={"${selectedSortField.value}":"${sortOrder.value}"}&search=${searchValue.value}`
          );
          allProduct.value = products.data.data;
        }
      } catch (error) {
        console.log(error);
      }
    };
    setAllProducts();

    // sorting functionality
    const onSorting = (sortParam) => {
      selectedSortField.value = sortParam;
      setAllProducts();
    };
    const onSortingOrder = (order) => {
      sortOrder.value = order === "asc" ? "desc" : "asc";
      if (selectedSortField.value !== "Sorting") setAllProducts();
    };
    const sortingOrderIcon = computed(() =>
      sortOrder.value === "asc" ? "mdi-arrow-up-thin" : "mdi-arrow-down-thin"
    );

    //searching functionality
    let abc;
    const onSearching = () => {
      clearTimeout(abc);
      abc = setTimeout(() => {
        setAllProducts();
      }, 900);
    };

    const showAlert = () => {
      isShowAlert.value = true;

      setTimeout(() => {
        isShowAlert.value = false;
      }, 700);
    };

    // category functionality
    const onSelectCategory = (category) => {
      selectedCategoryField.value = category;
      setAllProducts();
    };
    return {
      allProduct,
      sortingOrderIcon,
      selectedSortField,
      onSortingOrder,
      sortingField,
      sortOrder,
      onSorting,
      searchValue,
      onSearching,
      isShowAlert,
      showAlert,
      selectedCategoryField,
      categoryField,
      onSelectCategory,
    };
  },
};
</script>
<style scoped>
.set-right {
  position: fixed;
  z-index: 1;
  top: 80px;
  right: 0;
  padding: 8px;
}
</style>
