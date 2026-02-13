import { test, expect } from '@playwright/test';
import { CREDENTIALS, URL } from "../data/constants";
import { HeaderSelectors } from '../selectors/base-selectors';
import { Login } from '../pages/Login-Page';


let loginPage: Login;

test.describe("UI Functional Tests: Login functionality for the logged out users", () => {
    // Force clean state for all tests in this describe
    test.use({
        storageState: { cookies: [], origins: [] },
    });

    test.beforeEach(async ({ page }) => {
        loginPage = new Login(page);

        await page.goto(URL.E2E.PROD);
        await page.click(HeaderSelectors.LogInBtn);
    })

    test("Clicking 'Log In' opens Atlassian Login functionality", async ({ page }) => {

        await expect(page).toHaveURL(/id\.atlassian\.com\/login/);
        await expect(page).toHaveTitle("Log in with Atlassian account");
        await expect(loginPage.emailInput).toBeVisible();
        await expect(loginPage.loginButton).toBeEnabled();

    });

    test("Verify validation error when logging in with blank email", async ({page}) => {
        let warning:string = "Enter an email address";

        await loginPage.clickContinue();

        await expect(loginPage.missingEmailValidationMessage).toHaveText(warning);
    });

    test("Verify error message when logging in with blank password", async ({page}) => {
        let warning:string = "Enter your password";

        await loginPage.typeEmail(CREDENTIALS.REAL.USER!);
        await loginPage.clickContinue();
        await loginPage.clickLoginButton();

        await expect(loginPage.missingPasswordValidationMessage).toHaveText(warning);
    });


})