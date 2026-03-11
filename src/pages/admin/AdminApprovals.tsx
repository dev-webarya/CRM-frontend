import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Mail, Phone, User, AlertCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { authAPI } from '@/lib/api';
import { toast } from 'sonner';

interface PendingUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'teacher' | 'student';
  createdAt: string;
}

import { APIError } from '@/lib/api';

const AdminApprovals: React.FC = () => {
  const { user } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [approving, setApproving] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getPendingApprovals();
      setPendingUsers(response.data || []);
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.data?.message || 'Failed to fetch pending approvals');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      setApproving(userId);
      await authAPI.approveUser(userId);
      
      // Remove from pending list
      setPendingUsers(pendingUsers.filter(u => u._id !== userId));
      toast.success('User approved successfully');
      setError('');
    } catch (err) {
      if (err instanceof APIError) {
        const msg = err.data?.message || 'Failed to approve user';
        setError(msg);
        toast.error(msg);
      } else {
        setError('An unexpected error occurred. Please try again.');
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setApproving(null);
    }
  };

  const handleReject = async (userId: string) => {
    if (!window.confirm('Are you sure you want to reject this registration?')) return;
    
    try {
      setRejecting(userId);
      await authAPI.rejectUser(userId);
      
      // Remove from pending list
      setPendingUsers(pendingUsers.filter(u => u._id !== userId));
      toast.success('User rejected and removed');
      setError('');
    } catch (err) {
      if (err instanceof APIError) {
        const msg = err.data?.message || 'Failed to reject user';
        setError(msg);
        toast.error(msg);
      } else {
        setError('An unexpected error occurred. Please try again.');
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setRejecting(null);
    }
  };

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
          <p className="text-gray-600 mt-2">Only admin can access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading pending approvals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Approvals</h1>
          <p className="text-gray-600 mt-2">Manage pending teacher and student registrations</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Pending Count */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Pending Approvals</p>
              <p className="text-3xl font-bold text-blue-600">{pendingUsers.length}</p>
            </div>
            <Clock className="w-12 h-12 text-blue-300" />
          </div>
        </div>

        {/* Pending Users List */}
        {pendingUsers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">No Pending Approvals</h3>
            <p className="text-gray-600 mt-2">All registrations have been processed!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingUsers.map((pendingUser) => (
              <div key={pendingUser._id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  {/* Name */}
                  <div>
                    <div className="flex items-center text-gray-600 text-sm mb-1">
                      <User className="w-4 h-4 mr-2" />
                      Name
                    </div>
                    <p className="font-semibold text-gray-900">{pendingUser.name}</p>
                  </div>

                  {/* Email */}
                  <div>
                    <div className="flex items-center text-gray-600 text-sm mb-1">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </div>
                    <p className="font-semibold text-gray-900 break-all">{pendingUser.email}</p>
                  </div>

                  {/* Phone */}
                  <div>
                    <div className="flex items-center text-gray-600 text-sm mb-1">
                      <Phone className="w-4 h-4 mr-2" />
                      Phone
                    </div>
                    <p className="font-semibold text-gray-900">
                      {pendingUser.phone || 'Not provided'}
                    </p>
                  </div>

                  {/* Role */}
                  <div>
                    <div className="flex items-center text-gray-600 text-sm mb-1">
                      <Clock className="w-4 h-4 mr-2" />
                      Role
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      pendingUser.role === 'teacher' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {pendingUser.role}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-4 border-t border-gray-100 gap-4">
                  <div className="text-sm text-gray-500">
                    Registered on {new Date(pendingUser.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => handleReject(pendingUser._id)}
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      disabled={rejecting === pendingUser._id || approving === pendingUser._id}
                    >
                      {rejecting === pendingUser._id ? (
                        <Loader className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-2" />
                      )}
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleApprove(pendingUser._id)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      disabled={rejecting === pendingUser._id || approving === pendingUser._id}
                    >
                      {approving === pendingUser._id ? (
                        <Loader className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Approve
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApprovals;
