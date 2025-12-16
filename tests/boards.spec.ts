import {test, expect} from '@playwright/test';
import { faker } from '@faker-js/faker';
import { Boards } from '../pages/Boards-Page';
import { URL } from '../data/constants';

let boardsPage: Boards;

test.describe("Sample test for Boards page", () => {
    test.beforeEach(async ({ page }) => {
        boardsPage = new Boards(page);
        await page.goto(URL.E2E.PROD);
    })

    test("Creating a board", async ({}) => {
        let boardName = faker.company.buzzAdjective() + " board";
        await boardsPage.createBoard(boardName);
        expect(await boardsPage.getCurrentCompanydName()).toBe(boardName);
    })
})
