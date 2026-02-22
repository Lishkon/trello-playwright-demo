export const BoardsTabMenuSelectors = {
    "createMenuButton": "button[data-testid='header-create-menu-button']",
    "createBoardButton": "button[data-testid='header-create-board-button']",
    "startWithTemplateButton": "button[data-testid='header-create-board-from-template-button']",
}

export const CreateBoardTileSelectors = {
    "boardTitle": "input[data-testid='create-board-title-input']",
    "visibilityOption": "div[data-testid='create-board-select-visibility']",
    "visibilityListox": "[data-testid='create-board-select-visibility-select--listbox']",
    "confirmPublicButton": "button:has-text('Yes, make board public')",
    "createButton": "button[data-testid='create-board-submit-button']"
}

export const CurrentBoardSelectors = {
    "currentBoardTitle": "div[data-testid='board-name-container']"
}