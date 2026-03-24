export class AppError extends Error {
    public readonly statusCode: number;
    public readonly errorType: string;
    public readonly isOperational: boolean;

    constructor(
        message: string,
        statusCode: number = 500,
        errorType: string = 'internal_error',
        isOperational: boolean = true
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errorType = errorType;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string, identifier?: string | number) {
        const message = identifier
            ? `${resource} with ID ${identifier} not found`
            : `${resource} not found`;
        super(message, 404, 'not_found');
    }
}

export class ValidationError extends AppError {
    public readonly field?: string;
    constructor(message: string, field?: string) {
        super(message, 400, 'validation_error');
        this.field = field;
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string = 'Authentication required') {
        super(message, 401, 'authentication_error');
    }
}

export class AuthorizationError extends AppError {
    constructor(message: string = 'Insufficient permissions') {
        super(message, 403, 'authorization_error');
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409, 'conflict_error');
    }
}

export class BusinessError extends AppError {
    constructor(message: string) {
        super(message, 422, 'business_error');
    }
}

export class DuplicateError extends AppError {
    constructor(resource: string, field?: string) {
        const message = field
            ? `${resource} with ${field} already exists.`
            : `${resource} already exists.`;
        super(message, 400, 'duplicate_error');
    }
}

export class InvalidCredentialsError extends AppError {
    constructor() {
        super('Invalid username or password.', 401, 'invalid_credentials');
    }
}

export const ErrorMessages = {
    INTERNAL_ERROR: 'An internal error occurred. Please try again later.',
    UNAUTHORIZED: 'Unauthorized access.',
    LOGIN_REQUIRED: 'Please login first.',
    INVALID_TOKEN: 'Invalid or expired token.',
    CREATE_SUCCESS: 'Data created successfully.',
    UPDATE_SUCCESS: 'Data updated successfully.',
    DELETE_SUCCESS: 'Data deleted successfully.',
    FETCH_SUCCESS: 'Data retrieved successfully.',
    REQUIRED_FIELD: (field: string) => `${field} is required.`,
};
