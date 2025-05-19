import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute'

// Layouts & Pages
import Quiz from './Quiz/Quiz'
import Enrollement from './Pages/Home/Enrollement/Enrollement'
import Layout from './Layout'
import Landing from './Pages/Home/Landing/Landing'
import About from './Pages/Home/About/About'
import Contact from './Pages/Home/Contact/Contact'
import Courses from './Pages/Home/Courses/Courses'
import Login from './Pages/Login/Login'
import Signup from './Pages/Signup/Signup'
import AdminLogin from './Pages/Login/AdminLogin'
import StudentDocument from './Pages/Components/DocumentVerification/StudentDocument'
import TeacherDocument from './Pages/Components/DocumentVerification/TeacherDocument'
import VarifyEmail from './Pages/Components/VarifyEmail/VarifyEmail'
import Rejected from './Pages/Response/Rejected'
import Pending from './Pages/Response/Pending'
import Admin from './Pages/Components/Admin/Admin'
import Course from './Pages/Components/Admin/Course'
import VarifyDoc from './Pages/Components/Admin/VarifyDoc'
import TeacherLayout from './Pages/Dashboard/TeacherDashboard/TeacherLayout'
import StudentLayout from './Pages/Dashboard/StudentDashboard/StudentLayout'
import SearchTeacher from './Pages/Dashboard/StudentDashboard/SearchTeacher'
import StudentClasses from './Pages/Dashboard/StudentDashboard/StudentClasses'
import StudentCourses from './Pages/Dashboard/StudentDashboard/StudentCourses'
import DashboardTeacher from './Pages/Dashboard/TeacherDashboard/DashboardTeacher'
import TeacherClasses from './Pages/Dashboard/TeacherDashboard/TeacherClasses'
import TeacherCourses from './Pages/Dashboard/TeacherDashboard/TeacherCourses'
import SearchData from './Pages/Home/Search/Search'
import ErrorPage from './Pages/ErrorPage/ErrorPage'
import Forgetpassword from './Pages/ForgetPassword/Forgetpassword'
import ResetPassword from './Pages/ForgetPassword/ResetPassword'
import ResetTeacher from './Pages/ForgetPassword/ResetTeacher'


const AppRouter = () => {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Layout />}>
        <Route path='/' element={<Landing />} />
        <Route path='/login' element={<Login />} />
        <Route path='/Signup' element={<Signup />} />
        <Route path='/Search/:subject' element={<SearchData />} />
        <Route path='/StudentDocument/:Data' element={<StudentDocument />} />
        <Route path='/TeacherDocument/:Data' element={<TeacherDocument />} />
        <Route path='/courses' element={<Courses />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/about' element={<About />} />
        <Route path='/varifyEmail' element={<VarifyEmail />} />
        <Route path='/adminLogin/' element={<AdminLogin />} />
        <Route path='/rejected/:user/:ID' element={<Rejected />} />
        <Route path='/pending' element={<Pending />} />
        <Route path="/quiz" element={
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        }/>
        {/* Protected Routes */}
        <Route path='/admin/:data' element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } />
        <Route path='/admin/course/:data' element={
          <ProtectedRoute>
            <Course />
          </ProtectedRoute>
        } />
        <Route path='/VarifyDoc/:type/:adminID/:ID' element={
          <ProtectedRoute>
            <VarifyDoc />
          </ProtectedRoute>
        } />

        <Route path='/Student/Dashboard/:ID' element={
          <ProtectedRoute>
            <StudentLayout />
          </ProtectedRoute>
        }>
          
          <Route path='/Student/Dashboard/:ID/Search' element={<SearchTeacher />} />
          <Route path='/Student/Dashboard/:ID/Classes' element={<StudentClasses />} />
          <Route path='/Student/Dashboard/:ID/Courses' element={<StudentCourses />} />
        </Route>

        <Route path='/Teacher/Dashboard/:ID' element={
          <ProtectedRoute>
            <TeacherLayout />
          </ProtectedRoute>
        }>
          <Route path='/Teacher/Dashboard/:ID/Home' element={<DashboardTeacher />} />
          <Route path='/Teacher/Dashboard/:ID/Classes' element={<TeacherClasses />} />
          <Route path='/Teacher/Dashboard/:ID/Courses' element={<TeacherCourses />} />
        </Route>
        <Route path='/courses/:id' element={<Enrollement/>}/>
        <Route path='/forgetPassword' element={<Forgetpassword />} />
        <Route path='/student/forgetPassword/:token' element={<ResetPassword />} />
        <Route path='/teacher/forgetPassword/:token' element={<ResetTeacher />} />
        
        <Route path='*' element={<ErrorPage />} />
      </Route>
    )
  )

  return <RouterProvider router={router} />
}

// ✅ Mount App
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Toaster />
    <AppRouter />
  </React.StrictMode>
)
