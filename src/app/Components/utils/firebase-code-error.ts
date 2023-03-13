export enum FirebaseCodeError {
    InUse = 'auth/email-already-in-use',
    WeakPassword = 'auth/weak-password',
    InvalidEmail = 'auth/invalid-email',
    MissingEmail = 'auth/missing-email',
    WrongPassword = 'auth/wrong-password',
    UserNotFound = 'auth/user-not-found',
    TooManyRequests = 'auth/too-many-requests'
}