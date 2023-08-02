<template>
  <!-- User Table Component  -->
  <div v-if="isUserAccessible('showUser')">
    <showSliderItemComponent v-if="userList">
      <template v-slot:title>
        <v-banner :elevation="0" class="pa-3 bg-lime-lighten-2" border>
          <div class="float-left text-h4 font-weight-black">User Table</div>
          <v-btn
            v-if="isUserAccessible('addUser')"
            class="float-right"
            @click.stop="onShowUserForm"
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
        <v-data-table
          v-if="userList"
          :headers="dessertHeaders"
          :items="userList"
          item-value="id"
          class="elevation-1"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <div class="d-flex justify-end align-center">
              <v-btn
                v-if="isUserAccessible('showPermission')"
                @click="onShowUserPermission(item.raw)"
                variant="text"
              >
                <v-icon icon="mdi-shield-account" size="x-large"></v-icon>
                <v-tooltip
                  activator="parent"
                  location="top"
                  text="Show Permission"
                ></v-tooltip>
              </v-btn>
              <v-btn
                v-if="isUserAccessible('addPermission')"
                @click="onShowAddPermissionDialog(item.raw)"
                variant="text"
              >
                <v-icon icon="mdi-shield-plus" size="large"></v-icon>
                <v-tooltip
                  activator="parent"
                  location="top"
                  text="Add Permission"
                ></v-tooltip>
              </v-btn>
              <v-btn
                v-if="isUserAccessible('updateUser')"
                @click="onShowEditUserForm(item.raw)"
                variant="text"
              >
                <v-icon icon="mdi-account-edit" size="large"></v-icon>
                <v-tooltip
                  activator="parent"
                  location="top"
                  text="edit"
                ></v-tooltip>
              </v-btn>
              <v-btn
                v-if="isUserAccessible('deleteUser')"
                @click="onDeleteUser(item.raw)"
                variant="text"
              >
                <v-icon icon="mdi-delete" size="large"></v-icon>
                <v-tooltip
                  activator="parent"
                  location="top"
                  text="delete"
                ></v-tooltip>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </template>
    </showSliderItemComponent>
    <loaderComponent v-else />
  </div>

  <!-- User Form -->
  <dialogBoxComponent
    dialogTitle="User Form"
    v-if="isShowUserForm"
    @closeDialogBox="isShowUserForm = false"
  >
    <template v-slot:main>
      <registerFormComponent
        @onSubmitForm="onSubmitUserForm"
        :userData="currentUser"
      >
        <template v-slot:extra-field>
          <v-combobox
            v-if="roleList"
            v-model="userRoleField"
            label="Select Role"
            :items="roleList"
            variant="solo"
          >
          </v-combobox>
        </template>
      </registerFormComponent>
    </template>
  </dialogBoxComponent>

  <!-- User Permission Box -->
  <dialogBoxComponent
    dialogTitle="User Permissions"
    v-if="isShowPermissionDialog"
    @closeDialogBox="isShowPermissionDialog = false"
  >
    <template v-slot:main>
      <div v-if="userPermissions?.length">
        <v-chip
          v-for="permission in userPermissions"
          :key="permission.id"
          class="ma-2"
        >
          {{ permission.title }}
        </v-chip>
      </div>
      <emptyMessageComponent v-else message="Permission Not Assign" />
    </template>
  </dialogBoxComponent>

  <!-- Role Form -->
  <dialogBoxComponent
    dialogTitle="Add Permissions"
    v-if="isShowAddPermissionForm"
    @closeDialogBox="isShowAddPermissionForm = false"
  >
    <template v-slot:main>
      <v-form ref="form" @submit.prevent="onAddPermission">
        <v-text-field
          v-model="currentUser.firstName"
          :rules="validationSchema.name"
          disabled
        ></v-text-field>

        <v-combobox
          v-model="currentUser.permissions"
          chips
          :rules="validationSchema.comboBox"
          closable-chips
          label="Select Permission"
          :items="permissionList"
          variant="solo"
          multiple
        >
        </v-combobox>
        <v-btn type="submit" block class="mt-2">Submit</v-btn>
      </v-form>
    </template>
  </dialogBoxComponent>
</template>

<script>
import { getDateFormat, isUserAccessible, validationSchema } from "@/util";
import { computed, onMounted, ref } from "vue";
import {
  assignPermissionToUser,
  getAllPermission,
  getAllRole,
  getAllUser,
  registerUser,
  removeUser,
  updateUserInfo,
} from "@/services";
import { VDataTable } from "vuetify/lib/labs/components.mjs";
import showSliderItemComponent from "@/components/ui/show-slider-item-component.vue";
import dialogBoxComponent from "@/components/ui/dialog-box-component.vue";
import registerFormComponent from "@/components/common/register-form-component.vue";
import loaderComponent from "@/components/ui/loader-component.vue";
import emptyMessageComponent from "@/components/ui/empty-message-component";

export default {
  components: {
    VDataTable,
    showSliderItemComponent,
    dialogBoxComponent,
    registerFormComponent,
    loaderComponent,
    emptyMessageComponent,
  },
  setup() {
    const userList = ref(null);
    const permissionList = ref(null);
    const userPermissions = ref(null);
    const currentUser = ref(null);
    const roleList = ref(null);
    const userRoleField = ref(null);
    const isShowUserForm = ref(false);
    const isShowAddPermissionForm = ref(false);
    const isShowPermissionDialog = ref(false);
    const expanded = ref([]);

    const dessertHeaders = [
      {
        title: "First Name",
        align: "start",
        key: "firstName",
      },
      { title: "Last Name", key: "lastName" },
      { title: "Contact", key: "contact" },
      { title: "Gender", key: "gender" },
      { title: "Email", key: "email" },
      { title: "Birth Date", key: "birthDate" },
      { title: "City", key: "city" },
      { title: "Address", key: "address" },
      { title: "Role", key: "role.title" },

      { title: "Actions", key: "actions", sortable: false },
    ];

    onMounted(async () => {
      try {
        const permissions = await getAllPermission();
        permissionList.value = permissions.data;

        if (isUserAccessible("showRole")) {
          const roles = await getAllRole();
          roleList.value = roles.data;
        }
      } catch (error) {
        console.log(error);
      }
    });

    const setUserList = async () => {
      try {
        const users = await getAllUser();
        userList.value = users.data;
      } catch (error) {
        console.log(error);
      }
    };
    setUserList();
    const onShowUserForm = () => {
      isShowUserForm.value = true;
      userRoleField.value = null;
      currentUser.value = null;
    };

    const onShowEditUserForm = (user) => {
      currentUser.value = user;
      currentUser.value.birthDate = user.birthDate.slice(0, 10);
      isShowUserForm.value = true;
      userRoleField.value = user.role;
    };
    const onSubmitUserForm = computed(() =>
      currentUser.value ? onUserEdit : onUserAdd
    );
    const onUserAdd = async (user) => {
      try {
        await registerUser({
          ...user,
          roleId: userRoleField.value.id,
        });
        setUserList();
        isShowUserForm.value = false;
      } catch (error) {
        console.log(error);
      }
    };
    const onUserEdit = async (user) => {
      try {
        await updateUserInfo(currentUser.value.id, {
          ...user,
          roleId: userRoleField.value.id,
        });
        setUserList();
        isShowUserForm.value = false;
      } catch (error) {
        console.log(error);
      }
    };
    const onDeleteUser = async (user) => {
      try {
        await removeUser(user.id);
        setUserList();
      } catch (error) {
        console.log(error);
      }
    };

    const onShowUserPermission = (user) => {
      userPermissions.value = user.permissions;
      isShowPermissionDialog.value = true;
    };
    const onShowAddPermissionDialog = (user) => {
      currentUser.value = user;
      isShowAddPermissionForm.value = true;
    };

    const onAddPermission = async () => {
      try {
        // await updateUserInfo(currentUser.value.id, {
        //   roleId: currentUser.value.role.id,
        // });

        await assignPermissionToUser({
          userId: currentUser.value.id,
          permissions: currentUser.value.permissions,
        });
        isShowAddPermissionForm.value = false;
        setUserList();
      } catch (error) {
        console.log(error);
      }
    };

    return {
      getDateFormat,
      validationSchema,
      userList,
      roleList,
      dessertHeaders,
      expanded,
      onShowUserForm,
      isShowUserForm,
      onSubmitUserForm,
      userRoleField,
      isUserAccessible,
      isShowPermissionDialog,
      onShowUserPermission,
      userPermissions,
      onShowAddPermissionDialog,
      isShowAddPermissionForm,
      currentUser,
      permissionList,
      onAddPermission,
      onShowEditUserForm,
      onDeleteUser,
    };
  },
};
</script>
