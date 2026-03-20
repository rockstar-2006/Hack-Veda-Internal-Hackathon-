import { 
  collection, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  serverTimestamp, 
  DocumentReference,
  arrayUnion,
  getDoc,
  orderBy,
  limit
} from "firebase/firestore";
import { db } from "./firebase";
import { generateCode } from "@/utils/generateCode";
import { Team, Submission, Announcement } from "@/types";

// Team Operations
export const createTeam = async (userId: string, teamName: string) => {
  const teamCode = generateCode();

  const teamData: Omit<Team, "id"> = {
    teamName,
    leaderId: userId,
    memberIds: [userId],
    teamCode,
    shortlisted: false,
    rsvpStatus: "pending",
    archived: false,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "teams"), teamData);
  return { id: docRef.id, ...teamData };
};

export const joinTeam = async (teamCode: string, userId: string) => {
  const q = query(
    collection(db, "teams"), 
    where("teamCode", "==", teamCode.toUpperCase()),
    where("archived", "==", false)
  );
  
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error("Invalid or inactive team code.");
  }

  const teamDoc = snapshot.docs[0];
  const data = teamDoc.data() as Team;

  // Check if user is already in team
  if (data.memberIds.includes(userId)) {
    throw new Error("Already a member of this team.");
  }
  
  // Max members check (standard hackathon usually 4-5)
  if (data.memberIds.length >= 5) {
      throw new Error("Team is already full (max 5 members).");
  }

  await updateDoc(teamDoc.ref, {
    memberIds: arrayUnion(userId),
  });

  return { id: teamDoc.id, ...data, memberIds: [...data.memberIds, userId] };
};

// Submission Operations
export const submitIdea = async (teamId: string, fileUrl: string) => {
  const submissionData: Omit<Submission, "id"> = {
    teamId,
    fileUrl,
    submittedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "submissions"), submissionData);
  return { id: docRef.id, ...submissionData };
};

// RSVP Operations
export const confirmRSVP = async (teamId: string) => {
  const teamRef = doc(db, "teams", teamId);
  await updateDoc(teamRef, {
    rsvpStatus: "confirmed",
  });
};

// Admin Operations
export const shortlistTeam = async (teamId: string, status: boolean) => {
  const teamRef = doc(db, "teams", teamId);
  await updateDoc(teamRef, {
    shortlisted: status,
  });
};

export const createAnnouncement = async (title: string, message: string) => {
  const announcementData: Omit<Announcement, "id"> = {
    title,
    message,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "announcements"), announcementData);
  return { id: docRef.id, ...announcementData };
};

// Fetching Data (Cost optimized: no listeners, direct gets)
export const getAnnouncements = async () => {
    const q = query(
        collection(db, "announcements"),
        orderBy("createdAt", "desc"),
        limit(5)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as (Announcement & { id: string })[];
};

export const getMyTeam = async (userId: string) => {
    const q = query(
        collection(db, "teams"), 
        where("memberIds", "array-contains", userId),
        where("archived", "==", false)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Team & { id: string };
};

export const getAllTeamsForAdmin = async (lastDoc?: any) => {
    // Pagination logic (simplified for now but structure is here)
    const q = query(
        collection(db, "teams"),
        where("archived", "==", false)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as (Team & { id: string })[];
};

export const updateTeamName = async (teamId: string, teamName: string) => {
    const teamRef = doc(db, "teams", teamId);
    await updateDoc(teamRef, { teamName });
};

// User Profile Operations
import { setDoc } from "firebase/firestore";
import { UserProfile } from "@/types";

export const updateUserProfile = async (userId: string, data: Partial<UserProfile>) => {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { ...data, userId }, { merge: true });
};

export const getUserProfile = async (userId: string) => {
    const userRef = doc(db, "users", userId);
    const snapshot = await getDoc(userRef);
    if (!snapshot.exists()) return null;
    return snapshot.data() as UserProfile;
};
