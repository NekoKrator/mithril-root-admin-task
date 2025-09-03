import { Layout, Typography, Button, Space, Flex } from 'antd';
import { getCurrentUser, logout } from '../services/auth';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

export default function AppHeader() {
  const currentUser = getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Header
      style={{
        background: '#fff',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <Flex
        gap='large'
        justify='space-between'
        align='center'
        style={{ width: '85%' }}
      >
        <Space>
          <Flex gap='large'>
            <Typography.Text
              onClick={() => navigate('/')}
              style={{ cursor: 'pointer' }}
            >
              My Notes
            </Typography.Text>

            {currentUser.role === 'user' ? null : (
              <Typography.Text
                onClick={() => navigate('/dashboard')}
                style={{ cursor: 'pointer' }}
              >
                Dashboard
              </Typography.Text>
            )}
          </Flex>
        </Space>

        <Space>
          <Flex gap='large' align='center'>
            <Typography.Text>
              Hello, <strong>{currentUser.email}</strong>
            </Typography.Text>

            <Button onClick={handleLogout} danger>
              Logout
            </Button>
          </Flex>
        </Space>
      </Flex>
    </Header>
  );
}
