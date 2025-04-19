import React, { useState } from 'react';
// Assuming you have a corresponding CSS file (e.g., FileViewer.css)
import './css/FileUploader.css';

const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log('--- handleFileChange Triggered ---');
    console.log('File selected:', file); // Log the whole file object

    // Reset state first
    setSelectedFile(null);
    setPreview(null);

    if (file) {
      // Log file type *before* the check
      console.log('[Debug] File Type:', file.type);
      setSelectedFile(file);

      // Check if it's an image type
      if (file.type.startsWith('image/')) {
        console.log('[Debug] File type IS image. Creating FileReader.');
        const reader = new FileReader();

        // Optional: Log when reading starts
        reader.onloadstart = () => {
            console.log('[Debug] FileReader: Reading started...');
        };

        // This is the crucial part: Log when reading finishes
        reader.onloadend = () => {
          console.log('[Debug] FileReader: onloadend triggered.');
          if (reader.result) {
             // Log the length to check if we got data
             console.log('[Debug] FileReader: Result available, length:', reader.result.length);
             // Log the beginning of the result to verify it's a data URL
             console.log('[Debug] FileReader: Result starts with:', reader.result.substring(0, 50));
             setPreview(reader.result); // Update the state
             console.log('[Debug] setPreview called.');
          } else {
              console.error('[Debug] FileReader: Result is empty or null.');
          }
        };

        // Log any errors during file reading
        reader.onerror = (error) => {
            console.error('[Error] FileReader Error:', error);
        };

        // Log right before starting the read operation
        console.log('[Debug] FileReader: Calling readAsDataURL...');
        reader.readAsDataURL(file);

      } else {
         // Log if the file type wasn't recognized as an image
         console.log('[Debug] File type is NOT image (`' + file.type + '`), skipping preview generation.');
      }

    } else {
      // Log if the user cancelled the dialog
      console.log('[Debug] File selection cancelled or no file chosen.');
    }
    // event.target.value = null; // Optional
  };

  // Also, add a log inside the JSX where the image is rendered:
  // In the return(...) part of FileViewer.js:

  {preview && (
    <div className="preview-section">
      <h4>Preview:</h4>
      {/* Add this log */}
      {console.log('[Render] Rendering preview image. Preview state available:', !!preview)}
      <img src={preview} alt="Selected preview" className="preview-image" />
    </div>
  )}
export default FileViewer;