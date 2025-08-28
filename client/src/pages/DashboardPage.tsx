import { fetchUsers } from '../services/users';
import { useState, useEffect } from 'react';
import type { UserId } from '../types/types';
import AddUserModal from '../components/AddUserModal';
import EditUserModal from '../components/EditUserModal';
import { canEdit } from '../services/auth';

export default function DashboardPage() {
  const [users, setUsers] = useState<UserId[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserId | null>(null);

  const load = async () => {
    try {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleEditUser = (user: UserId) => {
    setEditingUser(user);
  };

  const closeEditModal = () => {
    setEditingUser(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>User Management Dashboard</h2>
      <button
        onClick={() => setIsAddModalOpen(true)}
        style={{ marginBottom: '20px', padding: '10px 15px' }}
      >
        Add New User
      </button>

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>ID</th>
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>
                Email
              </th>
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>
                Name
              </th>
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>
                Role
              </th>
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                  {user.id.slice(0, 8)}...
                </td>
                <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                  {user.email}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                  {user.name}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                  {user.role}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                  {canEdit() && (
                    <button
                      onClick={() => handleEditUser(user)}
                      style={{ padding: '5px 10px' }}
                    >
                      Edit
                    </button>
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
