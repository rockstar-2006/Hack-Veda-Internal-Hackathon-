"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { getMyTeam } from "@/lib/db";
import { Team } from "@/types";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const useTeam = () => {
  const { user, loading: authLoading } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
        if (!authLoading) setLoading(false);
        return;
    }

    setLoading(true);
    const q = query(
        collection(db, "teams"), 
        where("memberIds", "array-contains", user.uid),
        where("archived", "==", false)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
        try {
            if (snapshot.empty) {
                setTeam(null);
            } else {
                setTeam({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Team & { id: string });
            }
            setError("");
            setLoading(false);
        } catch (err: any) {
            console.error("Error processing team snapshot:", err);
            setError(err.message || "Failed to load team data");
            setLoading(false);
        }
    }, (err) => {
        console.error("Listener error:", err);
        setError(err.message || "Failed to listen to team updates");
        setLoading(false);
    });

    return () => unsubscribe();
  }, [user, authLoading]);

  // Dummy refreshTeam for compatibility
  const fetchTeam = async () => {};

  return { team, loading, error, refreshTeam: fetchTeam };
};
