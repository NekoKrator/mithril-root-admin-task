import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchUsers, deleteUser } from '../services/user';
import { getCurrentUser } from '../services/auth';
import UserModal from '../components/UserModal';
import { useNavigate, Link } from 'react-router-dom';
import {
  Layout,
  Card,
  Typography,
  Button,
  Table,
  Popconfirm,
  ConfigProvider,
  Space,
  Tag,
  Flex,
  Input,
} from 'antd';
import Column from 'antd/es/table/Column';
import type { Role, UserId, NoteId } from '../types/types';
import type { InputRef } from 'antd';
import { roleColors } from '../services/roleColors';
import { fetchNotes } from '../services/note';
import { SearchOutlined } from '@ant-design/icons';

export default function DashboardPage() {
  const [users, setUsers] = useState<UserId[]>([]);
  const [notes, setNotes] = useState<NoteId[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  // const [searchText, setSearchText] = useState('');
  // const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadNotes = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedNotes = await fetchNotes();
      setNotes(fetchedNotes);
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteUser = useCallback(
    async (id: string) => {
      try {
        await deleteUser(id);
        loadUsers();
      } catch (error) {
        console.error(`Failed to delete user:`, error);
      }
    },
    [loadUsers]
  );

  const handleUserModalDone = useCallback(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    if (currentUser?.role === 'root_admin' || currentUser?.role === 'admin') {
      loadUsers();
      loadNotes();
    } else {
      navigate('/');
    }
  }, [currentUser?.role, loadUsers, loadNotes, navigate]);

  const enrichedUsers = users.map((u) => ({
    ...u,
    notesCount: notes.filter((n) => n.authorId === u.id).length,
  }));

  return (
    <ConfigProvider>
      <Layout
        style={{
          minHeight: '100vh',
          background: '#ededed',
          padding: 24,
        }}
      >
        <Card
          title={
            <Typography.Title level={3} style={{ margin: 0 }}>
              User Management
            </Typography.Title>
          }
          style={{
            maxWidth: 1500,
            margin: '0 auto',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            borderRadius: 8,
          }}
        >
          <Flex
            style={{
              marginBottom: 24,
            }}
            align='center'
            justify='space-between'
          >
            <Typography.Paragraph style={{ margin: 0 }}>
              Welcome, <strong>{currentUser.email}</strong> ({currentUser.role})
            </Typography.Paragraph>

            <UserModal
              mode='create'
              onDone={handleUserModalDone}
              triggerText='Add New User'
            />
          </Flex>

          <Table<UserId>
            dataSource={enrichedUsers}
            rowKey='id'
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} users`,
            }}
            loading={loading}
            style={{ height: '70vh' }}
          >
            <Column
              title='User ID'
              dataIndex='id'
              key='id'
              width={300}
              ellipsis
              render={(id) =>
                currentUser.id === id ? (
                  <Link to='/'>{id}</Link>
                ) : (
                  <Link to={`/user/${id}`}>{id}</Link>
                )
              }
            />
            <Column
              title='Email'
              dataIndex='email'
              key='email'
              width={200}
              ellipsis
              filterDropdown={
                <div
                  style={{ padding: 8 }}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <Input
                    ref={searchInput}
                    placeholder={'Search email'}
                    style={{ marginBottom: 8, display: 'block' }}
                  />
                  <Space>
                    <Button
                      type='primary'
                      icon={<SearchOutlined />}
                      size='small'
                      style={{ width: 90 }}
                    >
                      Search
                    </Button>
                    <Button size='small' style={{ width: 90 }}>
                      Reset
                    </Button>
                    <Button type='link' size='small'>
                      Close
                    </Button>
                  </Space>
                </div>
              }
            />
            <Column
              title='Name'
              dataIndex='name'
              key='name'
              width={150}
              ellipsis
            />
            {currentUser?.role === 'root_admin' && (
              <Column
                title='Created By'
                dataIndex='createdBy'
                key='createdBy'
                width={150}
                render={(_, user: UserId) => (
                  <span>
                    {user.createdBy ? user.createdBy.email : 'System'}
                  </span>
                )}
              />
            )}
            <Column
              title='Role'
              dataIndex='role'
              key='role'
              width={100}
              render={(role: string) => (
                <Tag color={roleColors[role as Role]} key={role}>
                  {role.toUpperCase()}
                </Tag>
              )}
              filters={[
                {
                  text: 'Root Admin',
                  value: 'root_admin',
                },
                {
                  text: 'Admin',
                  value: 'admin',
                },
                {
                  text: 'User',
                  value: 'user',
                },
              ]}
              onFilter={(value, record) =>
                record.role.includes(value as string)
              }
            />
            <Column
              title='Notes'
              dataIndex='notesCount'
              key='notesCount'
              width={100}
              sorter={(a, b) => (a.notesCount ?? 0) - (b.notesCount ?? 0)}
              sortDirections={['descend', 'ascend']}
              defaultSortOrder='descend'
            />
            <Column
              title='Actions'
              key='actions'
              width={100}
              fixed='right'
              render={(_, user: UserId) => (
                <Space size='small'>
                  <UserModal
                    mode='edit'
                    user={user}
                    onDone={handleUserModalDone}
                    triggerText='Edit'
                  />

                  <Popconfirm
                    title='Delete user'
                    description={`Are you sure you want to delete ${user.name}?`}
                    okText='Yes'
                    cancelText='No'
                    okType='danger'
                    onConfirm={() => handleDeleteUser(user.id)}
                  >
                    <Button
                      danger
                      size='small'
                      disabled={user.id === currentUser.id}
                    >
                      Delete
                    </Button>
                  </Popconfirm>
                </Space>
              )}
            />
          </Table>
        </Card>
      </Layout>
    </ConfigProvider>
  );
}
