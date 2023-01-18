import { Member } from './auth/models/Member'

export const Config = {
    auth: {
        cookieKey: 'jwt',
        // 7일 => ms
        accessTokenExpiresIn: 604800000,
        memberList: [
            { email: 'luorix@snu.ac.kr', name: '황진우' },
            { email: 'jihoon416@snu.ac.kr', name: '서지훈' },
            { email: 'tlsbamtol@snu.ac.kr', name: '신재우' },
            { email: 'hjl1013@snu.ac.kr', name: '이현준' },
            { email: 'naemduu@snu.ac.kr', name: '황두환' },
            { email: 'lisi2337qar@snu.ac.kr', name: '박준하' },
            { email: 'dongwooryu@snu.ac.kr', name: '류동우' },
        ],
    },
} as const satisfies {
    auth: {
        accessTokenExpiresIn: number
        cookieKey: string
        memberList: ReadonlyArray<Member>
    }
}
