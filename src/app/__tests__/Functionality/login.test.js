import { By, until } from 'selenium-webdriver';
import { initDriver, quitDriver, logError } from '../../utils/webdriverUtil';

jest.setTimeout(30000);

describe('Selenium Localhost Login Test', () => {
  let driver;

  beforeAll(async () => {
    driver = await initDriver();
  });

  afterAll(async () => {
    await quitDriver();
  });

  test('Load application and log in', async () => {
    if (!driver) {
      throw new Error('WebDriver is not initialized');
    }

    try {
      await driver.get('http://localhost:3000');

      try {
        await driver.findElement(By.linkText('Login')).click();
        await driver.wait(until.elementLocated(By.id('email')), 10000);
      } catch (error) {
        await logError(driver, error, 'navigate-to-login');
        throw error;
      }

      try {
        await driver.findElement(By.id('email')).sendKeys('test@test.com');
        await driver.findElement(By.id('password')).sendKeys('TestPassword!12');
        await driver.findElement(By.css('button[type="submit"]')).click();
        await driver.wait(until.urlIs('http://localhost:3000/'), 5000);
      } catch (error) {
        await logError(driver, error, 'enter-login-credentials');
        throw error;
      }

      try {
        const profileLink = await driver.findElement(By.linkText('Profile'));
        expect(profileLink).toBeTruthy();
      } catch (error) {
        await logError(driver, error, 'verify-login');
        throw error;
      }
    } catch (error) {
      console.error('Test failed: ', error);
    }
  });
});