# PROOF — Demonstrated Technical Capability

> **“Don’t tell us what you can do. Show us what you can prove.”**

PROOF is a technical capability platform where developers demonstrate what they can build through real work, technical decisions, evidence, expert review, and verified proof rather than relying solely on resumes or popularity metrics.

### Core Loop

```text
BUILD → PROVE → VERIFY → SHOW → DISCOVER
```

---

## 1. Why PROOF Exists

Traditional technical hiring signals rely heavily on resumes, academic credentials, and self-reported skills that do not reliably reflect real-world engineering competency. 

PROOF is designed around observable, verifiable technical execution:
* **Real-World Missions**: Concrete engineering challenges with explicit constraints, trade-offs, and failure models.
* **Architecture Specifications**: Explicit system topology, invariants, and concurrency models.
* **Architecture Decision Records (ADRs)**: Documented engineering trade-offs and rationale.
* **Verifiable Evidence**: Reproducible execution artifacts, benchmarks, and runner logs.
* **Expert Peer Audits**: Structured reviews and score rubrics staked by senior specialists.
* **Algorithmic Capability Profiles**: Telemetry derived strictly from technical evidence rather than social popularity.
* **Evidence-Based Discovery**: Direct recruiter access to demonstrated proof.

---

## 2. Core Features

### For Builders
* **Mission Catalog**: Structured technical missions across Distributed Systems, Databases, Concurrency, Networking, and Performance.
* **Mission Execution**: Lifecycle tracking from active attempts to verified case studies.
* **Engineering Workstation**: Dedicated workspace environment for drafting solutions.
* **Architecture Specification**: Diagram, system flow, and fault tolerance documentation.
* **Architecture Decision Records (ADRs)**: Defended trade-offs, alternative evaluations, and design context.
* **Evidence Manager**: Benchmark telemetry, chaos test reports, and artifact links.
* **Technical Defense**: Probing architectural questions to validate technical depth.
* **Case Study Repository**: Publicly discoverable verified proofs.
* **Capability & Progression**: Skill telemetry, evidence confidence ratings, XP, badges, and milestones.

### For Reviewers
* **Reviewer Hub**: Operational perspective tailored for audit workflows.
* **Pending Audit Pipeline**: Live queue of submissions awaiting verification.
* **Dossier Inspection**: Full inspection of candidate architecture, ADRs, and evidence items.
* **Rubric-Based Evaluation**: Granular scoring across Architecture, Code Quality, Scalability, Trade-Off Reasoning, and Testing Rigor.
* **Technical Feedback**: Structured written assessments covering strengths, improvements, and non-obvious insights.
* **Audit Persistence & Reputation**: Immutable published audit dossiers that stake reviewer reputation and update candidate capability scores.

### For Recruiters
* **Talent Directory**: High-density engineering registry searchable by verified competencies and capability scores.
* **Competency Filtering**: Multi-facet filtering across technical domains, verification confidence, and project volume.
* **Candidate Dossiers**: Comprehensive profiles exposing verified proofs, benchmark evidence, and reviewer audits.
* **Technical Reels Integration**: Direct inspection of short-form architecture demonstrations attached to profiles.
* **Opportunity Pipeline**: Direct candidate inquiry and outreach tracking with status management.

### For Technical Reels (Social Engineering Layer)
* **Demonstration Feed**: Short-form technical walkthroughs prioritizing architecture, code walkthroughs, benchmarks, and defenses.
* **Topic Classification**: Filter by Architecture, Code Walkthrough, Benchmark, Live Demo, and Defense.
* **Code & Architecture Viewer**: Synchronized syntax-highlighted code snippets and terminal telemetry.
* **Peer Scrutiny**: Technical Q&A discussions and save/bookmark capabilities.
* **Media Pipeline**: Direct presigned ticket upload workflow for video and thumbnail assets.

### Security & Access Control
* **JWT Authentication**: Secure token-based session handling with cryptographic verification.
* **Role Separation**: Strict role boundaries for `BUILDER`, `REVIEWER`, `RECRUITER`, and `ADMIN`.
* **Submission Ownership**: Modification restricted strictly to authors; view access granted to authors, verified records, reviewers, and recruiters.
* **Reviewer Authorization**: Peer audits can only be published by authenticated reviewers; self-review is forbidden.
* **Opportunity Participant Checks**: IDOR protections enforcing that only the creator, assigned candidate, or admin can update status.

---

## 3. Architecture

```text
Next.js 16 (App Router + Turbopack)
              ↓ HTTP / JSON API
FastAPI (Python 3.14 / Pydantic v2)
              ↓ SQLAlchemy 2.0 ORM (pg8000 Pure-Python Driver)
Supabase PostgreSQL & Supabase Storage (Reel Media)
```

### Technology Stack
* **Frontend**: Next.js 16, React 19, TypeScript, Vanilla CSS design tokens & Tailwind CSS utilities.
* **Backend**: FastAPI, Pydantic v2, SQLAlchemy 2.0, Alembic database migrations.
* **Database Driver**: `pg8000` (Pure-Python PostgreSQL driver, ensuring cross-platform reliability without native DLL dependencies).
* **Storage**: Supabase Storage for technical reel video and image assets.
* **Authentication**: Custom backend JWT issuance and password hashing (independent of Supabase Auth).

---

## 4. Data Model & Workflow

```text
Mission (Challenge)
        ↓
ChallengeAttempt (Attempt Tracking)
        ↓
Workspace Session
        ↓
Architecture Spec + Technical Decisions (ADR) + Evidence Items
        ↓
Submission (DRAFT → PENDING_REVIEW → VERIFIED)
        ↓
Reviewer Audit (Rubric Scoring + Written Feedback)
        ↓
Verification & Capability Recalculation
        ↓
Verified Proof / Engineer Dossier / Recruiter Discovery
```

*Note: Missions leverage the unified Challenge data model with specialized mission metadata, avoiding redundant entity models.*

---

## 5. Security Model

* **Authentication**: Stateless Bearer tokens containing user ID, role, and expiration claims.
* **Authorization Dependencies**: Declarative FastAPI route guards (`get_current_user_required`, `get_current_user_strict`).
* **Object-Level Authorization**: Enforced on all update and deletion endpoints to prevent Insecure Direct Object References (IDOR).
* **Role Verification**: Independent checks verifying `REVIEWER` / `ADMIN` roles before processing audits or reviewer reputation updates.
* **Secret Isolation**: All credentials and tokens are loaded via environment variables and excluded from source control.

---

## 6. Repository Structure

```text
proof/
├── backend/
│   ├── app/
│   │   ├── api/             # FastAPI routers (auth, submissions, reviews, talent, reels, etc.)
│   │   ├── core/            # Database engine, settings, security utilities
│   │   ├── models/          # SQLAlchemy ORM database models
│   │   ├── schemas/         # Pydantic v2 input/output schemas
│   │   ├── services/        # Capability engine, verification engine, storage service
│   │   └── main.py          # FastAPI application entrypoint & middleware
│   ├── migrations/          # Alembic schema versioning scripts
│   └── tests/               # Backend test suite
├── frontend/
│   ├── app/                 # Next.js App Router routes (/missions, /reviews, /talent, /reels, etc.)
│   ├── components/          # Reusable UI, editorial components, workspace editors, video player
│   ├── lib/                 # API client, AuthProvider, role context
│   └── public/              # Static media and design assets
├── adapters/                # Verification runner adapters
├── scripts/                 # Utility and maintenance tools
├── .env.example             # Root environment template
├── docker-compose.yml       # Containerized service definitions
└── alembic.ini              # Migration runner configuration
```

---

## 7. Local Development Setup

### Prerequisites
* **Node.js**: v18+ (v20+ recommended)
* **Python**: v3.11+ (v3.12+ / v3.14 compatible)
* **Database**: Supabase PostgreSQL or local PostgreSQL instance

### 1. Environment Configuration
Copy the provided environment templates:
```bash
# Root / Backend configuration
cp .env.example .env

# Frontend configuration (optional override)
cp frontend/.env.example frontend/.env.local
```
Update `.env` with your PostgreSQL database URL and JWT secret key.

### 2. Backend Setup
From the repository root:
```bash
# Create and activate virtual environment
python -m venv backend/.venv

# Windows (PowerShell):
.\backend\.venv\Scripts\Activate.ps1
# macOS / Linux:
source backend/.venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Run migrations
alembic upgrade head

# Start FastAPI server
python -m uvicorn backend.app.main:app --reload --port 8000
```
Backend API docs will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

### 3. Frontend Setup
In a separate terminal:
```bash
cd frontend

# Install packages
npm install

# Start Next.js development server
npm run dev
```
Frontend application will be available at [http://localhost:3000](http://localhost:3000).

---

## 8. Database & Migrations

* **Engine**: PostgreSQL via Supabase or local instance.
* **Migration Management**: Alembic tracks and applies schema revisions.
* **Current Schema Version**: `6e2f9d945bd1 (head)`
* **Applying Migrations**:
  ```bash
  alembic upgrade head
  ```

---

## 9. Testing & Technical Validation

The core platform has passed the following technical validation checks:

* **TypeScript Compilation**: `npx tsc --noEmit` passed with `0` errors.
* **Production Build**: `npm run build` compiled all 18 Next.js App Router static and dynamic routes.
* **Database Integrity**: Read-only database assertions verified 108 missions, 11 submissions, 11 published reviews, 18 technical reels, and 0 duplicate records.
* **Alembic Version Alignment**: Migration state verified at `6e2f9d945bd1 (head)`.
* **PostgreSQL Connectivity**: Pure-Python `pg8000` driver connection and SSL queries verified.
* **Security & Authorization**: Verified role access guards, IDOR mitigation, and submission access controls.

> *Note: Final consolidated real-browser E2E regression is pending because the external browser automation infrastructure currently has capacity limitations.*

---

## 10. Current Status

* **Core Implementation**: Complete
* **Technical Validation**: Passed
* **Final Browser Regression**: Pending external browser infrastructure availability

---

## 11. Roadmap (Future Work)

The following capabilities represent future platform extensions:
* **Advanced Code Telemetry**: Native containerized sandbox execution for builder test harnesses.
* **Multi-Reviewer Consensus**: Weighted Bayesian score aggregation for high-volume peer audits.
* **Richer Capability Graphs**: Multi-dimensional radar projections with historical growth tracking.
* **AI-Assisted Scrutiny**: Automated static analysis hints during the submission draft phase.
* **Community-Authored Missions**: Verification protocol for builder-submitted engineering challenges.

---

## 12. License

Licensing terms are currently to be determined. All rights reserved.

