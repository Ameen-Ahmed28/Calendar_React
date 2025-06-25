import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin } from 'lucide-react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);

  // Sample events data as per assignment requirements
  const sampleEvents = [
    {
      id: 1,
      title: "Team Meeting",
      date: "2025-06-23",
      time: "10:00",
      duration: 60,
      color: "#3B82F6",
      location: "Conference Room A"
    },
    {
      id: 2,
      title: "Project Review",
      date: "2025-06-25",
      time: "14:00",
      duration: 90,
      color: "#EF4444",
      location: "Office"
    },
    {
      id: 3,
      title: "Client Presentation",
      date: "2025-06-27",
      time: "09:00",
      duration: 120,
      color: "#10B981",
      location: "Zoom"
    },
    {
      id: 4,
      title: "Design Workshop",
      date: "2025-06-23",
      time: "15:00",
      duration: 180,
      color: "#F59E0B",
      location: "Design Studio"
    },
    {
      id: 5,
      title: "Code Review",
      date: "2025-06-30",
      time: "11:00",
      duration: 45,
      color: "#8B5CF6",
      location: "Dev Room"
    }
  ];

  useEffect(() => {
    setEvents(sampleEvents);
  }, []);

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const formatDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getEventsForDate = (dateStr) => {
    return events.filter(event => event.date === dateStr);
  };

  const isToday = (year, month, day) => {
    return today.getFullYear() === year && 
           today.getMonth() === month && 
           today.getDate() === day;
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 p-1"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(currentYear, currentMonth, day);
      const dayEvents = getEventsForDate(dateStr);
      const isTodayDate = isToday(currentYear, currentMonth, day);

      days.push(
        <div
          key={day}
          className={`h-32 p-1 border border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
            isTodayDate ? 'bg-blue-50 border-blue-200' : 'bg-white'
          }`}
          onClick={() => {
            setSelectedDate(dateStr);
            setShowEventModal(true);
          }}
        >
          <div className="h-full flex flex-col">
            <div className={`text-sm font-medium mb-1 ${
              isTodayDate ? 'text-blue-600' : 'text-gray-700'
            }`}>
              {isTodayDate && (
                <span className="inline-block w-6 h-6 bg-blue-600 text-white rounded-full text-center leading-6 text-xs font-bold">
                  {day}
                </span>
              )}
              {!isTodayDate && day}
            </div>
            <div className="flex-1 space-y-1 overflow-hidden">
              {dayEvents.slice(0, 3).map((event, index) => (
                <div
                  key={event.id}
                  className="text-xs p-1 rounded truncate text-white"
                  style={{ backgroundColor: event.color }}
                  title={`${event.title} - ${event.time}`}
                >
                  {event.title}
                </div>
              ))}
              {dayEvents.length > 3 && (
                <div className="text-xs text-gray-500 font-medium">
                  +{dayEvents.length - 3} more
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return days;
  };

  const EventModal = () => {
    if (!showEventModal || !selectedDate) return null;

    const dayEvents = getEventsForDate(selectedDate);
    const selectedDateObj = new Date(selectedDate);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-96 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedDateObj.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
                <p className="text-blue-100 text-sm">
                  {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => setShowEventModal(false)}
                className="text-white hover:text-gray-200 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20"
              >
                ×
              </button>
            </div>
          </div>
          <div className="p-4 max-h-64 overflow-y-auto">
            {dayEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Plus className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No events scheduled</p>
                <p className="text-sm">Click to add an event</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="border-l-4 pl-3 py-2 rounded-r"
                    style={{ borderLeftColor: event.color }}
                  >
                    <h4 className="font-medium text-gray-800">{event.title}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{event.time} ({event.duration}min)</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {monthNames[currentMonth]} {currentYear}
              </h1>
              <p className="text-gray-600 mt-1">
                Today is {today.toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Today
              </button>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Days of week header */}
          <div className="grid grid-cols-7 bg-gray-50 border-b">
            {daysOfWeek.map((day) => (
              <div key={day} className="p-4 text-center font-semibold text-gray-700 border-r border-gray-200 last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {renderCalendarDays()}
          </div>
        </div>

        {/* Event Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-blue-600">{events.length}</div>
            <div className="text-gray-600 text-sm">Total Events</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-green-600">
              {getEventsForDate(formatDate(today.getFullYear(), today.getMonth(), today.getDate())).length}
            </div>
            <div className="text-gray-600 text-sm">Today's Events</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-purple-600">
              {events.filter(e => new Date(e.date).getMonth() === currentMonth).length}
            </div>
            <div className="text-gray-600 text-sm">This Month</div>
          </div>
        </div>
      </div>

      <EventModal />
    </div>
  );
};

export default Calendar;