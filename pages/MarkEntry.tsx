
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, UserRole, ClassRoom, Subject, MarkRecord, Exam } from '../types';
import MarkInputRow from '../components/MarkInputRow';
import { Save, CheckCircle2, AlertCircle, Calendar, CheckSquare, Square, ChevronRight, Loader2, Cloud, CloudOff } from 'lucide-react';

interface MarkEntryProps {
  teacher: User;
  state: any;
  setState: any;
}

const MarkEntry: React.FC<MarkEntryProps> = ({ teacher, state, setState }) => {
  const { classId } = useParams(); // Get classId from route if present
  const [selectedExamId, setSelectedExamId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  // Toggles for Mark Columns
  const [includeTe, setIncludeTe] = useState(true);
  const [includeCe, setIncludeCe] = useState(true);

  // Auto-save State
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'modified' | 'saving'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<Date>(new Date());

  // Auto-save Logic (Every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoSaveStatus === 'modified') {
        triggerAutoSave();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [autoSaveStatus]);

  const triggerAutoSave = () => {
    setAutoSaveStatus('saving');
    // Simulate save delay (since data is already in state, this is visual feedback)
    setTimeout(() => {
      setAutoSaveStatus('saved');
      setLastSavedTime(new Date());
    }, 800);
  };

  // If classId is in params, use it. Otherwise rely on state
  const activeClassId = classId; 

  // Get all exams for classes relevant to this teacher
  const relevantExams = state.exams.filter((exam: Exam) => {
    // If activeClassId is set, only show exams for that class
    if (activeClassId && exam.classId !== activeClassId) return false;

    // Is teacher class teacher?
    const isClassTeacher = state.classes.some((c: any) => c.id === exam.classId && c.classTeacherId === teacher.id);
    // Or is teacher assigned to this class?
    const isSubjectTeacher = state.assignments.some((a: any) => a.classId === exam.classId && a.teacherId === teacher.id);
    return isClassTeacher || isSubjectTeacher;
  });

  const selectedExam = state.exams.find((e: any) => e.id === selectedExamId);
  const selectedClass = state.classes.find((c: any) => c.id === (activeClassId || selectedExam?.classId));
  
  // Filter students
  const students = selectedClass ? state.users.filter((u: any) => u.role === UserRole.STUDENT && u.classId === selectedClass.id) : [];

  // Determine if current user is the Class Teacher for this specific class
  const isClassTeacher = selectedClass?.classTeacherId === teacher.id;

  // Get configured subjects for this exam, FILTERED by Teacher Assignment
  const examSubjects = selectedExam ? selectedExam.subjectConfigs.map((config: any) => {
      const sub = state.subjects.find((s: any) => s.id === config.subjectId);
      if (!sub) return null;

      // Logic: 
      // 1. If Class Teacher, they *can* see all subjects (usually required for oversight).
      // 2. If Subject Teacher, strictly show only assigned subjects.
      const isAssigned = state.assignments.some((a: any) => 
        a.classId === selectedExam.classId && 
        a.subjectId === sub.id && 
        a.teacherId === teacher.id
      );

      if (!isClassTeacher && !isAssigned) {
          return null;
      }
      return { ...sub, config };
  }).filter(Boolean) : [];

  // Auto-select subject if only one exists
  useEffect(() => {
    if (examSubjects.length === 1 && !selectedSubjectId) {
        setSelectedSubjectId(examSubjects[0].id);
    }
  }, [examSubjects, selectedSubjectId]);

  const activeConfig = selectedExam?.subjectConfigs.find((c: any) => c.subjectId === selectedSubjectId);
  const maxTeMarks = activeConfig?.maxTe || 0;
  const maxCeMarks = activeConfig?.maxCe || 0;

  const handleMarkUpdate = (studentId: string, type: 'te' | 'ce' | 'att', val: string) => {
    // Mark as modified for auto-save
    setAutoSaveStatus('modified');
    
    if (type === 'att') {
        // Handle Attendance Update
        const existingAttIndex = state.attendance.findIndex((a: any) => 
            a.examId === selectedExamId && a.studentId === studentId
        );
        let updatedAtt = [...state.attendance];
        if (existingAttIndex >= 0) {
            updatedAtt[existingAttIndex] = { ...updatedAtt[existingAttIndex], percentage: val };
        } else {
            updatedAtt.push({ examId: selectedExamId, studentId, percentage: val });
        }
        setState({ ...state, attendance: updatedAtt });
        return;
    }

    // Handle Marks Update
    const upperVal = val.toUpperCase();
    const numVal = parseInt(val);
    const max = type === 'te' ? maxTeMarks : maxCeMarks;
    
    if (!isNaN(numVal)) {
        if (numVal > max) {
            alert(`Maximum mark is ${max}`);
            return; 
        }
    }

    const existingMarkIndex = state.marks.findIndex((m: any) => 
      m.studentId === studentId && 
      m.subjectId === selectedSubjectId &&
      m.examId === selectedExamId
    );

    let updatedMarks = [...state.marks];
    if (existingMarkIndex >= 0) {
      updatedMarks[existingMarkIndex] = {
        ...updatedMarks[existingMarkIndex],
        [type === 'te' ? 'teMark' : 'ceMark']: upperVal
      };
    } else {
      updatedMarks.push({
        studentId,
        subjectId: selectedSubjectId,
        examId: selectedExamId,
        teMark: type === 'te' ? upperVal : undefined,
        ceMark: type === 'ce' ? upperVal : undefined,
      });
    }
    setState({ ...state, marks: updatedMarks });
  };

  const handleManualSave = () => {
    triggerAutoSave();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
           {activeClassId && selectedClass ? (
               <div className="flex items-center gap-2 mb-2">
                   <span className="text-slate-400 font-bold text-sm">Class {selectedClass.name}</span>
                   <ChevronRight size={16} className="text-slate-300" />
                   <span className="text-blue-600 font-black text-sm uppercase tracking-widest">Grading</span>
               </div>
           ) : (
             <h1 className="text-4xl font-black text-slate-900 tracking-tight">Gradebook</h1>
           )}
          <p className="text-slate-400 font-bold mt-1">Select Exam and Subject to enter marks</p>
        </div>

        <div className="flex items-center gap-4">
            {/* Auto-Save Indicator */}
            <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-slate-100 shadow-sm transition-all">
                {autoSaveStatus === 'saving' && <Loader2 size={16} className="text-blue-500 animate-spin" />}
                {autoSaveStatus === 'modified' && <CloudOff size={16} className="text-amber-500" />}
                {autoSaveStatus === 'saved' && <Cloud size={16} className="text-green-500" />}
                
                <span className={`text-xs font-bold uppercase tracking-wider ${
                    autoSaveStatus === 'saving' ? 'text-blue-600' : 
                    autoSaveStatus === 'modified' ? 'text-amber-600' : 'text-slate-400'
                }`}>
                    {autoSaveStatus === 'saving' ? 'Saving...' : 
                     autoSaveStatus === 'modified' ? 'Unsaved' : 
                     'Saved'}
                </span>
                {autoSaveStatus === 'saved' && (
                    <span className="text-[10px] font-bold text-slate-300 hidden sm:inline">
                        {lastSavedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                )}
            </div>

            <button 
                onClick={handleManualSave}
                className="px-6 py-3 bg-blue-600 text-white font-black rounded-xl shadow-lg shadow-blue-200/50 flex items-center hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all text-sm"
            >
                <Save size={18} className="mr-2" /> Save Now
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Select Exam</label>
          <select 
            value={selectedExamId}
            onChange={(e) => { setSelectedExamId(e.target.value); setSelectedSubjectId(''); }}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-700 font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
          >
            <option value="">Choose Exam...</option>
            {relevantExams.map((ex: any) => {
                 const cls = state.classes.find((c: any) => c.id === ex.classId);
                 return <option key={ex.id} value={ex.id}>{ex.name} {(!activeClassId) ? `- Class ${cls?.name}` : ''}</option>
            })}
          </select>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Select Subject</label>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            disabled={!selectedExamId}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-700 font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none disabled:opacity-50"
          >
            <option value="">Choose Subject...</option>
            {examSubjects.map((sub: any) => (
                <option key={sub.id} value={sub.id}>{sub.name} (Max: {sub.config.maxTe}/{sub.config.maxCe})</option>
            ))}
          </select>
        </div>
      </div>

      {selectedExamId && selectedSubjectId ? (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50/50 gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600 font-black text-xl">
                {selectedClass?.name.charAt(0)}
              </div>
              <div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{selectedExam.name}</span>
                <h3 className="text-xl font-black text-slate-800 leading-none mt-1">
                  {state.subjects.find((s: any) => s.id === selectedSubjectId)?.name}
                </h3>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 items-center">
                {/* Checkboxes to hide/show TE and CE */}
                <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                    <button 
                        onClick={() => setIncludeTe(!includeTe)}
                        className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider ${includeTe ? 'text-blue-600' : 'text-slate-400'}`}
                    >
                        {includeTe ? <CheckSquare size={16} /> : <Square size={16} />}
                        TE ({maxTeMarks})
                    </button>
                    <div className="w-px h-4 bg-slate-200"></div>
                    <button 
                        onClick={() => setIncludeCe(!includeCe)}
                        className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider ${includeCe ? 'text-blue-600' : 'text-slate-400'}`}
                    >
                        {includeCe ? <CheckSquare size={16} /> : <Square size={16} />}
                        CE ({maxCeMarks})
                    </button>
                </div>
            </div>
          </div>
          
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-black tracking-widest">
                <tr>
                  <th className="px-8 py-5">Full Name</th>
                  <th className="px-8 py-5 text-center text-purple-600">Attendance %</th>
                  {includeTe && <th className="px-8 py-5 text-center">TE Marks</th>}
                  {includeCe && <th className="px-8 py-5 text-center">CE Marks</th>}
                  <th className="px-8 py-5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {students.map((student: any) => {
                  const mark = state.marks.find((m: any) => 
                    m.studentId === student.id && 
                    m.subjectId === selectedSubjectId && 
                    m.examId === selectedExamId
                  );

                  const att = state.attendance.find((a: any) => 
                     a.examId === selectedExamId && a.studentId === student.id
                  );
                  
                  return (
                    <MarkInputRow
                        key={student.id}
                        student={student}
                        teMark={mark?.teMark}
                        ceMark={mark?.ceMark}
                        attendance={att?.percentage}
                        teEnabled={includeTe}
                        ceEnabled={includeCe}
                        maxTeMarks={maxTeMarks}
                        maxCeMarks={maxCeMarks}
                        onUpdate={handleMarkUpdate}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
          {students.length === 0 && (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <AlertCircle size={32} className="text-slate-300" />
              </div>
              <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No students enrolled in this class.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-24 rounded-[3rem] text-center border-4 border-dashed border-slate-100 flex flex-col items-center justify-center">
           <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mb-6 text-blue-600 shadow-inner">
             <Calendar size={32} />
           </div>
          <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Select an exam context to enter marks.</p>
        </div>
      )}

      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10 duration-300">
          <div className="bg-slate-900 text-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center space-x-3 border border-white/10 backdrop-blur-xl">
            <CheckCircle2 size={24} className="text-green-400" />
            <span className="font-black uppercase tracking-widest text-xs">Entries Saved</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkEntry;
