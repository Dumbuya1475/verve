'use client';

import { useState, useEffect } from 'react';

const PreviewA4 = ({ type, formData, groupMembers }: any) => (
  <div
    className="w-[595px] min-h-[841px] shrink-0 p-[50px] flex flex-col text-[#000000] bg-white print:shadow-none print:max-w-none print:!zoom-100"
    style={{ 
      boxShadow: '0px 4px 20px -2px rgba(28, 25, 23, 0.08)', 
      fontFamily: 'Arial, sans-serif', 
      lineHeight: '1.2',
      zoom: 'min(1, calc((100vw - 32px) / 595))'
    }}
  >
    {/* Logo */}
    <div className="flex justify-center mb-6">
      <img src="/cover_logo/LUCT.jpeg" alt="LUCT Logo" className="h-24 object-contain" />
    </div>

    {/* Faculty */}
    <div className="text-center mb-4">
      <h2 className="text-[16px] font-bold uppercase">{formData.faculty}</h2>
    </div>

    {/* Course Code and Title */}
    <div className="border-y-[3px] border-black py-2 mb-6 text-center">
      <h3 className="text-[16px] font-bold uppercase">{formData.courseCode}: {formData.courseTitle}</h3>
    </div>

    {/* Details Grid */}
    <div className="grid grid-cols-[140px_10px_1fr] gap-y-[6px] text-[13px] mb-6 font-medium">
      <span>Title</span><span>:</span><span>{formData.assignmentTitle}</span>
      <span>Issue Date</span><span>:</span><span>{formData.issueDate}</span>
      <span>Due Date</span><span>:</span><span>{formData.dueDate}</span>
      <span>Lecturer/Examiner</span><span>:</span><span>{formData.lecturer}</span>
      
      {type === 'Individual' && (
        <>
          <span>Name of Student</span><span>:</span><span>{formData.studentName}</span>
          <span>Student ID No.</span><span>:</span><span>{formData.studentId}</span>
        </>
      )}
      
      <span>Class</span><span>:</span><span>{formData.className}</span>
      <span>Semester/Year</span><span>:</span><span>{formData.semester}</span>
    </div>

    {/* Attestation & Signatures / Group Table */}
    {type === 'Individual' ? (
      <>
        <p className="text-[11px] leading-[1.35] text-justify mb-6">
          I, hereby attest that contents of this attachment are my own work. Referenced works, articles, art,
          programs, papers or parts thereof are acknowledged at the end of this paper. This includes data
          excerpted from CD-ROMs, the Internet, other private networks, and other people's disk of the
          computer system.
        </p>
        <div className="flex justify-between text-[12px] mb-1 px-1">
          <span>Student's Signature : </span>
          <span className="pr-16">Date:</span>
        </div>
      </>
    ) : (
      <>
        <div className="w-full border-t border-dashed border-gray-400 my-2"></div>
        <p className="text-[13px] mb-2">Academic Honesty Policy Statement</p>
        <div className="w-full border-t-[3px] border-black mb-2"></div>
        <p className="text-[11px] leading-[1.35] text-justify mb-2">
          I/we, hereby attest that contents of this attachment are my own work. Referenced works, articles, art, programs, papers or parts thereof are acknowledged at the end of this paper. This includes data excerpted from CD-ROMs, the Internet, other private networks, and other people's disk of the computer system.
        </p>
        <div className="flex justify-between text-[12px] mb-2 px-1">
          <span>Student's Signature:</span>
          <span className="pr-[150px]">Date:</span>
        </div>
        
        <table className="w-full border-collapse border-[2px] border-black text-[11px] mb-12 mt-2">
          <thead>
            <tr className="bg-black text-white">
              <th className="border border-black p-1 text-center w-6"></th>
              <th className="border border-black p-1 text-center uppercase">Name</th>
              <th className="border border-black p-1 text-center uppercase">Surname</th>
              <th className="border border-black p-1 text-center uppercase">ID</th>
              <th className="border border-black p-1 text-center uppercase">Sign</th>
            </tr>
          </thead>
          <tbody>
            {groupMembers.map((member: any, idx: number) => {
              const parts = member.name.trim().split(' ');
              const surname = parts.length > 1 ? parts.pop() : '';
              const name = parts.join(' ');
              return (
                <tr key={idx} className="font-bold">
                  <td className="border border-black p-1 text-center font-normal">{idx + 1}</td>
                  <td className="border border-black p-1 pl-2">{name}</td>
                  <td className="border border-black p-1 pl-2">{surname}</td>
                  <td className="border border-black p-1 pl-2">{member.id}</td>
                  <td className="border border-black p-1"></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    )}

    {/* Grading Box */}
    <div className="mt-auto flex flex-1 min-h-[190px]">
      {/* Left Side */}
      <div className="w-[65%] border-[2px] border-black p-2">
        <p className="text-[11px] uppercase">Lecturer's Commments/Grade:</p>
      </div>
      {/* Right Side (Dashed) */}
      <div 
        className="w-[35%] flex flex-col p-2"
        style={{
          borderTop: '2px solid black',
          borderRight: '1px dashed #666',
          borderBottom: '1px dashed #666',
          borderLeft: 'none'
        }}
      >
        <p className="text-[8px] italic text-gray-600 mb-1 leading-none">for office use only upon receive</p>
        <p className="text-[12px]">Remark</p>
        <div className="mt-auto flex flex-col gap-[6px] text-[11px]">
          <p>DATE :</p>
          <p>TIME :</p>
          <p>RECEIVER'S NAME :</p>
        </div>
      </div>
    </div>
  </div>
);

export default function CoverPage() {
  const [isClient, setIsClient] = useState(false);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [isFullscreen, setIsFullscreen] = useState(false);
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

  const [groupMembers, setGroupMembers] = useState([
    { name: 'John Doe', id: '123456' },
    { name: 'Jane Smith', id: '123457' }
  ]);

  useEffect(() => {
    setIsClient(true);
    const savedType = localStorage.getItem('coverType');
    const savedFormData = localStorage.getItem('coverFormData');
    const savedMembers = localStorage.getItem('coverGroupMembers');
    if (savedType) setType(savedType as 'Individual' | 'Group');
    if (savedFormData) setFormData(JSON.parse(savedFormData));
    if (savedMembers) setGroupMembers(JSON.parse(savedMembers));
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('coverType', type);
      localStorage.setItem('coverFormData', JSON.stringify(formData));
      localStorage.setItem('coverGroupMembers', JSON.stringify(groupMembers));
    }
  }, [type, formData, groupMembers, isClient]);

  const handleMemberChange = (index: number, field: 'name' | 'id', value: string) => {
    const newMembers = [...groupMembers];
    newMembers[index][field] = value;
    setGroupMembers(newMembers);
  };

  const addMember = () => {
    setGroupMembers([...groupMembers, { name: '', id: '' }]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-full print:block">
      {/* Mobile Tab Switcher */}
      <div className="md:hidden flex bg-surface p-1 rounded-xl shadow-sm border border-outline-variant/30 mb-6 shrink-0 print:hidden">
        <button
          onClick={() => setMobileTab('editor')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            mobileTab === 'editor' ? 'bg-surface-strong text-foreground shadow-sm' : 'text-secondary hover:text-foreground'
          }`}
        >
          Editor
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            mobileTab === 'preview' ? 'bg-surface-strong text-foreground shadow-sm' : 'text-secondary hover:text-foreground'
          }`}
        >
          Preview
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 flex-1 md:max-h-[85vh] print:max-h-none print:block">
        {/* Left Pane: Input Form */}
        <section className={`w-full md:w-5/12 flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar print:hidden ${mobileTab === 'editor' ? 'flex' : 'hidden md:flex'}`}>
          <div className="flex flex-col gap-2 shrink-0">
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
            {type === 'Individual' && (
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
            )}
          </div>
        </form>

        {/* Group Members Section */}
        {type === 'Group' && (
          <div className="bg-surface p-6 rounded-container border border-outline-variant/30 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-foreground">Group Members</h2>
              <button type="button" onClick={addMember} className="text-primary text-sm font-medium flex items-center gap-1 hover:opacity-80">
                <span className="material-symbols-outlined text-[16px]">add_circle</span> Add Member
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {groupMembers.map((member, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={member.name}
                    onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                    className="flex-1 bg-surface-strong border border-outline-variant/30 rounded-control px-3 py-2 focus-ring text-sm"
                  />
                  <input
                    type="text"
                    placeholder="ID"
                    value={member.id}
                    onChange={(e) => handleMemberChange(idx, 'id', e.target.value)}
                    className="w-24 bg-surface-strong border border-outline-variant/30 rounded-control px-3 py-2 focus-ring text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Right Pane: Live Preview */}
      <section className={`w-full md:w-7/12 flex-col gap-4 print:w-full print:block ${mobileTab === 'preview' ? 'flex' : 'hidden md:flex'}`}>
        <div className="flex justify-between items-center print:hidden">
          <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider">Preview</h2>
          <div className="flex gap-2">
            <button onClick={() => setIsFullscreen(true)} className="bg-secondary-container text-secondary p-2 rounded-control hover:bg-outline-variant/30 transition-colors">
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
          <PreviewA4 type={type} formData={formData} groupMembers={groupMembers} />
        </div>
      </section>

      {/* Fullscreen Preview Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex justify-center overflow-y-auto p-8 print:hidden" onClick={() => setIsFullscreen(false)}>
          <div className="relative h-max cursor-auto" onClick={(e) => e.stopPropagation()}>
            <button className="absolute -top-4 -right-12 text-white hover:text-gray-300" onClick={() => setIsFullscreen(false)}>
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>
            <PreviewA4 type={type} formData={formData} groupMembers={groupMembers} />
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
