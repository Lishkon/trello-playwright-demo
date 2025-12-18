// tests/auth.setup.spec.ts
import { test as setup, expect } from "@playwright/test";
import { authenticator } from "otplib";
import * as dotenv from "dotenv";
dotenv.config();

import { CREDENTIALS, URL } from "../data/constants";
import { HeaderSelectors } from "../selectors/base-selectors";
import { Login } from "../pages/Login-Page";

const authFile = "auth/atlassian-storage.json";

setup("authentication with 2FA", async ({page}) => { 
  const loginPage = new Login(page);
  
  await page.goto(URL.E2E.PROD);
  await page.click(HeaderSelectors.LogInBtn);
  
  // Step 1: username + password
  await loginPage.typeEmail(CREDENTIALS.REAL.USER!);
  await loginPage.clickContinue();
  await loginPage.typePassword(CREDENTIALS.REAL.PASSWORD!);
  await loginPage.clickLoginButton();
  
  // Step 2: handle OTP only if Atlassian actually shows it
  const secret = process.env.TOTP_SECRET!;
  try {
    await expect(loginPage.otpInput).toBeVisible({ timeout: 5000 });
    
    const otp = authenticator.generate(secret);
    console.log("Generated OTP:", otp);
    
    await loginPage.otpInput.click();
    await page.keyboard.type(otp);
    await loginPage.otpSubmitButton.click();
  } catch (e) {
    console.log("No OTP challenge this time, continuing without it...");
  }
  
  // Step 3: wait until login completes (boards page)
  await expect(page).toHaveURL(/.*trello\.com.*/);
  
  // Step 4: Save storageState for future tests
  await page.context().storageState({
    path: authFile,
  });
  
  console.log("Auth state saved to auth/atlassian-storage.json");
});
