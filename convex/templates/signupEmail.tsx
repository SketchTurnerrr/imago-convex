import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

export function SignUpMagicLinkEmail(props: {
  magicLink: string | null | undefined;
}) {
  const { magicLink } = props;
  return (
    <Html>
      <Head />

      <Preview>Вітаємо в Імаго.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Вітаємо в Імаго.</Heading>
          <Section style={body}>
            <Text style={paragraph}>
              <Button style={button} href={magicLink ?? ''}>
                Створити акаунт
              </Button>
            </Text>
            <Text style={paragraph}>
              Якщо ви не робили запит на створення акаунту, можете проігнорувати
              це повідомлення.
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>Imago Ukraine</Text>
        </Container>
      </Body>
    </Html>
  );
}

export default SignUpMagicLinkEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 25px 48px',
};

const heading = {
  fontSize: '28px',
  fontWeight: 'bold',
  marginTop: '48px',
};

const body = {
  margin: '24px 0',
};

const paragraph = {
  fontSize: '14px',
  lineHeight: '26px',
  color: 'rgb(0, 0, 0, 0.6)',
};

const link = {
  color: '#9116af',
};

const hr = {
  borderColor: '#dddddd',
  marginTop: '48px',
};

const footer = {
  color: 'rgb(0,0,0, 0.7)',
  fontSize: '12px',
  marginLeft: '4px',
};

const button = {
  maxWidth: '150px',
  backgroundColor: '#9116af',
  borderRadius: '3px',
  fontWeight: '600',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
};
