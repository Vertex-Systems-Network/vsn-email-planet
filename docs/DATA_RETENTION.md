# Data retention plan

No production content is stored. Before adding message persistence, specify per-tenant choices for metadata versus full message cache, attachment lifecycle, search index retention, archive/backup distinction, deletion/tombstones, legal holds, export, consent revocation and key destruction. Logs must never contain raw message bodies, OAuth tokens, passwords or attachments. Retention defaults remain unselected pending product/security design.
