import {test, expect} from '@playwright/test';
import { Boards } from '../pages/Boards-Page';
import { Login } from '../pages/Login-Page';
import { URL } from '../data/constants';
import { HeaderSelectors } from '../selectors/base-selectors';

let boardsPage: Boards;

test.describe("Sample test for Boards page", () => {
    test.beforeEach(async ({ page }) => {
        let loginPage = new Login(page);
        boardsPage = new Boards(page);
        await page.goto(URL.E2E.PROD);
    })

    test("Creating a board", async ({page}) => {
        await boardsPage.createBoard("test")
    })
})
