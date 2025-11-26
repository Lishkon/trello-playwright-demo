import { test, expect } from '@playwright/test';
import { CREDENTIALS, URL } from "../data/constants";
import { HeaderSelectors } from '../selectors/base-selectors';
import { Login } from '../pages/Login-Page';


let loginPage: Login;

test.describe("UI Functional Tests: Login functionality", () => {
    test.beforeEach(async ({ page }) => {
        loginPage = new Login(page);

        await page.goto(URL.E2E.PROD);
        await page.click(HeaderSelectors.LogInBtn);
    })

    test.skip("Clicking 'Log In' opens Atlassian Login functionality", async ({ page }) => {

        await expect(page).toHaveURL(/id\.atlassian\.com\/login/);
        await expect(page).toHaveTitle("Log in with Atlassian account");
        await expect(loginPage.emailInput).toBeVisible();
        await expect(loginPage.loginButton).toBeEnabled();

    });

    test.skip("Verify error message when logging in with valid email and invalid password", async () => {
        let warning:string = "Incorrect email address and / or password. If you recently migrated your Trello account to an Atlassian account, you will need to use your Atlassian account password. Alternatively, you can get help logging in.";
        
        await loginPage.typeEmail(CREDENTIALS.REAL.USER!);
        await loginPage.clickContinue();
        await loginPage.typePassword(CREDENTIALS.INVALID_CREDS.PASSWORD!);
        await loginPage.clickLoginButton();
        
        await expect(loginPage.invalidCredentialHeaderTitle).toHaveText(warning);
    });

    test.skip("Verify validation error when logging in with blank email", async ({page}) => {
        let warning:string = "Enter an email address";

        await loginPage.clickContinue();

        await expect(loginPage.missingEmailValidationMessage).toHaveText(warning);
    });

    test.skip("Verify error message when logging in with blank password", async ({page}) => {
        let warning:string = "Enter your password";

        await loginPage.typeEmail(CREDENTIALS.REAL.USER!);
        await loginPage.clickContinue();
        await loginPage.clickLoginButton();

        await expect(loginPage.missingPasswordValidationMessage).toHaveText(warning);
    });


    test.skip("Verify login form submission via Enter key", async ({page}) => {
        let warning:string = "We've emailed you a code";

        await loginPage.typeEmail(CREDENTIALS.REAL.USER!);
        await loginPage.clickContinue();
        await loginPage.typePassword(CREDENTIALS.REAL.PASSWORD!);
        await page.keyboard.press('Enter');

        await expect(loginPage.atlassianHeaderTitle).toHaveText(warning);
    });

    test.skip("Verify redirection to the dashboard after successful login", async () => {
        
    });

    test.skip("Verify “Forgot Password?” link redirects to the correct recovery page", async () => {
        
    });

    test.skip("Verify “Sign up” link redirects to the registration page", async () => {
        
    });

    test.skip("Verify “Stay signed in” checkbox (if applicable) maintains session after browser restart", async () => {
        
    });

    test.skip("Verify session expires after logout or timeout", async () => {
        
    });

    test.skip("Verify behavior when hitting “Back” in the browser after logout (should not access dashboard)", async () => {
        
    });
    
    test.skip("Verify that the user can log in with valid Google Account", async () => {

    });
    
    test.skip("Verify that the user can log in with valid Microsoft Account", async () => {

    });
    
    test.skip("Verify that the user can log in with valid Apple Account", async () => {

    });
    
    test.skip("Verify that the user can log in with valid Slack Account", async () => {

    });
    
})

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

    test.skip("Verify that the user is informed about the authentication code sent to his email", async ({ page }) => {
        let warning:string = "We've emailed you a code";

        await loginPage.typeEmail(CREDENTIALS.REAL.USER!);
        await loginPage.clickContinue();
        await loginPage.typePassword(CREDENTIALS.REAL.PASSWORD!);
        await loginPage.clickLoginButton();

        await expect(loginPage.atlassianHeaderTitle).toHaveText(warning);
    });


})