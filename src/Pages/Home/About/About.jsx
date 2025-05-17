import React from 'react'
import Plant from "../../Images/Plant.svg";
import Plant2 from "../../Images/Plant2.svg";
import '../Landing/Landing.css'
import Footer from "../../Footer/Footer.jsx"
import Header from '../Header/Header.jsx';

function About({backgroundC}) {
  return (
    <>
    <Header/>
    <div className="about" style={{backgroundColor: backgroundC}}>
        <h4>About Us</h4>
        <hr className="underLine"/>
        <div className="content">
          <div className="left-svg">
            <img src={Plant2} className="w-[22rem]" alt="" />
          </div>
          <p>
            At BitWise , we believe in the transformative power of education. Our platform is designed to be a gateway to knowledge, offering a diverse range of courses and immersive learning experiences tailored for aspiring developers, seasoned programmers, and everyone in between.
            <h1 className=" bg-blue-700 w-fit py-1 px-3 rounded-sm my-2">Our Story</h1>
            BitWise was born out of a passion for coding and a desire to make quality programming education accessible to all. We understand the challenges faced by modern learners—whether you are a beginner taking your first steps into programming or a professional looking to upskill. That is why we created a platform that combines convenience, flexibility, and cutting-edge technology to deliver an unparalleled learning experience.
            <h1 className=" bg-blue-700 w-fit py-1 px-3 rounded-sm my-2">Our Mission</h1>
            Our mission is simple yet profound: to empower individuals through coding education . We aim to create a global community of learners where students can:

            Discover new programming languages and technologies.
            Enhance their skills with hands-on projects and real-world applications.
            Achieve their academic and professional goals in software development.
            By leveraging innovative teaching methods, interactive tools, and a supportive learning environment, we strive to make coding education engaging, interactive, and enjoyable for everyone.
          </p>
          <div className="right-svg">
            <img src={Plant} className="w-[30rem]" alt="" />
          </div>
        </div>
    </div>
    <Footer/>
    </>
  )
}

export default About