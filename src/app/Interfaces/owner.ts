export interface Owner {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  ssn: string;
  govID: number;
  cityID: number;
  gov: string;
  city: string;
  email: string;
  phoneNumber: string;
  profileImage: string;
  isBlocked: boolean | null;
  isDeleted: boolean;
  yourFavirotePerson: string;
  idFrontImage: string;
  idBackImage: string;
  userType: number;
  accountStatus: number;
}
