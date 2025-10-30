import { expect, Locator, Page } from "@playwright/test";
import { LoginForm } from "../selectors/Login.json"
import { error } from "console";
import { tr } from "@faker-js/faker";

export class Login {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    trelloLogo = LoginForm.TrelloLogo;
    emailInpt = LoginForm.EmailInp;
    passwdInpt = LoginForm.PasswordInp;
    continueButton = LoginForm.ContinueBtn;
    loginButton = LoginForm.LogInBtn;
    signupButton = LoginForm.SignUpButn;

    async verifyUrl(url: string) {
        expect(this.page.url()).toContain(url);
    }

    async verifyPageTitle(title: string) {
        expect(await this.page.title()).toBe(title);
    }
    
    async verifyLogoIsPresent() {
        await expect(this.page.locator(this.trelloLogo)).toBeVisible();
    }

    async verifyEmailInputIsPresent() {
        await expect(this.page.locator(this.emailInpt)).toBeVisible();
    }

    async verifyContinueButtonIsPresent() {
        await expect(this.page.locator(this.continueButton)).toBeVisible();
    }
    
    async verifyPasswordInputIsPresent() {
        await expect(this.page.locator(this.passwdInpt)).toBeVisible();
    }

    async verifyLoginButtonIsPresent() {
        await expect(this.page.locator(this.loginButton)).toBeVisible();
    }

    async verifyContinueWithGoogleButtonIsPresent() {
        // await expect(this.page.locator(this.emailInpt)).toBeVisible();
    }

    async verifyContinueWithMicrosoftButtonIsPresent() {}
    
    async verifyContinueWithAppleButtonIsPresent() {}
    
    async verifyContinueWithClackButtonIsPresent() {}

    async loginForm(username: string, password: string) {
        await this.enterEmailAndClickContinue(username);
        await this.enterPasswordAndClickLogin(password);
    }

    async enterEmailAndClickContinue(email: string) {
        await this.page.fill(LoginForm.EmailInp, email);
        await this.page.click(LoginForm.ContinueBtn);
    }

    async enterPasswordAndClickLogin(password: string) {
        await this.page.fill(LoginForm.PasswordInp, password);
        await this.page.click(LoginForm.LogInBtn);
    }

    async enterEmail(email: string) {
        await this.page.fill(LoginForm.EmailInp, email);
    }
    
    async enterPassword(password: string) {
        await this.page.fill(LoginForm.PasswordInp, password);
    }
    
    async clickContinueButton() {
        await this.page.click(LoginForm.ContinueBtn);
    }
    
    async clickSignUpButton() {
        await this.page.click(LoginForm.SignUpButn);
    }
    
    async verifySignUpButtonIsPresent() {
        await expect(this.page.locator(this.signupButton)).toBeVisible();
    }
    
    async clickLoginButton() {
        await this.page.click(LoginForm.LogInBtn);
    }

    async verifyInvalidCredentialsWarning(text: string) {
        expect(await this.page.innerText(LoginForm.IncorrectCredentialsWarning)).toBe(text)
    }

    async verifyMaskedPassword() {
        const type = await this.page.getAttribute(LoginForm.PasswordInp, 'type')
        expect(type).toBe(`password`);
    }

    /**
     * Takes in the locator and the string value of the warning and verifies the warning is present.
     * Will be taken away some place to be reused
     * @param locator 
     * @param warning 
     */
    async verifyWarning(locator: Locator, warning: string) {
        // expect(await this.page.innerText(locator)).toBe(warning);
        await expect(locator).toHaveText(warning, { timeout:6000 });
    }
}