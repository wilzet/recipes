import { User } from '@prisma/client'

export default function compareUsers(userA: User, userB: User) {
    if (userA.score > userB.score) return -1;
    else if (userA.score < userB.score) return 1; 

    return userA.id < userB.id ? -1 : 1;
}