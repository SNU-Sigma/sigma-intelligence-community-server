import { Injectable } from '@nestjs/common'
import { Member } from '../auth/models/Member'
import * as dotenv from 'dotenv'

@Injectable()
export class ConfigService {
    private configuration = (() => {
        // .env 파일 로드해서 process.env에 추가
        dotenv.config()

        return {
            port: Number(process.env['PORT'] ?? 3000),
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
                jwtSecret:
                    process.env['JWT_SECRET'] ??
                    (() => {
                        throw new Error('JWT_SECRET 환경변수가 빠져있습니다.')
                    })(),
            },
            // 매직링크 메일 보낼 때 사용
            mailing: {
                email: 'record.snusigma@gmail.com',
                password:
                    process.env['EMAIL_AUTH_PASSWORD'] ??
                    (() => {
                        throw new Error(
                            'EMAIL_AUTH_PASSWORD 환경변수가 빠져있습니다.',
                        )
                    })(),
                host: 'smtp.gmail.com',
                userName: '시그마 인텔리전스',
            },
            redirect: {
                // 현재는 매직링크를 위한 base url로 사용
                webBaseUrl: 'https://web.sigma-intelligence.com',
            },
            aws: {
                accessKeyId:
                    process.env['AWS_ACCESS_KEY_ID'] ??
                    (() => {
                        throw new Error(
                            'AWS_ACCESS_KEY_ID 환경변수가 빠져있습니다.',
                        )
                    })(),
                secretAccessKey:
                    process.env['AWS_SECRET_ACCESS_KEY'] ??
                    (() => {
                        throw new Error(
                            'AWS_SECRET_ACCESS_KEY 환경변수가 빠져있습니다.',
                        )
                    })(),
            },
        } as const satisfies {
            port: number
            auth: {
                accessTokenExpiresIn: number
                cookieKey: string
                memberList: ReadonlyArray<Member>
                jwtSecret: string
            }
            mailing: {
                email: string
                password: string
                host: string
                userName: string
            }
            redirect: {
                webBaseUrl: string
            }
            aws: {
                accessKeyId: string
                secretAccessKey: string
            }
        }
    })()

    select<T>(selector: (rootConfig: typeof this.configuration) => T): T {
        return selector(this.configuration)
    }
}
