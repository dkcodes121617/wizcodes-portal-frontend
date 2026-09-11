"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import { clearToken, getToken, type StudentProfile } from "@/lib/auth";

import { useIsAuthenticated } from "./use-is-authenticated";

export function useStudentSession() {
  const signedIn = useIsAuthenticated();
  const [studentName, setStudentName] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    if (!signedIn) {
      setStudentName(null);
      return;
    }

    const token = getToken();
    if (!token) {
      setStudentName(null);
      return;
    }

    let cancelled = false;
    setLoadingProfile(true);

    void api
      .get<StudentProfile>("/api/v1/auth/student/me", { token })
      .then((profile) => {
        if (!cancelled) setStudentName(profile.name);
      })
      .catch(() => {
        if (!cancelled) {
          clearToken();
          setStudentName(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingProfile(false);
      });

    return () => {
      cancelled = true;
    };
  }, [signedIn]);

  function logout() {
    clearToken();
    window.location.href = "/";
  }

  return { signedIn, studentName, loadingProfile, logout };
}
