"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { getMyTeam } from "@/lib/db";
import { Team } from "@/types";

export const useTeam = () => {
  const { user, loading: authLoading } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTeam = async () => {
    if (user) {
      setLoading(true);
      try {
        const teamData = await getMyTeam(user.uid);
        setTeam(teamData);
      } catch (err: any) {
        setError(err.message || "Failed to load team data.");
      } finally {
        setLoading(false);
      }
    } else if (!authLoading) {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [user, authLoading]);

  return { team, loading, error, refreshTeam: fetchTeam };
};
