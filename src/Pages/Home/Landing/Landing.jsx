import React, { useState } from "react";
import "./Landing.css";
import Classroom from "../../Images/Classroom.svg";
import Plant from "../../Images/Plant.svg";
import Plant2 from "../../Images/Plant2.svg"
import Contact from "../Contact/Contact.jsx";
import Footer from "../../Footer/Footer.jsx";
import Header from "../Header/Header.jsx";
import { CgProfile } from "react-icons/cg";
import { IoSchoolSharp } from "react-icons/io5";
import { FaSchool } from "react-icons/fa";
import { NavLink , useNavigate} from "react-router-dom";

function Landing() {
  const [LClass, setLClass] = useState(false);
  const [EMentor, setEMentor] = useState(false);
  const [subject, setSubject] = useState('');
  
  const [facList, setFacList] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate()

  const handleSearch = ()=>{
    // console.log('working')
    navigate(`/Search/${subject}`)
  }

  const AA = ()=>{
    setEMentor(true);
    setLClass(false);
  }

  const BB = ()=>{
    setEMentor(false);
    setLClass(true);
  }

  const teachersList = async(sub)=>{
    setLoading(true);

    const response = await fetch(`/api/course/${sub}`, {
      method: 'GET',
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    });

    const data = await response.json();
    setFacList(data.data);
    console.log(data.data);
    setLoading(false);
  }


  return (
    <>
    <Header/>
    {/* Top Section */}
      <div className="top">
        <div className="left">
          <h1>
          Empowering Minds, Inspiring Futures: <br />Your Gateway to Programming Excellence with  <span className="font-semibold text-amber-400 font-serif text-5xl">BitWise</span>
          </h1>
          {/*  Search  */}

          <div className="search mb-10">
            <img src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/6c476f454537d7f27cae2b4d0f31e2b59b3020f5" width={30} alt="" />
            <input type="text" placeholder='Ex: Math ...' value={subject} onChange={(e)=>setSubject(e.target.value)}/>
            <button className='w-32' onClick={handleSearch}>Find Teacher</button>
          </div>

        </div>
        <div className="right">
          <img src={Classroom} width={500} alt="" />
        </div>
      </div>

      {/* Features */}
      <div className="features ">
        <p>Why You Choose Us</p>
        {/* <hr className="underLine"/> */}
        <div className="fets2">
          <div className="fet cursor-pointer mb-5" onClick={AA}>
            <img
              src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/622a85ea75414daadf6055613c074c5280b95444"
              alt=""
            />
            <h4>Expert Mentor</h4>
            <p>
              Our expert mentors are the cornerstone of our educational
              approach. With a wealth of knowledge they support our students on
              their journey to success.
            </p>
          </div>

          <div className="fet cursor-pointer mb-5" onClick={BB}>
            <img
              src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/1478ee1b2a35123ded761b65c3ed2ceaece0d20f"
              alt=""
            />
            <h4>High Quality Live Class</h4>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta saepe eos minima eaque consequuntur quis tempora architecto sequi dolore, at ullam accusantium, voluptates sint, repellat adipisci cumque vitae magni et!
            </p>
          </div>

          <NavLink to='/contact'>
            <div className="fet cursor-pointer">
              <img
                src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/c412120e39b2095486c76978d4cd0bea88fd883b"
                alt=""
              />
              <h4>24/7 Live Support</h4>
              <p>
                We offer our students 24/7 live support. Whether it's a question
                or a challenge at midnight, our dedicated team is here to provide
                guidance, assistance.
              </p>
            </div>
          </NavLink>
        </div>
        {LClass && (
          <div className="flex items-center justify-center">
            <div className="flex gap-5 items-center my-5">
              <img src="https://lh3.googleusercontent.com/kq1PrZ8Kh1Pomlbfq4JM1Gx4z-oVr3HG9TEKzwZfqPLP3TdVYrx0QrIbpR-NmMwgDzhNTgi3FzuzseMpjzkfNrdHK5AzWGZl_RtKB80S-GZmWOQciR9s=w1296-v1-e30" alt="" width={300}/>
              <div className="text-white flex flex-col items-center">
                <h1>High Quality Live Class</h1>
                <p>We deliver high-quality live classes to our students,<br /> providing interactive learning experiences <br />led by experienced instructors.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Courses */}
      <div className="courses">
      <p>Faculty List</p>
      <hr className="underLine"/>
      <div className="subjects">
        <div className="subject" onClick={()=>teachersList("physics")}>
          <p>python</p>
        </div>
        <div className="subject" onClick={()=>teachersList("chemistry")}>
          <p>javascript</p>
        </div>
        <div className="subject" onClick={()=>teachersList("biology")}>
          <p>java</p>
        </div>
        <div className="subject" onClick={()=>teachersList("math")}>
          <p>c++</p>
        </div>
        <div className="subject" onClick={()=>teachersList("computer")}>
          <p>php</p>
        </div>
        
      </div>

      <div className="flex items-center justify-center gap-10">
        {!loading && facList && (
          facList.map(fac => (
          <div key={fac._id} className="bg-[#99afbc] p-5 rounded-md ">
            <div className="flex gap-3 items-center mb-2 ">
            <img src="https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png" alt="profile_img" width={50} />
            <div className="flex flex-col justify-center items-start pl-3">
            <p>{fac.enrolledteacher.Firstname} {fac.enrolledteacher.Lastname}</p>
            <h4 className="text-blue-900">{fac.enrolledteacher.Email}</h4>
            </div>
            </div>
            { fac.enrolledteacher.Email === "urttsg@gmail.com" ?
              <h4><span className="font-bold text-brown-800">Education :</span> Post graduate from Calcutta University</h4> 
              : 
              <h4><span className="font-bold text-brown-800">Education :</span> Post graduate from Sister Nivedita university</h4>
            }
            { fac.enrolledteacher.Email === "urttsg@gmail.com" ? <h4>1 years of teaching experience</h4> : <h4>2 years of teaching experience</h4>}
          </div>
        )))}
      </div>

      </div>

      {/* About Us */}
      <div className="about" style={{backgroundColor: "#042439"}}>
        <h4>About Us</h4>
        <hr className="underLine"/>
        <div className="content">
          <div className="left-svg">
            <img src={Plant2} width={300} alt="" />
          </div>
          <p>
          At BitWise , we believe in the transformative power of education. Our platform is designed to be a gateway to knowledge, offering a diverse range of courses and immersive learning experiences tailored for aspiring developers, seasoned programmers, and everyone in between.
            <h1 className=" bg-blue-700 w-fit py-1 px-3 rounded-sm my-2">Our Story</h1>
            BitWise was born out of a passion for coding and a desire to make quality programming education accessible to all. We understand the challenges faced by modern learners—whether you are a beginner taking your first steps into programming or a professional looking to upskill. That is why we created a platform that combines convenience, flexibility, and cutting-edge technology to deliver an unparalleled learning experience.
            <h1 className=" bg-blue-700 w-fit py-1 px-3 rounded-sm my-2">Our Mission</h1>
            Our mission is simple yet profound: to empower individuals through coding education . We aim to create a global community of learners where students can: Discover new programming languages and technologies. Enhance their skills with hands-on projects and real-world applications. Achieve their academic and professional goals in software development. By leveraging innovative teaching methods, interactive tools, and a supportive learning environment, we strive to make coding education engaging, interactive, and enjoyable for everyone.
          </p>
          <div className="right-svg">
            <img src={Plant} width={400} alt="" />
          </div>
        </div>
      </div>

      {/* Contact Us */}
      <div className="contact-us">
        <Contact/>
      </div>

      {/* Footer */}
      <Footer/>
    </>
  );
}

export default Landing;
