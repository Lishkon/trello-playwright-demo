import { Locator, Page } from "@playwright/test";
import { LoginSelectors, AttlassianScreenSelectors } from "../selectors/login-selectors";

export class Login {
    readonly page: Page;
    readonly trelloLogo: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly continueButton: Locator;
    readonly loginButton: Locator;
    readonly signupButton: Locator;
    readonly atlassianHeaderTitle: Locator;
    readonly invalidCredentialHeaderTitle: Locator;
    readonly missingEmailValidationMessage: Locator;
    readonly missingPasswordValidationMessage: Locator;
    readonly otpInput: Locator;
    readonly otpSubmitButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.trelloLogo = page.locator(LoginSelectors.TrelloLogo);
        this.emailInput = page.locator(LoginSelectors.EmailInp);
        this.passwordInput = page.locator(LoginSelectors.PasswordInp);
        this.continueButton = page.locator(LoginSelectors.ContinueBtn);
        this.loginButton = page.locator(LoginSelectors.LogInBtn);
        this.signupButton = page.locator(LoginSelectors.SignUpButn);
        this.atlassianHeaderTitle = page.locator(AttlassianScreenSelectors.HeaderTitle);
        this.invalidCredentialHeaderTitle = page.locator(AttlassianScreenSelectors.IncorrectCredentialsWarning);
        this.missingEmailValidationMessage = page.locator(AttlassianScreenSelectors.MissingEmailValidationMessage);
        this.missingPasswordValidationMessage = page.locator(AttlassianScreenSelectors.MissingPasswordValidationMessage);
        this.otpInput = page.locator(AttlassianScreenSelectors.OtpCodeInput);
        this.otpSubmitButton = page.locator(AttlassianScreenSelectors.VerifyButton);
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
    
    async clickSignUp() {
        await this.signupButton.click();
    }
    
    async clickLoginButton() {
        await this.loginButton.click();
    }

    async completeOtp(code: string) {
        if(await this.otpInput.isVisible()){
            await this.otpInput.click();
            await this.page.keyboard.type(code); 
            await this.otpSubmitButton.click();
        }
    }
}