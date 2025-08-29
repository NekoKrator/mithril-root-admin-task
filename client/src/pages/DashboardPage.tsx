import { fetchUsers } from '../services/users';
import { useState, useEffect } from 'react';
import type { UserId } from '../types/types';
import AddUserModal from '../components/AddUserModal';
import EditUserModal from '../components/EditUserModal';
import { getCurrentUser, logout } from '../services/auth';
import { useNavigate } from 'react-router';

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

  if (currentUser?.role === 'user') {
    return (
      <div>
        <p>You do not have access to this page.</p>
        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>User Management Dashboard</h2>

      {currentUser?.role === 'root_admin' && (
        <button
          onClick={() => setIsAddModalOpen(true)}
          style={{ marginBottom: '20px', padding: '10px 15px' }}
        >
          Add New User
        </button>
      )}

      <button
        onClick={() => {
          logout();
          navigate('/login');
        }}
        style={{ marginBottom: '20px', padding: '10px 15px' }}
      >
        Logout
      </button>

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
              {currentUser?.role === 'root_admin' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id.slice(0, 8)}...</td>
                <td>{user.email}</td>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>
                  {currentUser?.role === 'root_admin' && (
                    <button onClick={() => handleEditUser(user)}>Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isAddModalOpen && (
        <AddUserModal onDone={load} onClose={() => setIsAddModalOpen(false)} />
      )}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onDone={load}
          onClose={closeEditModal}
        />
      )}
    </div>
  );
}
