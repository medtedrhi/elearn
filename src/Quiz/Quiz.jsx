import React, { useEffect, useState } from 'react';
import Footer from '../Pages/Footer/Footer';
import Header from '../Pages/Home/Header/Header';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// Define your quiz questions per language
const tableHeaderCellStyle = {
    padding: '12px 16px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '1rem',
  };
  
  const tableBodyCellStyle = {
    padding: '14px 16px',
    textAlign: 'center',
    borderBottom: '1px solid #ddd',
    fontSize: '1rem',
    backgroundColor: '#ffffff',
  };
  
const rawQuestions = {
  JavaScript: [
    { question: "What is React?", options: ["Library", "Framework", "Database", "Language"], answer: "Library" },
    { question: "Which hook manages state in React?", options: ["useEffect", "useState", "useMemo", "useRef"], answer: "useState" },
    { question: "What keyword declares a variable?", options: ["var", "const", "let", "All of them"], answer: "All of them" },
    { question: "Which symbol is used for function?", options: ["=>", "==", "::", "&&"], answer: "=>" },
    { question: "Which is a falsy value?", options: ["0", "false", "null", "All"], answer: "All" },
    { question: "Which type is not primitive?", options: ["String", "Object", "Boolean", "Number"], answer: "Object" },
    { question: "Which converts JSON to JS object?", options: ["JSON.parse", "JSON.stringify", "parse()", "None"], answer: "JSON.parse" },
    { question: "What is NaN?", options: ["Not a Number", "Null", "Undefined", "0"], answer: "Not a Number" },
    { question: "How to write comment?", options: ["//", "/* */", "#", "<!-- -->"], answer: "//" },
    { question: "Which method adds item to array?", options: ["push", "pop", "shift", "slice"], answer: "push" },
  ],
  Python: [
    { question: "What defines a function?", options: ["function", "def", "fun", "define"], answer: "def" },
    { question: "Which symbol is for comments?", options: ["#", "//", "--", "/* */"], answer: "#" },
    { question: "Output of len('Python')?", options: ["5", "6", "7", "Error"], answer: "6" },
    { question: "3 ** 2 = ?", options: ["6", "9", "8", "7"], answer: "9" },
    { question: "List type in Python?", options: ["[]", "()", "{}", "<>"], answer: "[]" },
    { question: "Immutable type?", options: ["Tuple", "List", "Set", "Dict"], answer: "Tuple" },
    { question: "What is pip?", options: ["Package manager", "IDE", "Compiler", "Interpreter"], answer: "Package manager" },
    { question: "Which is not loop?", options: ["while", "do", "for", "loop"], answer: "loop" },
    { question: "String method to lowercase?", options: ["lower()", "tolower()", "down()", "toLowerCase()"], answer: "lower()" },
    { question: "Which opens file?", options: ["open()", "file()", "read()", "input()"], answer: "open()" },
  ],
  PHP: [
    { question: "Variable in PHP starts with?", options: ["$", "#", "@", "&"], answer: "$" },
    { question: "Echo prints text?", options: ["Yes", "No", "Sometimes", "Depends"], answer: "Yes" },
    { question: "Which is server-side?", options: ["PHP", "JS", "HTML", "CSS"], answer: "PHP" },
    { question: "Correct PHP extension?", options: [".php", ".html", ".py", ".js"], answer: ".php" },
    { question: "Which sends email?", options: ["mail()", "send()", "email()", "smtp()"], answer: "mail()" },
    { question: "Comment style in PHP?", options: ["//", "#", "/* */", "All"], answer: "All" },
    { question: "String concatenation?", options: [".", "+", "&", "%"], answer: "." },
    { question: "What is isset()?", options: ["Check if set", "Set variable", "Create var", "Check value"], answer: "Check if set" },
    { question: "Arrays in PHP are?", options: ["Indexed", "Associative", "Both", "None"], answer: "Both" },
    { question: "Which outputs text?", options: ["echo", "print", "display", "Both echo and print"], answer: "Both echo and print" },
  ],
  Cpp: [
    { question: "Which symbol for pointer?", options: ["*", "&", "#", "%"], answer: "*" },
    { question: "Loop structure in C++?", options: ["for", "while", "do while", "All"], answer: "All" },
    { question: "Which is not data type?", options: ["real", "int", "float", "double"], answer: "real" },
    { question: "Which keyword is constant?", options: ["const", "static", "final", "fix"], answer: "const" },
    { question: "Output: cout << 2+2;", options: ["4", "22", "2 + 2", "Error"], answer: "4" },
    { question: "Header for cout?", options: ["iostream", "stdio", "conio", "stdlib"], answer: "iostream" },
    { question: "Function definition keyword?", options: ["void", "def", "fun", "func"], answer: "void" },
    { question: "Which access modifier?", options: ["private", "public", "protected", "All"], answer: "All" },
    { question: "Which denotes comment?", options: ["//", "/* */", "#", "Both // and /* */"], answer: "Both // and /* */" },
    { question: "Which file extension?", options: [".cpp", ".c", ".h", ".cc"], answer: ".cpp" },
  ],
  Java: [
    { question: "Main method name?", options: ["main", "start", "init", "run"], answer: "main" },
    { question: "Which keyword for class?", options: ["class", "define", "fun", "object"], answer: "class" },
    { question: "Which is loop?", options: ["for", "foreach", "while", "All"], answer: "All" },
    { question: "Which is access modifier?", options: ["private", "public", "protected", "All"], answer: "All" },
    { question: "Boolean stores?", options: ["true/false", "1/0", "Yes/No", "None"], answer: "true/false" },
    { question: "Which compiles Java code?", options: ["javac", "java", "jvm", "compiler"], answer: "javac" },
    { question: "Which runs Java code?", options: ["java", "javac", "jre", "jvm"], answer: "java" },
    { question: "Default value of int?", options: ["0", "null", "undefined", "NaN"], answer: "0" },
    { question: "Which exception type?", options: ["try", "catch", "throw", "All"], answer: "All" },
    { question: "Which is package?", options: ["java.util", "java.lang", "java.io", "All"], answer: "All" },
  ],
};

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [scoreMap, setScoreMap] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [user, setUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      console.log('User data from localStorage:', userData); // Debug log
      if (userData && userData.id) {
        setUser(userData);
      } else {
        console.error('No valid user data found:', userData);
        toast.error('User session not found');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      toast.error('Session error');
      navigate('/login');
    }

    // Flatten and tag questions
    let combined = [];
    Object.entries(rawQuestions).forEach(([lang, qs]) => {
      qs.forEach(q => {
        combined.push({ ...q, lang });
      });
    });

    // Shuffle questions
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }

    setQuestions(combined);
  }, [navigate]);

  const saveRecommendations = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      const token = localStorage.getItem('token');
      if (!token || !user) {
        console.error('No token or user found');
        toast.error('Authentication required');
        navigate('/login');
        return;
      }

      // Calculate recommendations based on quiz scores
      const recommendations = Object.keys(rawQuestions).map(lang => {
        const correct = scoreMap[lang] || 0;
        const total = rawQuestions[lang].length;
        const percent = (correct / total) * 100;
        return {
          language: lang.toLowerCase(),
          score: percent,
          userId: user.id
        };
      });

      console.log('Sending recommendations:', { recommendations });

      // Save recommendations to backend
      const response = await fetch('http://127.0.0.1:8000/v1/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ recommendations })
      });

      let responseData;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        responseData = await response.json();
      } else {
        const text = await response.text();
        console.error('Received non-JSON response:', text);
        throw new Error('Invalid server response format');
      }

      console.log('Server response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || 'Failed to save recommendations');
      }

      if (responseData.data && responseData.data.length === 0) {
        toast.warning('No matching courses found for your quiz results. You will be redirected to browse all courses.');
      } else {
        toast.success('Quiz results saved successfully! Redirecting to recommended courses...');
      }
      
      // Small delay before navigation to ensure toast is visible
      setTimeout(() => {
        navigate(`/Student/Dashboard/${user.id}/Courses`);
      }, 1500);
    } catch (error) {
      console.error('Error saving recommendations:', error);
      toast.error(error.message || 'Failed to save quiz results. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnswer = (option) => {
    const currentQuestion = questions[current];
    const isCorrect = option === currentQuestion.answer;
    const lang = currentQuestion.lang;

    setScoreMap(prev => ({
      ...prev,
      [lang]: (prev[lang] || 0) + (isCorrect ? 1 : 0),
    }));

    const next = current + 1;
    if (next < questions.length) {
      setCurrent(next);
    } else {
      setShowResult(true);
    }
  };

  const renderResults = () => {
    return Object.keys(rawQuestions).map(lang => {
      const correct = scoreMap[lang] || 0;
      const total = rawQuestions[lang].length;
      const percent = ((correct / total) * 100).toFixed(1);
      return (
        <p key={lang}>
          <strong>{lang}</strong>: {correct} / {total} → {percent}%
        </p>
      );
    });
  };

  return (
    <>
      <Header />
      <div className="quiz-container" style={{ padding: '2rem', textAlign: 'center' }}>
        {!showResult && questions.length > 0 && (
          <>
            <h2>{questions[current].question}</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {questions[current].options.map((opt, i) => (
                <li
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  style={{
                    cursor: 'pointer',
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    margin: '0.5rem auto',
                    maxWidth: '300px',
                    borderRadius: '5px',
                  }}
                >
                  {opt}
                </li>
              ))}
            </ul>
            <p style={{ marginTop: '1rem' }}>
              Question {current + 1} of {questions.length}
            </p>
          </>
        )}

        {showResult && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '2rem',
              padding: '1rem',
            }}
          >
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#0077b6' }}>
              🎉 Quiz Completed!
            </h2>
            <h3 style={{ marginBottom: '1.5rem', color: '#023e8a' }}>Results by Language</h3>

            <div style={{ overflowX: 'auto', width: '100%', maxWidth: '700px' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  backgroundColor: '#f9fbfd',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: '#0077b6', color: 'white' }}>
                    <th style={tableHeaderCellStyle}>Language</th>
                    <th style={tableHeaderCellStyle}>Correct</th>
                    <th style={tableHeaderCellStyle}>Total</th>
                    <th style={tableHeaderCellStyle}>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(rawQuestions).map((lang) => {
                    const correct = scoreMap[lang] || 0;
                    const total = rawQuestions[lang].length;
                    const percent = ((correct / total) * 100).toFixed(1);

                    let percentColor = '';
                    let note = '';
                    if (percent < 50) {
                      percentColor = '#e63946';
                      note = '❌ Needs improvement';
                    } else if (percent < 70) {
                      percentColor = '#ffb703';
                      note = '⚠️ Review the basics';
                    } else {
                      percentColor = '#2a9d8f';
                      note = '✅ Great job!';
                    }

                    return (
                      <tr key={lang}>
                        <td style={tableBodyCellStyle}>{lang}</td>
                        <td style={tableBodyCellStyle}>{correct}</td>
                        <td style={tableBodyCellStyle}>{total}</td>
                        <td style={{ ...tableBodyCellStyle, color: percentColor, fontWeight: 600 }}>
                          {percent}%
                          <div style={{ fontSize: '0.85rem', color: '#555', marginTop: '4px' }}>{note}</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <button
              onClick={saveRecommendations}
              disabled={isSaving}
              style={{
                marginTop: '2rem',
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                backgroundColor: '#2a9d8f',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s',
              }}
            >
              {isSaving ? 'Saving Results...' : 'Save Results & Continue to Dashboard'}
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Quiz;
