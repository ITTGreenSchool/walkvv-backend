
export type UserRequest = {
    email: string;
    username: string;
    password: string;
}

export type UserLoginRequest = {
    email: string;
    password: string;
}

export type UserRegisterRequest = {
    email: string;
    username: string;
    password: string;
}

export type UserUpdateRequest = {
    email: string;
    password: string;
    updated_fields: {
        email?: string;
        username?: string;
        password?: string;
    }
}