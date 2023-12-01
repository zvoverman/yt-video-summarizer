
let myWindowId;
const contentBox = document.querySelector("#content");

/*
Make the content box editable as soon as the user mouses over the sidebar.
*/
window.addEventListener("mouseover", () => {
    contentBox.setAttribute("contenteditable", true);
});

/*
When the user mouses out, save the current contents of the box.
*/
window.addEventListener("mouseout", () => {
    contentBox.setAttribute("contenteditable", false);
    browser.tabs.query({ windowId: myWindowId, active: true }).then((tabs) => {
        let contentToStore = {};
        contentToStore[tabs[0].url] = contentBox.textContent;
        browser.storage.local.set(contentToStore);
    });
});

/*
Update the sidebar's content.

1) Get the active tab in this sidebar's window.
2) Get its stored content.
3) Put it in the content box.
*/
function updateContent() {
    browser.tabs.query({ windowId: myWindowId, active: true })
        .then((tabs) => {
            return browser.storage.local.get(tabs[0].url);
        })
        .then((storedInfo) => {
            contentBox.textContent = storedInfo[Object.keys(storedInfo)[0]];
        });
}

/*
Update content when a new tab becomes active.
*/
browser.tabs.onActivated.addListener(updateContent);

/*
Update content when a new page is loaded into a tab.
*/
browser.tabs.onUpdated.addListener(updateContent);

/*
When the sidebar loads, get the ID of its window,
and update its content.
*/
browser.windows.getCurrent({ populate: true }).then((windowInfo) => {
    myWindowId = windowInfo.id;
    updateContent();
});


///
///
///

const btn = document.getElementById("summarise");

btn.addEventListener("click", async function () {
    btn.disabled = true;
    btn.innerHTML = "Summarising...";

    // Get the current active tab
    const tabs = await browser.tabs.query({ currentWindow: true, active: true });
    const url = tabs[0].url;

    try {
        // Make a GET request to your Express.js server using fetch
        const response = await fetch(`http://127.0.0.1:8080/summary?url=${encodeURIComponent(url)}`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json(); // Assuming the response is in JSON format

        // Summarize the transcript data
        const summarizationResult = concatenateTextFields(data);

        const p = document.getElementById("output");
        p.innerHTML = summarizationResult;

        // You can use the 'summarizationResult' variable as needed

    } catch (error) {
        document.getElementById("output").innerHTML = "Error occurred during summarization";
        console.error("Error fetching summary:", error);
    } finally {
        btn.disabled = false;
        btn.innerHTML = "Summarise";
    }
});

function concatenateTextFields(objectsList) {
    return objectsList.map(obj => obj.text).join(' ');
}



