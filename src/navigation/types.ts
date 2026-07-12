import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type TabParamList = {
  Home: undefined;
  Explore: { query?: string } | undefined;
  Learn: { segment?: 'certifications' | 'roadmaps' } | undefined;
  Progress: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  CareerDetail: { careerId: string };
  Compare: undefined;
  Quiz: undefined;
  QuizResult: { resultId: string };
  CertificationDetail: { certificationId: string };
  RoadmapDetail: { roadmapId: string };
  EditProfile: undefined;
  ComingSoon: { title: string; description: string; icon: string };
};
