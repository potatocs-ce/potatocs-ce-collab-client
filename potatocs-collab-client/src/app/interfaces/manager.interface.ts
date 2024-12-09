export interface Manager {
  _id: string;
  email: string;
  username: string;
  password: string;
  phoneNumber: string;
  address: string;
}

export const InitialCompany: Manager = {
  _id: '',
  email: '',
  username: '',
  password: '',
  phoneNumber: '',
  address: '',
};
