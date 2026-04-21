import React, { useState, useEffect } from 'react';
import './Events.css';
import dormitoryImage from '../../../assets/images/dormitory.jpg';
import cleaningImage from '../../../assets/images/cleaning.jpg';
import movieImage from '../../../assets/images/movie.jpg';
import firstAidImage from '../../../assets/images/first-aid-training.jpg';
import fireImage from '../../../assets/images/fire-extinguisher.jpg';



const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate fetching events from an API
  useEffect(() => {
    // In a real app, you would fetch this from your backend
    const dummyEvents = [
      {
        id: 1,
        title: "Dormitory Orientation",
        description: "Welcome event for new students. Learn about dorm rules, meet your RAs, and get to know your fellow dorm mates.",
        date: "2025-09-01",
        time: "18:00",
        location: "Common Room",
        image: dormitoryImage
      },
      {
        id: 2,
        title: "Monthly Room Inspection",
        description: "Monthly cleanliness check of all dorm rooms. Make sure your room is tidy!",
        date: "2025-09-20",
        time: "10:00-15:00",
        location: " All Rooms",
        image: cleaningImage
      },
      {
        id: 3,
        title: "Movie Night",
        description: "Friday night movie screening. This week: Popular blockbuster. Vote for the movie at the front desk!",
        date: "2025-09-22",
        time: "20:00",
        location: "TV Lounge",
        image: movieImage
      },
      {
        id: 4,
        title: "First Aid Training",
        description: "Learn essential first aid skills including CPR, wound care, and emergency response. Certification provided upon completion.",
        date: "2025-10-10",
        time: "14:00-17:00",
        location: "Health Center",
        image: firstAidImage,

      },
      {
        id: 5,
        title: "Fire Safety Workshop",
        description: "Practical training on fire prevention, evacuation procedures, and proper use of fire extinguishers. Mandatory for all residents.",
        date: "2025-10-15",
        time: "10:00-12:00",
        location: "Main Courtyard",
        image: fireImage,

      }
    ];

    setTimeout(() => {
      setEvents(dummyEvents);
      setLoading(false);
    }, 800);
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="events-page">
      <header className="events-header">
        <h1>Dormitory Events</h1>
        <p>Stay updated with all the upcoming activities in our dormitory</p>
      </header>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading events...</p>
        </div>
      ) : (
        <div className="events-container">
          {events.length > 0 ? (
            events.map(event => (
              <div key={event.id} className="event-card">
                <div className="event-image" style={{ backgroundImage: `url(${event.image})` }}></div>
                <div className="event-content">
                  <h2>{event.title}</h2>
                  <div className="event-meta">
                 
                     <span className="event-time">
                     {event.time}
                    </span>
                    <span className="event-date">
                     {formatDate(event.date)}
                    </span>
                       <span className="event-location">
                       {event.location}
                    </span>
                   
                    
                  </div>
                  <p className="event-description">{event.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-events">
              <p>No upcoming events scheduled. Check back later!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Events;