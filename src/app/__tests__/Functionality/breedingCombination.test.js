import { By, until } from "selenium-webdriver";
import { initDriver, quitDriver, logError } from "../../utils/webdriverUtil";

jest.setTimeout(60000);

describe("Breeding Combination Functionality Test", () => {
  let driver;

  beforeAll(async () => {
    driver = await initDriver();
  });

  afterAll(async () => {
    await quitDriver();
  });

  test("Log in, navigate to Kitsun pal, favorite breeding combination, and verify in saved combinations", async () => {
    if (!driver) {
      throw new Error("WebDriver is not initialized");
    }

    try {
      // Step 1: Log in
      console.log("Navigating to login page");
      await driver.get("http://localhost:3000/login");
      await driver.findElement(By.id("email")).sendKeys("test@test.com");
      await driver.findElement(By.id("password")).sendKeys("TestPassword!12");
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.wait(until.urlIs("http://localhost:3000/"), 10000);
      console.log("Logged in successfully");

      // Step 2: Find the Kitsun pal and click it
      console.log("Finding Kitsun pal");
      await driver.wait(
        until.elementLocated(By.xpath("//h3[contains(text(), 'Kitsun')]")),
        10000
      );
      const kitsunCard = await driver.findElement(
        By.xpath("//h3[contains(text(), 'Kitsun')]")
      );
      await kitsunCard.click();
      await driver.wait(until.urlIs("http://localhost:3000/pal/Kitsun"), 10000);
      console.log("Navigated to Kitsun pal page");

      // Step 3: Search for the breeding combination
      console.log("Searching for the breeding combination");
      await driver.findElement(By.id("filter")).clear();
      await driver.findElement(By.id("filter")).sendKeys("Helzephyr");
      await driver.wait(
        until.elementLocated(
          By.xpath(
            "//div[@class='BreedingList_breedingList__2e5VC']//div[2]//div[1]//a[1]"
          )
        ),
        10000
      );
      const breedingCombination = await driver.findElement(
        By.xpath(
          "//div[@class='BreedingList_breedingList__2e5VC']//div[2]//div[1]//a[1]"
        )
      );
      await driver.wait(
        until.elementLocated(By.xpath("(//img[@alt='Lamball'])[1]")),
        10000
      );
      const LamballParent = await breedingCombination.findElement(
        By.xpath("(//img[@alt='Lamball'])[1]")
      );

      // Ensure both parents are correct
      const helzephyrParent = await breedingCombination.findElement(
        By.xpath("(//img[@alt='Helzephyr'])[1]")
      );
      expect(await helzephyrParent.getAttribute("alt")).toBe("Helzephyr");
      expect(await LamballParent.getAttribute("alt")).toBe("Lamball");

     // Step 4: Click the heart icon to favorite the combination if not already favorited
     console.log("Checking if the combination is already favorited");
     const favoriteIcon = await driver.findElement(
       By.css("svg[aria-label='favourite']")
     );
     const isFavorite = await favoriteIcon.getAttribute("data-favorite");
     if (isFavorite === "empty") {
       console.log("Clicking the favorite icon for the breeding combination");
       await driver.executeScript(
         "arguments[0].dispatchEvent(new MouseEvent('click', {bubbles: true}));",
         favoriteIcon
       );
       console.log("Favorited the breeding combination");
     } else {
       console.log("Breeding combination is already favorited");
     }

     // Step 5: Navigate to saved combinations page
     console.log("Navigating to saved combinations page");
     await driver.get("http://localhost:3000/saved-combinations");
     await driver.wait(
       until.urlIs("http://localhost:3000/saved-combinations"),
       10000
     );
     console.log("Navigated to saved combinations page");

     // Step 6: Ensure Kitsun button is present and click it
     console.log("Ensuring Kitsun button is present and clicking it");
     await driver.wait(
       until.elementLocated(By.css("img[alt='Kitsun']")),
       20000
     );
     const kitsunButton = await driver.findElement(
       By.css("img[alt='Kitsun']")
     );
     await kitsunButton.click();
     console.log("Clicked Kitsun button");

      // Step 7: Ensure the breeding combination is present
      console.log("Ensuring the breeding combination is present");
      await driver.executeScript("arguments[0].scrollIntoView(true);", kitsunButton);
      await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");
      await driver.wait(until.elementLocated(By.xpath("(//img[@alt='Lamball'])[1]")), 10000);
      const savedLamballParent = await driver.findElement(By.xpath("(//img[@alt='Lamball'])[1]"));
      const savedHelzephyrParent = await driver.findElement(By.xpath("(//img[@alt='Helzephyr'])[1]"));

      // Ensure both parents are correct in the saved combinations
      expect(await savedHelzephyrParent.getAttribute("alt")).toBe("Helzephyr");
      expect(await savedLamballParent.getAttribute("alt")).toBe("Lamball");
    } catch (error) {
      await logError(driver, error, "test-failed");
      console.error("Test failed: ", error);
      throw error;
    }
  });
});