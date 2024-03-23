export interface BaseModel {
    id: string;
    createdTimestamp: Date;
    modifiedTimestamp?: Date | null;
    createdBy: string;
    modifiedBy?: string | null;
}
