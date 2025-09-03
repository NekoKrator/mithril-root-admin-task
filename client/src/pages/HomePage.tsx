import { useCallback, useEffect, useState } from 'react';
import { getCurrentUser } from '../services/auth';
import { getNotes, deleteNote } from '../services/note';
import NoteModal from '../components/NoteModal';
import type { NoteId } from '../types/types';
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
} from 'antd';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

export default function Home() {
  const [notes, setNotes] = useState<NoteId[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState<NoteId | null>(null);

  const currentUser = getCurrentUser();

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

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

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

  return (
    <ConfigProvider>
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
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24,
              }}
            >
              <Typography.Paragraph style={{ marginBottom: 16 }}>
                Welcome, <strong>{currentUser.email}</strong> (
                {currentUser.role})
              </Typography.Paragraph>

              <NoteModal
                mode='create'
                onDone={handleNoteModalDone}
                triggerText='Add New Note'
              />
            </div>

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
                      onClick={() => setSelectedNote(note)}
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
              <Empty />
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
                {format(selectedNote.reminderDate, 'PPP, HH:mm', {
                  locale: enUS,
                })}
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
