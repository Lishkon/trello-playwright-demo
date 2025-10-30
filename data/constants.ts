import "dotenv/config";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

export const URL = {
    API: {
        "PROD": ""
    },
    E2E: {
        "PROD": "https://trello.com"
    }
}

export const CREDENTIALS = {
    REAL: {
        "USER": process.env.USER_EMAIL,
        "PASSWORD": process.env.USER_PASSWORD
    },
    INVALID_CREDS: {
        "USER": process.env.INVALID_USER_EMAIL,
        "PASSWORD": process.env.INVALID_USER_PASSWORD
    }
}

export const WORKSPACES = {
    "NEW_NAME": "Workspace: " + uuidv4(),
    "DESCRIPTION": "Description: " + faker.lorem.slug(4)
}

export const workspaceDropElements = [
    "Sales CRP",
    "Opertations"
]

export const BOARDS = {
    "NEW_NAME": "Board: " + uuidv4()
}