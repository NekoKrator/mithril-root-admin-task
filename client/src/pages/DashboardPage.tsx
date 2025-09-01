import { fetchUsers, deleteUser } from '../services/users';
import { useState, useEffect, useCallback } from 'react';
import type { UserId } from '../types/types';
import AddUserModal from '../components/AddUserModal';
import EditUserModal from '../components/EditUserModal';
import { getCurrentUser, logout } from '../services/auth';
import { useNavigate } from 'react-router';
import styles from '../css/DashboardPage.module.css';

export default function DashboardPage() {
  const [users, setUsers] = useState<UserId[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserId | null>(null);

  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const loadUsers = useCallback(async () => {
    try {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  }, []);

  const handleEditUser = (user: UserId) => {
    setEditingUser(user);
  };

  const handleDeleteUser = useCallback(
    async (id: string, email: string) => {
      if (!window.confirm(`Are you sure you want to delete ${email}?`)) return;

      try {
        await deleteUser(id);
        await loadUsers();
      } catch (error) {
        console.error(`Failed to delete ${email}:`, error);
      }
    },
    [loadUsers]
  );

  const closeEditModal = () => {
    setEditingUser(null);
  };

  useEffect(() => {
    if (currentUser?.role === 'root_admin' || currentUser?.role === 'admin') {
      loadUsers();
    }
  }, [currentUser, loadUsers]);

  return (
    <div className={styles.background}>
      <div className={styles.header}>
        <h1 className={styles.title}>User Management Dashboard</h1>
        <p className={styles.greetings}>
          Welcome, <span className={styles.important}>{currentUser.email}</span>
          ! You are logged in as{' '}
          <span className={styles.important}>{currentUser.role}</span>!
        </p>
      </div>

      <div className={styles.dashboard}>
        <div className={styles.actions}>
          <button
            className={styles.primaryBtn}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add New User
          </button>

          <button
            className={styles.secondaryBtn}
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Logout
          </button>
        </div>

        {users.length === 0 ? (
          <p>No users found</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Name</th>
                <th>Role</th>
                {currentUser?.role === 'root_admin' && <th>Created By</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  {currentUser?.role === 'root_admin' && (
                    <td>{user.createdBy ? user.createdBy.email : 'System'}</td>
                  )}
                  <td>
                    <div className={styles.rowActions}>
                      <button
                        className={styles.primaryBtn}
                        onClick={() => handleEditUser(user)}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteUser(user.id, user.email)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {isAddModalOpen && (
          <AddUserModal
            onDone={loadUsers}
            onClose={() => setIsAddModalOpen(false)}
          />
        )}
        {editingUser && (
          <EditUserModal
            user={editingUser}
            onDone={loadUsers}
            onClose={closeEditModal}
          />
        )}
      </div>
    </div>
  );
}
