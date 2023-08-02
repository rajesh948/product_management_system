<template>
  <!-- Role Component -->
  <div v-if="isUserAccessible('showRole')">
    <showSliderItemComponent v-if="roleList">
      <template v-slot:title>
        <v-banner :elevation="0" class="pa-3 bg-lime-lighten-2" border>
          <div class="float-left text-h4 font-weight-black">Role</div>
        </v-banner>
      </template>
      <template v-slot:content>
        <v-row class="mt-4">
          <v-col cols="12" v-for="role in roleList" :key="role.id">
            <v-card
              class="d-flex align-center bg-amber-lighten-5"
              elevation="1"
            >
              <v-card-title class="text-h5 w-25 mx-10">
                {{ role.title }}
              </v-card-title>

              <div class="d-flex justify-end align-center w-75 mx-10">
                <v-btn
                  v-if="isUserAccessible('showPermission')"
                  @click="onShowUserPermission(role)"
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
                  v-if="
                    role.title !== 'admin' && isUserAccessible('updateRole')
                  "
                  @click="onEditRole(role)"
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
                  v-if="
                    role.title !== 'user' &&
                    role.title !== 'admin' &&
                    isUserAccessible('deleteRole')
                  "
                  @click="onDeleteRole(role)"
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
            v-if="isUserAccessible('addRole')"
            class="d-flex justify-center py-5"
          >
            <v-btn @click="onShowRoleForm" icon="mdi-plus">
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
    <loaderComponent v-else />
  </div>

  <!-- Role Form -->
  <dialogBoxComponent
    dialogTitle="Add New Role"
    v-if="isShowDialog"
    @closeDialogBox="isShowDialog = false"
  >
    <template v-slot:main>
      <v-form ref="form" @submit.prevent="onAddNewRole">
        <v-text-field
          v-model="roleObject.title"
          :rules="validationSchema.name"
          label="Role name"
        ></v-text-field>
        <v-combobox
          v-if="isUserAccessible('assignPermissionRole')"
          v-model="roleObject.permissions"
          chips
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

  <!-- Role Permission Box -->
  <dialogBoxComponent
    :dialogTitle="roleObject.title + ' ' + 'permissions'"
    v-if="isShowPermissionDialog"
    @closeDialogBox="isShowPermissionDialog = false"
  >
    <template v-slot:main>
      <div v-if="roleObject.permissions?.length">
        <v-chip
          v-for="permission in roleObject.permissions"
          :key="permission.id"
          class="ma-2"
        >
          {{ permission.title }}
        </v-chip>
      </div>
      <emptyMessageComponent v-else message="Permission Not Assign" />
    </template>
  </dialogBoxComponent>
</template>

<script>
import { getDateFormat, isUserAccessible, validationSchema } from "@/util";
import { reactive, ref } from "vue";
import {
  assignPermissionToRole,
  createRole,
  deleteRole,
  getAllPermission,
  getAllRole,
  updateRole,
} from "@/services";
import showSliderItemComponent from "@/components/ui/show-slider-item-component.vue";
import dialogBoxComponent from "@/components/ui/dialog-box-component.vue";
import loaderComponent from "@/components/ui/loader-component.vue";
import emptyMessageComponent from "@/components/ui/empty-message-component";
export default {
  components: {
    showSliderItemComponent,
    dialogBoxComponent,
    loaderComponent,
    emptyMessageComponent,
  },
  setup() {
    const isShowDialog = ref(false);
    const isShowPermissionDialog = ref(false);
    const roleList = ref(null);
    const permissionList = ref(null);
    const form = ref(null);
    const roleObject = reactive({ roleId: null, title: null, permissions: [] });

    const setRolePermission = async () => {
      try {
        const roles = await getAllRole();
        roleList.value = roles.data;

        const permissions = await getAllPermission();
        permissionList.value = permissions.data;
      } catch (error) {
        console.log(error);
      }
    };
    setRolePermission();

    const setRoles = async () => {
      try {
        const roles = await getAllRole();
        roleList.value = roles.data;
      } catch (error) {
        console.log(error);
      }
    };

    const onAddNewRole = async () => {
      try {
        let role;
        if (form.value.isValid) {
          isShowDialog.value = false;

          if (!roleObject.roleId) {
            role = await createRole({
              title: roleObject.title,
            });
            role = role.data;
          } else {
            await updateRole(roleObject.roleId, {
              title: roleObject.title,
            });

            role = { id: roleObject.roleId };
          }
          if (isUserAccessible("assignPermissionRole")) {
            await assignPermissionToRole({
              roleId: role.id,
              permissions: roleObject.permissions,
            });
          }

          setRoles();
        }
      } catch (error) {
        console.log(error);
      }
    };
    const onEditRole = (role) => {
      roleObject.roleId = role.id;
      roleObject.title = role.title;
      roleObject.permissions = role.permissions.map((item) => {
        return { id: item.id, title: item.title };
      });
      isShowDialog.value = true;
    };

    const onDeleteRole = async (role) => {
      try {
        await deleteRole(role.id);
      } catch (error) {
        console.log(error);
      }
      setRoles();
    };

    const onShowUserPermission = (role) => {
      isShowPermissionDialog.value = true;
      roleObject.title = role.title;
      roleObject.permissions = role.permissions;
    };
    const onShowRoleForm = () => {
      isShowDialog.value = true;
      roleObject.roleId = null;
      roleObject.title = null;
      roleObject.permissions = [];
    };

    return {
      form,
      getDateFormat,
      validationSchema,
      roleList,
      roleObject,
      onAddNewRole,
      onEditRole,
      onDeleteRole,
      permissionList,
      isShowDialog,
      isShowPermissionDialog,
      onShowUserPermission,
      onShowRoleForm,
      isUserAccessible,
    };
  },
};
</script>
