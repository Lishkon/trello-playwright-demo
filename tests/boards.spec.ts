import {test, expect} from '@playwright/test';
import { faker } from '@faker-js/faker';
import { Boards } from '../pages/Boards-Page';
import { URL } from '../data/constants';

let boardsPage: Boards;

// Used for Board clean up after each test
let shortBoardId: string;

test.describe("Sample test for Boards page", () => {
    test.beforeEach(async ({ page }) => {
        boardsPage = new Boards(page);
        await page.goto(URL.E2E.PROD);
    })

    /**
     * Pre-requisites:
     * 
     * 1. API Key — go to https://trello.com/power-ups/admin, 
     *    click on your Power-Up or create one, and you'll find your API key
     * 2. API Token — on the same page where you see the key, there's a link to 
     *    generate a token. It will ask you to authorize access to your account
     * 
     * For local testing: 
     * Add the generated API key and Token to the TRELLO_API_KEY and TRELLO_API_TOKEN in the .env file
     * 
     * For CI/CD: 
     * 1. Add the TRELLO_API_KEY and TRELLO_API_TOKEN as CI/CD variables in CI/CD Settings -> Variables.
     *    Keep the variables Protected when running the pipeline in the Main branch, but unprotect for the other branches
     * 2. Add the TRELLO_API_KEY and TRELLO_API_TOKEN to .gitlab-ci.yml into the variables section:
     *        TRELLO_API_KEY: ${TRELLO_API_KEY}
     *        TRELLO_API_TOKEN: ${TRELLO_API_TOKEN}
     */
    test.afterEach(async ({request }) => {
        if (shortBoardId) {
            await request.delete(
                `https://api.trello.com/1/boards/${shortBoardId}?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`
            );
        }
    })

    test("Creating a board with the Workspace visibility", async ({page}) => {
        let boardName = faker.company.buzzAdjective() + " board";
        await boardsPage.createBoard(boardName, "Workspace");
        await expect(boardsPage.currentBoardSelector).toContainText(boardName);
        // Storing the boardId locally to be able to clean up the board after the test
        shortBoardId = page.url().split('/')[4]; 
        console.log(`The newly created board id: ${shortBoardId}`);
    })

    test("Creating a private board", async ({page}) => {
        let boardName = faker.company.buzzAdjective() + " board";
        await boardsPage.createBoard(boardName, "Private");
        await expect(boardsPage.currentBoardSelector).toContainText(boardName);
        // Storing the boardId locally to be able to clean up the board after the test
        shortBoardId = page.url().split('/')[4]; 
        console.log(`The newly created board id: ${shortBoardId}`);
    })
})
