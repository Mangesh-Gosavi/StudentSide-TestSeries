import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AddBulkUser from '../pages/BulkUploads/addBulkusers';
import ViewBatchList from '../pages/Batch/viewBatchList';
import AddBatch from '../pages/Batch/addBatch';
import EditUser from '../pages/UserManagement/editUser';
import AddUser from '../pages/UserManagement/addUser';
import Login from '../utils/login';
import Register from '../utils/register';
import Dashboard from '../dashboard';
import EditBatch from '../pages/Batch/editBatch';
import QuestionPaper from '../pages/Questionpaper/Question_Paper';
import ReviewQuestionsPage from '../pages/Questionpaper/Review_Questions';
import TestPapersPage from '../pages/Questionpaper/Test_Papers';
import AutoGenerate from '../pages/Questionpaper/AutoGenerate';
import ReviewPage from '../pages/Questionpaper/AutoGenerateReview';
import PartialQuestions from '../pages/Questionpaper/ParialQuestionsGenerate';
import ReviewPartialQuestions from '../pages/Questionpaper/Review_Partial_Questions';

import StudentDashboard from '../pages/Student/StudentDashboard';
import Myscheduledtest from '../pages/Student/Myscheduledtest';
import Reports from '../pages/Student/Reports';
import UserBookmark from '../pages/Student/UserBookmark';
import BookmarkQuestion from '../pages/Student/Bookmarkquestion';
import StudentReport from '../pages/Student/StudentReport';
import Test from '../pages/Student/Taketest';
import SolutionPage from '../pages/Student/SolutionPage';
import ReportPopup from '../pages/Student/ReportPopup';
import StudentResultChart from '../pages/Student/Chart';
import BooksPage from '../pages/Student/BooksPage';

export default function TestRoutes() {
  const bulkRoutes = [
    { path: '/bulk-password-upload', title: 'Bulk Password Upload' },
    { path: '/user-bulk-upload', title: 'User Bulk Upload' },
    { path: '/user-bulk-update', title: 'User Bulk Update' },
  ];

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Dashboard Route */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* User Management Routes */}
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/edit-user/:userId" element={<EditUser />} />  {/* Edit User Route should have :userId */}
        
        {/* Bulk Upload Routes */}
        {bulkRoutes.map(({ path, title }) => (
          <Route key={path} path={path} element={<AddBulkUser title={title} />} />
        ))}

        {/* Batch Management Routes */}
        <Route path="/batches" element={<ViewBatchList />} />
        <Route path="/batches/add-batch" element={<AddBatch title="Create New Batch" />} />
        <Route path="/batches/:batchId/edit-batch" element={<EditBatch />} /> 
        {/* <Route path="/batches/:batchId/add-students" element={<AddStudents />} />  Assuming AddStudents page for adding students to a batch */}

        {/* Create Question Paper */}
        <Route path="/question-paper" element={<QuestionPaper />}></Route>

        {/* Review Questions Route */}
        <Route path="/review-questions" element={<ReviewQuestionsPage />} />

        {/* Test Paper Route */}
        <Route path="/test-papers" element={<TestPapersPage />} />

        {/* Auto Generate page Route */}
        <Route path="/auto-generate" element={<AutoGenerate />} />

        {/* Auto Generate page Route */}
        <Route path="/review-autogenerate" element={<ReviewPage />} />
        
        {/* Partial Quesntions Generate page Route */}
        <Route path="/partial-question-generate" element={<PartialQuestions />} />

        {/* Partial Quesntions Generate page Route */}
        <Route path="/review-partial-question" element={<ReviewPartialQuestions />} />

       {/*Student side */}
        <Route path="/student-dashboard" element={<StudentDashboard/>}></Route>
        <Route path="/myscheduledtest" element={<Myscheduledtest/>}></Route>
        <Route path="/reports" element={<Reports/>}></Route>
        <Route path="/userbookmark" element={<UserBookmark/>}></Route>
        <Route path="/bookmarkquestion/:chapter" element={<BookmarkQuestion/>}></Route>
        <Route path="/studentreport/:testId" element={<StudentReport/>}></Route>
        <Route path="/taketest/:testId" element={<Test/>}></Route>
        <Route path="/solution/:questionId" element={<SolutionPage />} />
        <Route path="/testreport/:questionId" element={<ReportPopup />} />
        <Route path="/resultchart/:testId" element={<StudentResultChart />} />
        <Route path="/studymaterial" element={<BooksPage />} />
      </Routes>
    </Router>
  );
}