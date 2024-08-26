import { Builder } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";

/** @type {import('selenium-webdriver').WebDriver|undefined} */
let driver;

/**
 * Initialises a new Selenium WebDriver instance with Chrome
 * @async
 * @function initDriver
 * @returns {Promise<import('selenium-webdriver').WebDriver|undefined>} The initialised WebDriver instance, or undefined if initialisation fails
 */
const initDriver = async () => {
  try {
    const options = new chrome.Options();
    options.addArguments("--headless");
    options.addArguments("--disable-gpu");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
  } catch (error) {
    console.error("Error initializing WebDriver:", error);
  }
  return driver;
};

/**
 * Quits the current WebDriver instance if it exists
 * @async
 * @function quitDriver
 * @returns {Promise<void>}
 */
const quitDriver = async () => {
  if (driver) {
    await driver.quit();
  }
};

/**
 * Logs an error by taking a screenshot and appending to an error log file
 * @async
 * @function logError
 * @param {import('selenium-webdriver').WebDriver} driver - The WebDriver instance
 * @param {Error} error - The error object
 * @param {string} step - The step where the error occurred
 * @returns {Promise<void>}
 */
const logError = async (driver, error, step) => {
  const fs = require("fs");
  const path = require("path");

  if (driver) {
    const screenshot = await driver.takeScreenshot();
    const screenshotPath = path.join(__dirname, `../logs/${step}.png`);
    fs.writeFileSync(screenshotPath, screenshot, "base64");
    fs.appendFileSync(
      path.join(__dirname, "../logs/errors.log"),
      `${new Date().toISOString()} - ${step}: ${error.message}\n`
    );
  }
};

export { initDriver, quitDriver, logError };
