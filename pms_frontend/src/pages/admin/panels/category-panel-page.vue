<template>
  <div v-if="categoryList">
    <showSliderItemComponent>
      <template v-slot:title>
        <v-banner :elevation="0" class="pa-3 bg-lime-lighten-2" border>
          <div class="float-left text-h4 font-weight-black">Category</div>
        </v-banner>
      </template>
      <template v-slot:content>
        <v-row class="mt-4">
          <v-col cols="12" v-for="category in categoryList" :key="category.id">
            <v-card
              class="d-flex align-center bg-amber-lighten-5"
              elevation="1"
            >
              <v-card-title class="text-h5 w-25 mx-10">
                {{ category.name }}
              </v-card-title>

              <div class="d-flex justify-end align-center w-75 mx-10">
                <v-btn @click="onShowCategoryProduct(category)" variant="text">
                  <v-icon icon="mdi-animation" size="x-large"></v-icon>
                  <v-tooltip
                    activator="parent"
                    location="top"
                    text="Show Products"
                  ></v-tooltip>
                </v-btn>
                <v-btn
                  v-if="isUserAccessible('updateCategory')"
                  @click="onEditCategoryFormShow(category)"
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
                  v-if="isUserAccessible('deleteCategory')"
                  @click="onDeleteCategory(category)"
                  variant="text"
                >
                  <v-icon icon="mdi-delete" size="large"></v-icon>
                  <v-tooltip
                    activator="parent"
                    location="top"
                    text="Delete"
                  ></v-tooltip>
                </v-btn>
              </div>
            </v-card>
          </v-col>
          <v-col
            v-if="isUserAccessible('addCategory')"
            class="d-flex justify-center py-5"
          >
            <v-btn @click="onShowAddCategoryForm" icon="mdi-plus">
              <v-icon icon="mdi-plus" size="large"></v-icon>
              <v-tooltip
                activator="parent"
                location="right"
                text="Add Role"
              ></v-tooltip>
            </v-btn>
          </v-col>
        </v-row>
      </template>
    </showSliderItemComponent>

    <!-- Category Add Form -->
    <dialogBoxComponent
      :dialogTitle="formTitle"
      v-if="isShowCategoryForm"
      @closeDialogBox="isShowCategoryForm = false"
    >
      <template v-slot:main>
        <v-form ref="form" @submit.prevent="onAddNewCategory">
          <v-text-field
            v-model="categoryObject.name"
            :rules="validationSchema.name"
            label="Category title"
          ></v-text-field>
          <v-combobox
            v-if="isShowProductComboBox"
            v-model="categoryObject.productList"
            chips
            :rules="validationSchema.comboBox"
            closable-chips
            label="Select Products"
            :items="productList"
            clearable
            item-title="name"
            variant="solo"
            multiple
          >
          </v-combobox>
          <v-btn type="submit" block class="mt-2">Submit</v-btn>
        </v-form>
      </template>
    </dialogBoxComponent>

    <!-- Product List  -->
    <dialogBoxComponent
      :dialogTitle="categoryObject.name + ' Product List'"
      v-if="isShowProductListDialog"
      @closeDialogBox="isShowProductListDialog = false"
    >
      <template v-slot:main>
        <div>
          <v-row v-if="categoryObject.productList?.length">
            <v-col
              cols="12"
              v-for="product in categoryObject.productList"
              :key="product.id"
            >
              <v-card elevation="3" color="">
                <div
                  class="d-flex flex-no-wrap align-center justify-space-around"
                >
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
                      >Quantity : {{ product.quantity }}</v-card-subtitle
                    >
                  </div>
                  <div v-if="isUserAccessible('removeProductFromCategory')">
                    <v-btn
                      @click="
                        onRemoveProductFromCategory(
                          product.id,
                          categoryObject.categoryId
                        )
                      "
                      variant="text"
                    >
                      <v-icon icon="mdi-delete" size="large"></v-icon>
                      <v-tooltip
                        activator="parent"
                        location="top"
                        text="Delete"
                      ></v-tooltip>
                    </v-btn>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
          <emptyMessageComponent v-else message="Product Not Found" />
        </div>
      </template>
    </dialogBoxComponent>
  </div>
  <loaderComponent v-else />
</template>

<script>
import { computed, onMounted, reactive, ref } from "vue";
import {
  addProductToCategory,
  createCategory,
  deleteCategory,
  getAllCategory,
  getAllProduct,
  getProductsByCategory,
  removeProductFromCategory,
  updateCategory,
} from "@/services";
import showSliderItemComponent from "@/components/ui/show-slider-item-component";
import dialogBoxComponent from "@/components/ui/dialog-box-component";
import loaderComponent from "@/components/ui/loader-component";
import emptyMessageComponent from "@/components/ui/empty-message-component";
import {
  getImageLink,
  getRupeeFormat,
  validationSchema,
  isUserAccessible,
} from "@/util";

export default {
  components: {
    showSliderItemComponent,
    dialogBoxComponent,
    loaderComponent,
    emptyMessageComponent,
  },
  setup() {
    const categoryList = ref(null);
    const productList = ref(null);
    const form = ref(null);
    const isShowCategoryForm = ref(false);
    const isShowProductListDialog = ref(false);
    const categoryObject = reactive({
      categoryId: null,
      name: null,
      productList: [],
    });

    onMounted(async () => {
      try {
        const products = await getAllProduct();
        productList.value = products.data.data;
      } catch (error) {
        console.log(error);
      }
    });

    const setCategory = async () => {
      try {
        const category = await getAllCategory();
        categoryList.value = category.data;
      } catch (error) {
        console.log(error);
      }
    };
    setCategory();

    const setCategoryProduct = async (categoryId) => {
      try {
        const products = await getProductsByCategory(+categoryId);
        categoryObject.productList = products.data.data.map(
          (item) => item.product
        );
      } catch (error) {
        console.log(error);
      }
    };

    const onShowCategoryProduct = (category) => {
      setCategoryProduct(category.id);
      categoryObject.name = category.name;
      categoryObject.categoryId = category.id;
      isShowProductListDialog.value = true;
    };

    const onShowAddCategoryForm = () => {
      isShowCategoryForm.value = true;
      categoryObject.name = null;
      categoryObject.productList = [];
      categoryObject.categoryId = null;
    };
    const isShowProductComboBox = computed(() => {
      return categoryObject.categoryId
        ? isUserAccessible("removeProductFromCategory")
          ? true
          : false
        : isUserAccessible("addProductToCategory")
        ? true
        : false;
    });

    const onAddNewCategory = async () => {
      try {
        let categoryId;
        if (form.value.isValid) {
          isShowCategoryForm.value = false;

          if (!categoryObject.categoryId) {
            const category = await createCategory({
              name: categoryObject.name,
            });
            categoryId = category.data.id;
          } else {
            await updateCategory(categoryObject.categoryId, {
              name: categoryObject.name,
            });

            categoryId = categoryObject.categoryId;
          }

          if (isShowProductComboBox.value) {
            await addProductToCategory({
              categoryId: categoryId,
              products: categoryObject.productList,
            });
          }
          setCategory();
        }
      } catch (error) {
        console.log(error);
      }
    };

    const onEditCategoryFormShow = (category) => {
      setCategoryProduct(category.id);
      categoryObject.name = category.name;
      categoryObject.categoryId = category.id;
      isShowCategoryForm.value = true;
    };

    const onDeleteCategory = async (category) => {
      try {
        await deleteCategory(category.id);

        setCategory();
      } catch (error) {
        console.log(error);
      }
    };

    const onRemoveProductFromCategory = async (productId, categoryId) => {
      try {
        await removeProductFromCategory({
          categoryId: categoryId,
          productId: productId,
        });

        setCategoryProduct(categoryId);
      } catch (error) {
        console.log(error);
      }
    };

    const formTitle = computed(() => {
      return categoryObject.categoryId
        ? "Edit " + categoryObject.name + " Category"
        : "Add New Category";
    });

    return {
      form,
      categoryList,
      productList,
      onShowCategoryProduct,
      onShowAddCategoryForm,
      getImageLink,
      getRupeeFormat,
      isShowCategoryForm,
      isShowProductListDialog,
      validationSchema,
      categoryObject,
      onAddNewCategory,
      onEditCategoryFormShow,
      onDeleteCategory,
      onRemoveProductFromCategory,
      formTitle,
      isUserAccessible,
      isShowProductComboBox,
    };
  },
};
</script>

<style></style>
