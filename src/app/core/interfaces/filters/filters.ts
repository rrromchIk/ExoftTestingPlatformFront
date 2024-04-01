export interface Filters {
    sortColumn?: string;
    sortOrder?: 'asc' | 'desc' | '';
    selectFilters?: { [key: string]: string };
    searchTerm?: string
}
