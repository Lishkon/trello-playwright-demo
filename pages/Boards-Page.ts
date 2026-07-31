import { Locator, Page, expect } from "@playwright/test";

export class Boards {
    readonly page: Page;
    readonly createMenuButton: Locator;
    readonly createBoardButton: Locator;
    readonly currentBoardSelector: Locator;
    readonly startWithTemplateButton: Locator;
    readonly boardTitle: Locator;
    readonly visibilityDropdown: Locator;
    readonly visibilityListbox: Locator;
    readonly confirmPublicButton: Locator;
    readonly createButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.createMenuButton = page.getByTestId('header-create-menu-button');
        this.createBoardButton = page.getByTestId('create-board-button');
        this.currentBoardSelector = page.getByTestId('board-name-container');
        this.startWithTemplateButton = page.getByRole('button', {name: 'Start with a template'}).first();
        this.boardTitle = page.getByTestId('create-board-title-input').first();
        this.visibilityDropdown = page.getByTestId('create-board-select-visibility');
        this.visibilityListbox = page.getByTestId('create-board-select-visibility-select--listbox');
        this.confirmPublicButton = page.getByRole('button', { name: 'Yes, make board public' });
        this.createButton = page.getByTestId('create-board-submit-button');
    }

    async dismissPageChrome() {
        const cookieAcceptAll = this.page.getByTestId('accept-all-button');
        if (await cookieAcceptAll.isVisible({ timeout: 5000 }).catch(() => false)) {
            await cookieAcceptAll.click();
            await this.page.waitForLoadState('domcontentloaded');
        }

        const closeBanner = this.page.getByRole('button', { name: 'Close', exact: true });
        if (await closeBanner.isVisible({ timeout: 5000 }).catch(() => false)) {
            await closeBanner.click();
        }
    }

    async createBoard(boardname: string, visibility: string) {
        await this.page.waitForLoadState('networkidle');

        await expect(async () => {
            await this.createMenuButton.click({timeout: 8000});
            await this.createBoardButton.click({timeout: 8000});
            await expect(this.boardTitle).toBeVisible({timeout: 8000});
        }).toPass({ timeout: 25000});

        await this.boardTitle.fill(boardname);
        await this.selectBoardVisibility(visibility)
        await this.createButton.click();

    }

    async selectBoardVisibility(visibility: string) {
        await this.visibilityDropdown.click();
        await this.visibilityListbox.waitFor({state: 'visible'});

        await this.visibilityListbox
            .locator('[role="option"]')
            .filter({
                has: this.page.locator(`text="${visibility}"`)
            })
            .first()
            .click();
        
        const confirmationRequired = await this.confirmPublicButton
            .waitFor({state: 'visible', timeout: 5000})
            .then(() => true)
            .catch(() => false);

        if (confirmationRequired) {
            await this.confirmPublicButton.click();
        }
    }



    async findBoard(boardname: string) {
        return this.page.getByRole('link', { name: boardname });
    }

    async getCurrentCompanydName() {
        return this.currentBoardSelector.innerText();
    }
}