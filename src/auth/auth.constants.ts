import { Member } from './models/Member'

export const AuthConstants = {
    accessTokenExpiresIn: 604800000, // 7일 => ms
    cookieKey: 'jwt',
    memberList: [
        { email: 'luorix@snu.ac.kr', name: '황진우' },
        { email: 'jihoon416@snu.ac.kr', name: '서지훈' },
        { email: 'tlsbamtol@snu.ac.kr', name: '신재우' },
    ],
} as const satisfies {
    accessTokenExpiresIn: number
    cookieKey: string
    memberList: ReadonlyArray<Member>
}
