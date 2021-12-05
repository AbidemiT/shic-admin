export const state = () => ({
  lessons: [],
  lessonsTotal: 0,
  sortedLessons: [],
  nextPage: "",
  prevPage: "",
});

export const mutations = {
  SET_LESSONS(state, payload) {
    state.lessons = payload;
  },
  SET_SORTED_LESSONS(state, payload) {
    state.sortedLessons = payload;
  },
  SET_LESSONS_TOTAL(state, payload) {
    state.lessonsTotal = payload;
  },
  SET_NEXT_PAGE: (state, payload) => {
    state.nextPage = payload;
  },
  SET_PREV_PAGE: (state, payload) => {
    state.prevPage = payload;
  },
};

export const getters = {
  getLessons: (state) => state.lessons,
  getLessonsTotal: (state) => state.lessonsTotal,
  getSortedLessons: (state) => state.sortedLessons,
  getPrevPage: (state) => state.prevPage,
  getNextPage: (state) => state.nextPage,
};
