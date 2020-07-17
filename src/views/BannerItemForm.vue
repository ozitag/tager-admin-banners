<template>
  <page
    :title="isCreation ? 'Create Banner Item' : 'Update Banner Item'"
    :is-content-loading="isContentLoading"
    :footer="{ onSubmit: submitForm }"
  >
    <template v-slot:content>
      <form novalidate @submit.prevent>
        <form-field
          v-model="values.title"
          name="title"
          label="Title"
          :error="errors.title"
        />

        <form-field
          v-model="values.text"
          name="text"
          label="Text"
          type="textarea"
          :error="errors.text"
          rows="4"
        />

        <form-field-file-input
          v-model="values.image"
          label="Image"
          name="image"
          file-type="image"
        />

        <form-field
          v-model="values.buttonLabel"
          name="buttonLabel"
          label="Button: Label"
          :error="errors.buttonLabel"
        />

        <form-field
          v-model="values.buttonLink"
          name="buttonLink"
          label="Button: Link"
          :error="errors.buttonLink"
        />

        <form-field-checkbox
          v-model="values.buttonIsNewTab"
          name="buttonIsNewTab"
          label="Button: Is new tab?"
          :error="errors.buttonIsNewTab"
        />
      </form>
    </template>
  </page>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  convertRequestErrorToMap,
  FileType,
  Nullable,
} from '@tager/admin-services';

type FormValues = {
  title: string;
  text: string;
  buttonLink: string;
  buttonLabel: string;
  buttonIsNewTab: boolean;
  image: Nullable<FileType>;
};

export default Vue.extend({
  name: 'BannerItemForm',
  data(): {
    values: FormValues;
    errors: Record<string, string>;
    isContentLoading: boolean;
  } {
    return {
      values: {
        name: '',
        pageTitle: '',
        pageDescription: '',
        openGraphImage: null,
        urlAlias: '',
      },
      errors: {},
      isContentLoading: false,
    };
  },
  computed: {
    categoryId(): string {
      return this.$route.params.categoryId;
    },
    isCreation(): boolean {
      return this.categoryId === 'create';
    },
    pagePath(): string {
      return window.location.origin + '/blog/category/';
    },
  },
  mounted(): void {
    if (!this.isCreation) {
      this.isContentLoading = true;

      getBlogCategory(this.categoryId)
        .then((response) => {
          this.values = this.convertReviewToInitialValues(response.data);
        })
        .catch(console.error)
        .finally(() => {
          this.isContentLoading = false;
        });
    }
  },
  methods: {
    convertReviewToInitialValues(category: BlogCategory): FormValues {
      return {
        name: category.name,
        pageTitle: category.pageTitle ?? '',
        pageDescription: category.pageDescription ?? '',
        openGraphImage: category.openGraphImage,
        urlAlias: category.urlAlias,
      };
    },
    submitForm() {
      console.log('Submit form', this.values);
      const creationBody: BlogCategoryCreationPayload = {
        name: this.values.name,
        pageTitle: this.values.pageTitle,
        pageDescription: this.values.pageDescription,
        openGraphImage: this.values.openGraphImage?.id ?? null,
      };

      const updateBody: BlogCategoryUpdatePayload = {
        ...creationBody,
        urlAlias: this.values.urlAlias,
      };

      const requestPromise = this.isCreation
        ? createBlogCategory(creationBody)
        : updateBlogCategory(this.categoryId, updateBody);

      requestPromise
        .then(() => {
          this.errors = {};
          this.$router.push(BLOG_ROUTE_PATHS.CATEGORY_LIST);

          this.$toast({
            variant: 'success',
            title: 'Success',
            body: `Blog category was successfully ${
              this.isCreation ? 'created' : 'updated'
            }`,
          });
        })
        .catch((error) => {
          console.error(error);
          this.errors = convertRequestErrorToMap(error);
          this.$toast({
            variant: 'danger',
            title: 'Error',
            body: `Blog category ${
              this.isCreation ? 'creation' : 'update'
            } was failed`,
          });
        });
    },
    goBackToCategoryList() {
      this.$router.push(BLOG_ROUTE_PATHS.CATEGORY_LIST);
    },
  },
});
</script>

<style scoped lang="scss">
.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.save-button {
  min-width: 100px;
}

.alias-field-inner {
  display: flex;
  align-items: center;

  span {
    font-size: 0.9em;
    margin-right: 10px;
  }
}
</style>
