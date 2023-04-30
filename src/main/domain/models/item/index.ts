export interface ItemDTO {
    id?: string;
    userId?: string;
    projectId?: string;
    name: string;
    description: string;
    status?: number;
    startedAt?: string;
    completedAt?: string;
    createdAt?: string;
}