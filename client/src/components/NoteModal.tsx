import { Button, Form, DatePicker, Input, Typography, Modal } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import type { NoteModalProps, Note } from '../types/types';
import type { DatePickerProps } from 'antd';
import { useState } from 'react';
import { createNote, updateNote } from '../services/note';
import dayjs from 'dayjs';
import TextArea from 'antd/es/input/TextArea';

export default function NoteModal(props: NoteModalProps) {
  const { onDone, triggerText } = props;
  const mode = props.mode;
  const note = props.mode === 'edit' ? props.note : undefined;
  const [reminderDate, setReminderDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const isEditMode = mode === 'edit';
  const modalTitle = isEditMode ? 'Edit Note' : 'Create Note';
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
        await updateNote(note.id, { ...payload });
      } else {
        values.reminderDate = reminderDate;

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

  const onChange: DatePickerProps['onChange'] = (_, date) => {
    setReminderDate(new Date(String(date)));
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
            Create Note
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
            <DatePicker showTime disabled={loading} onChange={onChange} />
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
