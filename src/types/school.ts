// School-related TypeScript interfaces

export interface CreateSchoolRequest {
  schoolName: string;
  schoolLogoFilePath?: File | null;
  colorCode?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  userId: string;
}

export interface UpdateSchoolRequest {
  id: string;
  schoolName: string;
  schoolLogoFilePath?: string;
  colorCode?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  isSubscrptionActive: boolean;
  userId: string;
}

export interface GetSchoolResponse {
  id: string;
  schoolName: string;
  schoolLogoFilePath?: string;
  colorCode?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  isSubscrptionActive: boolean;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SchoolFormData {
  schoolName: string;
  schoolLogoFilePath?: File | null;
  colorCode?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
}

export interface SubscriptionResponse {
  id: string;
  allowedStudentCount: number;
  registeredStudentCount: number;
  amountPaid: number;
  createdAt: string;
}

export interface GetSingleSchoolWithSubs {
  schoolName: string;
  schoolLogoFilePath?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  planType: string;
  isSubscrptionActive: boolean;
  schoolSubscription: SubscriptionResponse;
}

export interface SchoolSubscriptionData {
  isSubscrptionActive: boolean;
}
