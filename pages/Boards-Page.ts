import { Locator, Page, expect } from "@playwright/test";
import { BoardsTabMenuSelectors, CreateBoardTileSelectors, CurrentBoardSelectors } from "../selectors/boards-selectors";

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
        this.createMenuButton = page.getByRole('button', {name: 'Create board or Workspace', exact: true });
        this.createBoardButton = page.getByTestId('header-create-board-button');
        this.currentBoardSelector = page.getByTestId('board-name-container');
        this.startWithTemplateButton = page.getByRole('button', {name: 'Start with a template'}).first();
        this.boardTitle = page.getByTestId('create-board-title-input');
        this.visibilityDropdown = page.getByTestId('create-board-select-visibility');
        this.visibilityListbox = page.getByTestId('create-board-select-visibility-select--listbox');
        this.confirmPublicButton = page.getByRole('button', { name: 'Yes, make board public' });
        this.createButton = page.getByTestId('create-board-submit-button');
    }

    async createBoard(boardname: string, visibility: string) {
        await this.createMenuButton.click();
        await expect(this.createBoardButton).toBeVisible();
        await this.createBoardButton.click();
        await expect(this.boardTitle).toBeVisible();
        await this.boardTitle.fill(boardname);
        await this.selectBoardVisibility(visibility)
        await this.createButton.click();
        // if 'Change box to Public?' dialog available, make an action

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
            .waitFor({state: 'visible', timeout: 3000})
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