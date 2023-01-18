import { Member } from './auth/models/Member'

// 민감한 정보는 .env로 / 이 곳은 안 민감한 정보
export const Config = {
    auth: {
        cookieKey: 'jwt',
        // 7일 => ms
        accessTokenExpiresIn: 604800000,
        // 직접 멤버 추가해야 함
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
    // 매직링크 메일 보낼 때 사용
    mailing: {
        email: 'record.snusigma@gmail.com',
        host: 'smtp.gmail.com',
        userName: '시그마 인텔리전스',
    },
    redirect: {
        // 현재는 매직링크를 위한 base url로 사용
        webBaseUrl: 'https://web.sigma-intelligence.com',
    },
} as const satisfies {
    auth: {
        accessTokenExpiresIn: number
        cookieKey: string
        memberList: ReadonlyArray<Member>
    }
    mailing: {
        email: string
        host: string
        userName: string
    }
    redirect: {
        webBaseUrl: string
    }
}
