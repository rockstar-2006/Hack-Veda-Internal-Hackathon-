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
  arrayRemove,
  deleteDoc,
  getDoc,
  orderBy,
  limit
} from "firebase/firestore";
import { db } from "./firebase";
import { generateCode } from "@/utils/generateCode";
import { Team, Submission, Announcement } from "@/types";

// Team Operations
export const createTeam = async (userId: string, teamName: string) => {
  // Check if user is already in a team
  const existingTeam = await getMyTeam(userId);
  if (existingTeam) {
    throw new Error("You are already part of a team!");
  }

  const teamCode = generateCode();
  const profile = await getUserProfile(userId);
  const leaderSnippet = {
      userId: userId,
      full_name: profile?.full_name || "LEADER",
      usn: profile?.usn || "...",
      branch: profile?.branch || "...",
      year: profile?.year || "...",
      phone: profile?.phone || "..."
  };

  const teamData: Omit<Team, "id"> = {
    teamName,
    leaderId: userId,
    memberIds: [userId],
    memberProfiles: [leaderSnippet],
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
  // Check if user is already in a team
  const existingTeam = await getMyTeam(userId);
  if (existingTeam) {
    throw new Error("You are already part of a team!");
  }

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
  const profile = await getUserProfile(userId);
  const snippet = {
      userId: userId,
      full_name: profile?.full_name || "STUDENT",
      usn: profile?.usn || "...",
      branch: profile?.branch || "...",
      year: profile?.year || "..."
  };

  // Max members check
  if (data.memberIds.length >= 5) {
      throw new Error("Team is already full (max 5 members).");
  }

  await updateDoc(teamDoc.ref, {
    memberIds: arrayUnion(userId),
    memberProfiles: arrayUnion(snippet)
  });

  return { id: teamDoc.id, ...data, memberIds: [...data.memberIds, userId] };
};

export const addTeammateByUSN = async (teamId: string, usn: string) => {
  // 1. Find user by USN
  const uq = query(collection(db, "users"), where("usn", "==", usn.toUpperCase()));
  const usnap = await getDocs(uq);
  
  if (usnap.empty) {
    throw new Error("Student with this USN not found. Ask them to setup their profile first!");
  }

  const userData = usnap.docs[0].data();
  const targetUserId = usnap.docs[0].id;
  const snippet = {
      userId: targetUserId,
      full_name: userData.full_name || "STUDENT",
      usn: userData.usn || usn.toUpperCase(),
      branch: userData.branch || "...",
      year: userData.year || "..."
  };

  // 2. Check current team size
  const teamRef = doc(db, "teams", teamId);
  const teamSnap = await getDoc(teamRef);
  if (!teamSnap.exists()) throw new Error("Team not found.");
  
  const teamData = teamSnap.data() as Team;
  if (teamData.memberIds.length >= 5) {
      throw new Error("Team is already full (max 5 members).");
  }

  // 3. Check if user already in any team
  const tq = query(collection(db, "teams"), where("memberIds", "array-contains", targetUserId), where("archived", "==", false));
  const tsnap = await getDocs(tq);
  if (!tsnap.empty) {
    throw new Error("This student is already in a team!");
  }

  // 4. Add to our team
  await updateDoc(teamRef, {
    memberIds: arrayUnion(targetUserId),
    memberProfiles: arrayUnion(snippet)
  });

  return userData;
};

export const leaveTeam = async (teamId: string, userId: string) => {
    const teamRef = doc(db, "teams", teamId);
    const teamSnap = await getDoc(teamRef);
    if (!teamSnap.exists()) throw new Error("Team not found.");
    
    const team = teamSnap.data() as Team;
    
    // If the leader leaves, or it's the last member, we dissolve the team softly to bypass strict Firebase delete rules
    if (team.leaderId === userId || team.memberIds.length === 1) {
        await updateDoc(teamRef, {
            archived: true,
            memberIds: arrayRemove(userId)
        });
        return { deleted: true };
    } else {
        await updateDoc(teamRef, {
            memberIds: arrayRemove(userId)
        });
        return { deleted: false };
    }
};

// Submission Operations
export const submitIdea = async (teamId: string, fileUrl: string) => {
  const submissionData: Omit<Submission, "id"> = {
    teamId,
    fileUrl,
    submittedAt: serverTimestamp(),
  };

  // We use teamId as document ID to ensure only one submission per team
  const docRef = doc(db, "submissions", teamId);
  await setDoc(docRef, submissionData);
  return { id: teamId, ...submissionData };
};

export const getSubmission = async (teamId: string) => {
    const docRef = doc(db, "submissions", teamId);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() } as Submission & { id: string };
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

export const getAllTeamsForAdmin = async () => {
    const q = query(
        collection(db, "teams")
        // Removed archived filter to ensure all teams are visible initially
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as (Team & { id: string })[];
};

export const getAdminStats = async () => {
    const [teamsSnap, submissionsSnap] = await Promise.all([
        getDocs(collection(db, "teams")),
        getDocs(collection(db, "submissions"))
    ]);

    const teams = teamsSnap.docs.map(d => d.data() as Team);
    
    return {
        totalTeams: teams.filter(t => !t.archived).length,
        shortlisted: teams.filter(t => t.shortlisted).length,
        confirmed: teams.filter(t => t.rsvpStatus === 'confirmed').length,
        submissions: submissionsSnap.size
    };
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

    // Sync to team if they are in one (Bypasses rules issues by caching name in team doc)
    try {
        const myTeam = await getMyTeam(userId);
        if (myTeam && myTeam.id) {
            const teamRef = doc(db, "teams", myTeam.id);
            const snippet = {
                userId,
                full_name: data.full_name || "STUDENT",
                usn: data.usn || "...",
                branch: data.branch || "...",
                year: data.year || "...",
                phone: data.phone || "..."
            };
            
            // Remove old snippet and add new one
            const currentProfiles = myTeam.memberProfiles || [];
            const updatedProfiles = [
                ...currentProfiles.filter(p => p.userId !== userId),
                snippet
            ];
            
            await updateDoc(teamRef, {
                memberProfiles: updatedProfiles
            });
        }
    } catch (err) {
        console.warn("Could not sync profile to team doc:", err);
    }
};

export const getUserProfile = async (userId: string) => {
    const userRef = doc(db, "users", userId);
    const snapshot = await getDoc(userRef);
    if (!snapshot.exists()) return null;
    return snapshot.data() as UserProfile;
};
