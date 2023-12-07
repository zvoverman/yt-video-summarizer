const btn = document.getElementById("summarise");

btn.addEventListener("click", async function () {
    btn.disabled = true;
    btn.innerHTML = "Summarising...";

    // Get the current active tab
    const tabs = await browser.tabs.query({ currentWindow: true, active: true });
    const url = tabs[0].url;

    try {
        // Make a GET request to Express.js server using fetch
        const response = await fetch(`http://127.0.0.1:8080/summary?url=${encodeURIComponent(url)}`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const summary = await response.text(); // Assuming the response is in text format

        // Set summary in extension
        document.getElementById("output").innerHTML = summary;

    } catch (error) {
        document.getElementById("output").innerHTML = "Error occurred during summarization";
        console.error("Error fetching summary:", error);
    } finally {
        btn.disabled = false;
        btn.innerHTML = "Summarise";
    }
});
