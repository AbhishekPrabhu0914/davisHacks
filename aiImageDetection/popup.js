document.getElementById('pickImageBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab.url.startsWith("chrome://") || tab.url.startsWith("edge://")) {
    alert("Can't be used on internal browser pages.");
    return;
  }

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const images = document.querySelectorAll('img');

      images.forEach((img) => {
        img.style.outline = '3px solid #00ccff';
        img.style.cursor = 'pointer';

        img.addEventListener('click', function handler(e) {
          e.preventDefault();
          e.stopPropagation();

          images.forEach(i => {
            i.style.outline = '';
            i.removeEventListener('click', handler);
            i.style.cursor = '';
          });

          chrome.runtime.sendMessage(
            { action: "checkImage", url: img.src },
            (response) => {
              if (response?.error) {
                alert("Error checking image: " + response.error);
                return;
              }

              const data = response?.result;

              if (data && typeof data.ai_probability === "number") {
                const percent = (data.ai_probability * 100).toFixed(2);
                alert(`AI Detection Result:\n\nAI Probability: ${percent}%`);
              } else if (data?.result === "Human") {
                alert("Result: Likely Human-generated");
              } else if (data?.result === "AI") {
                alert("Result: Likely AI-generated");
              } else {
                alert("Failed to get a valid response from the API."); 
              }
            }
          );
        }, { once: true });
      });
    }
  });
});
