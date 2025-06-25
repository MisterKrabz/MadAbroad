import React from "react";

function ProgramCard(props) {
  return (
    <div className="program-card">
      <h3 className="program-title">{program.title}</h3>
      <p className="program-description">{program.description}</p>
      <p className="program-location">{program.location}</p>
      <p className="program-duration">{program.duration}</p>
      <a href={program.link} className="program-link">Read More</a>
    </div>
  );
}

export default ProgramCard;