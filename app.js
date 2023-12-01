const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS for all routes
app.use(cors());

// youtube-transcript
const transcript = require('youtube-transcript');

// Define a route for the root path ("/")
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Define a route for the "/summary" path
app.get("/summary", async (req, res) => {
    try {
        // Retrieve the 'url' parameter from the query string
        const url = req.query.url || '';

        // Fetch the transcript asynchronously using youtube-transcript
        const summaryResult = await transcript.YoutubeTranscript.fetchTranscript(url);

        // Send the summary as the response
        res.json(summaryResult);

    } catch (error) {
        console.error("Error during summarization:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Port Environment Variable
app.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}/`);
});


