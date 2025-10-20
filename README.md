MIS Admin Frontend (Vite + React + TypeScript)

- Configure environment variable VITE_API_BASE to point to backend (e.g., http://localhost:3000)
- Install: npm install
- Run: npm run dev
- Login with admin credentials created in backend (seed-admin script)

This frontend provides:
- Login (JWT stored in localStorage)
- Teachers & Students listing (GET /api/teachers, /api/students)
- Upload CSV/XLS for students/teachers (POST /api/upload/students or /teachers) with client-side header validation for CSV files
- Pending approvals (GET /api/approvals/pending; approve/reject endpoints)
- Audit trail (GET /api/audit-trail)
