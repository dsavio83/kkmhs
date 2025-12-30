
import React, { useMemo } from 'react';
import { User, MarkRecord, GradeScheme, Subject, Exam } from '../types';
import { 
  Award, Book, Calendar, MapPin, User as UserIcon, 
  TrendingUp, Clock, CheckCircle2, AlertCircle, 
  ChevronRight, BookOpen, GraduationCap, LayoutDashboard,
  Percent, FileText, Star
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { LEARNING_ICONS } from '../constants';

interface StudentDashboardProps {
  student: User;
  state: any;
  view: 'dashboard' | 'courses' | 'grades';
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ student, state, view }) => {
  const myClass = state.classes.find((c: any) => c.id === student.classId);
  const myStudents = state.users.filter((u: any) => u.classId === student.classId && u.role === 'STUDENT');
  
  // Logic to find subjects and assigned teachers
  const mySubjects = state.subjects.map((sub: Subject) => {
    // Check if assigned
    const assignment = state.assignments.find((a: any) => a.classId === myClass?.id && a.subjectId === sub.id);
    if (assignment) {
        return { 
            ...sub, 
            teacher: state.users.find((u: any) => u.id === assignment.teacherId),
            assignmentId: assignment.id
        };
    }
    return null;
  }).filter(Boolean);

  // Filter exams that belong to this class
  const myExams = state.exams.filter((e: any) => e.classId === myClass?.id);

  // Grade Logic
  const applicableScheme = state.gradeSchemes.find((s: any) => s.applicableClasses.includes(myClass?.gradeLevel));
  const getGrade = (percent: number) => {
    if (!applicableScheme) return '-';
    const boundary = applicableScheme.boundaries.find((b: any) => percent >= b.minPercent);
    return boundary ? boundary.grade : 'F';
  };

  const calculateStudentPerformance = (studentId: string) => {
      let totalMax = 0;
      let totalObtained = 0;
      let examResults: any[] = [];
      let totalPercentageSum = 0;
      let examsCounted = 0;

      myExams.forEach((exam: any) => {
          let examMax = 0;
          let examObt = 0;
          
          exam.subjectConfigs.forEach((conf: any) => {
             if(!conf.included) return;
             const mark = state.marks.find((m: any) => m.examId === exam.id && m.subjectId === conf.subjectId && m.studentId === studentId);
             
             const te = parseInt(mark?.teMark === 'A' ? '0' : mark?.teMark || '0');
             const ce = parseInt(mark?.ceMark === 'A' ? '0' : mark?.ceMark || '0');
             const max = (conf.maxTe || 0) + (conf.maxCe || 0);
             
             examMax += max;
             examObt += (te + ce);
          });
          
          if (examMax > 0) {
              const percent = (examObt / examMax) * 100;
              examResults.push({
                  id: exam.id,
                  name: exam.name,
                  percentage: percent,
                  total: examObt,
                  max: examMax
              });
              totalPercentageSum += percent;
              examsCounted++;
              totalMax += examMax;
              totalObtained += examObt;
          }
      });

      return {
          overallPercentage: examsCounted > 0 ? (totalPercentageSum / examsCounted) : 0,
          examResults,
          totalObtained,
          totalMax
      };
  };

  const myPerformance = useMemo(() => calculateStudentPerformance(student.id), [student.id, myExams, state.marks]);

  // Rank Calculation
  const myRank = useMemo(() => {
      if (myExams.length === 0) return '-';
      // Calculate average percentage for all students in class
      const classPerformance = myStudents.map((s: any) => ({
          id: s.id,
          ...calculateStudentPerformance(s.id)
      }));
      
      // Sort by overall percentage descending
      classPerformance.sort((a: any, b: any) => b.overallPercentage - a.overallPercentage);
      
      const rank = classPerformance.findIndex((p: any) => p.id === student.id) + 1;
      return rank > 0 ? rank : '-';
  }, [myStudents, myExams, state.marks]);

  // Attendance
  const attendance = useMemo(() => {
     // Get latest exam attendance
     if (myExams.length === 0) return null;
     const latestExam = myExams[myExams.length - 1];
     const att = state.attendance.find((a: any) => a.examId === latestExam.id && a.studentId === student.id);
     return att ? att.percentage : '95'; // Default mock if data missing
  }, [myExams, state.attendance, student.id]);

  // --- VIEW: DASHBOARD ---
  const renderDashboard = () => (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center text-3xl font-black shadow-inner">
                        {student.name.charAt(0)}
                    </div>
                    <div>
                        <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">Student Portal</span>
                        <h1 className="text-3xl font-black mt-2 leading-none">Hello, {student.name.split(' ')[0]}!</h1>
                        <p className="text-blue-100 font-medium mt-1 opacity-90">Class {myClass?.name} &bull; Roll #{student.admissionNo}</p>
                    </div>
                </div>
                
                <div className="flex gap-4">
                     <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 text-center min-w-[100px]">
                        <p className="text-[10px] uppercase font-bold text-blue-200 mb-1">Rank</p>
                        <p className="text-3xl font-black">{myRank}<span className="text-sm font-medium opacity-60">/{myStudents.length}</span></p>
                     </div>
                </div>
              </div>
              
              {/* Background Decoration */}
              <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-white/10 to-transparent skew-x-12"></div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-50"></div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between group hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600"><CheckCircle2 size={24} /></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Attendance</span>
                  </div>
                  <div>
                      <h3 className="text-3xl font-black text-slate-800">{attendance}%</h3>
                      <p className="text-xs font-bold text-slate-400 mt-1">Excellent Record</p>
                  </div>
              </div>
               <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between group hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600"><TrendingUp size={24} /></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Avg. Score</span>
                  </div>
                  <div>
                      <h3 className="text-3xl font-black text-slate-800">{myPerformance.overallPercentage.toFixed(1)}%</h3>
                      <p className="text-xs font-bold text-slate-400 mt-1">Across {myExams.length} Exams</p>
                  </div>
              </div>
               <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between group hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600"><Star size={24} /></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Total Marks</span>
                  </div>
                  <div>
                      <h3 className="text-3xl font-black text-slate-800">{myPerformance.totalObtained}</h3>
                      <p className="text-xs font-bold text-slate-400 mt-1">Out of {myPerformance.totalMax}</p>
                  </div>
              </div>
          </div>

          {/* Charts Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center">
                      <TrendingUp className="mr-2 text-blue-500" size={20}/> Performance Trend
                  </h3>
                  <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={myPerformance.examResults}>
                              <defs>
                                  <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                  </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} dy={10} />
                              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} domain={[0, 100]} />
                              <Tooltip 
                                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                                  cursor={{stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4'}}
                              />
                              <Area type="monotone" dataKey="percentage" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorPerf)" />
                          </AreaChart>
                      </ResponsiveContainer>
                  </div>
              </div>

               <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center">
                      <UserIcon className="mr-2 text-purple-500" size={20}/> Profile Details
                  </h3>
                  <div className="space-y-4">
                      {[
                          { label: "Date of Birth", val: student.dob, icon: Calendar },
                          { label: "Father's Name", val: student.fatherName || 'Not Listed', icon: UserIcon },
                          { label: "Category", val: student.category, icon: Award },
                          { label: "Address", val: student.address, icon: MapPin },
                      ].map((item, i) => (
                          <div key={i} className="flex items-center p-3 bg-slate-50/50 rounded-2xl">
                              <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 mr-4">
                                  <item.icon size={18} />
                              </div>
                              <div>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</p>
                                  <p className="text-sm font-bold text-slate-800">{item.val || '-'}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>
  );

  // --- VIEW: COURSES ---
  const renderCourses = () => (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h1 className="text-3xl font-black text-slate-900">My Subjects</h1>
              <p className="text-slate-400 font-bold">Teachers and course information</p>
            </div>
            <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-bold">
                Total: {mySubjects.length}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mySubjects.map((sub: any, idx) => {
                  const iconObj = LEARNING_ICONS.find(i => sub.name.includes(i.label)) || LEARNING_ICONS[idx % LEARNING_ICONS.length];
                  return (
                      <div key={sub.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
                          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${iconObj.color.replace('text-', 'from-').replace('400', '100')} to-transparent rounded-bl-[100px] opacity-20 transition-opacity group-hover:opacity-40`}></div>
                          
                          <div className="relative z-10">
                              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                                  <span className={`${iconObj.color}`}>{iconObj.icon}</span>
                              </div>
                              <h3 className="text-xl font-black text-slate-800 mb-1">{sub.name}</h3>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{sub.shortCode || 'General'}</p>
                              
                              <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-3">
                                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 font-bold text-xs">
                                      {sub.teacher?.name.charAt(0) || 'T'}
                                  </div>
                                  <div>
                                      <p className="text-[9px] font-black uppercase text-slate-400">Teacher</p>
                                      <p className="text-sm font-bold text-slate-700">{sub.teacher?.name || 'Not Assigned'}</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  )
              })}
          </div>
      </div>
  );

  // --- VIEW: GRADES ---
  const renderGrades = () => (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
           <div>
              <h1 className="text-3xl font-black text-slate-900">Academic Report</h1>
              <p className="text-slate-400 font-bold">Detailed breakdown of marks and grades</p>
           </div>

           {myExams.length > 0 ? myExams.map((exam: any) => {
               // Calculate results for this specific exam
               let examMax = 0;
               let examObt = 0;
               const subjectsData = exam.subjectConfigs
                .filter((c:any) => c.included)
                .map((conf: any) => {
                    const sub = state.subjects.find((s:any) => s.id === conf.subjectId);
                    const mark = state.marks.find((m:any) => m.examId === exam.id && m.subjectId === conf.subjectId && m.studentId === student.id);
                    
                    const te = mark?.teMark === 'A' ? 0 : parseInt(mark?.teMark || '0');
                    const ce = mark?.ceMark === 'A' ? 0 : parseInt(mark?.ceMark || '0');
                    const total = te + ce;
                    const max = (conf.maxTe || 0) + (conf.maxCe || 0);
                    const percent = max > 0 ? (total/max)*100 : 0;
                    
                    examMax += max;
                    examObt += total;

                    return {
                        name: sub?.name,
                        te: mark?.teMark || '-',
                        ce: mark?.ceMark || '-',
                        total,
                        max,
                        grade: getGrade(percent),
                        isPass: percent >= 35
                    };
               });
               
               const examPercent = examMax > 0 ? (examObt / examMax) * 100 : 0;
               const examGrade = getGrade(examPercent);
               const isPass = examPercent >= 35;

               return (
                   <div key={exam.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mb-6">
                       <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/30">
                           <div className="flex items-center gap-4">
                               <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                   <FileText size={24} />
                               </div>
                               <div>
                                   <h3 className="text-xl font-black text-slate-800">{exam.name}</h3>
                                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{subjectsData.length} Subjects</p>
                               </div>
                           </div>
                           
                           <div className="flex gap-4">
                               <div className={`px-5 py-3 rounded-xl border ${isPass ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                                   <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Result</p>
                                   <p className="text-lg font-black">{isPass ? 'PASSED' : 'FAILED'}</p>
                               </div>
                               <div className="px-5 py-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-700">
                                   <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Percentage</p>
                                   <p className="text-lg font-black">{examPercent.toFixed(1)}%</p>
                               </div>
                           </div>
                       </div>

                       <div className="overflow-x-auto">
                           <table className="w-full text-left">
                               <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                   <tr>
                                       <th className="px-8 py-4">Subject</th>
                                       <th className="px-8 py-4 text-center">Term (TE)</th>
                                       <th className="px-8 py-4 text-center">Cont. (CE)</th>
                                       <th className="px-8 py-4 text-center">Total</th>
                                       <th className="px-8 py-4 text-center">Grade</th>
                                       <th className="px-8 py-4 text-right">Status</th>
                                   </tr>
                               </thead>
                               <tbody className="divide-y divide-slate-50">
                                   {subjectsData.map((row: any, idx: number) => (
                                       <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                           <td className="px-8 py-4 font-bold text-slate-700">{row.name}</td>
                                           <td className="px-8 py-4 text-center font-medium text-slate-500">{row.te}</td>
                                           <td className="px-8 py-4 text-center font-medium text-slate-500">{row.ce}</td>
                                           <td className="px-8 py-4 text-center font-black text-slate-800">
                                               {row.total} <span className="text-[10px] text-slate-400 font-medium">/ {row.max}</span>
                                           </td>
                                           <td className="px-8 py-4 text-center">
                                               <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-600">{row.grade}</span>
                                           </td>
                                           <td className="px-8 py-4 text-right">
                                               {row.isPass ? (
                                                   <span className="text-xs font-black text-green-600">PASS</span>
                                               ) : (
                                                   <span className="text-xs font-black text-red-500">FAIL</span>
                                               )}
                                           </td>
                                       </tr>
                                   ))}
                               </tbody>
                           </table>
                       </div>
                   </div>
               )
           }) : (
               <div className="p-20 text-center text-slate-400 font-bold">No exam records found.</div>
           )}
      </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-20">
       {view === 'dashboard' && renderDashboard()}
       {view === 'courses' && renderCourses()}
       {view === 'grades' && renderGrades()}
    </div>
  );
};

export default StudentDashboard;
