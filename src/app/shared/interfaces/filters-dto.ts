export interface FiltersDto {
    sortColumn?: string;
    selectFilters?: { [key: string]: string };
    searchTerm?: string
}
