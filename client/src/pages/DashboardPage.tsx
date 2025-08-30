import { fetchUsers } from '../services/users';
import { useState, useEffect } from 'react';
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

  const load = async () => {
    try {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'root_admin' || currentUser?.role === 'admin') {
      load();
    }
  }, [currentUser]);

  const handleEditUser = (user: UserId) => {
    setEditingUser(user);
  };

  const closeEditModal = () => {
    setEditingUser(null);
  };

  return (
    <div className={styles.background}>
      <div className={styles.header}>
        <h1 className={styles.title}>User Management Dashboard</h1>
        <p className={styles.greetings}>
          Hello, <span className={styles.important}>{currentUser.email}</span>!
          You have the role of{' '}
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
                  <td>
                    <button
                      className={styles.editBtn}
                      onClick={() => handleEditUser(user)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {isAddModalOpen && (
          <AddUserModal
            onDone={load}
            onClose={() => setIsAddModalOpen(false)}
          />
        )}
        {editingUser && (
          <EditUserModal
            user={editingUser}
            onDone={load}
            onClose={closeEditModal}
          />
        )}
      </div>
    </div>
  );
}
