export interface BaseModel {
    id: string;
    createdTimestamp: Date;
    modifiedTimestamp?: Date;
    createdBy: string;
    modifiedBy?: string;
}
