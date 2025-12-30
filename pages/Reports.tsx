
import React, { useState, useMemo, useEffect } from 'react';
import { User, UserRole } from '../types';
import { Printer, Award, CheckSquare, Square, Download, Loader2, FileText, Smartphone } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ReportsProps {
  teacher: User;
  state: any;
}

// --- Helper Components ---

const SignatureLine = ({ label, name }: { label: string, name?: string }) => (
    <div className="flex flex-col items-center justify-end min-w-[100px]">
        {name && <span className="text-[9px] font-bold text-slate-800 uppercase mb-1 font-serif">{name}</span>}
        <div className="w-full border-b border-slate-800 mb-1"></div>
        <span className="text-[8px] font-bold text-slate-600 uppercase tracking-wider">{label}</span>
    </div>
);

// --- Progress Card Component (A5 Portrait - Professional Design) ---
const ProgressCardA5: React.FC<{ data: any, selectedExam: any, selectedClass: any, settings: any, schoolDetails: any, classTeacher: any }> = ({ 
    data, selectedExam, selectedClass, settings, schoolDetails, classTeacher 
}) => (
    <div className="progress-card-item bg-white mx-auto print:mx-0 mb-8 print:mb-0 shadow-lg print:shadow-none relative box-border overflow-hidden bg-white text-slate-900" 
         style={{ width: '148mm', height: '210mm', breakAfter: 'page', pageBreakAfter: 'always' }}>
        
        {/* Decorative Outer Border */}
        <div className="h-full w-full p-3 flex flex-col">
            <div className="h-full w-full border-4 double border-slate-900 p-1 flex flex-col rounded-sm">
                <div className="flex-1 border border-slate-400 p-4 flex flex-col relative rounded-sm">
                    
                    {/* Header Section */}
                    <div className="text-center mb-5">
                        <div className="w-16 h-16 mx-auto mb-2 opacity-10 absolute top-4 left-0 right-0 m-auto flex items-center justify-center">
                            <Award size={64} />
                        </div>
                        <h1 className="text-xl font-black uppercase tracking-wide text-slate-900 leading-tight font-serif relative z-10">
                            {schoolDetails?.name || 'SMART SCHOOL'}
                        </h1>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1 font-serif relative z-10">
                            {schoolDetails?.place || 'CHENNAI'} {schoolDetails?.schoolCode ? `- ${schoolDetails.schoolCode}` : ''}
                        </p>
                        
                        {/* Report Title Badge */}
                        <div className="mt-4 flex justify-center relative z-10">
                            <div className="bg-slate-900 text-white rounded-full px-6 py-1.5 shadow-sm flex items-center justify-center">
                                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-center">
                                    PROGRESS REPORT
                                </h2>
                            </div>
                        </div>
                        <div className="mt-2 text-[11px] font-bold text-slate-800 uppercase tracking-wider border-b border-slate-300 inline-block pb-0.5 font-serif">
                            Academic Year 2024-2025 &bull; {selectedExam?.name}
                        </div>
                    </div>

                    {/* Student Details Section - Updated with MB 2px and Thicker Bottom Border */}
                    <div className="mb-4 w-full bg-slate-50 border border-slate-200 rounded-xl p-3">
                         <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-[10px]">
                            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-1 mb-[2px]">
                                <span className="font-bold text-slate-500 uppercase tracking-wide">Name:</span>
                                <span className="font-black text-slate-900 uppercase text-[11px] font-serif">{data.student.name}</span>
                            </div>
                            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-1 mb-[2px]">
                                <span className="font-bold text-slate-500 uppercase tracking-wide">Admission No:</span>
                                <span className="font-black text-slate-900">{data.student.admissionNo}</span>
                            </div>
                            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-1 mb-[2px]">
                                <span className="font-bold text-slate-500 uppercase tracking-wide">Class:</span>
                                <span className="font-black text-slate-900 uppercase">{selectedClass?.name}</span>
                            </div>
                            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-1 mb-[2px]">
                                <span className="font-bold text-slate-500 uppercase tracking-wide">D.O.B:</span>
                                <span className="font-black text-slate-900">{data.student.dob || '-'}</span>
                            </div>
                            <div className="flex items-center justify-between col-span-2 pt-1 border-b-2 border-slate-200 pb-1 mb-[2px]">
                                <span className="font-bold text-slate-500 uppercase tracking-wide">Attendance:</span>
                                <span className="font-black text-slate-900">{data.attendance ? `${data.attendance}%` : 'N/A'}</span>
                            </div>
                         </div>
                    </div>

                    {/* Marks Table - Updated with Bottom Border 2px for content */}
                    <div className="flex-1 mt-2">
                        <table className="w-full border-collapse border border-slate-900 text-[10px]">
                            <thead>
                                <tr className="bg-slate-100 text-slate-900 h-9 font-serif">
                                    <th className="border border-slate-900 px-3 text-left font-black uppercase tracking-wider align-middle">SUBJECT</th>
                                    {settings.showTe && <th className="border border-slate-900 px-1 text-center font-bold w-10 align-middle">TE</th>}
                                    {settings.showCe && <th className="border border-slate-900 px-1 text-center font-bold w-10 align-middle">CE</th>}
                                    {settings.showTotal && <th className="border border-slate-900 px-1 text-center font-black w-12 bg-slate-200 align-middle">TOTAL</th>}
                                    {settings.showGrade && <th className="border border-slate-900 px-1 text-center font-bold w-12 align-middle">GRADE</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {data.subjects.length > 0 ? data.subjects.map((sub: any) => (
                                    <tr key={sub.id} className="h-8">
                                        <td className="border border-slate-900 border-b-2 px-3 font-bold text-slate-800 uppercase text-[10px] font-serif tracking-tight align-middle">{sub.name}</td>
                                        {settings.showTe && <td className="border border-slate-900 border-b-2 text-center font-medium text-slate-700 align-middle">{sub.teStr}</td>}
                                        {settings.showCe && <td className="border border-slate-900 border-b-2 text-center font-medium text-slate-700 align-middle">{sub.ceStr}</td>}
                                        {settings.showTotal && <td className="border border-slate-900 border-b-2 text-center font-black bg-slate-50 text-slate-900 align-middle">{sub.total}</td>}
                                        {settings.showGrade && <td className="border border-slate-900 border-b-2 text-center font-bold text-slate-800 align-middle">{sub.grade}</td>}
                                    </tr>
                                )) : (
                                    <tr><td colSpan={6} className="border border-slate-900 p-8 text-center italic text-slate-400 align-middle">No Data</td></tr>
                                )}
                            </tbody>
                            {data.subjects.length > 0 && (
                                <tfoot className="bg-slate-100 font-black text-slate-900">
                                    <tr className="h-9 border-b-2 border-slate-900">
                                        <td className="border border-slate-900 px-3 text-right text-[10px] uppercase tracking-wider align-middle" colSpan={(settings.showTe ? 1 : 0) + (settings.showCe ? 1 : 0) + 1}>GRAND TOTAL</td>
                                        {settings.showTotal && <td className="border border-slate-900 text-center text-[11px] align-middle">{data.grandTotal} <span className="text-[7px] text-slate-500 font-normal">/{data.maxTotal}</span></td>}
                                        {settings.showGrade && <td className="border border-slate-900 text-center align-middle">{data.grade}</td>}
                                    </tr>
                                    <tr className="h-9">
                                        <td className="border border-slate-900 px-3 text-right text-[10px] uppercase tracking-wider align-middle" colSpan={(settings.showTe ? 1 : 0) + (settings.showCe ? 1 : 0) + 1 + (settings.showTotal ? 1 : 0) + (settings.showGrade ? 1 : 0) - 1}>RESULT</td>
                                        <td className={`border border-slate-900 text-center font-black text-[11px] tracking-widest align-middle ${data.percentage >= 35 ? 'text-green-800' : 'text-red-700'}`}>
                                            {data.percentage >= 35 ? 'PASS' : 'FAIL'}
                                        </td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>

                    {/* Footer Signatures (3 Signatures for Progress Card) */}
                    <div className="mt-auto pt-10 pb-2">
                         <div className="flex justify-between items-end gap-2 px-1">
                            <SignatureLine label="Class Teacher" name={classTeacher?.name} />
                            <SignatureLine label="Parent / Guardian" />
                            <SignatureLine label="Headmaster" />
                         </div>
                         <div className="text-[8px] text-slate-400 text-center mt-4 uppercase tracking-widest font-medium">
                             SmartSchool Pro System Generated Report
                         </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// --- Main Reports Component ---
const Reports: React.FC<ReportsProps> = ({ teacher, state }) => {
  // 1. Get relevant classes and exams
  const myFormClasses = state.classes.filter((c: any) => c.classTeacherId === teacher.id);
  const mySubjectClasses = state.assignments.filter((a: any) => a.teacherId === teacher.id).map((a: any) => state.classes.find((c: any) => c.id === a.classId)).filter(Boolean);
  const uniqueClassIds = new Set([...myFormClasses.map((c: any) => c.id), ...mySubjectClasses.map((c: any) => c.id)]);
  const myClasses = state.classes.filter((c: any) => uniqueClassIds.has(c.id));

  const primaryClass = myFormClasses[0];

  const [selectedClassId, setSelectedClassId] = useState(primaryClass ? primaryClass.id : '');
  const [selectedExamId, setSelectedExamId] = useState('');
  const [viewMode, setViewMode] = useState<'consolidated' | 'progress_card'>('consolidated');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('all'); 
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // New State: Orientation for Consolidated Report
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');

  // New State: Display Mode for Consolidated Report
  const [consolidatedDisplayMode, setConsolidatedDisplayMode] = useState<'marks' | 'grade' | 'both'>('both');

  // Report Settings
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('report_settings');
    return saved ? JSON.parse(saved) : {
      showTe: true, showCe: true, showTotal: true, showPercentage: true, showGrade: true
    };
  });

  useEffect(() => {
    localStorage.setItem('report_settings', JSON.stringify(settings));
  }, [settings]);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  const examsForClass = state.exams.filter((e: any) => e.classId === selectedClassId);
  
  const selectedClass = state.classes.find((c: any) => c.id === selectedClassId);
  const selectedExam = state.exams.find((e: any) => e.id === selectedExamId);
  const classTeacher = state.users.find((u:any) => u.id === selectedClass?.classTeacherId);
  
  const students = selectedClass ? state.users.filter((u: any) => u.role === UserRole.STUDENT && u.classId === selectedClass.id) : [];

  // Grade Logic
  const applicableScheme = state.gradeSchemes.find((s: any) => s.applicableClasses.includes(selectedClass?.gradeLevel));
  const getGrade = (percent: number) => {
    if (!applicableScheme) return '-';
    const boundary = applicableScheme.boundaries.find((b: any) => percent >= b.minPercent);
    return boundary ? boundary.grade : 'F';
  };

  // Process Data
  const reportData = useMemo(() => {
    if (!selectedExam || !students.length) return [];

    return students.map((student: any) => {
      let totalMax = 0;
      let totalObt = 0;
      let subjectResults: any[] = [];
      const attendance = state.attendance.find((a:any) => a.examId === selectedExamId && a.studentId === student.id)?.percentage;

      selectedExam.subjectConfigs.forEach((config: any) => {
        const subject = state.subjects.find((s: any) => s.id === config.subjectId);
        if (!subject) return;

        const markRecord = state.marks.find((m: any) => m.examId === selectedExamId && m.subjectId === config.subjectId && m.studentId === student.id);
        const teRaw = markRecord?.teMark;
        const ceRaw = markRecord?.ceMark;

        if ((teRaw === undefined || teRaw === '') && (ceRaw === undefined || ceRaw === '')) { return; }

        const parse = (val: string | undefined) => (val === 'A' || val === '' || !val) ? 0 : parseInt(val);
        const te = parse(teRaw);
        const ce = parse(ceRaw);
        const subTotal = (settings.showTe ? te : 0) + (settings.showCe ? ce : 0);
        const subMax = (settings.showTe ? config.maxTe : 0) + (settings.showCe ? config.maxCe : 0);
        
        totalMax += subMax;
        totalObt += subTotal;

        subjectResults.push({
          id: subject.id,
          name: subject.name,
          shortCode: subject.shortCode,
          teStr: teRaw === 'A' ? 'A' : (teRaw ?? '-'),
          ceStr: ceRaw === 'A' ? 'A' : (ceRaw ?? '-'),
          te, ce,
          total: subTotal,
          max: subMax,
          grade: getGrade((subTotal / subMax) * 100)
        });
      });

      const percentage = totalMax > 0 ? (totalObt / totalMax) * 100 : 0;

      return {
        student,
        subjects: subjectResults,
        grandTotal: totalObt,
        maxTotal: totalMax,
        percentage: percentage,
        grade: getGrade(percentage),
        attendance
      };
    }).sort((a: any, b: any) => b.grandTotal - a.grandTotal);
  }, [selectedExam, students, state.marks, settings.showTe, settings.showCe, state.attendance]);

  const handlePrint = () => window.print();

  const handleDownloadPdf = async () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);

    try {
        if (viewMode === 'consolidated') {
            const element = document.getElementById('consolidated-report-view');
            if (element) {
                // High Scale for crisp text but standard size
                const canvas = await html2canvas(element, { 
                    scale: 4, 
                    useCORS: true, 
                    logging: false,
                    backgroundColor: '#ffffff',
                    windowWidth: element.scrollWidth,
                    windowHeight: element.scrollHeight
                });
                const imgData = canvas.toDataURL('image/png');
                
                // Use selected orientation
                const isLandscape = orientation === 'landscape';
                
                // For exact match, we set the PDF page size to match the image aspect ratio mapped to A4 width
                const pdfWidth = isLandscape ? 297 : 210; 
                // Fix: Calculate pdfHeight based on canvas dimensions
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

                const pdf = new jsPDF(isLandscape ? 'l' : 'p', 'mm', [pdfWidth, pdfHeight]); 

                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`${selectedClass?.name}_${selectedExam?.name}_Consolidated.pdf`);
            }
        } else {
            // Progress Cards A5
            const cards = document.getElementsByClassName('progress-card-item');
            if (cards.length > 0) {
                const pdf = new jsPDF('p', 'mm', 'a5');
                const pdfWidth = 148;  
                const pdfHeight = 210;

                for (let i = 0; i < cards.length; i++) {
                    const card = cards[i] as HTMLElement;
                    // Use scale 4 for high quality text
                    const canvas = await html2canvas(card, { 
                        scale: 4, 
                        useCORS: true, 
                        logging: false,
                        backgroundColor: '#ffffff',
                    });
                    const imgData = canvas.toDataURL('image/jpeg', 1.0);
                    if (i > 0) pdf.addPage();
                    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                }
                const filename = selectedStudentId === 'all' 
                    ? `${selectedClass?.name}_${selectedExam?.name}_All_Cards.pdf` 
                    : `${selectedClass?.name}_${selectedExam?.name}_${reportData.find((d:any) => d.student.id === selectedStudentId)?.student.name}.pdf`;
                pdf.save(filename);
            }
        }
    } catch (err) {
        console.error("PDF Generation failed", err);
        alert("Failed to generate PDF.");
    } finally {
        setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
       <style>
        {`
          @media print {
            @page {
              size: ${viewMode === 'consolidated' ? (orientation === 'landscape' ? 'A4 landscape' : 'A4 portrait') : 'A5 portrait'};
              margin: 0;
            }
            body { -webkit-print-color-adjust: exact; }
            .print\\:hidden { display: none !important; }
            .print\\:mx-0 { margin-left: 0; margin-right: 0; }
            .print\\:mb-0 { margin-bottom: 0; }
            .print\\:shadow-none { box-shadow: none; }
          }
        `}
      </style>
      
      {/* Header & Controls */}
      <div className="grid grid-cols-12 gap-4 items-center print:hidden">
        <div className="col-span-10">
          <h1 className="text-3xl font-black text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-400 font-bold truncate">Generate consolidated sheets and progress cards</p>
        </div>
        <div className="col-span-2 flex justify-end gap-2">
            <button 
                onClick={handleDownloadPdf} 
                disabled={!selectedExamId || isGeneratingPdf}
                className={`p-3 text-white font-black rounded-2xl shadow-lg flex items-center justify-center transition-all aspect-square ${isGeneratingPdf ? 'bg-slate-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] shadow-blue-200'}`} 
                title="Download PDF"
            >
                {isGeneratingPdf ? <Loader2 size={24} className="animate-spin" /> : <Download size={24} />}
            </button>
            <button 
                onClick={handlePrint} 
                disabled={!selectedExamId}
                className="p-3 bg-slate-900 text-white font-black rounded-2xl shadow-lg flex items-center justify-center hover:bg-slate-800 transition-all aspect-square disabled:bg-slate-200 disabled:text-slate-400" 
                title="Print / Export"
            >
                <Printer size={24} />
            </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6 print:hidden">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Class</label>
                {primaryClass ? (
                    <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700">
                        {primaryClass.name} (My Class)
                    </div>
                ) : (
                    <select 
                        value={selectedClassId}
                        onChange={(e) => { setSelectedClassId(e.target.value); setSelectedExamId(''); }}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Choose Class</option>
                        {myClasses.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                )}
             </div>
             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Exam</label>
                <select 
                    value={selectedExamId}
                    onChange={(e) => setSelectedExamId(e.target.value)}
                    disabled={!selectedClassId}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    <option value="">Choose Exam</option>
                    {examsForClass.map((e: any) => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
             </div>
             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Report Type</label>
                <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                    <button onClick={() => setViewMode('consolidated')} className={`flex-1 py-2 rounded-lg text-xs font-black uppercase transition-all ${viewMode === 'consolidated' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>Consolidated</button>
                    <button onClick={() => setViewMode('progress_card')} className={`flex-1 py-2 rounded-lg text-xs font-black uppercase transition-all ${viewMode === 'progress_card' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>Progress Card</button>
                </div>
             </div>
             {viewMode === 'consolidated' && (
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Page Orientation</label>
                    <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                        <button onClick={() => setOrientation('portrait')} className={`flex-1 py-2 rounded-lg text-xs font-black uppercase transition-all flex items-center justify-center gap-2 ${orientation === 'portrait' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
                            <Smartphone size={14} /> Portrait
                        </button>
                        <button onClick={() => setOrientation('landscape')} className={`flex-1 py-2 rounded-lg text-xs font-black uppercase transition-all flex items-center justify-center gap-2 ${orientation === 'landscape' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
                            <FileText size={14} className="rotate-90" /> Landscape
                        </button>
                    </div>
                </div>
             )}
         </div>
         {viewMode === 'consolidated' ? (
            <div className="flex gap-2 pt-4 border-t border-slate-50">
                 {['marks', 'grade', 'both'].map((mode) => (
                    <button key={mode} onClick={() => setConsolidatedDisplayMode(mode as any)} className={`px-4 py-2 rounded-xl text-xs font-black uppercase border transition-all ${consolidatedDisplayMode === mode ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-400'}`}>{mode === 'both' ? 'Marks & Grade' : mode + ' Only'}</button>
                 ))}
            </div>
         ) : (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-50">
                {[{ key: 'showTe', label: 'TE' }, { key: 'showCe', label: 'CE' }, { key: 'showTotal', label: 'Total' }, { key: 'showGrade', label: 'Grade' }].map((opt) => (
                    <button key={opt.key} onClick={() => toggleSetting(opt.key as any)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase border transition-all ${settings[opt.key as keyof typeof settings] ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-400'}`}>
                        {settings[opt.key as keyof typeof settings] ? <CheckSquare size={16} /> : <Square size={16} />} {opt.label}
                    </button>
                ))}
            </div>
         )}
      </div>

      {selectedExamId ? (
          <>
            {viewMode === 'consolidated' && (
                // Dynamic Container Width based on Orientation
                <div className="overflow-auto w-full flex justify-center py-4 bg-slate-100/50 rounded-3xl">
                    <div id="consolidated-report-view" className="bg-white shadow-xl mx-auto relative box-border text-slate-900" 
                         style={{ 
                             width: orientation === 'landscape' ? '297mm' : '210mm', 
                             minHeight: orientation === 'landscape' ? '210mm' : '297mm', 
                             padding: '15mm' 
                         }}>
                        
                        {/* Header */}
                        <div className="text-center border-b-[2px] border-slate-900 pb-3 mb-4">
                            <h1 className="text-2xl font-black uppercase tracking-wide text-slate-900 mb-1 leading-none font-serif">{state.schoolDetails?.name || 'SMART SCHOOL'}</h1>
                            <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">{state.schoolDetails?.place || 'CHENNAI'}</p>
                            <div className="mt-4 inline-block border-b border-slate-800 pb-1 px-4">
                                <h2 className="text-lg font-black uppercase tracking-wider">{selectedExam?.name} - RESULT SHEET</h2>
                            </div>
                        </div>

                        {/* Class Info Row */}
                        <div className="flex justify-between items-end mb-3 border-b border-slate-300 pb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Class:</span>
                                <span className="text-lg font-black">{selectedClass?.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Class Teacher:</span>
                                <span className="text-sm font-bold">{classTeacher?.name}</span>
                            </div>
                        </div>

                        {/* Marks Table */}
                        <div className="w-full mb-12">
                            <table className="w-full text-left whitespace-nowrap border-collapse border border-slate-800 text-[10px]">
                                <thead>
                                    <tr className="bg-slate-100 text-slate-900 uppercase font-black tracking-wider h-8">
                                        <th className="border border-slate-800 w-10 text-center align-middle">S.No</th>
                                        <th className="border border-slate-800 pl-3 w-40 align-middle">Student Name</th>
                                        {selectedExam.subjectConfigs.map((config: any) => {
                                            const sub = state.subjects.find((s: any) => s.id === config.subjectId);
                                            // In Portrait Mode, show Short Code or first 3 letters
                                            const label = orientation === 'portrait' 
                                                ? (sub?.shortCode || sub?.name.substring(0, 3).toUpperCase()) 
                                                : (sub?.name || 'SUB');

                                            return (
                                                <th key={config.subjectId} className="border border-slate-800 text-center px-1 max-w-[50px] align-middle">
                                                    {label}
                                                </th>
                                            )
                                        })}
                                        <th className="border border-slate-800 text-center bg-slate-200 px-1 w-12 align-middle">Total</th>
                                        <th className="border border-slate-800 text-center px-1 w-12 align-middle">%</th>
                                        <th className="border border-slate-800 text-center w-10 align-middle">Rank</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.map((data: any, idx: number) => (
                                        <tr key={data.student.id} className="h-7 hover:bg-slate-50">
                                            <td className="border border-slate-800 text-center font-bold text-slate-600 align-middle py-1">{idx + 1}</td>
                                            <td className={`border border-slate-800 font-bold uppercase text-slate-900 pl-3 truncate align-middle py-1 ${orientation === 'portrait' ? 'max-w-[120px]' : 'max-w-[200px]'}`}>
                                                {data.student.name}
                                            </td>
                                            {selectedExam.subjectConfigs.map((config: any) => {
                                                const subResult = data.subjects.find((s: any) => s.id === config.subjectId);
                                                return (
                                                    <td key={config.subjectId} className={`border border-slate-800 text-center font-medium align-middle py-1 ${orientation === 'portrait' ? 'text-[9px]' : ''} pb-2`}>
                                                        {subResult ? (
                                                            <span>
                                                                {consolidatedDisplayMode === 'marks' && subResult.total}
                                                                {consolidatedDisplayMode === 'grade' && subResult.grade}
                                                                {consolidatedDisplayMode === 'both' && (
                                                                    <>
                                                                        <span className="font-bold">{subResult.total}</span>
                                                                        <span className="text-[8px] ml-0.5 text-slate-500 font-normal">({subResult.grade})</span>
                                                                    </>
                                                                )}
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-300">-</span>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                            <td className="border border-slate-800 text-center font-black bg-slate-50 text-sm align-middle py-1">
                                                {data.grandTotal}
                                            </td>
                                            <td className="border border-slate-800 text-center font-bold align-middle py-1">
                                                {data.percentage.toFixed(0)}%
                                            </td>
                                            <td className="border border-slate-800 text-center font-bold align-middle py-1">
                                                {idx + 1}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer Signatures (Only 2 for Consolidated: CT and HM) */}
                        <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
                             <div className="text-center w-48">
                                <div className="border-b border-slate-800 mb-2"></div>
                                <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Class Teacher</p>
                            </div>
                            <div className="text-center w-48">
                                <div className="border-b border-slate-800 mb-2"></div>
                                <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Headmaster</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {viewMode === 'progress_card' && (
                <div className="space-y-6">
                    <div className="flex justify-end print:hidden">
                        <select 
                           className="bg-white border border-slate-200 rounded-xl px-4 py-2 font-bold text-sm outline-none"
                           value={selectedStudentId}
                           onChange={(e) => setSelectedStudentId(e.target.value)}
                        >
                            <option value="all">Whole Class (Print All)</option>
                            {reportData.map((d: any) => (
                                <option key={d.student.id} value={d.student.id}>{d.student.name}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-8 print:gap-0 print:block">
                        {selectedStudentId === 'all' ? (
                            reportData.map((data: any) => (
                                <ProgressCardA5 key={data.student.id} data={data} selectedExam={selectedExam} selectedClass={selectedClass} settings={settings} schoolDetails={state.schoolDetails} classTeacher={classTeacher} />
                            ))
                        ) : (
                             <ProgressCardA5 data={reportData.find((d: any) => d.student.id === selectedStudentId)} selectedExam={selectedExam} selectedClass={selectedClass} settings={settings} schoolDetails={state.schoolDetails} classTeacher={classTeacher} />
                        )}
                    </div>
                </div>
            )}
          </>
      ) : (
          <div className="bg-white p-24 rounded-[3rem] text-center border-4 border-dashed border-slate-100 flex flex-col items-center justify-center print:hidden">
             <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mb-6 text-blue-600 shadow-inner"><Award size={32} /></div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Select Class & Exam to Generate Reports.</p>
          </div>
      )}
    </div>
  );
};

export default Reports;
