import {SelectFilter} from "../interfaces/filters/select-filter";
import {SortCriteria} from "../interfaces/filters/sort-criteria";
import {UserRole} from "../interfaces/user/user-role.enum";
import {UserTestStatus} from "../interfaces/user-test/user-test-status.enum";
import {TestDifficulty} from "../interfaces/test/test-difficulty.enum";



export const DIFFICULTY_FILTER: SelectFilter = {
    filterLabel: 'Choose difficulty',
    filterName: 'difficulty',
    options: [
        { optionLabel: 'All', optionValue: '' },
        { optionLabel: 'Easy', optionValue: TestDifficulty.Easy },
        { optionLabel: 'Medium', optionValue: TestDifficulty.Medium },
        { optionLabel: 'Hard', optionValue: TestDifficulty.Hard }
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
        { optionLabel: 'Not started', optionValue: UserTestStatus.NotStarted },
        { optionLabel: 'In Process', optionValue: UserTestStatus.InProcess },
        { optionLabel: 'Completed', optionValue: UserTestStatus.Completed }
    ]
}

export const USER_ROLE_FILTER: SelectFilter = {
    filterLabel: 'Choose role',
    filterName: 'role',
    options: [
        { optionLabel: 'All', optionValue: '' },
        { optionLabel: 'User', optionValue: UserRole.User },
        { optionLabel: 'Admin', optionValue: UserRole.Admin },
        { optionLabel: 'Superadmin', optionValue: UserRole.SuperAdmin }
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
    filterName: 'templateId',
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
