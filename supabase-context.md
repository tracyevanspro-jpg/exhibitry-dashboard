# Brain 2 — Supabase Context

## Connection
- **Project ID:** `jrgfbfxzrpzfscguicwi`
- **URL:** `https://jrgfbfxzrpzfscguicwi.supabase.co`
- **Anon key:** get from Supabase dashboard → Settings → API → `anon` public key

## What is Brain 2?
A personal knowledge base for Tracy Evans / Exhibitry, a Houston-based experiential design company.
It stores active projects, tasks, contacts, ideas, and ingested documents.
It is queried by an AI assistant (Claude) during work sessions to stay current on all projects.

## Tables

### `projects`
Tracks all active client projects and opportunities.
| column | type | notes |
|---|---|---|
| id | uuid | primary key |
| name | text | project name |
| status | text | see status values below |
| next_action | text | what needs to happen next |
| notes | text | full project context |
| last_updated | timestamptz | |
| source | text | e.g. 'gmail' |
| created_at | timestamptz | |

**Status values in use:**
- `active-fabrication` — physical build underway with USMI
- `active-pitch` — pitch/presentation imminent
- `active-proposal` — proposal submitted, awaiting response
- `Active` — general active project
- `Active — Pre-RFP` — waiting for RFP to arrive
- `Lead` — early stage inquiry

### `admin`
Tasks and to-dos with optional due dates.
| column | type | notes |
|---|---|---|
| id | uuid | primary key |
| task | text | task description |
| due_date | timestamptz | nullable |
| status | text | 'Open', 'pending', 'Closed', 'complete' |
| notes | text | context |
| date_captured | timestamptz | |
| source | text | |
| created_at | timestamptz | |

### `people`
Contacts — clients, partners, vendors.
| column | type | notes |
|---|---|---|
| id | uuid | primary key |
| name | text | |
| context | text | role, company, relationship notes, email, phone |
| follow_ups | text | pending follow-up notes |
| last_touched | timestamptz | |
| tags | text[] | e.g. ['slb', 'fabrication', 'prospect'] |
| source | text | |
| created_at | timestamptz | |

### `ideas`
Freeform ideas and notes.
| column | type | notes |
|---|---|---|
| id | uuid | primary key |
| name | text | |
| context | text | |
| tags | text[] | |
| source | text | |
| created_at | timestamptz | |

### `documents`
Ingested documents (meeting notes, reports, etc.)
| column | type | notes |
|---|---|---|
| id | uuid | primary key |
| name | text | |
| context | text | extracted content / summary |
| tags | text[] | |
| source | text | |
| created_at | timestamptz | |

### `inbox_log`
Log of inbound contacts and website form submissions.

## Key company context
- **Exhibitry** — experiential design, HoloTube installations, interactive exhibits
- **HoloTube** — Exhibitry's signature holographic display product (life-size and standard)
- **USMI / Paul Johnson** — primary fabrication partner, 30-year relationship, Houston
- **Tim Drake** — field installation and repair contractor, Canadian
- Tracy travels frequently: Houston base + project sites nationwide
