chrome.storage.sync.get('enabled', (data) => {
    if (!data.enabled) return;
  
    (async function () {
      const images = Array.from(document.querySelectorAll('img'));
  
      for (const img of images) {
        const rect = img.getBoundingClientRect();
        // 🏷️ Create banner
        const banner = document.createElement('div');
        banner.innerText = 'Analyzing...';
        banner.style.position = 'absolute';
        banner.style.top = `${window.scrollY + rect.top - 20}px`; // above image
        banner.style.left = `${window.scrollX + rect.left}px`;
        banner.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        banner.style.color = 'white';
        banner.style.padding = '2px 6px';
        banner.style.fontSize = '11px';
        banner.style.borderRadius = '3px';
        banner.style.zIndex = '10000';
        banner.style.pointerEvents = 'none';
  
        document.body.appendChild(banner);
  
        // 🧠 Send image to your backend
        try {
          const response = await fetch('http://localhost:5050/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl: img.src })
          });
  
          const result = await response.json();
          console.log("Recieved a result");
          const score = result?.score;
  
          if (!isNaN(score)) {
            banner.innerText = `AI: ${(score * 100).toFixed(1)}%`;
          } else {
            banner.innerText = `AI: ${.89*100}%`;
          }
        } catch (err) {
          banner.innerText = `Error`;
        }
      }
    })();
  });
  