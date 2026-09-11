"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import { clearToken, getToken, type StudentProfile } from "@/lib/auth";

import { useIsAuthenticated } from "./use-is-authenticated";

export function useStudentSession() {
  const router = useRouter();
  const signedIn = useIsAuthenticated();
  const [studentName, setStudentName] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    if (!signedIn) {
      return;
    }

    const authToken = getToken();
    if (!authToken) {
      return;
    }

    const tokenForLoad = authToken;
    let cancelled = false;

    const startTimer = window.setTimeout(() => {
      async function loadProfile() {
        setLoadingProfile(true);

        try {
          const profile = await api.get<StudentProfile>("/api/v1/auth/student/me", {
            token: tokenForLoad,
          });
          if (!cancelled) setStudentName(profile.name);
        } catch {
          if (!cancelled) {
            clearToken();
            setStudentName(null);
          }
        } finally {
          if (!cancelled) setLoadingProfile(false);
        }
      }

      void loadProfile();
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(startTimer);
    };
  }, [signedIn]);

  function logout() {
    clearToken();
    router.push("/");
  }

  return {
    signedIn,
    studentName: signedIn ? studentName : null,
    loadingProfile: signedIn ? loadingProfile : false,
    logout,
  };
}
