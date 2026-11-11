# Security Policy

## Supported Versions

Only the latest release receives security updates.

| Version | Supported          |
| ------- | ------------------ |
| 2.2.x   | :white_check_mark: |
| < 2.2   | :x:                |

Versions up to and including 2.2.0 are vulnerable to OS command injection
(CWE-78) via the file name, through `@hckrnews/converter`,
`@hckrnews/pdf2png` and `@hckrnews/ppt2pdf`. Upgrade to 2.2.1 or later.

## Reporting a Vulnerability

Please do not report security vulnerabilities through public issues or pull
requests.

Report them privately via GitHub:
<https://github.com/w3nl/ppt-png/security/advisories/new>

Include a description, the affected version, and steps to reproduce. You can
expect an initial response within a week. If the report is accepted, a fix is
prepared in a private fork and a security advisory is published together with
the patched release. If it is declined, you will receive an explanation.
