import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { paymentAPI, courseAPI, invoiceAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, CheckCircle } from 'lucide-react';

import { Course, Payment as PaymentData } from '@/types/types';
import { APIError } from '@/lib/api';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedInvoice, setSelectedInvoice] = useState<string>('');
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    paymentMethod: 'bank_transfer',
    transactionId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tab, setTab] = useState<'pay' | 'history'>('pay');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!user) return;
    loadCourses();
    loadInvoices();
    loadPayments();
  }, [user]);

  const loadCourses = async () => {
    try {
      const data = user?.role === 'student'
        ? await courseAPI.getCoursesForStudent()
        : await courseAPI.getAll(1, 100);
      setCourses(data.data || []);
    } catch (err) {
      console.error('Failed to load courses:', err);
    }
  };

  const loadPayments = async () => {
    try {
      const data = await paymentAPI.getMyPayments();
      setPayments(data.data || []);
    } catch (err) {
      console.error('Failed to load payments:', err);
    }
  };

  const loadInvoices = async () => {
    try {
      const data = await invoiceAPI.getMyInvoices();
      setInvoices(data.data || []);
    } catch (err) {
      console.error('Failed to load invoices:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        throw new Error('Please enter a valid amount');
      }

      if (!selectedInvoice && !formData.description) {
        throw new Error('Please enter a description');
      }

      // If an invoice is selected, record payment against it (recommended)
      if (selectedInvoice) {
        const invoicePayResp = await invoiceAPI.payInvoice(selectedInvoice, {
          amountPaid: parseFloat(formData.amount),
          paymentMethod: formData.paymentMethod,
          transactionId: formData.transactionId || undefined
        });
        setSuccess(`Payment of ₹${formData.amount} recorded against invoice successfully.`);
        loadInvoices();
        loadPayments();
        setFormData({ amount: '', description: '', paymentMethod: 'bank_transfer', transactionId: '' });
        setSelectedInvoice('');
        setSelectedCourse('');
        return;
      }

      // Otherwise record a general payment (optional)
      const paymentResponse = await paymentAPI.processPayment({
        courseId: selectedCourse || undefined,
        amount: parseFloat(formData.amount),
        paymentMethod: formData.paymentMethod,
        description: formData.description,
        transactionId: formData.transactionId || undefined
      });

      setSuccess(`Payment of ₹${formData.amount} recorded successfully! Reference: ${paymentResponse.payment?.referenceNumber || paymentResponse.referenceNumber}`);
      setFormData({ amount: '', description: '', paymentMethod: 'bank_transfer', transactionId: '' });
      setSelectedCourse('');
      
      // Reload payments
      loadPayments();

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.data?.message || 'Payment processing failed');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-2">{user?.name}, manage your payments and course purchases</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setTab('pay')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              tab === 'pay'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Make Payment
          </button>
          <button
            onClick={() => setTab('history')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              tab === 'history'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Payment History
          </button>
        </div>

        {/* Make Payment Tab */}
        {tab === 'pay' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    New Payment
                  </CardTitle>
                  <CardDescription>Enter payment details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {success && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">{success}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Invoice (Recommended)</label>
                      <select
                        name="invoiceId"
                        value={selectedInvoice}
                        onChange={(e) => setSelectedInvoice(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select an invoice</option>
                        {invoices
                          .filter((i) => i.status !== 'paid')
                          .map((inv: any) => (
                            <option key={inv._id} value={inv._id}>
                              {inv.invoiceNumber} ({inv.billingMonth}) - Due ₹{Number(inv.remainingAmount || 0).toFixed(0)}
                            </option>
                          ))}
                      </select>
                      <p className="text-xs text-gray-500">
                        Paying an invoice will automatically update your due amount on the dashboard.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Course (Optional)</label>
                      <select
                        name="courseId"
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select a course</option>
                        {courses.map(course => (
                          <option key={course.courseId} value={course.courseId}>
                            {course.subject} - ₹{course.billingRatePerHour || '0'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Amount (INR)</label>
                      <Input
                        type="number"
                        name="amount"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={handleChange}
                        step="1"
                        min="0"
                        required
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Input
                        type="text"
                        name="description"
                        placeholder="Payment description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Payment Method</label>
                      <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="credit_card">Card (Manual Entry)</option>
                      </select>
                    </div>

                    {(formData.paymentMethod === 'bank_transfer' || formData.paymentMethod === 'credit_card') && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Transaction ID (Optional)</label>
                        <Input
                          type="text"
                          name="transactionId"
                          value={formData.transactionId}
                          onChange={handleChange}
                          placeholder="Bank ref / UPI ref / receipt no."
                          className="w-full"
                        />
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? 'Processing...' : 'Pay Now'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="text-2xl font-bold">₹{formData.amount || '0.00'}</p>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-medium capitalize">{formData.paymentMethod.replace('_', ' ')}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Payment History Tab */}
        {tab === 'history' && (
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Your recent transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No payments found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-sm">Reference</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">Description</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map(payment => (
                        <tr key={payment._id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm font-mono">{payment.referenceNumber}</td>
                          <td className="py-3 px-4 text-sm font-semibold">₹{payment.amount.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {payment.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm">{payment.description}</td>
                          <td className="py-3 px-4 text-sm">{new Date(payment.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Payment;
