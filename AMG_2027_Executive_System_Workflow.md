# AMG 2027 Gubernatorial Campaign Digital Platform
## Executive System Architecture, Operational Workflow & Technical Proposal

**Candidates:** Engineer Mustapha Gubio & Hon. Ali Isa Abdullahi  
**Party:** All Progressives Congress (APC), Borno State Chapter  
**Strategic Theme:** *Consolidating Peace, Accelerating Transformation — Sustaining the Zulum Legacy*

---

## 1. Executive Summary

The **AMG 2027 Digital Campaign Platform** is a strategic web application engineered to power the gubernatorial campaign of **Engineer Mustapha Gubio & Hon. Ali Isa Abdullahi** across all 27 Local Government Areas (LGAs) of Borno State.

Beyond serving as a high-impact public landing page and digital policy manifesto, the platform acts as a centralized **grassroots mobilization and governance engine**. It provides an official digital accreditation framework where campaign organizations—including Ward Committees, Trade Unions, Civil Society Organizations (CSOs), Youth Groups, and Women Coalitions—can officially register, catalog their member rosters, submit verified field activities (rallies, stakeholder meetings, community outreach), and receive executive campaign recognition.

This document presents the complete end-to-end operational workflow, stakeholder role matrix, high-concurrency cloud architecture (engineered for 10,000+ simultaneous concurrent users), infrastructure cost projections (in both USD and Nigerian Naira at ₦1,430/$), and sequential implementation phases for leadership review and approval.

---

## 2. Key Stakeholders & Role-Based Access Control (RBAC)

The system establishes four distinct user surfaces with strictly enforced permissions:

| Stakeholder Role | Access Level | Core Responsibilities & Capabilities |
|---|---|---|
| **Public Visitors & Voters** | Public (`/`, `/organisations`, `/news`) | • Browse candidate profiles, 10-Point Development Agenda, and official statements.<br>• Search and verify accredited campaign support organizations by LGA and category.<br>• View organization public profiles, member counts, and photo feeds.<br>• Access INEC PVC verification portals, rally schedules, and press releases. |
| **Campaign Organizations (Admins)** | Authenticated (`/portal`) | • Submit official organization accreditation application.<br>• Manage verified member rosters (executive and general member name lists).<br>• Directly publish field activity reports (rallies, endorsements, outreach) with photo evidence.<br>• Maintain up-to-date leadership contact details and coverage scope. |
| **Media & Communications Team** | Authenticated (`/admin/news`) | • Author, schedule, and publish official press releases and campaign announcements.<br>• Curate high-resolution event photography and media galleries.<br>• Feature critical news updates dynamically on the public homepage. |
| **Super Administrators (Campaign Executive Leadership)** | Root Admin (`/admin`) | • Vet, approve, reject (with typed feedback), or suspend campaign organizations.<br>• Provision and manage internal `admin` and `media_team` user credentials.<br>• Moderate and audit published field activities and organization media.<br>• Monitor state-wide analytics, LGA voter engagement, and mobilization density. |

---

## 3. End-to-End System Operational Flow

The system operates through a structured 5-step workflow connecting grassroots voters, support organizations, campaign leadership, and the media team:

### Step 1: Public Discovery & Voter Engagement
* Voters and delegates visit the campaign portal from mobile phones, tablets, or desktops.
* Visitors review candidate executive track records, read policy briefs from the 10-Point Development Agenda, check upcoming town halls, and inspect campaign photography.
* Voters browse the **Public Organization Directory** (`/organisations`) to identify officially accredited APC support groups active within their specific ward or LGA.

### Step 2: Organization Self-Registration & Onboarding
* Leaders of Ward Committees, Trade Unions, CSOs, or Voluntary Support Groups navigate to the registration portal.
* The representative completes the digital accreditation application:
  * **Organization Identity**: Official name, category (Ward Committee, Trade Union, CSO, Youth, Women), and official logo.
  * **Geographic Coverage**: Flexible coverage selector (Single-LGA selection for Ward/LGA committees, or Multi-LGA picker for state-wide unions and coalitions).
  * **Executive Leadership**: Primary administrator name, official phone number, and verified email address.
  * **Mobilization Scale**: Estimated total member count and organizational mission statement.
* Submitting the form provisions the organization account and routes the application into the Super Admin Vetting Queue in a `pending` state.

### Step 3: Executive Vetting & Administrative Governance
* Campaign Super Administrators review pending submissions within the Admin Dashboard (`/admin`):
  * **Approval**: One-click approval immediately transitions the organization status to `approved`. The group's profile goes live on the Public Directory, and an automated welcome email with portal login instructions is dispatched to the organization's primary admin.
  * **Rejection with Typed Feedback**: If an application has missing documentation or invalid details, the Super Admin rejects it with a specific typed reason (e.g., *"Please upload an official association letterhead and specify your Maiduguri Ward executive"*). The organization receives an email notification, logs back into their portal, amends the flagged fields, and resubmits without losing previously entered data.
  * **Suspension / Content Moderation**: Super Admins retain continuous authority to suspend, unpublish, or delete any organization profile or rogue post that violates campaign communication guidelines.

### Step 4: Grassroots Organization Operations
* Approved organization leaders log into their dedicated dashboard (`/portal`):
  * **Member Roster Management**: Leaders maintain an accurate name list of executive officers and general members (Full Name and Functional Title/Role).
  * **Field Activity Reporting**: When an organization conducts a grassroots rally, voter PVC drive, or community outreach, the admin posts a field report with a title, summary write-up, and photo evidence.
  * **Immediate Synchronization**: Published reports instantly appear on the organization's public profile page and feed into the central campaign activity timeline.

### Step 5: Media Team News Publishing
* Communications officers log in with dedicated `media_team` credentials.
* Using a rich content editor, they draft and publish official campaign news, press statements, rally photo galleries, and policy updates directly to the homepage and news hub without developer dependency.

---

## 4. Technical Architecture & High-Concurrency Scalability

The platform is engineered to maintain **100% uptime and sub-second page loads**, even during peak political events, election night updates, or viral announcements generating **10,000+ simultaneous concurrent visitors**.

```
                        +---------------------------------------+
                        |           Global Edge CDN             |
                        |        (Vercel Edge Network)          |
                        +---------------------------------------+
                                    |               |
             Static Asset & Page Cache |               | Edge API Requests
                                    v               v
                        +-------------------+   +-----------------------+
                        | Next.js Frontend  |   |     Supabase Auth     |
                        |    (SSG & ISR)    |   |     & Edge Routes     |
                        +-------------------+   +-----------------------+
                                                            |
                                                            v
                                                +-----------------------+
                                                |   Supabase Postgres   |
                                                |    (With Supavisor    |
                                                |   Connection Pool)    |
                                                +-----------------------+
```

### Executive Concept — What is a CDN?
> [!NOTE]
> **CDN** stands for **Content Delivery Network**. It is a globally distributed network of high-speed servers (including edge locations serving Nigeria and West Africa).
> 
> Instead of 10,000 visitors trying to connect to a single central web server at the exact same second (which causes server overload, sluggish loading, or full crashes), the CDN automatically stores pre-rendered copies of the campaign website on hundreds of secure edge servers worldwide.
> 
> When a voter in Maiduguri, Biu, Abuja, or Lagos opens the site, the page loads instantaneously from the nearest CDN node. This guarantees **zero website crashes** during breaking news announcements, while saving millions of Naira in server hosting costs.

### Core Performance Engineering Principles:
1. **Edge CDN Caching (Incremental Static Regeneration - ISR)**:
   * Public-facing pages (Landing Page, 10-Point Agenda, Public Org Directory, News) are pre-compiled and served directly from CDN memory.
   * When 10,000 citizens open the site simultaneously, **0 queries hit the database**. Content delivery is instantaneous.
2. **Database Connection Pooling (Supavisor)**:
   * Dynamic actions (logins, application submissions, activity uploads) route through Supabase's **Supavisor connection pooler**, handling thousands of requests per second without memory exhaustion or database lockups.
3. **Automated Image Optimization Pipeline**:
   * All uploaded organization logos and rally photos are compressed and converted into lightweight next-gen formats (`WebP`/`AVIF`) on upload, preventing slow mobile loading in low-bandwidth rural areas.
4. **API-First Architecture**:
   * All backend services communicate through clean RESTful endpoints, ensuring that if campaign leadership decides to commission a dedicated mobile app (React Native/Flutter) in the future, the exact same backend and database will power it without rewriting code.

---

## 5. Component Specifications & Recommended Tiers

| # | Infrastructure Component | Provider & Tier | Key Technical Specifications | Rationale & Campaign Value |
|---|---|---|---|---|
| **1** | **Domain Name** | Existing Purchase (Annual Renewal) | • Custom Domain DNS<br>• Auto-renewing SSL/TLS | Preserves established campaign branding and official web authority (~$12/year = **~₦17,160/yr**). |
| **2** | **Frontend Hosting & Edge CDN** | **Vercel Pro Plan** ($20/month) | • 1 TB Edge CDN Bandwidth<br>• Global Edge Caching (West Africa nodes)<br>• 99.99% Uptime SLA<br>• Automated DDoS Mitigation | Delivers sub-second page loads to 10,000+ concurrent visitors without crashing and provides automatic deployments (**~₦28,600/month**). |
| **3** | **Database Engine & Authentication** | **Supabase Pro Plan** ($25 – $50/month) | • 8 GB Postgres Database<br>• 100,000 Monthly Active Auth Users<br>• **Supavisor Connection Pooler**<br>• Daily Automated Database Backups | Prevents project auto-pausing, secures user roles via Row Level Security (RLS), and absorbs heavy concurrent submission traffic (**~₦35,750 – ₦71,500/month**). |
| **4** | **Media & Image Asset Storage** | **Cloudflare R2** ($0 – $10/month) | • 10 GB Free Base Storage<br>• **$0 Egress Bandwidth Fees**<br>• Global S3-compatible asset delivery | Eliminates bandwidth download fees when thousands of voters view high-res rally albums, org logos, and field photos (**~₦0 – ₦14,300/month**). |
| **5** | **Transactional Email Service** | **Resend Pro Plan** ($20/month) | • 50,000 emails/month<br>• Dedicated IP reputation<br>• High deliverability to Nigerian inboxes | Powers essential email delivery for organization application receipts, password resets, and approval notifications (**~₦28,600/month**). |

---

## 6. Financial Cost Summary Table

*(Calculated using the benchmark exchange rate of **$1 USD = ₦1,430 NGN**)*

| Component | Recommended Tier | Development Phase | Peak Launch & Election Phase (10,000 Concurrent Users) | Monthly Cost in NGN (₦) |
|---|---|---|---|---|
| **Domain Name** | Annual Renewal | **$0** (₦0) | **$0** (Annual renewal ~$12/yr) | **~₦17,160 / year** |
| **Frontend & Edge CDN** | Vercel Pro | **$0 / mo** (Hobby) | **$20 / mo** (1 TB Bandwidth + DDoS Guard) | **~₦28,600 / month** |
| **Database & Auth** | Supabase Pro | **$0 / mo** (Free) | **$25 to $50 / mo** (Dedicated Pooler + Auto Backups) | **~₦35,750 – ₦71,500 / month** |
| **Media Asset Storage** | Cloudflare R2 | **$0 / mo** | **$0 to $10 / mo** ($0 Egress Bandwidth Fees) | **~₦0 – ₦14,300 / month** |
| **Transactional Email** | Resend Pro | **$0 / mo** | **$20 / mo** (50,000 emails/mo) | **~₦28,600 / month** |
| **TOTAL ESTIMATED COST** | | **$0 / month** | **~$45 to $100 / month** | **~₦64,350 – ₦143,000 / month** |

> **Cost Efficiency Note**: By leveraging modern serverless edge architecture, total infrastructure costs stay under **₦143,000/month ($100/mo)** even during peak campaign traffic. This eliminates the need for expensive traditional dedicated cloud servers costing millions of Naira.

---

## 7. Proposed Features & Strategic Rationale (Why It Matters)

| Proposed Feature | Key Functional Scope | Why It Matters (Strategic Campaign Value) |
|---|---|---|
| **1. Public Landing Page & Manifesto** | Candidate profiles, 10-Point Development Agenda, video highlights, interactive Borno rally calendar, volunteer registration. | **Establishes Immediate Credibility**: Communicates policy promises directly to voters state-wide, counters rival misinformation, and captures grassroots supporter data. |
| **2. Public Organization Directory & Profiles** | Searchable directory (`/organisations`) of verified support groups across 27 LGAs. Dedicated org profile pages with verified member counts and activity streams. | **Public Transparency & Grassroots Validation**: Showcases visible state-wide momentum by allowing voters and party stakeholders to see accredited campaign groups in their home LGA. |
| **3. Organization Self-Registration Portal** | Online onboarding form for Ward Committees, Trade Unions, CSOs, Youth, and Women groups to apply for formal accreditation. | **Eliminates Paper Logistical Overhead**: Replaces manual paper registration, streamlines vetting, and builds a centralized, exportable database of campaign organizations across Borno State. |
| **4. Organization Management Portal (`/portal`)** | Authenticated dashboard where group leaders log executive member rosters and publish field reports with photo evidence. | **Grassroots Empowerment & Field Reporting**: Gives local leaders direct recognition and ownership to showcase their rallies and voter mobilization in real time. |
| **5. Super Admin Governance Dashboard (`/admin`)** | One-click Approval / Rejection with typed feedback reasons; Super Admin account creation module for Admin & Media roles; content moderation. | **Total Executive Control & Risk Mitigation**: Ensures campaign leadership maintains absolute authority over which organizations represent the AMG 2027 banner, preventing rogue groups or bad actors. |
| **6. Media & Communications Hub (`/admin/news`)** | Dedicated publishing tool for the communications team to draft, schedule, and publish press releases, rally news, and photo galleries. | **Rapid Messaging & Media Agility**: Empowers the communications team to publish breaking news updates instantly without requiring developer assistance. |

---

## 8. Implementation Phasing & Milestones

*Phasing represents structured sequential development milestones to ensure rigorous quality control, security verification, and seamless delivery:*

### Phase 1: Foundation & Core Platform Migration
* Initialize Next.js enterprise application structure with TypeScript and Edge runtime compatibility.
* Port existing CSS design token system ([style.css](file:///c:/Users/USER/.gemini/antigravity-ide/scratch/amg2027/css/style.css)) to ensure 100% pixel-perfect visual fidelity.
* Provision Supabase PostgreSQL database schema, configure Role-Based Access Control (RBAC), and establish Row-Level Security (RLS) policies.
* Migrate existing 15 landing page sections into dynamic components utilizing Incremental Static Regeneration (ISR).

### Phase 2: Organization Onboarding & Administrative Governance
* Build the public organization self-registration workflow with single and multi-LGA selection across all 27 Borno LGAs.
* Construct the Super Admin Dashboard (`/admin`) for reviewing pending applications (One-click Approve, Reject with typed feedback, and Suspend).
* Implement user management module enabling Super Admins to provision additional Admin and Media Team accounts.
* Wire automated transactional email notifications for registration receipts and vetting decisions.

### Phase 3: Organization Self-Service Portal & Public Directory
* Build the Organization Management Portal (`/portal`) for executive roster management and direct field activity logging.
* Implement the multi-photo upload pipeline with automatic client-side image compression.
* Construct the searchable Public Organization Directory (`/organisations`) with LGA and category filtering.
* Build dynamic individual organization profile pages (`/org/[slug]`) showcasing member counts, leadership contacts, and verified activity feeds.

### Phase 4: Media Communications Hub, Concurrency Testing & Public Launch
* Deploy the Media Team publishing engine (`/admin/news`) and photo gallery manager.
* Execute simulated stress and load testing at **10,000 concurrent requests** to validate CDN caching hit rates and Supavisor connection pooling.
* Connect the official custom domain DNS, verify SSL/TLS certificates, perform cross-device QA, and execute public launch.
