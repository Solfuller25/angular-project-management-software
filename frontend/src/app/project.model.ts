export interface Project {
    id?: number;
    name: string;
    description: string;
    active: boolean;
    team: any;
};

export const defaultProject: Project = {
    name: '',
    description: "",
    active: true,
    team: [],
};