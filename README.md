# ZSTUDENT_APP - Student Management System

A browser-based demonstration of the Student Management System assignment.

## Files

- `index.html` - main user interface
- `style.css` - styling
- `script.js` - CREATE/CHANGE/DISPLAY/DELETE, validation, marks and result report

## GitHub Pages

1. Upload all three files to the root of the repository.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select branch `main` and folder `/ (root)`.
5. Click **Save**.
6. Open the generated GitHub Pages URL.

## Data

This demo stores students and marks in the browser's `localStorage`. It does not use a server/database. Data is therefore stored separately in each browser/device.

## Assignment mapping

- Student details: Student ID, First Name, Last Name, DOB, Gender, Email, Phone, Course, Admission Date, Status.
- Operations: CREATE, CHANGE, DISPLAY, DELETE.
- Validation: Student ID, email, course, marks range.
- Result report: Student, Course, Subject, Marks, Percentage, Grade, Result.
