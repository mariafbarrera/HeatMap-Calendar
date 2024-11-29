# YouTube Watch History Heatmap 🌟


## 🛠️ How It Works
I downloaded my YouTube data from **Google Takeout**, which gave me a JSON file containing all the details of my YouTube watch history.

### Steps:
1. **Download YouTube Data**: First, I used [Google Takeout](https://takeout.google.com/) to download my YouTube data. This gave me a huge JSON file with every video I've watched and when.
2. **Extract the Watch History**: I pulled the relevant data from the JSON file, focusing on the dates and number of videos watched each day (essentially created a hashmap that stored the date and number of videos watched for a specific day).
3. **Create the Heatmap**: Using the extracted data, I created a colorful heatmap using React that shows my watch history over time, displaying the number of videos I watched each day. 

4. **GIPHY API Integration**: For added interaction, I integrated the GIPHY API to fetch random gifs based on the number of videos watched. For example:
   - **Low watch count**: Relaxed or chill gifs.
   - **Moderate watch count**: Moderate Activity gifs.
   - **High watch count**: "Crazy amount" gifs.

**Note**: If you don’t see any gifs, it’s likely because the GIPHY API has exceeded the allowed number of calls in an hour. Please try again later!

---

### Extra Information
The JSON file contains data up to **November 26, 2024**, so the heatmap reflects watch history only up to this date.

