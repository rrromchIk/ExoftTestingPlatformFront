export interface FiltersDto {
    sortColumn?: string;
    sortDirection?: 'asc' | 'desc';
    selectFilters?: { [key: string]: string };
    searchTerm?: string
}
