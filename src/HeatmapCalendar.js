import React, { useEffect, useState } from "react";
import "./HeatmapCalendar.css";
import watchHistory from "./data/youtube-history.json";


// GIPHY API Utility
const API_KEY = process.env.REACT_APP_GIPHY_API_KEY; // Use environment variable for API key
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
                dateString,
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
    const [getGif, setGif] = useState([]);

    useEffect( ()=> {
        const watchCounts = processWatchHistory(watchHistory, year);
        const calendarData = generateCalendar(year, watchCounts);
        setCalendar(calendarData);
        let tags = ["bored", "chill", "moderate binge", "crazy amount"]
        const fetchGifs = async () => {
            try {
                for (const tag of tags) {
                   let url =  await fetchGif(tag);
                    addGif(tag, url)
                }
            } catch (error) {
                console.error("Error", error);
            }
        };

        fetchGifs();

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

    async function fetchGif(tag) {
        try {
            // Increase limit to get more variety
            const response = await fetch(
                `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${tag}&limit=5&rating=g`
            );
            const data = await response.json();

            if (data.data && data.data.length > 0) {
                // Randomly select one GIF from the returned results
                const randomGif = data.data[Math.floor(Math.random() * data.data.length)];
                const gifUrl = randomGif.images.downsized.url || "";
                return gifUrl;
            }
            return ""; // Return empty string if no GIFs found
        } catch (error) {
            console.error("Error fetching GIF:", error);
            return ""; // Return empty string if there was an error
        }
    }

    const addGif = (type, url) => {
        const newItem = {"type": type, "url": url};
        setGif((prevItems) => [...prevItems, newItem]);
    };

    const findGifByType = (type) => {
        const foundGif = getGif.find((gif) => gif.type === type);
        return foundGif || null;
    };

    const getGifTag = (value) => {
        if (value > 15) return "crazy amount";
        if (value > 10) return "moderate binge";
        if (value >= 1) return "chill";
        if (value < 1) return "bored";
    };

    const getGifUrlByTag = (value) => {
        let gif = findGifByType(getGifTag(value));
        if (gif && gif.url) {
            return gif.url;
        } else {
            return null;
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
                                    <div className="tooltip">
                                        {day.dayOfWeek}, {day.dateString} <br />
                                        Number of Videos Watched: {day.value}
                                        {getGifUrlByTag(day.value) &&
                                            <img
                                                src={getGifUrlByTag(day.value)}
                                                alt="Reaction GIF"
                                                style={{ maxWidth: '150px', width: '100%', height: 'auto' }}
                                            />}
                                    </div>
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
