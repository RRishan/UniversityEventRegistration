# Quick Start Guide - Event Approval Workflow

## For Event Reviewers

### Accessing Pending Events
1. Log in with your reviewer role (advisor, welfare officer, proctor, etc.)
2. Navigate to **Approval Dashboard** (`/approval-dashboard`)
3. See all events waiting for your approval

### Reviewing an Event

1. **Click** on an event to open detail page
2. **Scroll** to see three approval components:
   - **Approval Status Card** (top right sidebar): Quick overview
   - **Pending Approval Status**: Shows current status and full timeline
   - **Approval Progress Tracker**: Visual workflow stages

3. **Review**:
   - Event details (overview card)
   - Organization, project, venue info (sidebar)
   - Previous approvals/rejections (timeline)
   - Feedback from other reviewers

4. **Decide**:
   - Scroll to **Workflow Action** section
   - Add comment if rejecting (required)
   - Click **Approve** or **Reject**

5. **Confirmation**:
   - Success message appears
   - Redirected to dashboard
   - Next reviewer will be notified

### Understanding the Status Indicators

| Icon | Status | Meaning |
|------|--------|---------|
| ⏳ | Pending | Awaiting approval |
| ✓ | Approved | Successfully approved |
| ✗ | Rejected | Needs review/changes |
| → | Arrow | Workflow progression |

## For Event Organizers

### Submitting an Event

1. Create event with all details
2. Click **Submit for Approval**
3. Event status becomes **Pending**

### Tracking Approval Status

1. Go to your event detail page
2. Scroll to **Approval Status** section
3. See:
   - Current reviewer role
   - All previous approvals
   - Complete approval timeline

### If Event is Rejected

1. Navigate to event
2. Check **Pending Approval Status** for feedback
3. Read comment from reviewer explaining rejection
4. Edit event details
5. Click **Resubmit**
6. Workflow restarts with organization authority

## Component Usage Examples

### Using PendingApprovalStatus

```typescript
import { PendingApprovalStatus } from "@/components/ui/PendingApprovalStatus";

<PendingApprovalStatus
  currentStage={detail.workflow.currentStage}
  currentRole={detail.workflow.currentRole}
  workflowStatus={detail.workflow.status}
  history={detail.workflow.history}
  createdAt={detail.event.createdAt}
/>
```

### Using ApprovalWorkflowTracker

```typescript
import { ApprovalWorkflowTracker } from "@/components/ui/ApprovalWorkflowTracker";

<ApprovalWorkflowTracker
  currentStage={detail.workflow.currentStage}
  workflowStatus={detail.workflow.status}
  history={detail.workflow.history}
/>
```

### Using ApprovalStatusCard

```typescript
import { ApprovalStatusCard } from "@/components/ui/ApprovalStatusCard";

<ApprovalStatusCard
  status={detail.workflow.status}
  currentRole={detail.workflow.currentRole}
  currentStage={detail.workflow.currentStage}
  finalApprovedAt={detail.workflow.finalApprovedAt}
  returnedToPresidentAt={detail.workflow.returnedToPresidentAt}
/>
```

## Approval Workflow Stages

Events follow this approval sequence:

```
1. Organization Authority (Advisor)
   ↓ (Approves)
2. Welfare Officer
   ↓ (Approves)
3. Venue Owner (if different venue)
   ↓ (Approves)
4. Category Check (if applicable)
   ↓ (Approves)
5. Security Upload (President uploads docs)
   ↓
6. Proctor
   ↓ (Approves)
7. Vice Chancellor
   ↓ (Approves)
8. Welfare Final (Final welfare check)
   ↓ (Approves)
9. APPROVED ✓ (Event is now public)
```

Any rejection at any stage → Event returned to president for changes

## Common Actions

### How to Approve
1. Review event details
2. Optionally add comment
3. Click **Approve** button
4. Event moves to next stage automatically

### How to Reject
1. Review event details
2. **Add comment explaining rejection** (required)
3. Click **Reject** button
4. Event returned to president with your feedback

### How to View Full Timeline
1. Look for **Pending Approval Status** component
2. Scroll through **Approval Journey** section
3. See all decisions and comments in chronological order

### How to See What's Pending
1. Look for amber/yellow highlighting
2. ⏳ indicates currently pending stage
3. Role name shown in "Waiting For Approval" section

## Colors Quick Reference

- 🟡 **Amber/Yellow**: Currently pending, needs action
- 🟢 **Green**: Approved, moving forward
- 🔴 **Red**: Rejected, needs review
- 🔵 **Blue**: Information, status changes
- ⚫ **Gray**: History, past stages

## FAQ

**Q: Where do I see pending events?**
A: Go to `/approval-dashboard` - all events needing your approval are listed there.

**Q: How do I know what stage the event is at?**
A: Look at the "Workflow timeline" section and "Current stage" indicator. The pending role is highlighted.

**Q: Can I see who approved before me?**
A: Yes! Check the "Approval Journey" in the Pending Approval Status component. See all previous decisions and comments.

**Q: What happens if I reject?**
A: Event is returned to the president. It becomes hidden and they must fix issues and resubmit. Your comment explains why.

**Q: What's the difference between Pending and Returned?**
A: **Pending**: Event is waiting for some role to approve. **Returned**: Event was rejected and sent back to president.

**Q: Can I change my decision after approval?**
A: No, decisions are final. Contact an administrator if needed.

**Q: How long does approval take?**
A: Depends on reviewer response time. No automatic timeout.

**Q: Will I be notified of new events?**
A: Currently check dashboard manually. Email notifications coming soon.

## Troubleshooting

### "Approve button is disabled"
- ✓ Check you're the current assigned reviewer
- ✓ Check event status is "pending"
- ✓ Try refreshing page

### "Can't see event in dashboard"
- ✓ Verify your role matches the current stage
- ✓ Check if you're the assigned person for this stage
- ✓ Contact admin if issue persists

### "Timeline not showing decisions"
- ✓ Event may be in draft state
- ✓ Scroll down to see full timeline
- ✓ Try refreshing page

### "Event status shows wrong stage"
- ✓ Check Workflow Tracker component
- ✓ Scroll to see complete timeline
- ✓ Page may need refresh

## Key Shortcuts

| Action | Path |
|--------|------|
| View pending events | `/approval-dashboard` |
| Review event | `/approval-dashboard/event/:eventId` |
| My events | `/my-events` |
| Create event | `/events/create` |

## Data Fields Explained

### Event Overview
- **Title**: Event name
- **Date**: When event occurs
- **Time**: Start and end time
- **Venue**: Where event will be held
- **Attendees**: Expected number

### Approval Status
- **Current Stage**: Which approval step we're at
- **Current Role**: Who needs to approve
- **Status**: Pending/Approved/Returned/Rejected

### Workflow History
- **Stage**: Which approval step
- **Role**: Who was responsible
- **Decision**: What they decided
- **Actor**: Who made decision
- **Comment**: Their feedback
- **Date**: When decision made

---

**For detailed information, see**:
- Backend: `WORKFLOW_DOCUMENTATION.md`
- Frontend: `APPROVAL_WORKFLOW_GUIDE.md`
- Implementation: `IMPLEMENTATION_SUMMARY.md`
