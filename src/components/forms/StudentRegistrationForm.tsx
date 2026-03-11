import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { teacherAPI } from '@/lib/api';
import { Loader } from 'lucide-react';

import { RegistrationData, Teacher } from '@/types/types';

interface StudentRegistrationFormProps {
  formData: RegistrationData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  showTeacherSelection?: boolean;
}

const StudentRegistrationForm: React.FC<StudentRegistrationFormProps> = ({ 
  formData, 
  onChange, 
  showTeacherSelection = true 
}) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  useEffect(() => {
    if (showTeacherSelection) {
      const fetchTeachers = async () => {
        setLoadingTeachers(true);
        try {
          const resp = await teacherAPI.getAll(1, 100, { status: 'Active' });
          if (resp.success) {
            setTeachers(resp.data);
          }
        } catch (err) {
          console.error('Failed to fetch teachers:', err);
        } finally {
          setLoadingTeachers(false);
        }
      };
      fetchTeachers();
    }
  }, [showTeacherSelection]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Name */}
      <div className="space-y-1.5">
        <Label className="text-sm font-bold text-slate-700 ml-1">Full Name *</Label>
        <Input
          name="name"
          placeholder="Jane Doe"
          value={formData.name}
          onChange={onChange}
          required
          className="h-11 bg-slate-50/50 border-slate-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label className="text-sm font-bold text-slate-700 ml-1">Email Address *</Label>
        <Input
          type="email"
          name="email"
          placeholder="student@example.com"
          value={formData.email}
          onChange={onChange}
          required
          className="h-11 bg-slate-50/50 border-slate-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      {/* Mobile */}
      <div className="space-y-1.5">
        <Label className="text-sm font-bold text-slate-700 ml-1">Mobile *</Label>
        <Input
          type="tel"
          name="phone"
          placeholder="10-digit mobile number"
          value={formData.phone || formData.mobile}
          onChange={onChange}
          required
          className="h-11 bg-slate-50/50 border-slate-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      {/* Parent Email */}
      <div className="space-y-1.5">
        <Label className="text-sm font-bold text-slate-700 ml-1">Parent Email ID *</Label>
        <Input
          type="email"
          name="parentEmailId"
          placeholder="parent@example.com"
          value={formData.parentEmailId}
          onChange={onChange}
          required
          className="h-11 bg-slate-50/50 border-slate-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      {/* Father's Name */}
      <div className="space-y-1.5">
        <Label className="text-sm font-bold text-slate-700 ml-1">Father's Name *</Label>
        <Input
          type="text"
          name="fatherName"
          placeholder="Father's full name"
          value={formData.fatherName}
          onChange={onChange}
          required
          className="h-11 bg-slate-50/50 border-slate-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      {/* Mother's Name */}
      <div className="space-y-1.5">
        <Label className="text-sm font-bold text-slate-700 ml-1">Mother's Name *</Label>
        <Input
          type="text"
          name="motherName"
          placeholder="Mother's full name"
          value={formData.motherName}
          onChange={onChange}
          required
          className="h-11 bg-slate-50/50 border-slate-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      {/* Parent Contact */}
      <div className="space-y-1.5">
        <Label className="text-sm font-bold text-slate-700 ml-1">Parent Contact *</Label>
        <Input
          type="tel"
          name="parentContact"
          placeholder="10-digit mobile number"
          value={formData.parentContact}
          onChange={onChange}
          required
          className="h-11 bg-slate-50/50 border-slate-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      {/* Grade */}
      <div className="space-y-1.5">
        <Label className="text-sm font-bold text-slate-700 ml-1">Grade *</Label>
        <select
          name="grade"
          value={formData.grade}
          onChange={onChange}
          required
          className="w-full h-11 px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="">Select Grade</option>
          {["6", "7", "8", "9", "10", "11", "12", "12thPass", "UG", "FreshGrad", "Professional"].map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Date of Enrollment / Course Name */}
      <div className="space-y-1.5">
        <Label className="text-sm font-bold text-slate-700 ml-1">Course Name</Label>
        <Input
          type="text"
          name="courseName"
          placeholder="e.g., Mathematics, Science"
          value={formData.courseName}
          onChange={onChange}
          className="h-11 bg-slate-50/50 border-slate-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      {/* Preferred Teacher Selection */}
      {showTeacherSelection && (
        <div className="space-y-1.5">
          <Label className="text-sm font-bold text-slate-700 ml-1">Preferred Teacher *</Label>
          <div className="relative">
            <select
              name="preferredTeacherId"
              value={formData.preferredTeacherId}
              onChange={onChange}
              required
              className="w-full h-11 px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none"
              disabled={loadingTeachers}
            >
              <option value="">Select a Teacher</option>
              {teachers.map(t => (
                <option key={t.teacherId} value={t.teacherId}>{t.name}</option>
              ))}
            </select>
            {loadingTeachers && (
              <div className="absolute right-3 top-3">
                <Loader className="h-5 w-5 animate-spin text-slate-400" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Address */}
      <div className="col-span-1 md:col-span-2 space-y-1.5">
        <Label className="text-sm font-bold text-slate-700 ml-1">Address</Label>
        <Input
          type="text"
          name="address"
          placeholder="Full residential address"
          value={formData.address}
          onChange={onChange}
          className="h-11 bg-slate-50/50 border-slate-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      {/* Monthly Fee Amount */}
      <div className="col-span-1 md:col-span-2 space-y-1.5 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
        <Label className="text-sm font-bold text-emerald-800 ml-1">Monthly Fee Amount (₹)</Label>
        <Input
          type="number"
          name="monthlyFeeAmount"
          placeholder="e.g., 3000"
          value={formData.monthlyFeeAmount}
          onChange={onChange}
          required
          min="0"
          className="h-11 bg-white border-emerald-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
        />
        <p className="text-[10px] text-emerald-600 ml-1">Initial fee amount for your selected courses.</p>
      </div>
    </div>
  );
};

export default StudentRegistrationForm;
