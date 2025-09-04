import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LockOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  Card,
  Layout,
  ConfigProvider,
  Typography,
  Flex,
} from 'antd';
import { resetPassword } from '../services/auth';

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    setError('Reset token is missing or invalid');
    setLoading(false);
    return;
  }

  const onFinish = async (values: { password: string; confirm: string }) => {
    setLoading(true);
    setError(null);

    if (values.password !== values.confirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await resetPassword(token, values.password);
      navigate('/login');
    } catch {
      setError('Failed to reset password');
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
              Reset Your Password
            </Typography.Title>
            <Typography.Text type='secondary'>
              Enter your new password below
            </Typography.Text>
          </div>

          <Form
            form={form}
            name='resetPassword'
            onFinish={onFinish}
            layout='vertical'
            autoComplete='off'
          >
            <Form.Item
              label='New Password'
              name='password'
              rules={[
                {
                  required: true,
                  message: 'Please input your new password!',
                },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder='New password'
                disabled={loading}
              />
            </Form.Item>

            <Form.Item
              label='Confirm Password'
              name='confirm'
              rules={[
                { required: true, message: 'Please confirm your password!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder='Confirm password'
                disabled={loading}
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
                  {loading ? 'Loading...' : 'Reset Password'}
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
