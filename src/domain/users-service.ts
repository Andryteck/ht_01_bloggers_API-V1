import {UsersRepository, usersRepository} from "../repositories/users-db-repository";
import {v4 as uuidv4} from "uuid";
import {EntityWithPaginationType, UserType} from "../../types/types";
import {addHours} from "date-fns";
import {authService} from "../middlewares/auth-service";

class UsersService  {
    constructor(private usersRepository: UsersRepository, ) {
    }
    async getUsers(page: number, pageSize: number, searchNameTerm: string) {
        const users = await this.usersRepository.getUsers(page, pageSize, searchNameTerm)
        return users
    }
    async createUser(login: string, password: string): Promise<UserType | null> {
        const passwordHash = await authService._generateHash(password)
        const newUser: UserType = {
            accountData: {
                id: uuidv4(),
                login: login,
                email: login,
                passwordHash,
                createdAt: new Date()
            },
            loginAttempts: [],
            emailConfirmation: {
                sentEmails: [],
                confirmationCode: uuidv4(),
                expirationDate: addHours(new Date(), 24),
                isConfirmed: false
            }
        }
        const createdUser = await this.usersRepository.createUser(newUser)
        return createdUser
    }
    async deleteUserById(id: string): Promise<boolean> {
        return await this.usersRepository.deleteUserById(id)
    }
}

export const usersService = new UsersService(usersRepository)