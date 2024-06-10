const { defineConfig } = require("cypress");

module.exports = defineConfig({
  env:{
    wpUser:'admin',
    wpPassword:'1234'
  },
  e2e: {
    baseUrl: "https://anamstarter.local",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
