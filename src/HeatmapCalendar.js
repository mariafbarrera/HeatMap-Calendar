import React, { useEffect, useState } from "react";
import "./HeatmapCalendar.css";
import watchHistory from "./data/youtube-history.json"; 

// Function to process the YouTube watch history
function processWatchHistory(data, year) {
    const countTimes = {};

    data.forEach((entry) => {
        const time = entry.time;
        const entryYear = time.split("-")[0];
        if (entryYear === String(year)) {
            const date = time.split("T")[0];
            countTimes[date] = (countTimes[date] || 0) + 1;
        }
    });

    return countTimes; // Returns an object with date keys and watch count values
}

// Function to generate the calendar data
function generateCalendar(year, watchCounts) {
    const months = [];
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    for (let month = 0; month < 12; month++) {
        const monthName = new Date(year, month).toLocaleString("default", { month: "long" });
        const daysInMonth = new Date(year, month + 1, 0).getDate(); // Total days in the month
        const days = [];

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateString = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD

            days.push({
                day,
                dayOfWeek: daysOfWeek[date.getDay()],
                value: watchCounts[dateString] || 0 // Default to 0 if no data for the day
            });
        }

        months.push({
            month: monthName,
            days
        });
    }

    return months;
}

// HeatmapCalendar component
const HeatmapCalendar = ({ year }) => {
    const [calendar, setCalendar] = useState([]);
    const [clickedDay, setClickedDay] = useState(null); // State to manage the clicked day
    const [isMobile, setIsMobile] = useState(false); // check if it's a mobile screen

    useEffect(() => {
        const watchCounts = processWatchHistory(watchHistory, year);
        const calendarData = generateCalendar(year, watchCounts);
        setCalendar(calendarData);

        // Detect if the screen width is mobile
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768); // Breakpoint
        };

        window.addEventListener("resize", checkMobile); // Update on screen resize
        checkMobile(); // Initial check
        return () => window.removeEventListener("resize", checkMobile); // Clean up event listener
    }, [year]);

    const getHeatmapColor = (value) => {
        if (value > 15) return "heatmap-high";
        if (value > 10) return "heatmap-medium";
        if (value >= 1) return "heatmap-low";
        return "heatmap-none";
    };

    const handleDayClick = (day) => {
        if (isMobile) {
            setClickedDay(clickedDay === day ? null : day); // Toggle tooltip on click for mobile
        }
    };

    return (
        <div className="calendar-container">
            {calendar.map((month, index) => (
                <div key={index} className="month">
                    <h3>{month.month}</h3>
                    <div className="days-grid">
                        {month.days.map((day, i) => (
                            <div
                                key={i}
                                className={`day ${getHeatmapColor(day.value)}`}
                                onClick={() => handleDayClick(day)} // Click event for mobile screens
                                onMouseEnter={() => !isMobile && setClickedDay(day)} // Hover event for desktop
                                onMouseLeave={() => !isMobile && setClickedDay(null)} // Remove tooltip on mouse leave
                            >
                                {day.day}
                                {(clickedDay === day || isMobile) && (
                                    <div className="tooltip"> Number of Videos Watched: {day.value}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HeatmapCalendar;
