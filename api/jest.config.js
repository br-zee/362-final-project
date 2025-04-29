module.exports = {
    collectCoverageFrom: [
      "api/src/**/*.js"
    ],
    testMatch: [
      "**/api/tests/**/*.test.js"
    ],
    coverageProvider: "v8",
    forceCoverageMatch: [
      "**/api/src/**/*.js"
    ],
  };
  