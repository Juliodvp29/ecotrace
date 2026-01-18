export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl: string | null;
  authProvider: string;
  onboardingCompleted?: boolean;
}
