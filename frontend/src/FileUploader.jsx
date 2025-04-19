import React, { useState } from 'react';

// Ensure the CSS file exists at this path relative to the component
// and contains styles for the classes used below (e.g., .title-banner, .file-uploader-container, etc.).
import './css/FileUploader.css';

const FileViewer = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle'); // 'idle', 'success', 'error'
  const [submitMessage, setSubmitMessage] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    // Reset states
    setSelectedFile(null);
    setPreview(null);
    setIsSubmitting(false);
    setSubmitStatus('idle');
    setSubmitMessage('');

    if (file) {
      setSelectedFile(file);

      // Only generate preview for image types
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();

        reader.onloadend = () => {
          if (reader.result) {
            setPreview(reader.result);
          }
        };

        reader.onerror = (error) => {
          console.error('FileReader Error:', error);
          setSubmitStatus('error');
          setSubmitMessage('Error reading file preview.');
          setSelectedFile(null); // Clear selection if preview fails
        };

        reader.readAsDataURL(file);
      } else {
        // Handle non-image files if necessary, or provide feedback
        setSubmitStatus('error');
        setSubmitMessage('Selected file is not an image.');
        setSelectedFile(null); // Clear selection for non-images
      }
    }
    // event.target.value = null; // Uncomment if you want to allow re-selecting the same file without clicking away
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission if wrapped in a form

    if (!selectedFile || isSubmitting) {
      return; // Don't submit if no file or already submitting
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    const formData = new FormData();
    // 'imageFile' is the key the backend will use to access the file. Adjust if needed.
    formData.append('imageFile', selectedFile, selectedFile.name);

    // --- Replace with your actual backend endpoint ---
    const backendUrl = '/api/upload-image';
    // ----------------------------------------------

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        body: formData,
        // Headers are often not needed for FormData with fetch,
        // the browser sets 'Content-Type': 'multipart/form-data' automatically.
        // Add other headers like Authorization if required:
        // headers: {
        //   'Authorization': `Bearer ${your_token}`
        // }
      });

      const responseData = await response.json(); // Assuming backend sends JSON response

      if (!response.ok) {
        // Handle HTTP errors (e.g., 4xx, 5xx)
        throw new Error(responseData.message || `Server error: ${response.status}`);
      }

      // Success
      setSubmitStatus('success');
      setSubmitMessage(responseData.message || 'File uploaded successfully!');
      // Optionally clear selection after successful upload:
      // setSelectedFile(null);
      // setPreview(null);

    } catch (error) {
      console.error('Submission Error:', error);
      setSubmitStatus('error');
      setSubmitMessage(error.message || 'An error occurred during upload. Please try again.');
    } finally {
      setIsSubmitting(false); // Re-enable button
    }
  };

  return (
    // Added a wrapping div if needed, or attach banner class to existing container
    <div>
      {/* --- Added Title Banner --- */}
      <div className="title-banner">
        <h1>ThreatVerify</h1> {/* Using h1 for semantic importance */}
      </div>
      {/* ------------------------ */}

      <div className="file-uploader-container">
        <h3>Upload an Image</h3>
        <input
          type="file"
          onChange={handleFileChange}
          className="file-input"
          accept="image/*" // Restrict to image files
          disabled={isSubmitting} // Disable input while submitting
        />

        {selectedFile && (
          <div className="file-info">
            <p>Selected: {selectedFile.name}</p>
            <p>Type: {selectedFile.type}</p>
            <p>Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
          </div>
        )}

        {preview && (
          <div className="preview-section">
            <h4>Preview:</h4>
            <img src={preview} alt="Selected preview" className="preview-image" />
          </div>
        )}

        {/* Submit Button - Appears only when a valid image file is selected */}
        {selectedFile && selectedFile.type.startsWith('image/') && (
          <button
            onClick={handleSubmit}
            className="submit-button"
            disabled={isSubmitting} // Disable button while submitting
          >
            {isSubmitting ? 'Submitting...' : 'Submit Image'}
          </button>
        )}

        {/* Feedback Messages */}
        {submitStatus === 'success' && (
          <p className="status-message success">{submitMessage}</p>
        )}
        {submitStatus === 'error' && (
          <p className="status-message error">{submitMessage}</p>
        )}
      </div>
    </div>
  );
};

export default FileViewer;