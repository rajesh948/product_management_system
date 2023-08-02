export const validationSchema = {
  name: [
    (value: string) => {
      if (!value?.trim()) {
        return "Please Enter value";
      } else if (value?.length <= 3) {
        return "Needs to be at least 3 characters.";
      }
      return true;
    },
  ],
  password: [
    (value: string) => {
      if (!value?.trim()) {
        return "Please Enter Password";
      } else if (value?.length <= 8 && !/[0-9-]+/.test(value)) {
        return "Password needs to be at least 8 digits.";
      }
      return true;
    },
  ],
  email: [
    (value: string) => {
      const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

      if (!value?.trim()) {
        return "Please Enter Email";
      } else if (!regex.test(value)) {
        return "Please Enter Valid Email";
      }
      return true;
    },
  ],
  contact: [
    (value: string) => {
      const regex = /^\d+$/;

      if (!value?.trim()) {
        return "Please Enter contact";
      } else if (value.length !== 10) {
        return "please enter 10 digit number";
      } else if (!regex.test(value)) {
        return "please enter numeric value only";
      }
      return true;
    },
  ],
  number: [
    (value: string) => {
      const regex = /^\d+$/;

      if (!value) {
        return "Please Enter value";
      } else if (!regex.test(value)) {
        return "please enter numeric value only";
      }
      return true;
    },
  ],

  isRequired: [
    (value: string) => {
      if (!value?.trim()) {
        return "Please enter value ";
      }
      return true;
    },
  ],
  comboBox: [
    (value: Array<object> | object) => {
      if (!Array.isArray(value)) {
        if (!value) {
          return "Please Select Option";
        }
      } else {
        if (!value?.length) {
          return "Please Select Option ";
        }
      }
      return true;
    },
  ],
  address: [
    (value: string) => {
      if (!value?.trim()) {
        return "Please enter address ";
      } else if (value?.length > 250) {
        return "Please write less then 250 character";
      }
      return true;
    },
  ],
  description: [
    (value: string) => {
      if (!value?.trim()) {
        return "Please enter description ";
      } else if (value?.length > 250) {
        return "Please write less then 250 character";
      }
      return true;
    },
  ],
  image: [
    (value: Array<{ size: number }>) => {
      if (!value) {
        return "Please choose image";
      }
      if (value[0]?.size > 1024 * 1024) {
        return "please choose file which size is less then 1MB";
      }
      return true;
    },
  ],
};
