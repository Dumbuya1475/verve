'use client';

import { useState } from 'react';

export default function CoverPage() {
  const [type, setType] = useState<'Individual' | 'Group'>('Individual');
  const [formData, setFormData] = useState({
    university: 'Limkokwing University',
    faculty: 'Faculty of Information and Communication Technology',
    courseCode: 'COMP2101',
    courseTitle: 'Software Engineering',
    assignmentTitle: 'Assignment 1',
    issueDate: '2023-10-12',
    dueDate: '2023-11-15',
    lecturer: 'Dr. Sarah Johnson',
    className: 'CS-3A',
    semester: 'Semester 2 / 1',
    studentName: 'Mohamed Super Dumbuya ',
    studentId: '90500xxxx',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full max-h-[85vh]">
      {/* Left Pane: Input Form */}
      <section className="w-full md:w-5/12 flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-foreground">Cover Page Details</h1>
          <p className="text-secondary text-base">Fill in your assignment information to generate a professional cover.</p>
        </div>

        {/* Toggle Selector */}
        <div className="bg-surface p-1 rounded-xl flex shadow-sm border border-outline-variant/30">
          <button
            onClick={() => setType('Individual')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${type === 'Individual' ? 'bg-surface-strong shadow-sm text-foreground' : 'text-secondary hover:text-foreground'
              }`}
          >
            Individual
          </button>
          <button
            onClick={() => setType('Group')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${type === 'Group' ? 'bg-surface-strong shadow-sm text-foreground' : 'text-secondary hover:text-foreground'
              }`}
          >
            Group
          </button>
        </div>

        <form className="flex flex-col gap-4 pb-8">
          <div className="grid grid-cols-1 gap-4">
            {/* University Name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-secondary">University Name</label>
              <input
                name="university"
                className="bg-surface border border-outline-variant/30 rounded-control px-4 py-2 focus-ring focus:bg-surface-strong transition-all text-base"
                type="text"
                value={formData.university}
                onChange={handleChange}
              />
            </div>

            {/* Faculty */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-secondary">Faculty</label>
              <input
                name="faculty"
                className="bg-surface border border-outline-variant/30 rounded-control px-4 py-2 focus-ring focus:bg-surface-strong transition-all text-base"
                type="text"
                value={formData.faculty}
                onChange={handleChange}
              />
            </div>

            {/* Course Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-secondary">Course Code</label>
                <input
                  name="courseCode"
                  className="bg-surface border border-outline-variant/30 rounded-control px-4 py-2 focus-ring focus:bg-surface-strong transition-all text-base"
                  type="text"
                  value={formData.courseCode}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-secondary">Course Title</label>
                <input
                  name="courseTitle"
                  className="bg-surface border border-outline-variant/30 rounded-control px-4 py-2 focus-ring focus:bg-surface-strong transition-all text-base"
                  type="text"
                  value={formData.courseTitle}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Assignment Title */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-secondary">Assignment Title</label>
              <input
                name="assignmentTitle"
                className="bg-surface border border-outline-variant/30 rounded-control px-4 py-2 focus-ring focus:bg-surface-strong transition-all text-base"
                type="text"
                value={formData.assignmentTitle}
                onChange={handleChange}
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-secondary">Issue Date</label>
                <input
                  name="issueDate"
                  className="bg-surface border border-outline-variant/30 rounded-control px-4 py-2 focus-ring focus:bg-surface-strong transition-all text-base"
                  type="date"
                  value={formData.issueDate}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-secondary">Due Date</label>
                <input
                  name="dueDate"
                  className="bg-surface border border-outline-variant/30 rounded-control px-4 py-2 focus-ring focus:bg-surface-strong transition-all text-base"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Faculty/Academic Roles */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-secondary">Lecturer/Examiner</label>
              <input
                name="lecturer"
                className="bg-surface border border-outline-variant/30 rounded-control px-4 py-2 focus-ring focus:bg-surface-strong transition-all text-base"
                type="text"
                value={formData.lecturer}
                onChange={handleChange}
              />
            </div>

            {/* Class & Semester */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-secondary">Class</label>
                <input
                  name="className"
                  className="bg-surface border border-outline-variant/30 rounded-control px-4 py-2 focus-ring focus:bg-surface-strong transition-all text-base"
                  type="text"
                  value={formData.className}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-secondary">Semester/Year</label>
                <input
                  name="semester"
                  className="bg-surface border border-outline-variant/30 rounded-control px-4 py-2 focus-ring focus:bg-surface-strong transition-all text-base"
                  type="text"
                  value={formData.semester}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-secondary">Student Name</label>
                <input
                  name="studentName"
                  className="bg-surface border border-outline-variant/30 rounded-control px-4 py-2 focus-ring focus:bg-surface-strong transition-all text-base"
                  type="text"
                  value={formData.studentName}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-secondary">Student ID</label>
                <input
                  name="studentId"
                  className="bg-surface border border-outline-variant/30 rounded-control px-4 py-2 focus-ring focus:bg-surface-strong transition-all text-base"
                  type="text"
                  value={formData.studentId}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </form>
      </section>

      {/* Right Pane: Live Preview */}
      <section className="w-full md:w-7/12 flex flex-col gap-4 print:w-full print:block">
        <div className="flex justify-between items-center print:hidden">
          <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider">Preview</h2>
          <div className="flex gap-2">
            <button className="bg-secondary-container text-secondary p-2 rounded-control hover:bg-outline-variant/30 transition-colors">
              <span className="material-symbols-outlined align-middle">zoom_in</span>
            </button>
            <button
              onClick={handlePrint}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-control text-sm font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-soft"
            >
              <span className="material-symbols-outlined text-[20px]">download</span>
              Download PDF
            </button>
          </div>
        </div>

        {/* A4 Preview Container */}
        <div className="bg-surface rounded-container p-6 flex justify-center h-full overflow-y-auto print:p-0 print:bg-transparent">
          <div
            className="w-full max-w-[595px] p-[60px] flex flex-col text-[#000000] bg-white print:shadow-none print:max-w-none"
            style={{ aspectRatio: '1 / 1.414', boxShadow: '0px 4px 20px -2px rgba(28, 25, 23, 0.08)', fontFamily: 'Times New Roman, serif', lineHeight: '1.2' }}
          >
            {/* Institutional Header */}
            <div className="bg-black text-white px-4 py-6 mb-8 flex flex-col items-center">
              <h3 className="font-bold text-[24px] uppercase tracking-[0.1em] text-center">{formData.university || 'UNIVERSITY NAME'}</h3>
              <p className="text-[12px] uppercase tracking-widest mt-1 opacity-80">Of Creative Technology</p>
            </div>

            <div className="w-full h-[1px] bg-black mb-8"></div>

            {/* Faculty and Course Info */}
            <div className="text-center mb-8">
              <p className="text-[16px] font-bold uppercase mb-1">{formData.faculty}</p>
              <p className="text-[14px] uppercase mb-6">{formData.courseCode} {formData.courseTitle}</p>
            </div>

            {/* Assignment Title Header */}
            <div className="text-center mb-8 border-y border-black py-4">
              <h4 className="text-[20px] font-bold uppercase">{formData.assignmentTitle}</h4>
            </div>

            {/* Details Table */}
            <table className="w-full text-[13px] border-collapse mb-8 text-left">
              <tbody>
                <tr>
                  <td className="py-2 font-bold w-[140px] align-top">Lecturer Name</td>
                  <td className="py-2 w-[20px] text-center align-top">:</td>
                  <td className="py-2 align-top">{formData.lecturer}</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold align-top">Student Name</td>
                  <td className="py-2 text-center align-top">:</td>
                  <td className="py-2 align-top">{formData.studentName}</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold align-top">Student ID</td>
                  <td className="py-2 text-center align-top">:</td>
                  <td className="py-2 align-top">{formData.studentId}</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold align-top">Class</td>
                  <td className="py-2 text-center align-top">:</td>
                  <td className="py-2 align-top">{formData.className}</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold align-top">Date of Issue</td>
                  <td className="py-2 text-center align-top">:</td>
                  <td className="py-2 align-top">{formData.issueDate}</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold align-top">Date of Submission</td>
                  <td className="py-2 text-center align-top">:</td>
                  <td className="py-2 align-top">{formData.dueDate}</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold align-top">Semester / Year</td>
                  <td className="py-2 text-center align-top">:</td>
                  <td className="py-2 align-top">{formData.semester}</td>
                </tr>
              </tbody>
            </table>

            <p className="text-[10px] italic text-center mb-8 px-4 opacity-80 leading-relaxed">
              I hereby declare that this assignment is my own work and has not been submitted in any other context.
              All sources of information and data used have been properly acknowledged.
            </p>

            {/* Grading Box */}
            <div className="mt-auto border-2 border-black p-4 flex">
              <div className="w-1/2 border-r border-black/30 pr-4 flex flex-col">
                <p className="text-[11px] font-bold uppercase mb-16">Lecturer's Comments:</p>
                <div className="mt-auto">
                  <div className="w-full h-[1px] bg-black mb-1"></div>
                  <p className="text-[9px] uppercase">Signature</p>
                </div>
              </div>
              <div className="w-1/2 pl-4 flex flex-col items-center justify-center">
                <p className="text-[11px] font-bold uppercase mb-4">Grade / Mark</p>
                <div className="w-[80px] h-[80px] border border-black"></div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
