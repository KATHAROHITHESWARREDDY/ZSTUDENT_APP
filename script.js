const STORAGE_STUDENTS = "zstudent_students";
const STORAGE_MARKS = "zstudent_marks";

const courses = {
  CSE: "Computer Science",
  ECE: "Electronics",
  EEE: "Electrical Engineering",
  AIML: "Artificial Intelligence",
  CAI: "Computer Applications & AI"
};

const $ = id => document.getElementById(id);

function getStudents() {
  return JSON.parse(localStorage.getItem(STORAGE_STUDENTS) || "[]");
}
function saveStudents(data) {
  localStorage.setItem(STORAGE_STUDENTS, JSON.stringify(data));
}
function getMarks() {
  return JSON.parse(localStorage.getItem(STORAGE_MARKS) || "[]");
}
function saveMarks(data) {
  localStorage.setItem(STORAGE_MARKS, JSON.stringify(data));
}

function showMessage(text, type = "info") {
  const box = $("message");
  box.textContent = text;
  box.className = "message " + type;
}

function readStudentForm() {
  return {
    studentId: $("studentId").value.trim().toUpperCase(),
    firstName: $("firstName").value.trim(),
    lastName: $("lastName").value.trim(),
    dob: $("dob").value,
    gender: $("gender").value,
    email: $("email").value.trim(),
    phone: $("phone").value.trim(),
    courseId: $("courseId").value,
    admissionDate: $("admissionDate").value,
    status: $("status").value
  };
}

function validateStudent(s) {
  if (!s.studentId) return "Student ID cannot be blank.";
  if (!s.firstName) return "First Name cannot be blank.";
  if (!s.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email))
    return "Please enter a valid email address.";
  if (!s.courseId || !courses[s.courseId])
    return "Course must exist.";
  if (s.phone && !/^[0-9+\-\s]{7,15}$/.test(s.phone))
    return "Please enter a valid phone number.";
  return "";
}

function clearStudentForm() {
  $("studentForm").reset();
  $("status").value = "Active";
  showMessage("");
}

function createStudent() {
  const s = readStudentForm();
  const error = validateStudent(s);
  if (error) return showMessage(error, "error");

  const students = getStudents();
  if (students.some(x => x.studentId === s.studentId))
    return showMessage("Student ID already exists.", "error");

  students.push(s);
  saveStudents(students);
  showMessage("Student created successfully.", "success");
  renderReport();
}

function findStudent(id) {
  return getStudents().find(x => x.studentId === id.toUpperCase());
}

function fillStudent(s) {
  $("studentId").value = s.studentId;
  $("firstName").value = s.firstName;
  $("lastName").value = s.lastName;
  $("dob").value = s.dob;
  $("gender").value = s.gender;
  $("email").value = s.email;
  $("phone").value = s.phone;
  $("courseId").value = s.courseId;
  $("admissionDate").value = s.admissionDate;
  $("status").value = s.status;
}

function displayStudent() {
  const id = $("studentId").value.trim().toUpperCase();
  if (!id) return showMessage("Enter Student ID to display.", "error");
  const s = findStudent(id);
  if (!s) return showMessage("Student not found.", "error");
  fillStudent(s);
  showMessage("Student details displayed.", "success");
}

function changeStudent() {
  const s = readStudentForm();
  const error = validateStudent(s);
  if (error) return showMessage(error, "error");

  const students = getStudents();
  const index = students.findIndex(x => x.studentId === s.studentId);
  if (index === -1) return showMessage("Student not found.", "error");

  students[index] = s;
  saveStudents(students);
  showMessage("Student details changed successfully.", "success");
  renderReport();
}

function deleteStudent() {
  const id = $("studentId").value.trim().toUpperCase();
  if (!id) return showMessage("Enter Student ID to delete.", "error");

  const students = getStudents();
  const index = students.findIndex(x => x.studentId === id);
  if (index === -1) return showMessage("Student not found.", "error");

  if (!confirm(`Delete student ${id}?`)) return;

  students.splice(index, 1);
  saveStudents(students);

  const marks = getMarks().filter(m => m.studentId !== id);
  saveMarks(marks);

  clearStudentForm();
  showMessage("Student deleted successfully.", "success");
  renderReport();
}

function addMarks() {
  const studentId = $("marksStudentId").value.trim().toUpperCase();
  const course = $("marksCourse").value;
  const subject = $("subject").value.trim();
  const marks = Number($("marks").value);
  const maxMarks = Number($("maxMarks").value);

  if (!studentId) return showMessage("Marks: Student ID cannot be blank.", "error");
  if (!findStudent(studentId)) return showMessage("Marks: Student does not exist.", "error");
  if (!course || !courses[course]) return showMessage("Marks: Course must exist.", "error");
  if (!subject) return showMessage("Subject cannot be blank.", "error");
  if (!Number.isFinite(maxMarks) || maxMarks <= 0) return showMessage("Maximum marks must be greater than 0.", "error");
  if (!Number.isFinite(marks) || marks < 0) return showMessage("Marks cannot be negative.", "error");
  if (marks > maxMarks) return showMessage("Marks cannot exceed maximum marks.", "error");

  const list = getMarks();
  const existing = list.findIndex(m =>
    m.studentId === studentId && m.course === course && m.subject.toLowerCase() === subject.toLowerCase()
  );

  const record = { studentId, course, subject, marks, maxMarks };
  if (existing >= 0) list[existing] = record;
  else list.push(record);

  saveMarks(list);
  showMessage(existing >= 0 ? "Marks updated successfully." : "Marks added successfully.", "success");
  renderReport();
}

function loadMarksStudent() {
  const id = $("marksStudentId").value.trim().toUpperCase();
  const s = findStudent(id);
  if (!s) return showMessage("Student not found.", "error");
  $("marksCourse").value = s.courseId;
  showMessage("Student course loaded.", "success");
}

function gradeFor(p) {
  if (p >= 90) return "A+";
  if (p >= 80) return "A";
  if (p >= 70) return "B";
  if (p >= 60) return "C";
  if (p >= 50) return "D";
  return "F";
}

function renderReport() {
  const tbody = $("reportTable").querySelector("tbody");
  tbody.innerHTML = "";
  const marksList = getMarks();
  $("emptyReport").style.display = marksList.length ? "none" : "block";

  marksList.forEach(m => {
    const s = findStudent(m.studentId);
    const percentage = (m.marks / m.maxMarks) * 100;
    const grade = gradeFor(percentage);
    const result = percentage >= 50 ? "PASS" : "FAIL";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(s ? s.firstName + " " + s.lastName : m.studentId)}<br><small>${escapeHtml(m.studentId)}</small></td>
      <td>${escapeHtml(courses[m.course] || m.course)}</td>
      <td>${escapeHtml(m.subject)}</td>
      <td>${m.marks}</td>
      <td>${m.maxMarks}</td>
      <td>${percentage.toFixed(2)}%</td>
      <td>${grade}</td>
      <td class="${result === "PASS" ? "pass" : "fail"}">${result}</td>
    `;
    tbody.appendChild(tr);
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[c]));
}

$("createBtn").addEventListener("click", createStudent);
$("changeBtn").addEventListener("click", changeStudent);
$("displayBtn").addEventListener("click", displayStudent);
$("deleteBtn").addEventListener("click", deleteStudent);
$("clearBtn").addEventListener("click", clearStudentForm);
$("addMarksBtn").addEventListener("click", addMarks);
$("loadMarksBtn").addEventListener("click", loadMarksStudent);
$("clearMarksBtn").addEventListener("click", () => {
  $("marksStudentId").value = "";
  $("marksCourse").value = "";
  $("subject").value = "";
  $("marks").value = "";
  $("maxMarks").value = "100";
  showMessage("");
});
$("reportBtn").addEventListener("click", renderReport);

renderReport();
