# Event Approval Workflow - Testing Guide

## Test Environment Setup

### Required Test Data
1. Multiple test users with different roles:
   - Organization Advisor
   - Welfare Officer
   - Venue Owner
   - Proctor
   - Vice Chancellor
   - Event President/Organizer

2. Test events at different approval stages

3. Test organization, project, and venue data

## Manual Testing Scenarios

### Scenario 1: Full Approval Path

**Objective**: Verify event flows through complete approval workflow

**Steps**:
1. Create event as organizer
   - Fill all required fields
   - Submit for approval
   - ✓ Verify status: "pending"

2. Switch to Organization Advisor
   - Go to `/approval-dashboard`
   - ✓ See pending event
   - Open event detail
   - ✓ Verify "Pending Approval Status" shows correct role
   - ✓ Verify "Approval Progress Tracker" shows organizationAuthority as pending
   - Add comment: "Looks good"
   - Click Approve
   - ✓ Toast shows "Workflow approved"

3. Switch to Welfare Officer
   - ✓ Event appears in dashboard
   - ✓ "Current Stage" shows "welfareOfficer"
   - ✓ Timeline shows advisor approval
   - Click Approve
   - ✓ Moves to next stage

4. Continue through all stages
   - Repeat for: Venue Owner, Proctor, Vice Chancellor
   - ✓ Each stage shows previous approvals
   - ✓ Timeline grows with each approval

5. Final approval by Welfare Officer
   - ✓ Status changes to "approved"
   - ✓ Event becomes public
   - ✓ "Approval Progress Tracker" shows all checkmarks
   - ✓ Color changes to green

**Expected Result**: Event successfully approved and visible

---

### Scenario 2: Rejection and Return

**Objective**: Verify rejection returns event to president

**Steps**:
1. Event at Welfare Officer stage (pending)

2. As Welfare Officer:
   - Open event
   - ✓ Verify comment field is visible
   - ✓ Approve button enabled
   - ✓ Reject button enabled
   - Leave blank comment
   - Click Reject
   - ✓ Toast error: "Please add a rejection message"
   - Add comment: "Attendee count too high for venue"
   - Click Reject
   - ✓ Toast shows "Workflow rejected"

3. Check workflow status:
   - ✓ Status changes to "returned"
   - ✓ "Current Role" changes to "president"
   - ✓ "Current Stage" changes to "returnedToPresident"
   - ✓ New entry in timeline shows rejection with comment
   - ✓ Rejection timestamp recorded

4. As President:
   - ✓ Event appears in approval dashboard
   - ✓ "Pending Approval Status" shows returned status
   - ✓ Can see welfare officer's rejection comment
   - Edit event (reduce attendees)
   - Resubmit
   - ✓ Status resets to "pending"
   - ✓ Stage resets to "organizationAuthority"
   - ✓ Workflow restarts

**Expected Result**: Event returned and successfully resubmitted

---

### Scenario 3: Component Display Verification

**Objective**: Verify all UI components display correctly

**Test Case 3A: PendingApprovalStatus Component**
```
✓ Displays when workflowStatus = "pending"
  - Shows ⏳ icon with pulse animation
  - Shows "Waiting For Approval" section
  - Shows current role name
  - Shows stage name
✓ Displays when workflowStatus = "approved"  
  - Shows ✓ icon
  - Shows "Fully Approved" message
  - Shows approval date
✓ Displays when workflowStatus = "returned"
  - Shows ↩ icon
  - Shows "Returned for Changes" message
  - Shows return date
✓ Timeline section
  - Shows all history entries
  - Each entry has role, decision, actor, comment, date
  - Color coding: green (approved), red (rejected)
✓ Summary section
  - Shows approval count
  - Shows rejection count
  - Shows submission date
```

**Test Case 3B: ApprovalWorkflowTracker Component**
```
✓ Displays workflow stages
  - Shows relevant stages only (not all stages)
✓ Stage status indicators
  - Completed stages: ✓ green
  - Pending stage: ⏳ amber with pulse
  - Upcoming stages: ○ gray
  - Rejected stage: ✗ red
✓ Arrows between stages
  - Visible between each stage
  - Color: gray/light blue
✓ Special states
  - "Workflow Approved" card when approved
  - "Workflow Rejected" card when rejected
  - Shows proper messaging
```

**Test Case 3C: ApprovalStatusCard Component**
```
✓ Status display
  - Shows current status
  - Color matches workflow status
  - Shows appropriate icon
✓ Content varies by status
  - Pending: Shows waiting role
  - Approved: Shows approval date
  - Returned: Shows return date
  - Rejected: Shows rejection info
✓ Sidebar display
  - Compact format
  - Fits in 1-column layout
  - Responsive on mobile
```

---

### Scenario 4: Data Accuracy

**Objective**: Verify all data displays correctly

**Steps**:
1. Create event with known data
   - Title: "Test Event 123"
   - Attendees: 150
   - Date: "2024-06-15"
   - Venue: "Auditorium A"

2. Check Event Overview Card
   - ✓ Title matches
   - ✓ Attendee count correct
   - ✓ Date formatted correctly
   - ✓ Venue name correct

3. Check Workflow Timeline
   - For each approval entry:
   - ✓ Stage name displays correctly
   - ✓ Role name displays correctly
   - ✓ Reviewer name matches approver
   - ✓ Email address correct
   - ✓ Timestamp formatted correctly
   - ✓ Comment displays properly

4. Check Related Records
   - ✓ Organization info correct
   - ✓ Project info correct
   - ✓ Venue info correct
   - ✓ President info correct

**Expected Result**: All data displays accurately and consistently

---

### Scenario 5: Role-Based Access

**Objective**: Verify only authorized users can approve

**Steps**:
1. Event pending Welfare Officer approval

2. As Organization Advisor (not assigned):
   - Open event
   - ✓ Approve/Reject buttons disabled
   - ✓ Message: "Workflow actions are disabled"

3. As Welfare Officer (correct role):
   - ✓ Approve button enabled
   - ✓ Reject button enabled
   - Can submit decision

4. As Admin:
   - ✓ Can view all details
   - ✓ Cannot approve unless also has correct role

**Expected Result**: Only authorized reviewers can approve

---

### Scenario 6: Edge Cases

**Test Case 6A: Missing Data**
```
✓ Event without security requirement
  - Skips security upload stage
  - Moves to proctor stage directly
✓ Event without category-specific approval
  - Skips category check stage
  - Moves to next stage
✓ Venue owner same as welfare officer
  - Handles correctly
  - Doesn't duplicate approvals
```

**Test Case 6B: Security Upload**
```
✓ Event requires security
  - At securityUpload stage
  - President submits image URL
  - ✓ Image URL saved
  - ✓ Stage progresses
  - ✓ History shows "uploaded" decision
```

**Test Case 6C: Concurrent Operations**
```
✓ Two users don't override each other
  - User A viewing event
  - User B approves event
  - User A refreshes
  - ✓ Sees updated workflow
```

---

## Automated Testing Checklist

### Unit Tests
- [ ] formatRole() function works correctly
- [ ] formatDate() function works correctly
- [ ] Stage determination logic correct
- [ ] Role resolution logic correct
- [ ] History filtering and sorting

### Component Tests
- [ ] PendingApprovalStatus renders all states
- [ ] ApprovalWorkflowTracker shows correct stages
- [ ] ApprovalStatusCard displays status
- [ ] All components handle missing data
- [ ] Responsive design works on mobile

### Integration Tests
- [ ] Event creation to approval flow
- [ ] Workflow decision endpoint returns correct data
- [ ] Event status updates propagate
- [ ] Related records populate correctly
- [ ] History records persist

### API Tests
```
GET /api/workflow/event/:eventId
✓ Returns 200 with valid eventId
✓ Returns 404 with invalid eventId
✓ Requires authentication
✓ Returns complete workflow object
✓ Includes all required fields

POST /api/workflow/decision
✓ Accepts valid decision
✓ Rejects without comment on rejection
✓ Updates workflow status
✓ Records history entry
✓ Calculates next stage correctly
✓ Requires authentication
✓ Validates user role matches current role
```

---

## Performance Testing

### Load Testing
- [ ] Can handle 100+ events in approval dashboard
- [ ] Approval detail page loads in < 2 seconds
- [ ] Workflow decision processed in < 1 second
- [ ] Timeline renders smoothly with 50+ history entries

### Memory Testing
- [ ] No memory leaks on component mount/unmount
- [ ] Efficient re-renders
- [ ] History array doesn't cause slowdowns

---

## Visual/UI Testing

### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

### Responsive Design
- [ ] Desktop (1920px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)
- [ ] All text readable
- [ ] All buttons clickable
- [ ] No horizontal scroll

### Color Contrast
- [ ] All text meets WCAG AA standards
- [ ] Status colors distinguishable
- [ ] Icons visible on all backgrounds

---

## Security Testing

### Authorization
- [ ] Users can't approve without correct role
- [ ] Users can't access other users' workflows
- [ ] Comments properly sanitized
- [ ] No SQL injection possible

### Data Integrity
- [ ] Timestamps immutable
- [ ] History can't be modified
- [ ] Decisions can't be reversed improperly
- [ ] Audit trail complete

---

## Test Case Execution Log

### Date: ___________

#### Test Case: Scenario 1 - Full Approval Path
- Status: ☐ Pass ☐ Fail ☐ Blocked
- Notes: _________________________________

#### Test Case: Scenario 2 - Rejection and Return
- Status: ☐ Pass ☐ Fail ☐ Blocked
- Notes: _________________________________

#### Test Case: Scenario 3A - Component Display
- Status: ☐ Pass ☐ Fail ☐ Blocked
- Notes: _________________________________

#### Test Case: Scenario 3B - Workflow Tracker
- Status: ☐ Pass ☐ Fail ☐ Blocked
- Notes: _________________________________

#### Test Case: Scenario 3C - Status Card
- Status: ☐ Pass ☐ Fail ☐ Blocked
- Notes: _________________________________

#### Test Case: Scenario 4 - Data Accuracy
- Status: ☐ Pass ☐ Fail ☐ Blocked
- Notes: _________________________________

#### Test Case: Scenario 5 - Role-Based Access
- Status: ☐ Pass ☐ Fail ☐ Blocked
- Notes: _________________________________

#### Test Case: Scenario 6 - Edge Cases
- Status: ☐ Pass ☐ Fail ☐ Blocked
- Notes: _________________________________

### Overall Result: ☐ PASS ☐ FAIL ☐ NEEDS FIXES

---

## Known Issues and Workarounds

| Issue | Workaround | Status |
|-------|-----------|--------|
| | | |

---

## Regression Testing

Before each release, verify:
- [ ] All previous test cases still pass
- [ ] No new bugs introduced
- [ ] Existing features unchanged
- [ ] Performance maintained

---

## Test Data SQL

```javascript
// Sample test data for workflow testing
db.users.insertMany([
  {
    fullName: "Test Advisor",
    email: "advisor@university.edu",
    adminProfile: { role: "advisor" }
  },
  {
    fullName: "Test Welfare",
    email: "welfare@university.edu",
    adminProfile: { role: "welfareOfficer" }
  },
  {
    fullName: "Test Proctor",
    email: "proctor@university.edu",
    adminProfile: { role: "proctor" }
  }
]);
```

---

## Sign-Off

**QA Engineer**: _________________ **Date**: _________
**Dev Lead**: _________________ **Date**: _________
**Product Manager**: _________________ **Date**: _________

