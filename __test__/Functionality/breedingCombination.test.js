import { By, until } from "selenium-webdriver";
import { initDriver, quitDriver, logError } from "../../src/app/utils/webdriverUtil";

jest.setTimeout(60000);

describe('Breeding Combination Functionality Test', () => {
  let driver;

  beforeAll(async () => {
    driver = await initDriver();
  });

  afterAll(async () => {
    await quitDriver(driver);
  });

  test('Log in, navigate to Killamari pal, save a breeding combination if not saved, and verify in saved combinations', async () => {
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

      // Step 2: Find the pal, Killamari, and click it
      console.log("Finding Killamari");
      await driver.wait(until.elementLocated(By.xpath("//h3[contains(text(), 'Killamari')]")), 10000);
      const killamariCard = await driver.findElement(By.xpath("//h3[contains(text(), 'Killamari')]"));
      await killamariCard.click();
      await driver.wait(until.urlIs('http://localhost:3000/pal/023'), 10000);
      console.log('Navigated to Killamari pal page');

      // Step 3: Find the breeding card with Lamball and Leezpunk parents
      console.log('Finding the breeding combination');
      const breedingCard = await driver.wait(until.elementLocated(By.xpath("//div[.//a[@aria-label='Link to Lamball'] and .//a[@aria-label='Link to Leezpunk']]")), 10000);
      
      // Verify both parents are present
      const lamballLink = await breedingCard.findElement(By.css("a[aria-label='Link to Lamball']"));
      const leezpunkLink = await breedingCard.findElement(By.css("a[aria-label='Link to Leezpunk']"));
      expect(await lamballLink.isDisplayed()).toBeTruthy();
      expect(await leezpunkLink.isDisplayed()).toBeTruthy();

      // Check if the combination is already saved
      const heartIcon = await breedingCard.findElement(By.css('[data-favorite]'));
      const initialFavoriteState = await heartIcon.getAttribute('data-favorite');
      console.log('Initial favorite state:', initialFavoriteState);

      if (initialFavoriteState !== 'filled') {
        // Save the combination if it's not already saved
        await driver.executeScript(`
          var event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
          });
          arguments[0].dispatchEvent(event);
        `, heartIcon);
        
        await driver.sleep(1000); // Wait for the state to update

        // Verify the heart icon state has changed
        const newFavoriteState = await heartIcon.getAttribute('data-favorite');
        expect(newFavoriteState).toBe('filled');
        console.log('Breeding combination saved');
      } else {
        console.log('Breeding combination was already saved');
      }

      // Step 4: Navigate to the saved combinations page
      console.log('Navigating to saved combinations page');
      await driver.get('http://localhost:3000/saved-combinations');
      await driver.wait(until.urlIs('http://localhost:3000/saved-combinations'), 10000);
      console.log('Navigated to saved combinations page');

      // Step 5: Click on the Killamari image to view its saved combinations
      console.log('Clicking on Killamari to view saved combinations');
      const killamariSavedPal = await driver.wait(until.elementLocated(By.css("img[alt='Killamari']")), 10000);
      await killamariSavedPal.click();
      await driver.sleep(1000); // Wait for the combinations to load

      // Step 6: Verify the saved combination is present
      console.log('Verifying saved combination');
      try {
        const savedCard = await driver.wait(until.elementLocated(By.xpath("//div[.//a[@aria-label='Link to Lamball'] and .//a[@aria-label='Link to Leezpunk']]")), 10000);
        const savedLamballLink = await savedCard.findElement(By.css("a[aria-label='Link to Lamball']"));
        const savedLeezpunkLink = await savedCard.findElement(By.css("a[aria-label='Link to Leezpunk']"));
        const removeButton = await savedCard.findElement(By.css("button[aria-label='remove']"));
        
        expect(await savedLamballLink.isDisplayed()).toBeTruthy();
        expect(await savedLeezpunkLink.isDisplayed()).toBeTruthy();
        expect(await removeButton.isDisplayed()).toBeTruthy();
        console.log('Saved combination verified');
      } catch (error) {
        console.log('Error finding saved combination:', error);
        throw new Error('Failed to find the saved breeding combination for Killamari');
      }

    } catch (error) {
      await logError(driver, error, 'test-failed');
      console.error('Test failed: ', error);
      throw error;
    }
  });
});