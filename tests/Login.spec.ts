import { test, expect } from '@playwright/test';
import { CREDENTIALS, URL } from "../data/constants";
import { Header } from "../selectors/Base.json";
import { HomeHeader } from "../selectors/Home.json"
import { LoginForm} from "../selectors/Login.json"
import { Login } from '../pages/Login-Page';


let loginPage: Login;

test.describe("UI Functional Tests: Login functionality", () => {
    test.beforeEach(async ({ page }) => {
        loginPage = new Login(page);

        await page.goto(URL.E2E.PROD);
        await page.click(Header.LogInBtn);
    })

    test("Verify that the login page loads correclty", async () => {
        await loginPage.verifyUrl("https://id.atlassian.com/login");
        await loginPage.verifyPageTitle("Log in with Atlassian account");
        await loginPage.verifyLogoIsPresent();
        await loginPage.verifyEmailInputIsPresent();
        await loginPage.enterEmailAndClickContinue(CREDENTIALS.REAL.USER!);
        await loginPage.verifyPasswordInputIsPresent();
        await loginPage.enterPassword(CREDENTIALS.REAL.PASSWORD!);
        await loginPage.verifyLoginButtonIsPresent();       
    });

    
    test("Verify that the user can log in with valid email and valid password", async ({ page }) => {
        let warning:string = "We've emailed you a code";
        await loginPage.loginForm(CREDENTIALS.REAL.USER!, CREDENTIALS.REAL.PASSWORD!);
        await loginPage.verifyWarning(page.locator(LoginForm.CodeEmailedWarning), warning);
    });

    test("Verify error message when logging in with valid email and invalid password", async () => {
        let warning:string = "Incorrect email address and / or password. If you recently migrated your Trello account to an Atlassian account, you will need to use your Atlassian account password. Alternatively, you can get help logging in.";
        await loginPage.loginForm(CREDENTIALS.REAL.USER!, CREDENTIALS.INVALID_CREDS.PASSWORD!);
        await loginPage.verifyInvalidCredentialsWarning(warning);
    });

    test("Verify validation error when logging in with blank email", async ({page}) => {
        let warning:string = "Enter an email address";
        await loginPage.enterEmailAndClickContinue('');
        await loginPage.verifyWarning(page.locator(LoginForm.EmailInpValidationMessage), warning);
    });

    test("Verify error message when logging in with blank password", async ({page}) => {
        let warning:string = "Enter your password";
        await loginPage.enterEmailAndClickContinue(CREDENTIALS.REAL.USER!);
        await loginPage.enterPasswordAndClickLogin('')
        await loginPage.verifyWarning(page.locator(LoginForm.PasswordInpValidationMessage), warning);
    });


    test("Verify login form submission via Enter key", async ({page}) => {
        let warning:string = "We've emailed you a code";
        await loginPage.loginForm(CREDENTIALS.REAL.USER!, CREDENTIALS.REAL.PASSWORD!);
        await page.keyboard.press('Enter')
        await loginPage.verifyWarning(page.locator(LoginForm.CodeEmailedWarning), warning)
    });

    test.skip("Verify redirection to the dashboard after successful login", async () => {
        
    });

    test("Verify password input is masked (secure input field)", async () => {
        await loginPage.loginForm(CREDENTIALS.REAL.USER!, CREDENTIALS.REAL.PASSWORD!);
        await loginPage.verifyMaskedPassword();
        
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

    test("Verify the error message when trying to log in with invalid credentials", async () => {
        let warning = "Incorrect email address and / or password. If you recently migrated your Trello account to an Atlassian account, you will need to use your Atlassian account password. Alternatively, you can get help logging in."
        await loginPage.loginForm(CREDENTIALS.INVALID_CREDS.USER!, CREDENTIALS.INVALID_CREDS.PASSWORD!)
        await loginPage.verifyInvalidCredentialsWarning(warning);
    });
    
})
