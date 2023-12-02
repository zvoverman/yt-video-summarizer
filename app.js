const huggingface = require('@huggingface/inference');

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

require('dotenv').config();

const hf = new huggingface.HfInference(process.env.HF_ACCESS_TOKEN);

console.log(hf);

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
        const transcriptObject = await transcript.YoutubeTranscript.fetchTranscript(url);

        // Summarize the transcript data
        const transcriptString = concatenateTextFields(transcriptObject);

        // Hugging Face
        const summaryResponse = await hf.summarization({
            model: 'facebook/bart-large-cnn',
            inputs: transcriptString,
            parameters: {
                max_length: 300
            }
        })

        console.log(summaryResponse.summary_text);

        // Send the summary as the response
        res.json(summaryResponse.summary_text);

    } catch (error) {
        console.error("Error during summarization:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Port Environment Variable
app.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}/`);
});

function concatenateTextFields(objectsList) {
    return objectsList.map(obj => obj.text).join(' ');
}


