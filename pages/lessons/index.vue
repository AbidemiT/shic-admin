<template>
  <div class="container-fluid mt-5">
    <div class="row justify-content-end my-4">
      <div class="col-6 text-right">
        <button
          class="btn btn-sm btn-success"
          @click="toggleLessonForm"
          v-if="!lessonForm && !lessonUpdateForm"
        >
          New Lesson
        </button>
      </div>
    </div>
    <div v-if="!lessonForm && !lessonUpdateForm">
      <card
        class="no-border-card"
        body-classes="px-0 pb-1"
        footer-classes="pb-2"
      >
        <template slot="header">
          <div class="row">
            <div class="col-6">
              <h3 class="mb-0">{{ lessonsCategory.title }}</h3>
            </div>
          </div>
        </template>
        <div>
          <div class="table-responsive" v-if="lessons.length > 0">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Lesson No.</th>
                  <th scope="col">Title</th>
                  <th scope="col">Duration</th>
                  <th scope="col">Description</th>
                  <th scope="col">Links</th>
                </tr>
              </thead>
              <tbody >
                <tr v-for="(lesson, i) in lessons" :key="i">
                  <td>
                    {{ lesson.level }}
                  </td>
                  <td>
                    {{ lesson.title }}
                  </td>
                  <td>
                    {{ lesson.duration }}
                  </td>
                  <td>
                    {{ lesson.description }}
                  </td>
                  <td
                    style="height: 50px; width: 80px"
                    v-html="lesson.link"
                  ></td>
                  <td>
                    <el-dropdown trigger="click" class="dropdown">
                      <span
                        class="btn btn-sm btn-icon-only text-light"
                        aria-label="Dropdown menu"
                        @click="setLessonId(lesson.id), setLesson(lesson)"
                      >
                        <i class="fas fa-ellipsis-v mt-2"></i>
                      </span>
                      <el-dropdown-menu
                        class="dropdown-menu dropdown-menu-arrow show"
                        role="list"
                        slot="dropdown"
                      >
                        <a
                          class="dropdown-item"
                          href="#"
                          @click="lessonUpdateForm = true"
                          >Edit Lesson</a
                        >
                        <a
                          class="dropdown-item"
                          href="#"
                          @click="modals.modal1 = true"
                          >Delete Lesson</a
                        >
                      </el-dropdown-menu>
                    </el-dropdown>
                  </td>
                </tr>
              </tbody>
            </table>
            <div
              slot="footer"
              class="
                col-12
                d-flex
                justify-content-center justify-content-sm-between
                flex-wrap
              "
            >
              <div class="">
              </div>
              <nav aria-label="...">
                <ul class="pagination">
                  <li
                    class="page-item"
                    v-if="prevPage"
                  >
                    <a
                      class="page-link"
                      href="#"
                      aria-label="Previous"
                      @click="prev"
                    >
                      <i class="fa fa-angle-left"></i>
                      <span class="sr-only">Previous</span>
                    </a>
                  </li>
                  <li
                    class="page-item"
                    v-if="nextPage"
                  >
                    <a
                      class="page-link"
                      href="#"
                      aria-label="Next"
                      @click="next"
                    >
                      <i class="fa fa-angle-right"></i>
                      <span class="sr-only">Next</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            <modal :show.sync="modals.modal1">
              <h6
                slot="header"
                class="modal-title mb-0"
                id="modal-title-default"
              >
                Delete Lesson
              </h6>
              <p>Are you sure you want to delete Lesson?</p>
              <template slot="footer">
                <base-button type="primary" @click="deleteLesson">{{
                  deleteLessonLoading ? "Deleting Lesson..." : "Delete Lesson"
                }}</base-button>
                <base-button
                  type="link"
                  class="ml-auto"
                  @click="modals.modal1 = false"
                  >Close
                </base-button>
              </template>
            </modal>
          </div>
          <div v-else class="w-100 text-center">
                  <span>No Lessons Yet</span>
              </div>
        </div>
      </card>
    </div>
    <div v-else-if="!lessonUpdateForm">
      <div class="row mb-5">
        <div class="col-6">
          <h3 class="mb-0">New Lesson</h3>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col">
          <form @submit.prevent="newLesson">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group row">
                  <label
                    for="lessonTitle"
                    class="col-md-6 col-form-label form-control-label"
                    >Lesson Title:</label
                  >
                  <div class="col-md-12">
                    <base-input
                      type="text"
                      v-model="lessonData.title"
                      required
                      id="lessonTitle"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-group row">
                  <label
                    for="lessonNumber"
                    class="col-md-6 col-form-label form-control-label"
                    >Lesson Number:</label
                  >
                  <div class="col-md-12">
                    <base-input
                      type="text"
                      v-model="lessonData.level"
                      required
                      id="lessonNumber"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-group row">
                  <label
                    for="lessonThumnail"
                    class="col-md-6 col-form-label form-control-label"
                    >Lesson Thumbnail:</label
                  >
                  <div class="col-md-12">
                    <base-input
                      type="text"
                      placeholder=" lesson Thumbnail"
                      v-model="lessonData.image"
                      required
                      id="lessonThumnail"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4">
                <div class="form-group row">
                  <label
                    for="duration"
                    class="col-md-6 col-form-label form-control-label"
                    >Duration</label
                  >
                  <div class="col-md-12">
                    <base-input
                      type="text"
                      placeholder=" lesson Duration (12:35)"
                      v-model="lessonData.duration"
                      required
                      id="duration"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group row">
                  <label
                    for="link"
                    class="col-md-6 col-form-label form-control-label"
                    >Link</label
                  >
                  <div class="col-md-12">
                    <base-input
                      type="text"
                      placeholder=" Lesson link"
                      v-model="lessonData.link"
                      required
                      id="link"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group row">
                  <label
                    for="lessonStatus"
                    class="col-md-6 col-form-label form-control-label"
                    >Status</label
                  >
                  <div class="col-md-12">
                    <el-select
                      class="select-danger"
                      placeholder="Select lesson Status"
                      v-model="lessonData.status"
                      required
                      id="lessonStatus"
                    >
                      <el-option
                        v-for="option in [
                          { value: 1, label: 'Active' },
                          { value: 0, label: 'Closed' },
                        ]"
                        class="select-danger"
                        :value="option.value"
                        :label="option.label"
                        :key="option.label"
                      >
                      </el-option>
                    </el-select>
                    <!-- <base-input
                      type="text"
                      placeholder=" 1 for Active, 0 for Closed"
                      v-model="LessonData.status"
                      required
                      id="LessonDescription"
                    /> -->
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group row align-items-end">
                  <label
                    for="lessonDescription"
                    class="col-md-6 col-form-label form-control-label"
                    >Description</label
                  >
                  <div class="col-md-12">
                    <textarea
                      class="form-control"
                      id="lessonDescription"
                      rows="3"
                      placeholder=""
                      v-model="lessonData.description"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div class="row my-5">
              <div class="col-md-4">
                <div
                  class="
                    form-group
                    row
                    h-50
                    justify-content-end
                    align-items-end
                  "
                >
                  <div class="col-md-6">
                    <button class="btn btn-sm btn-success">
                      {{
                        updateLessonLoading ? "Updating Lesson" : "Save Lesson"
                      }}
                    </button>
                  </div>
                  <div class="col-md-6">
                    <button
                      class="btn btn-sm btn-danger"
                      @click.prevent="lessonForm = false"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="row mb-5">
        <div class="col-6">
          <h3 class="mb-0">Update Lesson</h3>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <form @submit.prevent="updateLesson">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group row">
                  <label
                    for="lessonTitle"
                    class="col-md-6 col-form-label form-control-label"
                    >Lesson Title:</label
                  >
                  <div class="col-md-12">
                    <base-input
                      type="text"
                      v-model="lessonUpdateData.title"
                      required
                      id="lessonTitle"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-group row">
                  <label
                    for="lessonUpdateLevel"
                    class="col-md-6 col-form-label form-control-label"
                    >Lesson Number:</label
                  >
                  <div class="col-md-12">
                    <base-input
                      type="text"
                      v-model="lessonUpdateData.level"
                      required
                      id="lessonUpdateLevel"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-group row">
                  <label
                    for="lessonThumnail"
                    class="col-md-6 col-form-label form-control-label"
                    >Lesson Thumbnail:</label
                  >
                  <div class="col-md-12">
                    <base-input
                      type="text"
                      placeholder=" lesson Thumbnail"
                      v-model="lessonUpdateData.image"
                      required
                      id="lessonThumbnail"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4">
                <div class="form-group row">
                  <label
                    for="duration"
                    class="col-md-6 col-form-label form-control-label"
                    >Duration</label
                  >
                  <div class="col-md-12">
                    <base-input
                      type="text"
                      placeholder=" in Months e.g 1 Month, 12 Months"
                      v-model="lessonUpdateData.duration"
                      required
                      id="duration"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group row">
                  <label
                    for="link"
                    class="col-md-6 col-form-label form-control-label"
                    >Link</label
                  >
                  <div class="col-md-12">
                    <base-input
                      type="text"
                      placeholder=" Lesson link"
                      v-model="lessonUpdateData.link"
                      required
                      id="link"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group row">
                  <label
                    for="lessonStatus"
                    class="col-md-6 col-form-label form-control-label"
                    >Status</label
                  >
                  <div class="col-md-12">
                    <el-select
                      class="select-danger"
                      placeholder="Select Lesson Status"
                      v-model="lessonUpdateData.status"
                      required
                      id="lessonStatus"
                    >
                      <el-option
                        v-for="option in [
                          { value: 1, label: 'Active' },
                          { value: 0, label: 'Closed' },
                        ]"
                        class="select-danger"
                        :value="option.value"
                        :label="option.label"
                        :key="option.label"
                      >
                      </el-option>
                    </el-select>
                    <!-- <base-input
                      type="text"
                      placeholder=" 1 for Active, 0 for Closed"
                      v-model="investmentUpdateData.status"
                      required
                      id="investmentDescription"
                    /> -->
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group row align-items-end">
                  <label
                    for="lessonDescription"
                    class="col-md-6 col-form-label form-control-label"
                    >Description</label
                  >
                  <div class="col-md-12">
                    <textarea
                      class="form-control"
                      id="lessonDescription"
                      rows="3"
                      placeholder=""
                      v-model="lessonUpdateData.description"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div class="row my-5">
              <div class="col-md-4">
                <div
                  class="
                    form-group
                    row
                    h-50
                    justify-content-end
                    align-items-end
                  "
                >
                  <div class="col-md-6">
                    <button class="btn btn-sm btn-success">
                      {{
                        newLessonLoading ? "Updating Lesson" : "Update Lesson"
                      }}
                    </button>
                  </div>
                  <div class="col-md-6">
                    <button
                      class="btn btn-sm btn-danger"
                      @click.prevent="lessonUpdateForm = false"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { BasePagination } from "@/components/argon-core";
import { mapGetters } from "vuex";
import {
  Table,
  TableColumn,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Tooltip,
  Select,
  Option,
  Button,
} from "element-ui";

export default {
  middleware: "redirect",
  layout: "DashboardLayout",
  components: {
    BasePagination,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Select.name]: Select,
    [Option.name]: Option,
    [Button.name]: Button,
  },
  data() {
    return {
      newLessonLoading: false,
      deleteLessonLoading: false,
      updateLessonLoading: false,
      lessonForm: false,
      lessonUpdateForm: false,
      sortableLesson: null,
      lessonData: {
        title: "",
        lesson_category_id: "",
        description: "",
        duration: "",
        status: "",
        link: "",
        level: "",
        image: "",
      },
      lessonUpdateData: {
        title: "",
        description: "",
        duration: "",
        status: "",
        lesson_category_id: "",
        link: "",
        image: "",
        level: "",
      },
      categories: null,
      subscriptions: null,
      lessonId: "",
      modals: {
        modal1: false,
      },
    };
  },
  created() {
    // this.fetchLessons();
    this.fecthCategories();
  },
  computed: {
    ...mapGetters({
      lessons: "lessons/getLessons",
      lessonsCategory: "lessons/getLessonsCategory",
      lessonsTotal: "lessons/getLessonsTotal",
      nextPage: "lessons/getNextPage",
      prevPage: "lessons/getPrevPage",
    }),
  },
  methods: {
    async next() {   
      let link = this.nextPage.split('/v1')
      let linkParam = link[1]
      let url = linkParam
      console.log({prev: this.prevPage});
     try {
        let response = await this.$axios.get(url);
        console.log({ response });
        this.$store.commit('lessons/SET_LESSONS', response.data.data.data)
        this.$store.commit('lessons/SET_LESSONS_TOTAL', response.data.data.total)
        this.$store.commit(
          "lessons/SET_NEXT_PAGE",
          response.data.data.next_page_url
        );
        this.$store.commit(
          "lessons/SET_PREV_PAGE",
          response.data.data.prev_page_url
        );
      } catch (error) {
        console.log({error});
      }
    },
    async prev() {
      let link = this.prevPage.split('/v1')
      let linkParam = link[1]
      let url = linkParam
      console.log({url});
     try {
        let response = await this.$axios.get(url);
        console.log({ response });
        this.$store.commit('lessons/SET_LESSONS', response.data.data.data)
        this.$store.commit('lessons/SET_LESSONS_TOTAL', response.data.data.total)
        this.$store.commit(
          "lessons/SET_NEXT_PAGE",
          response.data.data.next_page_url
        );
        this.$store.commit(
          "lessons/SET_PREV_PAGE",
          response.data.data.prev_page_url
        );
      } catch (error) {
        console.log({error});
        // this.$notify({
        //   type: "error",
        //   message: `${error.message}`,
        // });
      }
    },
    setLessonId(id) {
      this.lessonId = id;
    },
    async fecthCategories() {
      let url = "/Management/lesson-category";
      // let url = "http://209.97.136.114/api/v1/investment/_category";

      try {
        let response = await this.$axios.get(url);
        console.log({ response });
        this.categories = response.data.data;
      } catch (error) {
        if (error.message) {
          this.$notify({
            type: "danger",
            message: `Oops... ${error.message}`,
          });
        }

        if (error.response) {
          this.$notify({
            type: "danger",
            message: `Oops... Error Fetching Categories`,
          });
        }
      }
    },
    setLesson(lesson) {
      console.log({ selectedLesson: lesson });
      this.lessonUpdateData.title = lesson.title;
      this.lessonUpdateData.level = lesson.level;
      this.lessonUpdateData.description = lesson.description;
      this.lessonUpdateData.duration = lesson.duration;
      this.lessonUpdateData.image = lesson.image;
      this.lessonUpdateData.status = lesson.status;
      this.lessonUpdateData.lesson_category_id = String(
        lesson.lesson_category_id
      );
      this.lessonUpdateData.link = lesson.link;
    },
    toggleLessonForm() {
      this.lessonForm = true;
    },
    async updateLesson() {
      // let url = `http://209.97.136.114/api/v1/investment/_product/${this.investmentId}`;
      let url = `/Management/lesson/${this.lessonId}`;
      this.updateLessonLoading = true;
      this.lessonUpdateForm = false;
      console.log({ updateData: this.lessonUpdateData });

      try {
        let response = await this.$axios.put(url, this.lessonUpdateData);
        console.log({ responseUpdate: response });
        this.updateLessonLoading = false;
        this.fetchCategoryLessons();
        this.$notify({
          type: "success",
          message: `Lesson Updated Successfully`,
        });
      } catch (error) {
        this.updateLessonLoading = false;
        if (error.message) {
          this.$notify({
            type: "danger",
            message: `Oops... ${error.message}`,
          });
        }

        if (error.response) {
          this.$notify({
            type: "danger",
            message: `Oops... Error Updating Lesson`,
          });
        }
      }
    },
    async newLesson() {
      // let url = "http://209.97.136.114/api/v1/investment/_product";
      let url = "/Management/lesson";
      this.newLessonLoading = true;
      this.lessonForm = false;
      this.lessonData.lesson_category_id = this.lessonsCategory.id;
      console.log({ dataData: this.lessonData });

      try {
        let response = await this.$axios.post(url, this.lessonData);
        console.log({ responseSave: response });
        this.newLessonLoading = false;
        // this.fetchLessons()
        this.fetchCategoryLessons();
        this.$notify({
          type: "success",
          message: `Lesson created Successfully`,
        });
      } catch (error) {
        this.newLessonLoading = false;
        if (error.message) {
          this.$notify({
            type: "danger",
            message: `Oops... ${error.message}`,
          });
        }

        if (error.response) {
          this.$notify({
            type: "danger",
            message: `Oops... Error Fetching Categories`,
          });
        }
      }
    },
    async deleteLesson() {
      let url = `/Management/lesson/${this.lessonId}`;
      this.deleteLessonLoading = true;
      this.modals.modal1 = false;
      console.log({ dataData: this.lessonData });

      try {
        let response = await this.$axios.delete(url);
        console.log({ responseDelete: response });
        this.deleteLessonLoading = false;
        this.fetchCategoryLessons();
        this.$notify({
          type: "success",
          message: `Lesson Deleted Successfully`,
        });
      } catch (error) {
        this.deleteLessonLoading = false;
        if (error.message) {
          this.$notify({
            type: "danger",
            message: `Oops... ${error.message}`,
          });
        }

        if (error.response) {
          this.$notify({
            type: "danger",
            message: `Oops... Error Deleting Lesson`,
          });
        }
      }
    },
    async fetchLessons() {
      let url = "/Management/lesson";
      // let url = "http://209.97.136.114/api/v1/investment/_product";

      try {
        let response = await this.$axios.get(url);
        console.log({ response });
        // this.lessons = response.data.data;
      } catch (error) {
        if (error.message) {
          this.$notify({
            type: "danger",
            message: `Oops... ${error.message}`,
          });
        }

        if (error.response) {
          this.$notify({
            type: "danger",
            message: `Oops... Error Fetching Categories`,
          });
        }
      }
    },
    async fetchCategoryLessons() {
      let url = `/Management/lesson-paginate/${this.lessonsCategory.id}/20`;

      try {
        let response = await this.$axios.get(url);

        this.$store.commit("lessons/SET_LESSONS", response.data.data.data);
        this.$store.commit(
          "lessons/SET_LESSONS_TOTAL",
          response.data.data.total
        );
      } catch (error) {
        this.$notify({
          type: "error",
          message: `${error.message}`,
        });
      }
    },
  },
};
</script>
<style>
iframe {
  height: 100px !important;
  width: 120px !important;
}
</style>
