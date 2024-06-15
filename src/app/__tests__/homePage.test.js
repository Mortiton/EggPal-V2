import { By, until } from 'selenium-webdriver';
import { initDriver, quitDriver, logError } from '../utils/webdriverUtil';

jest.setTimeout(60000);

describe('Home Page Functionality Test', () => {
  let driver;

  beforeAll(async () => {
    driver = await initDriver();
  });

  afterAll(async () => {
    await quitDriver();
  });

  test('Log in and test filters and search functionality', async () => {
    if (!driver) {
      throw new Error('WebDriver is not initialized');
    }

    try {
      // Step 1: Log in
      console.log('Navigating to login page');
      await driver.get('http://localhost:3000/login');
      await driver.findElement(By.id('email')).sendKeys('test@test.com');
      await driver.findElement(By.id('password')).sendKeys('TestPassword!12');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.wait(until.urlIs('http://localhost:3000/'), 10000);
      console.log('Logged in successfully');

      // Step 2: Apply filters and check if "Killamari" appears
      try {
        console.log('Opening type filter dropdown');
        await driver.wait(until.elementLocated(By.css('button[aria-label="Element Type"]')), 10000);
        await driver.findElement(By.css('button[aria-label="Element Type"]')).click();
        console.log('Selected "Element Type" dropdown');

        console.log('Selecting dark type filter');
        await driver.wait(until.elementLocated(By.css('button[aria-label="dark"]')), 10000);
        await driver.findElement(By.css('button[aria-label="dark"]')).click();
        console.log('Selected "dark" type filter');

        console.log('Opening work filter dropdown');
        await driver.wait(until.elementLocated(By.css('button[aria-label="Base Skills"]')), 10000);
        await driver.findElement(By.css('button[aria-label="Base Skills"]')).click();
        console.log('Selected "Base Skills" dropdown');
        
        console.log('Selecting transporting work filter');
        await driver.wait(until.elementLocated(By.css('button[aria-label="transporting"]')), 10000);
        await driver.findElement(By.css('button[aria-label="transporting"]')).click();
        console.log('Selected "transporting" work filter');

        console.log('Waiting for Killamari to appear');
        await driver.wait(until.elementLocated(By.xpath("//h3[contains(text(), 'Killamari')]")), 15000);
        const killamariCard = await driver.findElement(By.xpath("//h3[contains(text(), 'Killamari')]"));
        const killamariText = await killamariCard.getText();
        console.log('Card Text:', killamariText);
        expect(killamariText).toContain('Killamari');
      } catch (error) {
        await logError(driver, error, 'apply-filters');
        throw error;
      }

      // Step 3: Ensure "Killamari" appears when searched
      try {
        console.log('Clearing filters');
        await driver.wait(until.elementLocated(By.xpath("//span[contains(text(), 'Clear Filters')]")), 10000);
        await driver.findElement(By.xpath("//span[contains(text(), 'Clear Filters')]")).click();
        console.log('Filters cleared');

        console.log('Searching for Killamari');
        await driver.findElement(By.id('filter')).sendKeys('Killamari');
        await driver.wait(until.elementLocated(By.xpath("//h3[contains(text(), 'Killamari')]")), 10000);
        const killamariCard = await driver.findElement(By.xpath("//h3[contains(text(), 'Killamari')]"));
        const killamariText = await killamariCard.getText();
        console.log('Card Text:', killamariText);
        expect(killamariText).toContain('Killamari');
      } catch (error) {
        await logError(driver, error, 'search-killamari');
        throw error;
      }

    } catch (error) {
      await logError(driver, error, 'test-failed');
      console.error('Test failed: ', error);
      throw error;
    }
  });
});