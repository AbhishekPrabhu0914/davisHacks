import React, { useState } from 'react';

function FileUploader() {
  // State to store the selected file
  const [selectedFile, setSelectedFile] = useState(null);
  // State to store a preview URL if the file is an image (optional)
  const [preview, setPreview] = useState(null);

  // Handles the file selection event
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the first file selected

    if (file) {
      setSelectedFile(file);
      console.log("File selected:", file);

      // Optional: Create a preview URL for image files
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null); // Clear preview if not an image
      }

    } else {
      // Handle the case where the user cancels file selection
      setSelectedFile(null);
      setPreview(null);
      console.log("File selection cancelled.");
    }

    // Clear the input value to allow selecting the same file again if needed
    // event.target.value = null; // Uncomment if you need this behavior
  };

  // Optional: Handle the file upload logic (e.g., send to server)
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    // --- Upload Logic Would Go Here ---
    // Typically involves creating FormData and using fetch or Axios
    // Example using FormData and fetch:
    const formData = new FormData();
    formData.append('file', selectedFile); // 'file' is the key expected by the server

    console.log("Uploading file:", selectedFile.name);

    try {
      // Replace '/api/upload' with your actual backend endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        // Headers might be needed depending on your backend (e.g., Authorization)
        // headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const result = await response.json(); // Or response.text() depending on backend
      console.log("Upload successful:", result);
      alert(`File "${selectedFile.name}" uploaded successfully!`);
      // Optionally clear the selection after successful upload
      // setSelectedFile(null);
      // setPreview(null);

    } catch (error) {
      console.error("Upload error:", error);
      alert(`Error uploading file: ${error.message}`);
    }
    // --- End of Upload Logic ---
  };


  return (
    <div>
      <h2>Select a File</h2>
      {/* File Input */}
      <input
        type="file"
        onChange={handleFileChange}
        // You can add 'accept' to suggest file types to the browser
        // accept="image/*,.pdf,.txt"
      />

      {/* Display File Info and Preview */}
      {selectedFile && (
        <div style={{ marginTop: '20px' }}>
          <h3>File Details:</h3>
          <p>Name: {selectedFile.name}</p>
          <p>Type: {selectedFile.type}</p>
          <p>Size: {Math.round(selectedFile.size / 1024)} KB</p>

          {/* Image Preview */}
          {preview && (
            <div>
              <h4>Preview:</h4>
              <img src={preview} alt="Selected preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
            </div>
          )}

          {/* Upload Button */}
          <button onClick={handleUpload} style={{ marginTop: '10px' }}>
            Upload File
          </button>
        </div>
      )}

      {!selectedFile && (
         <p style={{ marginTop: '20px' }}>No file selected.</p>
      )}
    </div>
  );
}

export default FileUploader;