export type PostType = {
    id?: string;
    title: string | null;
    shortDescription: string | null;
    content: string | null;
    bloggerId: string;
    bloggerName?: string | null;
}
export type BloggerType = {
    id: string;
    name: string | null;
    youtubeUrl: string | null;
}
/*export type UserType = {
    id: string;
    login: string;
    passwordHash?: string;
}*/
export type CommentType = {
    id: string;
    content: string; //20<len<300
    postId: string;
    userId: string;
    userLogin: string;
    addedAt: Date;
}

export type EntityWithPaginationType<T> = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: T;
}

export type QueryDataType = {
    page: number;
    pageSize: number;
    searchNameTerm: string;
}
export type ErrorMessageType = {
    message: string;
    field: string;
}

/*export type UserAccountDBType = WithId<{
    accountData: UserAccountType,
    loginAttempts: LoginAttemptType[],
    emailConfirmation: EmailConfirmationType
}>*/

export type UserType = {
    accountData: UserAccountType,
    loginAttempts: LoginAttemptType[],
    emailConfirmation: EmailConfirmationType
}

export type UserAccountType = {
    id: string,
    email: string
    login: string
    passwordHash: string
    createdAt: Date
}
export type SentConfirmationEmailType = {
    sentDate: Date
}

export type LoginAttemptType = {
    attemptDate: Date
    ip: string
}

export type EmailConfirmationType = {
    isConfirmed: boolean
    confirmationCode: string
    expirationDate: Date
    sentEmails: SentConfirmationEmailType[]
}