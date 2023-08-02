<template>
  <div v-if="productList">
    <showSliderItemComponent>
      <template v-slot:title>
        <v-banner :elevation="0" class="pa-3 bg-lime-lighten-2" border>
          <div class="float-left text-h4 font-weight-black">Product Table</div>

          <v-btn
            v-if="isUserAccessible('addProduct')"
            class="float-right"
            @click.stop="onShowAddForm"
            variant="tonal"
          >
            <v-icon icon="mdi-plus" size="x-large"></v-icon>
            <v-tooltip
              activator="parent"
              location="top"
              text="Create New User"
            ></v-tooltip>
          </v-btn>
        </v-banner>
      </template>
      <template v-slot:content>
        <v-banner :elevation="0" class="bg-lime-lighten-4" border>
          <v-card-title class="w-75">
            <v-text-field
              v-model="searchValue"
              density="compact"
              variant="solo"
              label="Search"
              append-inner-icon="mdi-magnify"
              single-line
              hide-details
              @input="onSearchingProduct"
            ></v-text-field>
          </v-card-title>
        </v-banner>
        <v-table height="550px" fixed-header hover>
          <thead>
            <tr class="text-h6 bg-red">
              <th v-for="item in tableHeader" :key="item.title">
                {{ item.title }}
              </th>
            </tr>
          </thead>
          <tbody v-if="productList">
            <tr v-for="product in productList" :key="product.id">
              <td>{{ product.name }}</td>
              <td>{{ product.price }}</td>
              <td>{{ product.quantity }}</td>
              <td>{{ product.description }}</td>
              <td>
                <v-img
                  :width="150"
                  aspect-ratio="16/9"
                  cover
                  :src="getImageLink(product.image)"
                ></v-img>
              </td>
              <td>
                <v-btn
                  v-if="isUserAccessible('updateProduct')"
                  @click="onShowEditForm(product)"
                  variant="text"
                >
                  <v-icon icon="mdi-pencil" size="large"></v-icon>
                  <v-tooltip
                    activator="parent"
                    location="top"
                    text="Edit"
                  ></v-tooltip>
                </v-btn>
                <v-btn
                  v-if="isUserAccessible('deleteProduct')"
                  @click="onDeleteProduct(product.id)"
                  variant="text"
                >
                  <v-icon icon="mdi-delete" size="large"></v-icon>
                  <v-tooltip
                    activator="parent"
                    location="top"
                    text="Delete"
                  ></v-tooltip>
                </v-btn>
              </td>
            </tr>
            <tr>
              <td colspan="6" class="text-center">
                <v-btn @click="onShowMoreProducts">Load More </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </template>
    </showSliderItemComponent>
  </div>
  <loaderComponent v-else />
  <dialogBoxComponent
    :dialogTitle="formTitle"
    v-if="isShowProductForm"
    @closeDialogBox="isShowProductForm = false"
  >
    <template v-slot:main>
      <v-form ref="formRef" @submit.prevent="submitAction">
        <v-text-field
          v-model="productObject.name"
          :rules="validationSchema.name"
          name="name"
          label="title"
        ></v-text-field>
        <v-text-field
          v-model="productObject.price"
          :rules="validationSchema.number"
          name="price"
          label="price"
        ></v-text-field>
        <v-text-field
          v-model="productObject.quantity"
          :rules="validationSchema.number"
          label="quantity"
          name="quantity"
        ></v-text-field>
        <v-text-field
          v-model="productObject.description"
          :rules="validationSchema.description"
          label="description"
          name="description"
        ></v-text-field>
        <v-card class="mx-auto" max-width="244" v-if="isImageShow">
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn icon="mdi-close-circle" @click="closeImage"></v-btn>
          </v-card-actions>
          <v-img
            :src="getImageLink(productObject.image)"
            height="200px"
            cover
          ></v-img>
        </v-card>
        <v-file-input
          v-else
          :rules="validationSchema.image"
          accept=".png ,.jpg,.jpeg"
          label="image"
          name="image"
          showSize
          v-model="productObject.image"
        ></v-file-input>
        <v-btn type="submit" block class="mt-2">Submit</v-btn>
      </v-form>
    </template>
  </dialogBoxComponent>
</template>

<script>
import { computed, reactive, ref } from "vue";
import {
  addProduct,
  deleteProduct,
  getAllProduct,
  updateProduct,
} from "@/services";
import { getImageLink, validationSchema, isUserAccessible } from "@/util";
import dialogBoxComponent from "@/components/ui/dialog-box-component";
import showSliderItemComponent from "@/components/ui/show-slider-item-component";
import loaderComponent from "@/components/ui/loader-component";
export default {
  components: {
    dialogBoxComponent,
    showSliderItemComponent,
    loaderComponent,
  },
  setup() {
    const productList = ref(null);
    const isImageShow = ref(false);
    const searchValue = ref("");
    const isShowProductForm = ref(null);
    const limit = ref(5);
    const formRef = ref(null);
    const productObject = reactive({
      id: null,
      name: null,
      price: null,
      quantity: null,
      description: null,
      image: null,
    });
    const tableHeader = [
      { title: "Name", align: "start", key: "name" },
      { title: "Price", key: "price" },
      { title: "Quantity", key: "quantity" },
      { title: "Details", key: "description" },
      { title: "Image", key: "image" },
      { title: "Action", key: "" },
    ];

    const setProduct = async () => {
      try {
        const products = await getAllProduct(
          `?search=${searchValue.value}&limit=${limit.value}`
        );
        productList.value = products.data.data;
      } catch (error) {
        console.log(error);
      }
    };
    setProduct();

    const onShowMoreProducts = () => {
      limit.value += 10;
      setProduct();
    };

    const getFormData = () => {
      const formData = new FormData();
      for (const key in productObject) {
        if (key === "id" || key === "image") continue;
        formData.append(key, productObject[key]);
      }
      formData.append("image", productObject.image[0]);
      return formData;
    };

    const onAddProduct = async () => {
      try {
        if (formRef.value.isValid) {
          await addProduct(getFormData());
          isShowProductForm.value = false;
          setProduct();
        }
      } catch (error) {
        console.log(error);
      }
    };

    const onUpdateProduct = async () => {
      try {
        if (formRef.value.isValid) {
          await updateProduct(productObject.id, getFormData());

          isShowProductForm.value = false;
          setProduct();
        }
      } catch (error) {
        console.log(error);
      }
    };

    const submitAction = computed(() =>
      productObject.id ? onUpdateProduct : onAddProduct
    );

    const onDeleteProduct = async (productId) => {
      try {
        await deleteProduct(productId);
        setProduct();
      } catch (error) {
        console.log(error);
      }
    };

    //searching functionality
    const onSearchingProduct = () => {
      let searchInterval;
      clearTimeout(searchInterval);
      searchInterval = setTimeout(() => {
        setProduct();
      }, 900);
    };

    const onShowEditForm = (product) => {
      Object.keys(product).forEach((key) => {
        if (Object.keys(productObject).includes(key)) {
          productObject[key] = product[key];
        }
      });
      isImageShow.value = true;
      isShowProductForm.value = true;
    };

    const onShowAddForm = () => {
      Object.keys(productObject).forEach((key) => {
        productObject[key] = null;
      });
      isImageShow.value = false;
      isShowProductForm.value = true;
    };

    const closeImage = () => {
      isImageShow.value = false;
      productObject.image = null;
    };

    const formTitle = computed(() => {
      return productObject.id ? "Edit " + " Product" : "Add New Product";
    });

    return {
      productList,
      isShowProductForm,
      isImageShow,
      tableHeader,
      validationSchema,
      getImageLink,
      formRef,
      submitAction,
      productObject,
      onDeleteProduct,
      onShowEditForm,
      onShowAddForm,
      closeImage,
      formTitle,
      isUserAccessible,
      onShowMoreProducts,
      searchValue,
      onSearchingProduct,
    };
  },
};
</script>

<style scoped>
tr {
  height: 18px !important;
}
</style>
