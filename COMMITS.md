# Conventional Commits Guide

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification for all commit messages.

## Format

```git
<type>(<scope>): <short description>
[optional body]
[optional footer]
```

### Rules
- Subject line must be **under 72 characters**
- Use the **imperative mood** ("add" not "added", "fix" not "fixed")
- Do not end the subject line with a period
- Body explains the **why**, not the what
- Reference issue numbers in the footer where applicable



---

## Types

| Type       | When to Use                                           | Example                                          |
|------------|-------------------------------------------------------|--------------------------------------------------|
| `feat`     | New capability — test, page object, helper, assertion | `feat(boards): add board deletion test`          |
| `fix`      | Bug fix in existing test code or scripts              | `fix(auth): prevent OTP selector mismatch in CI` |
| `test`     | New test suites, scenarios, or test data              | `test(login): add blank email validation test`   |
| `refactor` | Restructuring without changing behavior               | `refactor(boards): extract board name assertion to helper` |
| `perf`     | Performance tuning (timeouts, workers, selectors)     | `perf(config): increase CI workers from 2 to 4`  |
| `docs`     | Documentation, README updates                         | `docs: add conventional commits guide`           |
| `chore`    | Cleanup, gitignore, folder reorganization             | `chore: add test-results to gitignore`           |
| `config`   | Configuration changes (playwright, CI/CD, env)        | `config(auth): rename TOTP_SECRET to avoid CI self-reference`  |
| `ci`       | CI/CD pipeline changes (stages, triggers, artifacts)  | `ci: add test-results to artifact paths`         |
| `revert`   | Reverting a previous commit                           | `revert: undo storageState changes from abc1234` |

---

## Scopes

| Scope       | What it covers                                                  |
|-------------|-----------------------------------------------------------------|
| `auth`      | Authentication flow, OTP/TOTP, session management, storageState |
| `boards`    | Board-related tests, page objects, selectors                    |
| `login`     | Login-related tests, page objects, selectors                    |
| `api`       | API helpers, cleanup scripts, Trello API integration            |
| `config`    | Playwright config, CI/CD pipeline config                        |
| `data`      | Test data, constants, environment variable structure            |
| `selectors` | Selector files, locator updates                                 |
| `helpers`   | Utility/helper files (e.g. TOTP helper)                         |
| `infra`     | Docker, CI runners, pipeline infrastructure                     |
| `deps`      | Dependency updates, package.json changes                        |
| *(none)*    | Cross-cutting changes with no single scope                      |

---

## Examples

```git
feat(boards): add afterEach API cleanup for created boards

Boards created during tests are now deleted via the Trello REST API
after each test to prevent hitting the 10-board workspace limit.

Closes #12
```

```git
fix(auth): resolve TOTP_SECRET self-reference in GitLab CI

Renamed CI variable mapping from TOTP_SECRET: ${TOTP_SECRET}
to SECRET: ${TOTP_SECRET} to prevent GitLab from passing
the literal string instead of the resolved value.
```

```git
ci: add screenshots and video recording to artifact paths

Added test-results/ to artifact paths in .gitlab-ci.yml so
failure screenshots and video recordings are preserved after
each pipeline run.
```
```git
config(auth): add otplib window option for CI clock drift

Set authenticator.options = { window: 2 } to allow ±60 seconds
tolerance for TOTP code validation, compensating for GitLab
shared runner clock skew.
```


---

## What NOT to do

- ❌ `fix: stuff` — too vague
- ❌ `feat(boards): Added the board creation test.` — past tense, ends with period
- ❌ `feat(boards): Add the board creation test and also fix the login selector and update the config file` — multiple concerns in one commit
- ✅ One commit = one logical change