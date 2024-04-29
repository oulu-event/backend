module.exports = {
  arrowParens: "avoid",
  bracketSameLine: true,
  bracketSpacing: false,
  trailingComma: "es5",
  tabWidth: 4,
  semi: true,
  singleQuote: true,
  overrides: [
    {
      files: "*.json",
      options: {
        tabWidth: 2,
        useTabs: false,
        trailingComma: "none",
        parser: "json",
      },
    },
    {
      files: "*.js",
      options: {
        bracketSpacing: true,
        trailingComma: "all",
        semi: true,
        singleQuote: true,
        printWidth: 80,
        parser: "babel",
      },
    },
  ],
};
