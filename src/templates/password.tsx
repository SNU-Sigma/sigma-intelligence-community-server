import { Html } from '@react-email/html'
import { Button } from '@react-email/button'

interface Props {
    link: string
}

export default function Password({ link }: Props) {
    return (
        <Html lang='ko'>
            <Button href={link} style={buttonStyle}>
                비밀번호 설정
            </Button>
        </Html>
    )
}

const buttonStyle = {
    backgroundColor: '#7b0920',
    borderRadius: '4px',
    fontWeight: 'normal',
    color: '#fff',
    fontSize: '15px',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'block',
    padding: '8px',
} as const satisfies React.CSSProperties
