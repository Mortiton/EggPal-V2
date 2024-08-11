import { By, until, WebElementCondition } from 'selenium-webdriver';
import { initDriver, quitDriver, logError } from "../../src/app/utils/webdriverUtil";

jest.setTimeout(60000);

describe('Selenium Localhost Login and Filtering Test', () => {
  let driver;

  beforeAll(async () => {
    driver = await initDriver();
  });

  afterAll(async () => {
    await quitDriver(driver);
  });

  test('Load application, log in, and test filtering and sorting', async () => {
    if (!driver) {
      throw new Error('WebDriver is not initialized');
    }

    try {
      // Login process
      await driver.get('http://localhost:3000');
      await driver.findElement(By.linkText('Login')).click();
      await driver.wait(until.elementLocated(By.id('email')), 10000);
      await driver.findElement(By.id('email')).sendKeys('test@test.com');
      await driver.findElement(By.id('password')).sendKeys('TestPassword!12');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.wait(until.urlIs('http://localhost:3000/'), 5000);

      // Verify login
      const profileLink = await driver.findElement(By.linkText('Profile'));
      expect(profileLink).toBeTruthy();

      // Apply filters
      await driver.findElement(By.id('type-dropdown-button')).click();
      await driver.findElement(By.css('button:has(img[alt="water"])')).click();
      await driver.findElement(By.id('work-dropdown-button')).click();
      await driver.findElement(By.css('button:has(img[alt="watering"])')).click();

      // Wait for filters to be applied
      await driver.sleep(2000);

      // Check if filter text appears
      const filterElements = await driver.findElements(By.css('.PalList_selectedFilter__LBrJK'));
      console.log('Number of filter elements:', filterElements.length);
      
      const filterTexts = await Promise.all(filterElements.map(el => el.getText()));
      console.log('Filter texts:', filterTexts);
      
      expect(filterTexts).toEqual([
        'Type: water\nX',
        'Work: watering\nX'
      ]);

      // Check for the presence of sort buttons
      try {
        await driver.wait(until.elementsLocated(By.css('.svg-inline--fa.fa-arrow-up, .svg-inline--fa.fa-arrow-down')), 5000);
        const sortButtons = await driver.findElements(By.css('.svg-inline--fa.fa-arrow-up, .svg-inline--fa.fa-arrow-down'));
        console.log('Number of sort buttons:', sortButtons.length);
        expect(sortButtons.length).toBe(2);
      } catch (error) {
        console.error('Error finding sort buttons:', error);
        await driver.takeScreenshot().then(
          function(image) {
            require('fs').writeFileSync('screenshot-sort-buttons.png', image, 'base64');
          }
        );
        throw error;
      }

      // Function to get the first visible Pal
      const getFirstVisiblePal = async () => {
        const pals = await driver.findElements(By.css('img[alt^="Image of "]'));
        for (let pal of pals) {
          if (await pal.isDisplayed()) {
            return pal.getAttribute('alt');
          }
        }
        throw new Error('No visible Pals found');
      };

      // Check default order (Fuack should be first)
      let firstPal = await getFirstVisiblePal();
      console.log('First pal (default order):', firstPal);
      expect(firstPal).toBe('Image of Fuack');

      // Click descending order (down arrow) and check if Jormuntide is first
      await driver.findElement(By.css('.svg-inline--fa.fa-arrow-down')).click();
      await driver.sleep(1000); // Wait for sorting to complete
      firstPal = await getFirstVisiblePal();
      console.log('First pal (descending order):', firstPal);
      expect(firstPal).toBe('Image of Jormuntide');

      // Click ascending order (up arrow) and check if Fuack is first again
      await driver.findElement(By.css('.svg-inline--fa.fa-arrow-up')).click();
      await driver.sleep(1000); // Wait for sorting to complete
      firstPal = await getFirstVisiblePal();
      console.log('First pal (ascending order):', firstPal);
      expect(firstPal).toBe('Image of Fuack');

    } catch (error) {
      await logError(driver, error, 'test-failed');
      console.error('Test failed: ', error);
      throw error;
    }
  });
});