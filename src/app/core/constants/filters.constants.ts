import {SelectFilter} from "../interfaces/select-filter";
import {SortCriteria} from "../interfaces/sort-criteria";



export const DIFFICULTY_FILTER: SelectFilter = {
    filterLabel: 'Choose difficulty',
    filterName: 'difficulty',
    options: [
        { optionLabel: 'All', optionValue: '' },
        { optionLabel: 'Easy', optionValue: 'easy' },
        { optionLabel: 'Medium', optionValue: 'medium' },
        { optionLabel: 'Hard', optionValue: 'hard' }
    ]
}

export const PUBLISHED_FILTER: SelectFilter = {
    filterLabel: 'Published',
    filterName: 'published',
    options: [
        { optionLabel: 'Both', optionValue: '' },
        { optionLabel: 'True', optionValue: 'true' },
        { optionLabel: 'False', optionValue: 'false' }
    ]
}

export const USER_TEST_STATUS_FILTER: SelectFilter = {
    filterLabel: 'Choose status',
    filterName: 'userTestStatus',
    options: [
        { optionLabel: 'All', optionValue: '' },
        { optionLabel: 'Not started', optionValue: 'notStarted' },
        { optionLabel: 'In Process', optionValue: 'inProcess' },
        { optionLabel: 'Completed', optionValue: 'completed' }
    ]
}

export const USER_ROLE_FILTER: SelectFilter = {
    filterLabel: 'Choose role',
    filterName: 'role',
    options: [
        { optionLabel: 'All', optionValue: '' },
        { optionLabel: 'User', optionValue: 'user' },
        { optionLabel: 'Admin', optionValue: 'admin' },
        { optionLabel: 'Superadmin', optionValue: 'superAdmin' }
    ]
}

export const EMAIL_CONFIRMED_FILTER: SelectFilter = {
    filterLabel: 'Email confirmed',
    filterName: 'emailConfirmed',
    options: [
        { optionLabel: 'Both', optionValue: '' },
        { optionLabel: 'True', optionValue: 'true' },
        { optionLabel: 'False', optionValue: 'false' }
    ]
}

export const FROM_TEMPLATE_FILTER: SelectFilter = {
    filterLabel: 'Choose template',
    filterName: 'template',
    options: [
        { optionLabel: 'All', optionValue: '' },
    ]
}

export const DURATION_SORT_CRITERIA: SortCriteria = {
    label: 'Duration',
    value: 'duration'
}

export const CREATION_DATE_SORT_CRITERIA: SortCriteria = {
    label: 'Creation date',
    value: 'creationDate'
}

export const MODIFICATION_DATE_SORT_CRITERIA: SortCriteria = {
    label: 'Modification date',
    value: 'modificationDate'
}

export const STARTING_TIME_SORT_CRITERIA: SortCriteria = {
    label: 'Starting time',
    value: 'startingTime'
}

export const SCORE_SORT_CRITERIA: SortCriteria = {
    label: 'Score',
    value: 'score'
}
