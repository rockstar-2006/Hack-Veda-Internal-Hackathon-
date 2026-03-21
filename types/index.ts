import { FieldValue, Timestamp } from "firebase/firestore";

export type UserRole = "student" | "admin";

export interface UserProfile {
  userId: string;
  email: string | null;
  role: UserRole;
  userCode?: string;
  // Student Metadata
  full_name?: string;
  branch?: string;
  usn?: string;
  year?: string;
  phone?: string;
}

export interface Team {
  id?: string;
  teamName: string;
  leaderId: string;
  memberIds: string[];
  teamCode: string;
  shortlisted: boolean;
  rsvpStatus: "pending" | "confirmed";
  archived: boolean;
  createdAt: FieldValue | Timestamp;
  memberProfiles?: {
      userId: string;
      full_name: string;
      usn: string;
      branch: string;
      year: string;
      phone?: string;
  }[];
}

export interface Submission {
  id?: string;
  teamId: string;
  fileUrl: string;
  submittedAt: FieldValue | Timestamp;
  status?: "submitted" | "under_review" | "shortlisted";
}

export interface Announcement {
  id?: string;
  title: string;
  message: string;
  createdAt: FieldValue | Timestamp;
}

export interface ScheduleEvent {
  date: string;
  title: string;
}
