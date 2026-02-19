import { test as setup, expect } from "@playwright/test";
import { authenticator } from "otplib";
import * as dotenv from "dotenv";
dotenv.config();

import { CREDENTIALS, URL } from "../data/constants";
import { HeaderSelectors } from "../selectors/base-selectors";
import { Login } from "../pages/Login-Page";

const authFile = "auth/atlassian-storage.json";

/**
 * @fileoverview Playwright authentication setup that handles Atlassian's 2FA login flow.
 * Runs as a setup project before authenticated test suites, persisting the session
 * to a storageState file so subsequent tests can skip the login process.
 *
 * @requires TOTP_SECRET - Environment variable containing the TOTP shared secret for OTP generation.
 * @requires USER_EMAIL - Environment variable for the Atlassian account email.
 * @requires USER_PASSWORD - Environment variable for the Atlassian account password.
 *
 * @see {@link https://playwright.dev/docs/auth} Playwright authentication documentation.
 */

setup("Authentication with 2FA", async ({page}) => { 
  const loginPage = new Login(page);
  
  await page.goto(URL.E2E.PROD);
  await page.click(HeaderSelectors.LogInBtn);
  await loginPage.typeEmail(CREDENTIALS.REAL.USER!);
  await loginPage.clickContinue();
  await loginPage.typePassword(CREDENTIALS.REAL.PASSWORD!);
  await loginPage.clickLoginButton();
  
  const secret = process.env.TOTP_SECRET!;
  try {
    await expect(loginPage.otpInput).toBeVisible({ timeout: 5000 });  
    // Adding the otplib window option to bypass the time-related issue in CI
    authenticator.options = { window: 1 };  
    
    const otp = authenticator.generate(secret);
    console.log("Generated OTP:", otp);    
    await loginPage.otpInput.click();
    await page.keyboard.type(otp);
    await loginPage.otpSubmitButton.click();
  } catch (e) {
    console.log("No OTP challenge this time, continuing without it...");
  }
  
  await expect(page).toHaveURL(/.*trello\.com\/.*boards.*/);

  await page.context().storageState({
    path: authFile,
  });
  
  console.log("Auth state saved to auth/atlassian-storage.json");
});
