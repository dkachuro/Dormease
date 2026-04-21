import React, { useState, useEffect } from 'react';
import './Events-staff.css';
import dormitoryImage from '../../../assets/images/dormitory.jpg';
import cleaningImage from '../../../assets/images/cleaning.jpg';
import movieImage from '../../../assets/images/movie.jpg';
import firstAidImage from '../../../assets/images/first-aid-training.jpg';
import fireImage from '../../../assets/images/fire-extinguisher.jpg';
import defaultEventImage from '../../../assets/images/dormitory.jpg'; // Use any of your existing images

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // Add this line

    
  
  // New event form state
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    image: ''
  });

  // Simulate fetching events from an API
  useEffect(() => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleAddEvent = (e) => {
  e.preventDefault();
  
  // Create the event data
  const eventData = {
    ...newEvent,
    id: editingEvent ? editingEvent.id : Math.max(0, ...events.map(e => e.id)) + 1,
    image: newEvent.imagePreview || (editingEvent ? editingEvent.image : defaultEventImage)
  };

  if (editingEvent) {
    // Update existing event
    setEvents(events.map(event => 
      event.id === editingEvent.id ? eventData : event
    ));
  } else {
    // Add new event
    setEvents([...events, eventData]);
  }
  
  handleCancel();
};

const handleEditEvent = (event) => {
  setEditingEvent(event);
  setNewEvent({
    title: event.title,
    description: event.description,
    date: event.date,
    time: event.time,
    location: event.location,
    image: null, // We don't store the file object here
    imagePreview: null
  });
  setShowAddEventForm(true);
};

const handleDeleteEvent = (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this event?");
  if (confirmDelete) {
    setEvents(events.filter(event => event.id !== id));
  }
};


const handleCancel = () => {
  setNewEvent({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    image: '',
    imagePreview: null
  });
  setShowAddEventForm(false);
};



const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
        setNewEvent(prev => ({
            ...prev,
            image: file,
            imagePreview: reader.result
        }));
        };
        reader.readAsDataURL(file);
    }
    };

  return (
    <div className="events-page">
        <header className="events-header">
            <h1>Dormitory Events</h1>
                <button 
            className="add-event-button"
            onClick={() => setShowAddEventForm(true)}
        >
            Add New Event
        </button>
            <p>Stay updated with all the upcoming activities in our dormitory</p>
        
        </header>

      {showAddEventForm && (
        <div className="add-event-form-container">
          <div className="add-event-form">
            <h2>Add New Event</h2>
            <div className="form-scrollable-content">
            <form onSubmit={handleAddEvent}>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={newEvent.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={newEvent.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Date:</label>
                  <input
                    type="date"
                    name="date"
                    value={newEvent.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Time:</label>
                  <input
                    type="text"
                    name="time"
                    value={newEvent.time}
                    onChange={handleInputChange}
                    placeholder="e.g. 14:00 or 14:00-16:00"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Location:</label>
                <input
                  type="text"
                  name="location"
                  value={newEvent.location}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Event Image:</label>
                <div className="file-upload-wrapper">
                  <label className="file-upload-button">
                    <span>Choose File</span>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="file-upload-input"
                      key={editingEvent ? `edit-${editingEvent.id}` : 'add-new'}
                    />
                  </label>
                  <span className="file-upload-name">
                    {newEvent.image?.name || (editingEvent ? 'Current image' : 'No file chosen')}
                  </span>
                </div>
                {(newEvent.imagePreview || editingEvent?.image) && (
                  <div className="image-preview">
                    <img 
                      src={newEvent.imagePreview || editingEvent.image} 
                      alt="Preview" 
                    />
                    {newEvent.imagePreview && (
                      <button
                        type="button"
                        className="remove-image-button"
                        onClick={() => setNewEvent(prev => ({
                          ...prev,
                          image: null,
                          imagePreview: null
                        }))}
                      >
                        ×
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              <div className="form-buttons">
                <button 
                type="button" 
                className="cancel-button"
                onClick={handleCancel}  // Changed from direct setShowAddEventForm
                >
                Cancel
                </button>
                <button type="submit" className="submit-button">Add Event</button>
              </div>
            </form>
          </div>
          </div>
        </div>
      )}

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
                    <span className="event-time">{event.time}</span>
                    <span className="event-date">{formatDate(event.date)}</span>
                    <span className="event-location">{event.location}</span>
                  </div>
                  <p className="event-description">{event.description}</p>
                  <div className="event-buttons">
                    <button
                      className="edit-button"
                      onClick={() => handleEditEvent(event)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      Delete
                    </button>
                  </div>
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