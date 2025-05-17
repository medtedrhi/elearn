import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute'

// Layouts & Pages

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

// ✅ Quiz Gate Component with per-language breakdown
const QuizGate = ({ onPass }) => {
  const [current, setCurrent] = React.useState(0)
  const [score, setScore] = React.useState(0)
  const [showResult, setShowResult] = React.useState(false)
  const [languageScores, setLanguageScores] = React.useState({
    JavaScript: 0,
    Python: 0,
    Java: 0,
    Cpp: 0,
    PHP: 0,
  })

  const questions = [
    // JavaScript
    { lang: "JavaScript", question: "What is React?", options: ["Library", "Framework", "Database", "Language"], answer: "Library" },
    { lang: "JavaScript", question: "Which hook is used for managing state in React?", options: ["useEffect", "useState", "useMemo", "useRef"], answer: "useState" },
    { lang: "JavaScript", question: "Which operator is used to assign a value in JavaScript?", options: ["==", "=>", "=", "==="], answer: "=" },
    { lang: "JavaScript", question: "Which method converts JSON to a JavaScript object?", options: ["JSON.parse()", "JSON.stringify()", "parseJSON()", "decode()"], answer: "JSON.parse()" },
    { lang: "JavaScript", question: "Which data type is not primitive in JavaScript?", options: ["String", "Number", "Object", "Boolean"], answer: "Object" },

    // Python
    { lang: "Python", question: "What is the output of: len('Hello')?", options: ["4", "5", "6", "None"], answer: "5" },
    { lang: "Python", question: "Which keyword is used to define a function in Python?", options: ["function", "define", "def", "func"], answer: "def" },
    { lang: "Python", question: "What data structure does Python use for key-value pairs?", options: ["List", "Tuple", "Set", "Dictionary"], answer: "Dictionary" },
    { lang: "Python", question: "Which symbol is used for comments in Python?", options: ["//", "#", "/* */", "<!-- -->"], answer: "#" },
    { lang: "Python", question: "What is the output of: 3 ** 2 in Python?", options: ["5", "6", "9", "8"], answer: "9" },

    // Java
    { lang: "Java", question: "Which keyword is used to create a class in Java?", options: ["function", "def", "class", "Class"], answer: "class" },
    { lang: "Java", question: "Which data type is used to store true or false values in Java?", options: ["boolean", "int", "char", "double"], answer: "boolean" },
    { lang: "Java", question: "What is the entry point for a Java application?", options: ["start()", "main()", "init()", "run()"], answer: "main()" },
    { lang: "Java", question: "Which keyword is used to inherit a class in Java?", options: ["implements", "extends", "inherits", "instanceof"], answer: "extends" },
    { lang: "Java", question: "Which package is automatically imported in every Java program?", options: ["java.util", "java.main", "java.lang", "java.io"], answer: "java.lang" },

    // C++
    { lang: "Cpp", question: "Which symbol is used to denote a pointer in C++?", options: ["&", "*", "%", "#"], answer: "*" },
    { lang: "Cpp", question: "Which keyword is used to define a constant in C++?", options: ["static", "define", "const", "immutable"], answer: "const" },
    { lang: "Cpp", question: "What is the correct way to write a for loop in C++?", options: ["for(i = 0; i < 10; i++)", "loop(i < 10)", "for(int i in 10)", "foreach(i in 10)"], answer: "for(i = 0; i < 10; i++)" },
    { lang: "Cpp", question: "Which of the following is not a C++ data type?", options: ["int", "float", "real", "double"], answer: "real" },
    { lang: "Cpp", question: "What is the output of: cout << 2 + 2;", options: ["22", "4", "2 + 2", "Error"], answer: "4" },

    // PHP
    { lang: "PHP", question: "Which symbol is used to declare a variable in PHP?", options: ["$", "@", "#", "&"], answer: "$" },
    { lang: "PHP", question: "How do you write a comment in PHP?", options: ["// comment", "<!-- comment -->", "/* comment */", "# comment"], answer: "// comment" },
    { lang: "PHP", question: "What does PHP stand for?", options: ["Personal Home Page", "Private Home Page", "Professional Hosting Platform", "Page Handling Processor"], answer: "Personal Home Page" },
    { lang: "PHP", question: "What is the correct file extension for PHP files?", options: [".html", ".php", ".js", ".py"], answer: ".php" },
    { lang: "PHP", question: "Which function is used to output text in PHP?", options: ["echo", "print", "write", "display"], answer: "echo" },
  ]

  const handleAnswer = (option) => {
    const currentQuestion = questions[current]
    if (option === currentQuestion.answer) {
      setScore((prev) => prev + 1)
      setLanguageScores((prev) => ({
        ...prev,
        [currentQuestion.lang]: prev[currentQuestion.lang] + 1,
      }))
    }

    const next = current + 1
    if (next < questions.length) {
      setCurrent(next)
    } else {
      setShowResult(true)
      setTimeout(() => {
        localStorage.setItem('quizPassed', 'true')
        onPass()
      }, 10000)
    }
  }

  const renderLanguageResults = () => {
    const result = []
    const questionsPerLang = 5

    for (const [lang, correct] of Object.entries(languageScores)) {
      const percent = ((correct / questionsPerLang) * 100).toFixed(0)
      result.push(
        <p key={lang}>
          <strong>{lang}:</strong> {correct} / {questionsPerLang} → {percent}%
        </p>
      )
    }

    return result
  }

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      {!showResult ? (
        <>
          <h2>{questions[current].question}</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {questions[current].options.map((opt, idx) => (
              <li
                key={idx}
                onClick={() => handleAnswer(opt)}
                style={{
                  margin: "0.5rem 0",
                  cursor: "pointer",
                  border: "1px solid #ccc",
                  padding: "0.5rem",
                  borderRadius: "5px",
                }}
              >
                {opt}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div>
          <h2>Quiz Completed</h2>
          <p>Your total score: {score} / {questions.length}</p>
          <div style={{ marginTop: '1rem' }}>
            <h3>Results by Language:</h3>
            {renderLanguageResults()}
          </div>
          <button onClick={onPass}>Redirecting to the site...</button>
        </div>
      )}
    </div>
  )
}

// ✅ App Router
const AppRouter = () => {
  // const [quizPassed, setQuizPassed] = React.useState(
  //   localStorage.getItem('quizPased') === 'true'
  // )

  // if (!quizPassed) {
  //   return <QuizGate onPass={() => setQuizPassed(true)} />
  // }

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
