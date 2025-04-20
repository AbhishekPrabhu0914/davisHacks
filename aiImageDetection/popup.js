const toggle = document.getElementById('toggleSwitch');

chrome.storage.sync.get('enabled', (data) => {
  toggle.checked = data.enabled ?? false;
});

toggle.addEventListener('change', () => {
  chrome.storage.sync.set({ enabled: toggle.checked });
});
