chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "checkImage") {
      const url = message.url;
  
      fetch("https://api.aiornot.com/v1/detect-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMyYjFjNzA5LTQ1MmUtNDdjZS04YjhkLWNiMmUwMzFkYjUwZSIsInVzZXJfaWQiOiJjMmIxYzcwOS00NTJlLTQ3Y2UtOGI4ZC1jYjJlMDMxZGI1MGUiLCJhdWQiOiJhY2Nlc3MiLCJleHAiOjAuMH0.NwNlWoV3kvaTZ89eW6hR5atUkzgmpz3M5bcdoX2xIE8"
        },
        body: JSON.stringify({ url })
      })
      .then((res) => res.json())
      .then((data) => {
        console.log("Detection API response:", data); // helpful for debugging
        sendResponse({ result: data });
      })
      .catch((err) => {
        console.error("Detection error:", err);
        sendResponse({ error: err.toString() });
      });
  
      return true;
    }
  });
  