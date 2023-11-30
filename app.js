const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS for all routes
app.use(cors());

// youtube-transcript
//const transcript = require('youtube-transcript');

// Define a route for the root path ("/")
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

//response.send(status) is now a function that takes the JSON object as the argument.
app.get("/summary", (req, res) => {
    // Retrieve the 'url' parameter from the query string
    const url = req.query.url || '';

    // Perform some summarization logic here (replace this with your actual logic)
    const summaryResult = `Summary for ${url}`;

    // Send the summary as the response
    res.send(summaryResult);
});

// Port Environment Variable
app.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}/`);
});


