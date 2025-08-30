# Marma Registration Form Test Plan

## Step 1: Personal Information

### Required Fields Validation
- [ ] Full Name: Cannot be empty
- [ ] Email: Must be valid format and cannot be empty
- [ ] Phone: Cannot be empty
- [ ] Country: Must be selected
- [ ] Marital Status: Must be selected
- [ ] Gender: Must be selected
- [ ] Photo: Must be uploaded

### Optional Fields
- [ ] Age: Can be empty but should accept numeric input
- [ ] Address: Can be empty
- [ ] Education Level: Can be empty

### Photo Upload
- [ ] Upload button opens file selector
- [ ] Selected image displays as preview
- [ ] Remove button removes the uploaded image
- [ ] Only image files can be selected
- [ ] Large images are handled properly

## Step 2: Ministry Information

### Fields
- [ ] Church/Organization/Ministry Name: Optional
- [ ] Position/Role: Optional
- [ ] Education Level: Optional dropdown
- [ ] Additional Ministry Information: Optional textarea

## Step 3: Pastoral Recommendation

### Required Fields
- [ ] Recommender Name: Cannot be empty
- [ ] Recommender Contact: Cannot be empty

### Optional Fields
- [ ] Relationship to Recommender: Can be empty
- [ ] Recommender Church/Ministry: Can be empty

## Step 4: Purpose and Authorization

### Required Fields
- [ ] Purpose of Membership: Cannot be empty

### Display Fields
- [ ] Signed By: Shows default value
- [ ] Approved By: Shows default value
- [ ] Attested By: Shows default value
- [ ] Regional Code: Shows placeholder
- [ ] Identification Number: Shows placeholder

## Navigation

- [ ] Progress bar correctly shows current step
- [ ] Previous button is disabled on Step 1
- [ ] Previous button navigates to previous step
- [ ] Continue button validates current step before proceeding
- [ ] Submit button appears only on the last step
- [ ] Cannot proceed to next step if current step has validation errors

## Form Submission

- [ ] All fields are validated before submission
- [ ] Success message appears after successful submission
- [ ] Form resets to Step 1 after submission
- [ ] Duplicate email submissions are rejected

## Admin View

- [ ] New registrations appear in the admin table
- [ ] Registration details modal shows all fields including new ones
- [ ] Photo is displayed in the details modal
- [ ] Marital status and gender are displayed
- [ ] Authorization fields are displayed
- [ ] Regional code and identification number are displayed
- [ ] Export to CSV includes all new fields

## Email Notifications

- [ ] Confirmation email is sent on registration
- [ ] Status update email is sent when admin approves/declines
- [ ] Email templates include appropriate information

## Edge Cases

- [ ] Form handles very long input text appropriately
- [ ] Special characters in input fields are handled properly
- [ ] Browser refresh/navigation is handled (data loss warning)
- [ ] Mobile responsiveness of multi-step form
