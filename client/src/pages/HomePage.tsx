import { useCallback, useEffect, useState } from 'react';
import { getCurrentUser } from '../services/auth';
import { getNotes, deleteNote } from '../services/note';
import NoteModal from '../components/NoteModal';
import type { NoteId, Visit } from '../types/types';
import {
  Layout,
  Card,
  Typography,
  Button,
  Popconfirm,
  ConfigProvider,
  Row,
  Col,
  Space,
  Spin,
  Modal,
  Empty,
  Flex,
  notification,
} from 'antd';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { getVisits } from '../services/visti';

export default function Home() {
  const [notes, setNotes] = useState<NoteId[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState<NoteId | null>(null);
  const [visitedNotes, setvisitedNotes] = useState({});
  const [api, contextHolder] = notification.useNotification();

  const currentUser = getCurrentUser();

  const getAllVisits = useCallback(async () => {
    try {
      const visits = await getVisits();
      const visitMap = new Map();

      visits.forEach((visit: Visit) => {
        const id = visit.note?.id || visit.noteId;
        visitMap.set(id, (visitMap.get(id) || 0) + 1);
      });

      setvisitedNotes(Object.fromEntries(visitMap));
    } catch (error) {
      console.error(error);
    }
  }, []);
  console.log(visitedNotes);

  const loadNotes = useCallback(async () => {
    setLoading(true);

    try {
      const fetchedNotes = await getNotes(currentUser.id);
      setNotes(fetchedNotes);
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser.id]);

  const handleNoteModalDone = useCallback(() => {
    loadNotes();
  }, [loadNotes]);

  const handleDeleteNote = useCallback(
    async (id: string) => {
      try {
        await deleteNote(id);
        loadNotes();
      } catch (error) {
        console.error(`Failed to delete note:`, error);
      }
    },
    [loadNotes]
  );

  const handleCopy = async (note: NoteId) => {
    try {
      await navigator.clipboard.writeText(
        `${import.meta.env.VITE_CLIENT_URL}note/${note.id}`
      );
    } catch (error) {
      console.error('Failed to copy text: ', error);
    }
  };

  const visitNotifications = useCallback(() => {
    api.open({
      message: 'New Notification',
      description: 'This is a push notification from Ant Design.',
      placement: 'bottomRight',
    });
  }, [api]);

  useEffect(() => {
    loadNotes();
    getAllVisits();
    visitNotifications();
  }, [loadNotes, getAllVisits, visitNotifications]);

  return (
    <ConfigProvider>
      {contextHolder}
      <Layout
        style={{
          minHeight: '100vh',
          background: '#ededed',
          padding: 24,
        }}
      >
        <Spin spinning={loading}>
          <Card
            title={
              <Typography.Title level={3} style={{ margin: 0 }}>
                My Notes
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
              justify='space-between'
              align='center'
            >
              <Typography.Paragraph style={{ margin: 0 }}>
                Welcome, <strong>{currentUser.email}</strong> (
                {currentUser.role})
              </Typography.Paragraph>

              <NoteModal
                mode='create'
                onDone={handleNoteModalDone}
                triggerText='Add New Note'
              />
            </Flex>

            {notes.length > 0 ? (
              <Row gutter={[16, 16]}>
                {notes.map((note) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={note.id}>
                    <Card
                      title={note.title}
                      bordered
                      hoverable
                      style={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      }}
                      bodyStyle={{ flex: 1, cursor: 'pointer' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.03)';
                        e.currentTarget.style.boxShadow =
                          '0 8px 20px rgba(0,0,0,0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      onClick={() => {
                        setSelectedNote(note);
                      }}
                      extra={
                        <Space
                          size='small'
                          onClick={(e) => e.stopPropagation()}
                        >
                          <NoteModal
                            mode='edit'
                            note={note}
                            onDone={handleNoteModalDone}
                            triggerText='Edit'
                          />
                          <Button size='small' onClick={() => handleCopy(note)}>
                            Copy
                          </Button>
                          <Popconfirm
                            title='Delete note'
                            description={`Are you sure you want to delete "${note.title}"?`}
                            okText='Yes'
                            cancelText='No'
                            okType='danger'
                            onConfirm={() => handleDeleteNote(note.id)}
                          >
                            <Button danger size='small'>
                              Delete
                            </Button>
                          </Popconfirm>
                        </Space>
                      }
                    >
                      <Typography.Paragraph
                        ellipsis={{ rows: 4, expandable: false }}
                      >
                        {note.content}
                      </Typography.Paragraph>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Flex justify='center' align='center' style={{ height: '70vh' }}>
                <Empty description='No data available' />
              </Flex>
            )}
          </Card>
        </Spin>

        <Modal
          open={!!selectedNote}
          title={
            <Typography.Title
              level={3}
              style={{ margin: 0, textAlign: 'left' }}
            >
              {selectedNote?.title}
            </Typography.Title>
          }
          footer={
            selectedNote?.reminderDate ? (
              <Typography.Paragraph
                style={{
                  whiteSpace: 'pre-wrap',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                {selectedNote.isSent
                  ? `The reminder was sent at ${format(
                      selectedNote.reminderDate,
                      'PPP, HH:mm',
                      { locale: enUS }
                    )}`
                  : `A reminder will be sent at ${format(
                      selectedNote.reminderDate,
                      'PPP, HH:mm',
                      { locale: enUS }
                    )}`}
              </Typography.Paragraph>
            ) : null
          }
          onCancel={() => setSelectedNote(null)}
          centered
          width={800}
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
          <Typography.Paragraph style={{ whiteSpace: 'pre-wrap' }}>
            {selectedNote?.content}
          </Typography.Paragraph>
        </Modal>
      </Layout>
    </ConfigProvider>
  );
}
