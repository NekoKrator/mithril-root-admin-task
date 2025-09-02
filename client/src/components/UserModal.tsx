import { useState } from 'react';
import type { UserFormData, Role, UserModalProps } from '../types/types';
import { Button, Form, Select, Input, Typography, Modal } from 'antd';
import { createUser, updateUser } from '../services/users';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { UserSchema } from '../services/validation';

export default function UserModal(props: UserModalProps) {
  const { onDone, triggerText } = props;
  const mode = props.mode;
  const user = props.mode === 'edit' ? props.user : undefined;
  const [role, setRole] = useState<Role>(user?.role || 'user');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const isEditMode = mode === 'edit';
  const modalTitle = isEditMode ? 'Edit User' : 'Create User';
  const submitButtonText = isEditMode ? 'Update User' : 'Create User';
  const loadingText = isEditMode ? 'Updating...' : 'Creating...';

  const onSubmit = async (values: UserFormData) => {
    const parsed = UserSchema.safeParse(values);
    if (!parsed.success) {
      form.setFields(
        parsed.error.issues.map((issue) => ({
          name: issue.path,
          errors: [issue.message],
        }))
      );
      return;
    }

    setError(null);
    setLoading(true);

    try {
      if (isEditMode && user) {
        await updateUser(user.id, { ...parsed.data, role });
      } else {
        await createUser({ ...parsed.data, role });
      }

      onDone();
      handleCancel();
    } catch {
      setError(`Failed to ${isEditMode ? 'update' : 'create'} user`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setError(null);

    if (!isEditMode) {
      setRole('user');
    }
  };

  const showModal = () => {
    setIsModalOpen(true);

    if (isEditMode && user) {
      form.setFieldsValue({
        email: user.email,
        name: user.name,
        role: user.role,
      });

      setRole(user.role);
    }
  };

  return (
    <>
      <Button type='primary' onClick={showModal}>
        {triggerText || modalTitle}
      </Button>

      <Modal
        title={
          <Typography.Title
            level={3}
            style={{ margin: 0, textAlign: 'center' }}
          >
            {modalTitle}
          </Typography.Title>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        width={400}
        styles={{
          content: {
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            borderRadius: 8,
          },
          body: {
            padding: '24px',
          },
          header: {
            backgroundColor: '#ffffff',
            borderBottom: 'none',
            padding: '24px 24px 0',
          },
        }}
      >
        <Form
          form={form}
          name={isEditMode ? 'editUser' : 'createUser'}
          layout='vertical'
          onFinish={onSubmit}
          autoComplete='off'
        >
          <Form.Item
            label='Email'
            name='email'
            rules={[
              { required: true, message: 'Please input your Email!' },
              { type: 'email', message: 'Invalid email format!' },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder='Email'
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            label='Name'
            name='name'
            rules={[{ required: true, message: 'Please input your Name!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder='Name'
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            label='Password'
            name='password'
            rules={[
              {
                required: !isEditMode,
                message: 'Please input your Password!',
              },
              {
                min: 6,
                message: 'Password must be at least 6 characters!',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={
                isEditMode ? 'Leave blank to keep current password' : 'Password'
              }
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            label='Role'
            name='role'
            initialValue='user'
            rules={[{ required: true, message: 'Please select a role!' }]}
          >
            <Select
              onChange={(value) => setRole(value as Role)}
              disabled={loading}
            >
              <Select.Option value='user'>User</Select.Option>
              <Select.Option value='admin'>Admin</Select.Option>
            </Select>
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
              {loading ? loadingText : submitButtonText}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
