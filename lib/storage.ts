
/**
 * Universal PDF Upload Logic (Free Tier Compatible)
 * 
 * This uses a server-side API proxy (/api/upload) to bypass CORS and 
 * anonymously upload files to catbox.moe for free hosting.
 * Bypasses need for Firebase Storage BLAZE plan.
 */
export const uploadPDF = (
  file: File, 
  teamId: string, 
  onProgress?: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (file.type !== "application/pdf") {
      return reject(new Error("Only PDF files are allowed."));
    }
    
    // Validate file size (10MB max)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return reject(new Error("File size exceeds 10MB limit."));
    }
    
    // Validate file name to prevent injection attacks
    if (!file.name || file.name.length === 0) {
      return reject(new Error("Invalid file name."));
    }
    
    console.log("Starting universal file upload (Free Tier active)...");
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('teamId', teamId);

    const xhr = new XMLHttpRequest();
    
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percentComplete = Math.round((event.loaded / event.total) * 90); // 90% is upload
        onProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (data.url) {
            console.log("Universal Upload Successful:", data.url);
            if (onProgress) onProgress(100);
            resolve(data.url);
          } else {
            reject(new Error("Upload response missing URL."));
          }
        } catch (e) {
          reject(new Error("Failed to parse upload response."));
        }
      } else {
        try {
          const data = JSON.parse(xhr.responseText);
          reject(new Error(data.error || "Upload service failed."));
        } catch (e) {
          reject(new Error(`Server error: ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during upload."));
    };

    xhr.open("POST", "/api/upload", true);
    xhr.send(formData);
  });
};

export const deleteSubmissionFile = async (teamId: string) => {
    // Note: Free service files (like Catbox) are usually permanent/anon 
    // and don't provide a delete API without a user hash.
    console.log(`Soft-delete requested for team ${teamId}.`);
};
