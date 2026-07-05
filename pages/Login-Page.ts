import { Locator, Page } from "@playwright/test";

export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly continueButton: Locator;
    readonly loginLink: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;
    readonly signUpLink: Locator;
    readonly missingEmailValidationMessage: Locator;
    readonly missingPasswordValidationMessage: Locator;
    readonly otpInput: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.getByTestId('username');
        this.passwordInput = page.getByLabel('Password')
        this.continueButton = page.getByRole('button', {name: 'Continue'});
        this.loginLink = page.getByRole('link', {name: 'Log in', exact: true });
        this.loginButton = page.getByRole('button', {name: 'Log in', exact: true });
        this.errorMessage = page.getByRole('alert');
        this.signUpLink = page.getByRole('link', {name: 'Sign up'});
        this.missingEmailValidationMessage = page.getByTestId('message-wrapper').first();
        this.missingPasswordValidationMessage = page.getByTestId('password-error-idf-testid');
        this.otpInput = page.locator('input[name="otpCode"]');
    }


    async login(username: string, password: string) {
        await this.emailInput.fill(username);
        await this.continueButton.click();
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async typeEmail(email: string) {
        await this.emailInput.fill(email);
    }

    async typePassword(password: string) {
        await this.passwordInput.fill(password);
    }
    
    async clickContinue() {
        await this.continueButton.click();
    }
    
    async clickLoginLink() {
        await this.loginLink.click();
    }

    async clickLoginButton() {
        await this.loginButton.click();
    }
    
    async completeOtp(code: string) {
        if(await this.otpInput.isVisible()){
            await this.otpInput.click();
            await this.page.keyboard.type(code); 
            await this.loginButton.click();
        }
    }
}