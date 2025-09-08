import { useState } from 'react';
import { login, forgotPassword } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { useWatch } from 'antd/es/form/Form';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  Card,
  Layout,
  ConfigProvider,
  Typography,
  Flex,
  message,
} from 'antd';
import type { User } from '../types/types';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const emailValue = useWatch('email', form);
  const emailError = form.getFieldError('email');

  const handleForgot = async () => {
    messageApi.info(
      'If this email address exists, a reset link has been sent. Check your email.'
    );

    try {
      await forgotPassword(emailValue);
    } catch {
      setError('Failed to send email');
    }
  };

  const onFinish = async (values: User) => {
    setLoading(true);
    setError(null);

    try {
      const { email, password } = values;
      await login(email, password);

      navigate('/');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider>
      <Layout
        style={{
          minHeight: '100vh',
          backgroundColor: '#ededed',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
        }}
      >
        <Card
          style={{
            width: 400,
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Typography.Title level={3} style={{ margin: 0, marginBottom: 8 }}>
              Login to Your Account
            </Typography.Title>
            <Typography.Text type='secondary'>
              Forgot password? Enter email and press 'Forgot?'
            </Typography.Text>
          </div>

          <Form
            form={form}
            name='login'
            onFinish={onFinish}
            layout='vertical'
            autoComplete='off'
          >
            <Form.Item
              label='Email'
              name='email'
              rules={[
                { required: true, message: 'Please input your Email!' },
                { type: 'email', message: 'Invalid email format!' },
              ]}
              validateTrigger='onChange'
            >
              <Input
                prefix={<MailOutlined />}
                placeholder='Email'
                disabled={loading}
              />
            </Form.Item>

            {contextHolder}
            <Form.Item
              label='Password'
              name='password'
              rules={[
                { required: true, message: 'Please input your Password!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder='Password'
                disabled={loading}
                addonAfter={
                  <Button
                    type='link'
                    size='small'
                    style={{ padding: 0 }}
                    onClick={handleForgot}
                    disabled={!emailValue || emailError.length > 0 || loading}
                  >
                    Forgot?
                  </Button>
                }
              />
            </Form.Item>

            {error && (
              <Typography.Text
                type='danger'
                style={{ display: 'block', marginBottom: 16 }}
              >
                {error}
              </Typography.Text>
            )}

            <Form.Item style={{ marginTop: 16, marginBottom: 0 }}>
              <Flex gap='small'>
                <Button
                  block
                  type='primary'
                  size='large'
                  htmlType='submit'
                  loading={loading}
                >
                  {loading ? 'Loading...' : 'Login'}
                </Button>
                <Button
                  block
                  size='large'
                  onClick={() => form.resetFields()}
                  disabled={loading}
                >
                  Clear
                </Button>
              </Flex>
            </Form.Item>
          </Form>
        </Card>
      </Layout>
    </ConfigProvider>
  );
}
