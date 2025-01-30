export interface Tag {
    id: number,
    name: string
}

export interface TaskFormProps {
    tags: Tag[]
}

export enum Priority {
    High = 'HIGH',
    Medium = 'MEDIUM',
    Low = 'LOW'
}