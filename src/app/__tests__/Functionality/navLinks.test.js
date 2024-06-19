import { By, until } from 'selenium-webdriver';
import { initDriver, quitDriver, logError } from '../../utils/webdriverUtil';

jest.setTimeout(30000);

describe('Selenium Navigation Links Test', () => {
  let driver;

  beforeAll(async () => {
    driver = await initDriver();
  });

  afterAll(async () => {
    await quitDriver();
  });

  test('Verify navigation links when not logged in', async () => {
    if (!driver) {
      throw new Error('WebDriver is not initialized');
    }

    try {
      await driver.get('http://localhost:3000');

      try {
        const loginLink = await driver.findElement(By.linkText('Login'));
        await loginLink.click();
        await driver.wait(until.urlIs('http://localhost:3000/login'), 5000);
        expect(await driver.getCurrentUrl()).toBe('http://localhost:3000/login');
      } catch (error) {
        await logError(driver, error, 'verify-login-link');
        throw error;
      }

      await driver.navigate().back();

      try {
        const signupLink = await driver.findElement(By.linkText('Signup'));
        await signupLink.click();
        await driver.wait(until.urlIs('http://localhost:3000/signup'), 5000);
        expect(await driver.getCurrentUrl()).toBe('http://localhost:3000/signup');
      } catch (error) {
        await logError(driver, error, 'verify-signup-link');
        throw error;
      }

    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });

  test('Verify navigation links when logged in', async () => {
    if (!driver) {
      throw new Error('WebDriver is not initialized');
    }

    try {
      try {
        await driver.get('http://localhost:3000/login');
        await driver.findElement(By.id('email')).sendKeys('test@test.com');
        await driver.findElement(By.id('password')).sendKeys('TestPassword!12');
        await driver.findElement(By.css('button[type="submit"]')).click();
        await driver.wait(until.urlIs('http://localhost:3000/'), 5000);
      } catch (error) {
        await logError(driver, error, 'login');
        throw error;
      }

      const links = [
        { text: 'Favourite Pals', url: 'http://localhost:3000/favourite-pals' },
        { text: 'Saved Combinations', url: 'http://localhost:3000/saved-combinations' },
        { text: 'Profile', url: 'http://localhost:3000/profile' }
      ];

      for (const link of links) {
        try {
          await driver.findElement(By.linkText(link.text)).click();
          await driver.wait(until.urlIs(link.url), 5000);
          expect(await driver.getCurrentUrl()).toBe(link.url);
          await driver.navigate().back();
        } catch (error) {
          await logError(driver, `verify-link-${link.text}`);
          throw error;
        }
      }

    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
});