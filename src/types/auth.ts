// API Request/Response types for authentication

export interface LoginRequest {
  UIN: string;
  Password: string;
}

export interface GetUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  uin: string;
  phoneNumber?: string;
  gender?: string;
  profilePicture?: string;
  schoolId?: string;
}

export interface GetUserWithToken {
  user: GetUser;
  token: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: GetUserWithToken;
}
