export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  ssn: string;
  govID: number;
  cityID: number;
  email: string;
  phoneNumber: string;
  profileImage: string;
  isBlocked: boolean | null;
  userType: number;
}
