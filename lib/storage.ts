import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase";

export const uploadPDF = async (file: File, teamId: string) => {
  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are allowed.");
  }
  
  // Cost optimization: Store only 1 PDF per team (overwrite if exists)
  const storageRef = ref(storage, `submissions/${teamId}.pdf`);

  try {
     // Overwrite if exists, storage handles this if path is same
     await uploadBytes(storageRef, file);
     return await getDownloadURL(storageRef);
  } catch (error) {
     console.error("Storage upload error:", error);
     throw error;
  }
};

export const deleteSubmissionFile = async (teamId: string) => {
    const storageRef = ref(storage, `submissions/${teamId}.pdf`);
    try {
        await deleteObject(storageRef);
    } catch (error) {
        console.error("Storage delete error:", error);
        // Might not exist, usually ignore error
    }
};
