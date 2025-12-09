import {test, expect} from '@playwright/test';
import { Boards } from '../pages/Boards-Page';
import { URL } from '../data/constants';

let boardsPage: Boards;

test.describe("Sample test for Boards page", () => {
    test.beforeEach(async ({ page }) => {
        boardsPage = new Boards(page);
        await page.goto(URL.E2E.PROD);
    })

    test("Creating a board", async ({page}) => {
        let boardName = "tesddt233";
        await boardsPage.createBoard(boardName);
        expect(boardsPage.findBoard(boardName)).toBeFalsy;
    })
})
