# System Architecture - Event Approval Workflow

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    University Event Registration                 │
│                   Approval Workflow System v1.0                  │
└─────────────────────────────────────────────────────────────────┘

                    ┌────────────────────────────┐
                    │   Frontend Components      │
                    ├────────────────────────────┤
                    │                            │
                    │  ┌──────────────────────┐  │
                    │  │ Pending Approval     │  │
                    │  │ Status Component     │  │
                    │  └──────────────────────┘  │
                    │            ▲               │
                    │            │               │
                    │  ┌──────────────────────┐  │
                    │  │ Approval Workflow    │  │
                    │  │ Tracker Component    │  │
                    │  └──────────────────────┘  │
                    │            ▲               │
                    │            │               │
                    │  ┌──────────────────────┐  │
                    │  │ Approval Status      │  │
                    │  │ Card Component       │  │
                    │  └──────────────────────┘  │
                    │                            │
                    └────────────────────────────┘
                              │
                              │ (API Calls)
                              ▼
                    ┌────────────────────────────┐
                    │    Backend API             │
                    ├────────────────────────────┤
                    │ GET /api/workflow/event/:id│
                    │ POST /api/workflow/decision│
                    │ POST /api/workflow/security│
                    └────────────────────────────┘
                              │
                              │ (Database Queries)
                              ▼
                    ┌────────────────────────────┐
                    │   MongoDB Collections      │
                    ├────────────────────────────┤
                    │ • WorkFlow                 │
                    │ • Event                    │
                    │ • User                     │
                    │ • Organization             │
                    │ • Project                  │
                    │ • Venue                    │
                    └────────────────────────────┘
```

---

## Data Flow Diagram

```
Event Submission
    │
    ▼
┌─────────────────────────────────────┐
│  Event Created (status: pending)    │
│  WorkFlow Created (stage: org auth) │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│  Reviewer Accesses Event            │
│  GET /api/workflow/event/:eventId   │
└─────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────────────┐
│   Frontend Components Render:                │
│   1. PendingApprovalStatus - Shows journey   │
│   2. ApprovalWorkflowTracker - Shows stages  │
│   3. ApprovalStatusCard - Quick summary      │
└──────────────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│   Reviewer Makes Decision            │
│   POST /api/workflow/decision        │
│   {                                  │
│     eventId,                         │
│     status: 'approved|rejected',     │
│     comment: 'feedback'              │
│   }                                  │
└──────────────────────────────────────┘
    │
    ├─ If Approved ────────────┐
    │                          │
    │                  Move to next stage
    │                  Update currentRole
    │                  Record in history
    │                          │
    │                          ▼
    │               Is this final stage?
    │                  No ──► Continue to next
    │                  Yes ──► Set to "approved"
    │                         Make public
    │
    └─ If Rejected ────────────┐
                               │
                       Return to president
                       Set status: "returned"
                       Record rejection
                       Update history
                       Make event hidden
                               │
                               ▼
                    President reviews feedback
                    Modifies event
                    Resubmits for approval
                               │
                               ▼
                    Workflow restarts from
                    organizationAuthority
```

---

## Component Interaction Diagram

```
┌──────────────────────────────────────────────────────────────┐
│              ApprovalEventDetail Page                        │
└──────────────────────────────────────────────────────────────┘
                           │
                           │ Props from API
                           │
        ┌──────────────────┼──────────────────┬─────────────────┐
        │                  │                  │                 │
        ▼                  ▼                  ▼                 ▼
    ┌──────────────┐  ┌────────────────┐  ┌──────────────┐  ┌────────────────┐
    │ Pending      │  │ Approval       │  │ Approval     │  │ Sidebar        │
    │ Approval     │  │ Workflow       │  │ Status       │  │ Components     │
    │ Status       │  │ Tracker        │  │ Card         │  │                │
    │ Component    │  │ Component      │  │ Component    │  │                │
    └──────────────┘  └────────────────┘  └──────────────┘  └────────────────┘
          │                   │                    │                │
          ├─ Shows timeline   ├─ Shows stages     ├─ Shows quick   ├─ Org info
          ├─ Shows current    ├─ Color-coded      │   status       ├─ Project info
          │  role             ├─ Arrows between   ├─ Current role  ├─ Venue info
          ├─ Shows feedback   │  stages           └─ Date info     └─ President
          └─ Shows summary    └─ Shows pending
                                 indicators
```

---

## Approval Workflow Stages

```
START
  │
  ▼
┌─────────────────────────────────────────┐
│  1. Organization Authority (Advisor)    │ ⏳ Waiting
│  Role: advisor/head                     │ Decision: Approve/Reject
└─────────────────────────────────────────┘
  │
  ├─ Reject ──► RETURNED TO PRESIDENT
  │
  └─ Approve ──┐
               ▼
┌─────────────────────────────────────────┐
│  2. Welfare Officer                     │ ⏳ Waiting
│  Role: welfareOfficer                   │ Decision: Approve/Reject
└─────────────────────────────────────────┘
  │
  ├─ Reject ──► RETURNED TO PRESIDENT
  │
  └─ Approve ──┐
               ▼
┌─────────────────────────────────────────┐
│  3. Venue Owner (if needed)             │ ⏳ Optional
│  Role: venueOwner                       │ Decision: Approve/Reject
└─────────────────────────────────────────┘
  │
  ├─ Reject ──► RETURNED TO PRESIDENT
  │
  └─ Approve ──┐
               ▼
┌─────────────────────────────────────────┐
│  4. Category Check (if needed)          │ ⏳ Optional
│  Role: category-specific                │ Decision: Approve/Reject
└─────────────────────────────────────────┘
  │
  ├─ Reject ──► RETURNED TO PRESIDENT
  │
  └─ Approve ──┐
               ▼
┌─────────────────────────────────────────┐
│  5. Security Upload (if needed)         │ ⏳ President uploads
│  Role: president                        │ Document: Security proof
└─────────────────────────────────────────┘
  │
  └─ Upload ──┐
              ▼
┌─────────────────────────────────────────┐
│  6. Proctor Review                      │ ⏳ Waiting
│  Role: proctor                          │ Decision: Approve/Reject
└─────────────────────────────────────────┘
  │
  ├─ Reject ──► RETURNED TO PRESIDENT
  │
  └─ Approve ──┐
               ▼
┌─────────────────────────────────────────┐
│  7. Vice Chancellor                     │ ⏳ Waiting
│  Role: viceChancellor                   │ Decision: Approve/Reject
└─────────────────────────────────────────┘
  │
  ├─ Reject ──► RETURNED TO PRESIDENT
  │
  └─ Approve ──┐
               ▼
┌─────────────────────────────────────────┐
│  8. Welfare Final Check                 │ ⏳ Waiting
│  Role: welfareOfficer                   │ Decision: Approve/Reject
└─────────────────────────────────────────┘
  │
  ├─ Reject ──► RETURNED TO PRESIDENT
  │
  └─ Approve ──┐
               ▼
┌─────────────────────────────────────────┐
│  ✓ FULLY APPROVED                       │ ✓ Event published
│  • Status: approved                     │ • Made public
│  • publicVisible: true                  │ • Visible to all users
│  • finalApprovedAt: timestamp           │ • Registration opens
└─────────────────────────────────────────┘
```

---

## Database Schema Relationships

```
┌──────────────┐
│   User       │
├──────────────┤
│ _id          │
│ fullName     │
│ email        │
│ role         │
│ adminProfile │
└──────────────┘
      ▲
      │ (One-to-Many)
      │ actor, president, owner
      │
      │ ┌──────────────────┐
      │ │    WorkFlow      │◄──────┐
      │ ├──────────────────┤       │
      │ │ _id              │       │
      │ │ event ───────────┼───────┼──► ┌──────────────┐
      │ │ currentStage     │       │    │    Event     │
      │ │ currentRole      │       │    ├──────────────┤
      │ │ currentAssignee ─┼───────┤    │ _id          │
      │ │ status           │       │    │ title        │
      │ │ history[]        │       │    │ organization ┼──► Organization
      │ │   - stage        │       │    │ project ─────┼──► Project
      │ │   - role         │       │    │ venue ───────┼──► Venue
      │ │   - decision     │       │    │ president ───┼──► User
      │ │   - comment      │       │    │ status       │
      │ │   - actor ───────┼───────┘    │ approvalStage│
      │ │   - at           │            │              │
      │ │ requiresSecurity  │            └──────────────┘
      │ │ securityImageUrl │
      │ │ history[]        │
      │ │ finalApprovedAt  │
      │ │ returnedToPresident│
      │ └──────────────────┘
      │
      └─ Multiple relationships to User
        (currentAssignee, actor in history, etc.)
```

---

## API Response Structure

```
GET /api/workflow/event/:eventId

┌─────────────────────────────────────┐
│  Response                           │
├─────────────────────────────────────┤
│ {                                   │
│   success: boolean,                 │
│   message: {                        │
│     event: {                        │
│       title,                        │
│       description,                  │
│       status,                       │
│       approvalStage,                │
│       approvalRole,                 │
│       createdAt,  ◄─── NEW          │
│       ... other fields              │
│     },                              │
│     relations: {                    │
│       organization,                 │
│       project,                      │
│       venue,                        │
│       president                     │
│     },                              │
│     workflow: {                     │
│       status,                       │
│       currentStage,                 │
│       currentRole,                  │
│       history: [{                   │
│         stage,                      │
│         role,                       │
│         decision,                   │
│         comment,                    │
│         at,                         │
│         actor: { ... }              │
│       }],                           │
│       finalApprovedAt,              │
│       returnedToPresidentAt         │
│     }                               │
│   }                                 │
│ }                                   │
└─────────────────────────────────────┘
```

---

## State Management Flow

```
User Action (Click Approve/Reject)
    │
    ▼
Component Event Handler
    │
    ├─ Validate (comment required for reject)
    │
    ├─ Show Loading State
    │
    ▼
POST /api/workflow/decision
    │
    ▼
Backend Processes Decision
    │
    ├─ Verify user role
    ├─ Update workflow
    ├─ Update event
    ├─ Record history
    └─ Calculate next stage
    │
    ▼
Return Updated Workflow
    │
    ├─ Show Success Toast
    │
    ├─ Fetch Latest Data
    │
    ▼
Component Updates
    │
    ├─ Update detail object
    ├─ Re-render components
    ├─ Show new status
    └─ Hide loading state
    │
    ▼
Navigate to Dashboard
```

---

## Component Rendering Tree

```
ApprovalEventDetail (Page)
│
├─ MainLayout
│  └─ Header
│
├─ PageHeader
│  ├─ Back Button
│  └─ Event Cover/Title
│
├─ EventOverview Card
│  ├─ Title
│  ├─ Date/Time
│  └─ Venue Info
│
├─ PendingApprovalStatus Component
│  ├─ Status Badge
│  ├─ Pending Role (if pending)
│  ├─ Approval Journey
│  │  └─ History Items
│  └─ Summary Stats
│
├─ ApprovalWorkflowTracker Component
│  ├─ Stage 1 (completed/pending/upcoming)
│  ├─ Arrow
│  ├─ Stage 2
│  ├─ Arrow
│  ├─ ... more stages
│  └─ Arrow
│
├─ WorkflowTimeline Card
│  └─ History Timeline (if any)
│
├─ WorkflowAction Card
│  ├─ Comment Textarea
│  ├─ Approve Button
│  └─ Reject Button
│
└─ Sidebar
   ├─ ApprovalStatusCard Component
   │  ├─ Status Icon
   │  ├─ Status Text
   │  └─ Role Info
   │
   ├─ Related Records Card
   │  ├─ Organization Info
   │  ├─ Project Info
   │  ├─ Venue Info
   │  └─ President Info
   │
   └─ Approval Summary Card
      ├─ Category
      ├─ Stage & Role
      ├─ Security Requirements
      └─ Visibility Status
```

---

## Deployment Architecture

```
Production Environment
│
├─ Frontend Build
│  ├─ React Components
│  ├─ New UI Components
│  ├─ Type Definitions
│  └─ Styles (Tailwind)
│
├─ Backend Server
│  ├─ Express.js
│  ├─ Updated workFlowController
│  ├─ Routes (unchanged)
│  └─ Models (unchanged)
│
└─ Database
   ├─ WorkFlow Collection
   ├─ Event Collection
   ├─ User Collection
   ├─ Organization Collection
   ├─ Project Collection
   └─ Venue Collection
```

---

## Security Flow

```
User Access Request
    │
    ▼
Authentication Check
    │ (userAuth middleware)
    │
    ▼
Authorization Check
    │ └─ Verify user role matches currentRole
    │
    ▼
Data Validation
    │ ├─ Verify event exists
    │ ├─ Verify workflow exists
    │ └─ Verify status is pending
    │
    ▼
Role Verification
    │ └─ Ensure user can approve
    │
    ▼
Process Decision
    │ ├─ Record in history
    │ ├─ Update event
    │ └─ Calculate next stage
    │
    ▼
Return Response
    │
    └─ Send updated workflow
```

---

## Performance Optimization Points

```
Frontend
├─ useMemo for role name formatting
├─ Conditional rendering
├─ Component memoization
└─ Lazy loading of images

Backend
├─ Efficient database queries
├─ Indexed collections
├─ Minimal data transformation
└─ Avoid N+1 queries

Database
├─ Proper indexing
├─ Document-level optimization
└─ Query plan optimization
```

---

**Diagram Version**: 1.0  
**Last Updated**: June 2024  
**Status**: Production Ready

