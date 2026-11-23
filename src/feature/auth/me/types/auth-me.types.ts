export type AuthUserProfile = {
  first_name: string;
  last_name: string;
  display_name: string;
  timezone: string;
  language: string;
};

export type AuthUser = {
  id: string;
  email: string;
  status: string;
  email_verified_at: string | null;
  last_login_at: string | null;
  profile: AuthUserProfile;
};