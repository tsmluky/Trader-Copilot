# Security Policy

## 1. Secrets Management
-   **NEVER** commit `.env` files.
-   **NEVER** embed keys in code.
-   **ALWAYS** use environment variables.

### Incident Response: Leaked Key
If a secret (API Key, Database URL) is committed to Git:
1.  **Rotate** the key immediately at the provider (AWS, OpenAI, DB Host).
2.  **Purge** the secret from Git history using `git filter-repo` or start a fresh repo.
3.  **Audit** logs for unauthorized usage during the exposure window.

## 2. Dependencies
-   Run `pip audit` and `npm audit` regularly before major releases.
-   Keep `requirements.txt` pinned.

## 3. Databases
-   Ensure `dev_local.db` (SQLite) is never deployed to production.
