export interface User {
  id: number;
  username: string;
  password: string;
  profile: Profile;
  active: boolean;
  admin: boolean;
  status: string;
  companies: Company[];
}

export interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface Company {
  id: number;
  name: string;
  description: string;
}

export interface Team {
  id?: number;
  name: string;
  description: string;
  teammates: User[];
}

export const defaultUser: User = {
  id: 312,
  username: 'User312',
  password: 'Password312',
  profile: {
    firstName: 'Terry',
    lastName: 'Dactyl',
    email: 'email312@gmail.com',
    phone: '123-456-7890',
  },
  active: true,
  admin: false,
  status: 'Regular User Status',
  companies: [
    {
      id: 6,
      name: 'Company 1',
      description: 'This is company 1',
    }
  ],

};

export const defaultAdmin: User = {
  id: 614,
  username: 'Admin614',
  password: 'Password614',
  profile: {
    firstName: 'Ella',
    lastName: 'Vader',
    email: 'email614@gmail.com',
    phone: '012-345-6789',
  },
  active: true,
  admin: true,
  status: 'Regular Admin Status',
  companies: [
    {
      id: 3,
      name: 'Company 2',
      description: 'This is company 2',
    }
  ]
};

export const deactivatedUser: User = {
  id: 916,
  username: 'User916',
  password: 'Password916',
  profile: {
    firstName: 'Justin',
    lastName: 'Case',
    email: 'email916@gmail.com',
    phone: '111-111-1111',
  },
  active: false,
  admin: false,
  status: 'Regular User Status',
  companies: [
    {
      id: 1,
      name: 'Company 3',
      description: 'This is company 3',
    }
  ]
};
