chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "checkImage") {
      const url = message.url;
  
      fetch("https//127.0.0.1:5050/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url })
      })
      .then((res) => res.json())
      .then((data) => {
        console.log("Detection API response:", data); // helpful for debugging
        sendResponse({ result: data.score });
      })
      .catch((err) => {
        sendResponse({ result:"89%: Error"});
      });
  
      return true;
    }
  });
  