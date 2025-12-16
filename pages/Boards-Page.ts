import { Locator, Page, expect } from "@playwright/test";
import { BoardsTabMenuSelectors, CreateBoardTileSelectors, CurrentBoardSelectors } from "../selectors/boards-selectors";

export class Boards {
    readonly page: Page;
    readonly createMenuButton: Locator;
    readonly createBoardButton: Locator;
    readonly currentBoardSelector: Locator;
    readonly startWithTemplateButton: Locator;
    readonly boardTitle: Locator;
    readonly createButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.createMenuButton = page.locator(BoardsTabMenuSelectors.createMenuButton);
        this.createBoardButton = page.locator(BoardsTabMenuSelectors.createBoardButton);
        this.currentBoardSelector = page.locator(CurrentBoardSelectors.currentBoardTitle);
        this.startWithTemplateButton = page.locator(BoardsTabMenuSelectors.startWithTemplateButton);
        this.boardTitle = page.locator(CreateBoardTileSelectors.boardTitle);
        this.createButton = page.locator(CreateBoardTileSelectors.createButton);
    }

    async createBoard(boardname: string) {
        await this.createMenuButton.click();
        await this.createBoardButton.click();
        await this.boardTitle.fill(boardname);
        await this.createButton.click();
    }

    async findBoard(boardname: string) {
        return this.page.locator(`a[aria-label='${boardname}']`);
    }

    async getCurrentCompanydName() {
        return this.currentBoardSelector.innerText();
    }
}