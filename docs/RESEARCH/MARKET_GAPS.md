# Market hypotheses and validation status

Checked 2026-11-09. No validated market gap or uniqueness claim exists.

| Hypothesis | Evidence found | Confidence | Required next proof |
|---|---|---:|---|
| Teams benefit from shared mailboxes, collaboration, rules, analytics and integrations. | Front and Missive product pages list these as core/tiered capabilities. | High for cited feature presence | User workflow interviews and plan-level trials |
| Personal unified inbox is established and offered without charge. | Thunderbird advertises unified inbox and free/open-source project. | High for cited claim | Client usability baseline and mobile comparison |
| Email connectivity APIs and self-hostable bridges exist. | EmailEngine supports IMAP/SMTP, Gmail and Graph via REST and says it is not a mail server/admin system. | High for cited scope | Evaluate deployment/security and actual operations |
| Mailbox migration is an existing category. | imapsync documents recursive incremental resumable IMAP transfer, with explicitly scoped limits. | High for cited scope | Compare enterprise migration tools and parity workflow |
| Hosting panels already administer mail accounts, while DMARC specialists analyze authentication. | Plesk, DirectAdmin and DMARC product documentation describe separate capabilities. | Medium | Test direct workflows and agency willingness to consolidate |
| Cross-provider agency email operations could be a combined product value. | Inferred from the categories above; no customer interviews or competitor teardown establish a gap. | Low | Interviews, design prototype tests, build-vs-integrate cost and security review |

Current interpretation: pursue permission-aware aggregation, incident evidence, migration planning/verification, and agency client context only as hypotheses. Integration may be more valuable and lower risk than reimplementing mature specialized DMARC/migration tools. Validate before selling or claiming differentiation.
