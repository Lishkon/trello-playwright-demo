export const LoginSelectors = {
    "EmailInp": "div[data-testid='username-container'] [id*='username-uid']",
    "EmailInpValidationMessage": "form#form-login div[data-testid='message-wrapper'] div#username-uid1-error",
    "PasswordInpValidationMessage": "form#form-login div[data-testid='message-wrapper'] div#password-uid2-error",
    "EmailInpVerifyItsYouMessage": "div[role='alert'] section[data-testid='form-error']",
    "SignUpButn": "#signup-submit",
    "ContinueBtn": "#login-submit",
    "LogInBtn": "#login-submit",
    "IncorrectCredentialsWarning": "div [role='alert']",
    "LoginScreenWarning": "div [role='alert']",
    "PasswordInp": "#password",
    "TrelloLogo": "span[aria-label='Trello']",
    "CodeEmailedWarning": "#ProductHeadingSuffix"
};

export const MicrosoftOnlineSelectors = {
    "EmailInp": "#i0116",
    "PasswordInp": "#i0118",
    "NextBtn": "#idSIButton9",
    "CancelBtn": "#idBtn_Back"
};

export const AttlassianScreenSelectors = {
    "HeaderTitle": "#ProductHeadingSuffix",
    "IncorrectCredentialsWarning": "div[data-testid='form-error--content']",
    "MissingEmailValidationMessage": "div[data-testid*='-invalid-error-message-field--idf-testid']",
    "MissingPasswordValidationMessage": "span[data-testid='password-error-idf-testid']",
    "RequireAdditionalVerificationMessage": "#email-sent-page",
    "OtpCodeInput": "#two-step-verification-otp-code-input",
    "VerifyButton": "#two-step-verification-submit button"
}