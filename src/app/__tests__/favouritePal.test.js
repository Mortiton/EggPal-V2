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

  test('Log in, navigate to Killamari pal, favourite it, and verify in favourite pals', async () => {
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
      
      //step 2: Find the pal, Killamari, and click it
      console.log("Finding Killamari")
      await driver.wait(until.elementLocated(By.xpath("//h3[contains(text(), 'Killamari')]")), 10000);
      const killamariCard = await driver.findElement(By.xpath("//h3[contains(text(), 'Killamari')]"));
      await killamariCard.click();
      await driver.wait(until.urlIs('http://localhost:3000/pal/Killamari'), 10000);
      console.log('Navigated to Killamari pal page');

      //step 3: click the favourite icon
      console.log('Clicking the favourite icon');
      const favouriteButton = await driver.findElement(By.css('[aria-label="Toggle Favourite"]'));
      await driver.executeScript("arguments[0].dispatchEvent(new MouseEvent('click', {bubbles: true}));", favouriteButton);
      console.log('favourited Killamari pal');

      //step 4: navigate to the favourite pal page
      console.log('Navigating to favourite pals page');
      await driver.findElement(By.linkText('Favourite Pals')).click();
      await driver.wait(until.urlIs('http://localhost:3000/favourite-pals'), 10000);
      console.log('Navigated to favourite pals page');

      //step 5: Ensure Killamari is present in the favourite pal page
      console.log('Ensuring Killamari is in the favourite pals list');
      await driver.wait(until.elementLocated(By.xpath("//h3[contains(text(), 'Killamari')]")), 10000);
      const favouriteKillamari = await driver.findElement(By.xpath("//h3[contains(text(), 'Killamari')]"));
      const favouriteKillamariText = await favouriteKillamari.getText();
      console.log('favourite Killamari Text:', favouriteKillamariText);
      expect(favouriteKillamariText).toContain('Killamari');

    } catch (error) {
        await logError(driver, error, 'test-failed');
        console.error('Test failed: ', error);
        throw error;
      }
    });
  });