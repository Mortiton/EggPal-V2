import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

let driver;

const initDriver = async () => {
  try {
    const options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--disable-gpu');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  } catch (error) {
    console.error('Error initializing WebDriver:', error);
  }
  return driver;
};

const quitDriver = async () => {
  if (driver) {
    await driver.quit();
  }
};

const logError = async (driver, error, step) => {
  const fs = require('fs');
  const path = require('path');
  
  if (driver) {
    const screenshot = await driver.takeScreenshot();
    const screenshotPath = path.join(__dirname, `../logs/${step}.png`);
    fs.writeFileSync(screenshotPath, screenshot, 'base64');
    fs.appendFileSync(path.join(__dirname, '../logs/errors.log'), `${new Date().toISOString()} - ${step}: ${error.message}\n`);
  }
};

export { initDriver, quitDriver, logError };