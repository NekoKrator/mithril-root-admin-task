import {
  Button,
  Form,
  DatePicker,
  Input,
  Typography,
  Modal,
  Switch,
  Space,
} from 'antd';
import { BookOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import type { NoteModalProps, Note } from '../types/types';
import { useState } from 'react';
import { createNote, updateNote } from '../services/note';
import dayjs from 'dayjs';
import TextArea from 'antd/es/input/TextArea';

export default function NoteModal(props: NoteModalProps) {
  const { onDone, triggerText } = props;
  const mode = props.mode;
  const note = props.mode === 'edit' ? props.note : undefined;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dateToggle, setDateToggle] = useState(false);

  const [form] = Form.useForm();

  const isEditMode = mode === 'edit';
  const modalTitle = isEditMode ? 'Edit This Note' : 'Create New Note';
  const submitButtonText = isEditMode ? 'Update Note' : 'Create Note';
  const loadingText = isEditMode ? 'Updating...' : 'Loading...';

  const onSubmit = async (values: Note) => {
    setError(null);
    setLoading(true);

    try {
      const payload = {
        ...values,
        reminderDate: values.reminderDate ? values.reminderDate : null,
      };

      if (isEditMode && note) {
        console.log(payload);
        await updateNote(note.id, { ...payload });
      } else {
        console.log(payload);
        await createNote({ ...payload });
      }

      onDone();
      handleCancel();
    } catch {
      setError(`Failed to ${isEditMode ? 'update' : 'create'} note`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setError(null);
  };

  const showModal = () => {
    setIsModalOpen(true);

    if (isEditMode && note) {
      form.setFieldsValue({
        title: note.title,
        content: note.content,
        reminderDate: note?.reminderDate ? dayjs(note.reminderDate) : undefined,
      });
    }
  };

  return (
    <>
      <Button
        type='primary'
        size={isEditMode ? 'small' : 'middle'}
        onClick={showModal}
      >
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
          header: {
            backgroundColor: '#ffffff',
            borderBottom: 'none',
          },
        }}
      >
        <Form
          form={form}
          name={isEditMode ? 'editNote' : 'createNote'}
          layout='vertical'
          onFinish={onSubmit}
          autoComplete='off'
        >
          <Form.Item
            label='Title'
            name='title'
            rules={[{ required: true, message: "Please input note's title" }]}
          >
            <Input
              prefix={<BookOutlined />}
              placeholder='Title'
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            label='Content'
            name='content'
            rules={[{ required: true, message: "Please input note's content" }]}
          >
            <TextArea rows={5} placeholder='Content' disabled={loading} />
          </Form.Item>

          <Form.Item label='Reminder Date' name='reminderDate'>
            <Space>
              <Space>
                <Typography.Text type='secondary'>
                  Add reminder?
                </Typography.Text>
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  onChange={() =>
                    dateToggle ? setDateToggle(false) : setDateToggle(true)
                  }
                />
              </Space>
              <DatePicker showTime disabled={loading || dateToggle} />
            </Space>
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
