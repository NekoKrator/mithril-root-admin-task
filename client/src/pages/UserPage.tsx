import { useParams } from 'react-router';
import { useState, useEffect, useCallback } from 'react';
import type { UserId, NoteId } from '../types/types';
import { findUser } from '../services/user';
import {
  Layout,
  Card,
  Typography,
  ConfigProvider,
  Row,
  Col,
  Empty,
  Spin,
  Modal,
  Flex,
} from 'antd';
import { getNotes } from '../services/note';

export default function UserPage() {
  const [user, setUser] = useState<UserId | null>(null);
  const [notes, setNotes] = useState<NoteId[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState<NoteId | null>(null);
  const { userId } = useParams();

  const loadUser = useCallback(async () => {
    setLoading(true);

    try {
      const fetchedUser = await findUser(userId!);
      setUser(fetchedUser);
    } catch (error) {
      console.error('Failed to find user:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const loadNotes = useCallback(async () => {
    setLoading(true);

    try {
      const fetchedNotes = await getNotes(userId!);
      setNotes(fetchedNotes);
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // useEffect(() => {
  //   if (currentUser.id === userId) {
  //     navigate('/');
  //   } else {
  //     loadUser();
  //     loadNotes();
  //   }
  // }, [currentUser, userId, loadUser, loadNotes, navigate]);

  useEffect(() => {
    loadUser();
    loadNotes();
  }, [loadUser, loadNotes]);

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
                {user ? `${user?.email}'s notes` : 'User Not Found'}
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
            {user && Object.keys(notes).length > 0 ? (
              <Spin spinning={loading}>
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
                          transition:
                            'transform 0.2s ease, box-shadow 0.2s ease',
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
              </Spin>
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
          footer='You can just read'
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
