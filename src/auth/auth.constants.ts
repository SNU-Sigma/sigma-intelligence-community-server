import { Member } from './models/Member'

export const AuthConstants = {
    accessTokenExpiresIn: 604800000, // 7일 => ms
    cookieKey: 'jwt',
    memberList: [{ email: 'jihoon416@snu.ac.kr', name: '서지훈' }],
} as const satisfies {
    accessTokenExpiresIn: number
    cookieKey: string
    memberList: ReadonlyArray<Member>
}
