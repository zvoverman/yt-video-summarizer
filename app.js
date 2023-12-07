// Hugging Face Inference API
const huggingface = require('@huggingface/inference');

// youtube-transcript
const transcript = require('youtube-transcript');

// Made with Express.js!
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const PORT = process.env.PORT || 8080;

require('dotenv').config();

const hf = new huggingface.HfInference(process.env.HF_API_KEY);

console.log(hf);

// root '/' path
app.get('/', (req, res) => {
    res.send('yt-transcript-summarizer');
});

// '/summary' path
app.get("/summary", async (req, res) => {
    try {
        // Retrieve the 'url' parameter from the query string
        const url = req.query.url || '';

        const transcriptObject = await transcript.YoutubeTranscript.fetchTranscript(url);

        // Process transcript fetch response
        const transcriptString = concatenateTextFields(transcriptObject);
        let chunks = splitIntoChunks(transcriptString);
        console.log(`\nNUMBER OF CHUNKS: ${chunks.length}\n`);

        let responses = await getSummary(chunks);
        console.log(responses);

        let summaryResults = responses.map(extractData).join("\n\n").replace(/(?:\r\n|\r|\n)/g, '<br>').replace(/"/g, "'");;

        console.log(summaryResults);

        // Send summary as response
        res.json(summaryResults);

    } catch (error) {
        console.error("Error during summarization:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}/`);
});

function concatenateTextFields(objectsList) {
    return objectsList.map(obj => obj.text).join(' ');
}

function splitIntoChunks(text) {
    let words = text.split(/\s+/);
    let chunks = [];
    for (let i = 0; i < words.length; i += 4000) {
        chunks.push(words.slice(i, i + 4000).join(' '));
    }
    return chunks;
}

async function callApiForChunk(chunk) {
    // Hugging Face Inference API call
    const summaryResponse = await hf.summarization({
        model: 'pszemraj/led-base-book-summary',
        inputs: chunk,
        parameters: {
            min_length: 20,
            max_length: 300,
            no_repeat_ngram_size: 3,
            encoder_no_repeat_ngram_size: 3,
            repetition_penalty: 3.5,
            num_beams: 5,
            do_sample: false,
            early_stopping: true
        }
    })
    return summaryResponse;
}

function getSummary(chunks) {
    let promises = chunks.map(callApiForChunk);

    // Use Promise.all to wait for all promises to resolve or reject
    return Promise.all(promises)
        .then(responses => {
            // responses is an array of response objects from each API call
            console.log('All API calls completed successfully.');
            return responses;

        })
        .catch(error => {
            console.error('One or more API calls failed:', error);
            throw error;
        });
}

// get text from JSON
function extractData(item) {
    return item.summary_text;
}