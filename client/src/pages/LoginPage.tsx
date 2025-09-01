import { useState } from 'react';
import { login } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types/types';
import type { FormProps } from 'antd';

import { LockOutlined, MailOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  Card,
  Layout,
  ConfigProvider,
  Typography,
} from 'antd';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const onFinish: FormProps<User>['onFinish'] = async (values) => {
    setLoading(true);
    setError(null);

    try {
      const { email, password } = values;
      const user = await login(email, password);

      if (user.role === 'root_admin' || user.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (e) {
      setError('Invalid email or password');
      console.error(e);
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
          title={<Typography.Title level={3}>Login</Typography.Title>}
          style={{
            width: 400,
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Form
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
                // { type: 'email', message: 'Invalid email format!' },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder='Email' />
            </Form.Item>

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

            <Form.Item>
              <Button
                block
                type='primary'
                size='large'
                htmlType='submit'
                loading={loading}
              >
                {loading ? 'Loading...' : 'Login'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Layout>
    </ConfigProvider>
  );
}
