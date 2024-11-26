const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    viewportWidth: 1280,
    viewportHeight: 880,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
