import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  requested_grade: number | null;
  approved: boolean;
  created_at: string;
};

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [accountLoading, setAccountLoading] = useState(false);

  useEffect(() => {
    let active = true;
    let authRevision = 0;
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      authRevision += 1;
      if (!active) return;
      setSession(s);
      setUser((prev) => (prev?.id === s?.user?.id ? prev : (s?.user ?? null)));
      if (!s?.user) {
        setProfile(null);
        setIsAdmin(false);
        setIsTeacher(false);
      }
      setAuthLoading(false);
    });
    const initialRevision = authRevision;
    supabase.auth.getSession().then(({ data }) => {
      if (!active || initialRevision !== authRevision) return;
      setSession(data.session);
      setUser((prev) => (prev?.id === data.session?.user?.id ? prev : (data.session?.user ?? null)));
      setAuthLoading(false);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setAccountLoading(false);
      return;
    }
    let active = true;
    setAccountLoading(true);
    setProfile(null);
    setIsAdmin(false);
    setIsTeacher(false);
    (async () => {
      const [{ data: p, error: profileError }, { data: roles, error: rolesError }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", user.id),
      ]);
      if (!active) return;
      if (!profileError) setProfile((p as Profile) ?? null);
      if (!rolesError) {
        setIsAdmin(!!roles?.some((r: { role: string }) => r.role === "admin"));
        setIsTeacher(!!roles?.some((r: { role: string }) => r.role === "teacher"));
      }
      setAccountLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [user?.id]);

  return {
    session,
    user,
    profile,
    isAdmin,
    isTeacher,
    loading: authLoading || (!!user && accountLoading),
    signOut: () => supabase.auth.signOut(),
  };
}
