import "../App.css";
import "./About.css"; 

function About(){
    return(
        <div id="about">
            <h1 className="section-title">About Mad Abroad</h1>
            <p className="about-description">
                Mad Abroad is a community-driven platform designed to help students at the University of Wisconsin-Madison share their study abroad experiences independently.
                <br/>
                <br/>
                Our mission is to provide a space where students can read and write reviews about various study abroad programs, allowing students considering studying 
                abroad to learn more about what these programs truely entail.
                <br/>
                <br/>
                Whether you're looking for insights on specific programs or student advice on living abroad, Mad Abroad aims to be your go-to resource.
            </p>
        </div>
    )
}
    
export default About;