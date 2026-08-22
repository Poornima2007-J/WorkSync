import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProfileViewModal from '../components/ProfileViewModal';
import UserAvatar from '../components/UserAvatar';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Mail,
  Phone,
  Building,
  Shield,
  User,
  X,
  Eye
} from 'lucide-react';

const EmployeeDirectoryPage = () => {
  const { isHR, user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  // Modal States
  const [viewingEmp, setViewingEmp] = useState(null);
  const [editingEmp, setEditingEmp] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    department: '',
    designation: '',
    phone: '',
    address: '',
    role: 0
  });

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/employee/all?search=${search}&department=${selectedDept}`);
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [search, selectedDept]);

  const handleOpenEdit = (emp) => {
    setEditingEmp(emp);
    setEditForm({
      firstName: emp.firstName,
      lastName: emp.lastName,
      department: emp.department,
      designation: emp.designation,
      phone: emp.phone,
      address: emp.address,
      role: emp.role === 'HR' || emp.role === 1 ? 1 : 0
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/employee/profile/${editingEmp.userId}`, {
        ...editForm,
        role: parseInt(editForm.role)
      });
      alert('Employee profile updated successfully!');
      setEditingEmp(null);
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update employee profile.');
    }
  };

  const departments = ['All', 'Engineering', 'UI/UX Design', 'Human Resources', 'Product Operations', 'Finance'];

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={24} color="#2563eb" />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Employee Profile Directory</h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Search and view complete employee profiles, designations, contact details, and role permissions.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2rem', width: '220px' }}
            />
          </div>

          <select
            className="form-input"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            style={{ width: '160px' }}
          >
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Directory Grid matching wireframe Row 2 */}
      {loading ? (
        <div className="card">Loading employee directory...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {employees.map((emp) => (
            <div key={emp.userId} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <UserAvatar src={emp.avatarUrl} name={`${emp.firstName} ${emp.lastName}`} size={54} />
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                    {emp.firstName} {emp.lastName}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--primary-600)', fontWeight: 600 }}>{emp.designation}</p>
                  <span className="badge badge-info" style={{ fontSize: '0.65rem', marginTop: '0.25rem' }}>
                    {emp.department}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', color: 'var(--text-muted)', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={14} /> {emp.email}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={14} /> {emp.phone || '+91 98000 00000'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Shield size={14} /> Role: <strong>{emp.role === 1 || emp.role === 'HR' ? 'HR Officer / Admin' : 'Employee'}</strong> ({emp.employeeId})
                </div>
              </div>

              {/* Action Buttons matching wireframe Row 2 */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  onClick={() => setViewingEmp(emp)}
                  className="btn btn-primary"
                  style={{ fontSize: '0.75rem', padding: '0.4rem 0.65rem', flex: 1 }}
                >
                  <Eye size={12} /> View Profile
                </button>

                {isHR && (
                  <button
                    onClick={() => handleOpenEdit(emp)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.4rem 0.65rem', flex: 1 }}
                  >
                    <Edit2 size={12} /> Edit Profile
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Profile Modal */}
      {viewingEmp && (
        <ProfileViewModal
          employee={viewingEmp}
          onClose={() => setViewingEmp(null)}
          onProfileUpdated={fetchEmployees}
        />
      )}

      {/* Edit Employee Modal matching wireframe Row 2 */}
      {editingEmp && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Edit Profile - {editingEmp.employeeId}</h3>
              <button onClick={() => setEditingEmp(null)} className="btn btn-secondary" style={{ padding: '0.35rem 0.6rem' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Designation</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.designation}
                    onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Role Privileges</label>
                  <select
                    className="form-input"
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  >
                    <option value={0}>Employee</option>
                    <option value={1}>HR / Admin Officer</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  className="form-input"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setEditingEmp(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDirectoryPage;
