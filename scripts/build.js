"use strict";

const fs = require("node:fs");
const path = require("node:path");

const sourceDirectory = path.join(__dirname, "src");
const sourceFiles = [
  "01-data-and-storage.js",
  "02-navigation.js",
  "03-storefront.js",
  "04-cart-checkout.js",
  "05-account.js",
  "06-admin.js",
  "07-app-start.js",
  "08-actions.js"
];

const bundle = sourceFiles
  .map(file => fs.readFileSync(path.join(sourceDirectory, file), "utf8"))
  .join("");

fs.writeFileSync(path.join(__dirname, "app.js"), bundle, "utf8");
console.log(`Built scripts/app.js from ${sourceFiles.length} source files.`);
