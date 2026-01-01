
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
                if (!conf.included) return;
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
        <div className="space-y-4 animate-fade-scale">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-[2rem] p-6 text-white shadow-premium relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl font-black shadow-lg">
                            {student.name.charAt(0)}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="bg-white/20 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest backdrop-blur-sm">Student Portal</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                            </div>
                            <h1 className="text-2xl font-black mt-1 leading-none">Hi, {student.name.split(' ')[0]}!</h1>
                            <p className="text-blue-100/80 font-bold text-[10px] mt-1 uppercase tracking-wider">Class {myClass?.name} &bull; Roll #{student.admissionNo}</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-center min-w-[80px]">
                            <p className="text-[8px] uppercase font-black text-blue-200 mb-0.5 tracking-widest">Global Rank</p>
                            <p className="text-xl font-black">{myRank}<span className="text-[10px] font-bold opacity-60 ml-0.5">/ {myStudents.length}</span></p>
                        </div>
                    </div>
                </div>

                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="native-card !p-4 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm"><CheckCircle2 size={20} /></div>
                        <div>
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Attendance</p>
                            <h3 className="text-lg font-black text-slate-800">{attendance}%</h3>
                        </div>
                    </div>
                </div>
                <div className="native-card !p-4 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><Percent size={20} /></div>
                        <div>
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Avg. Score</p>
                            <h3 className="text-lg font-black text-slate-800">{myPerformance.overallPercentage.toFixed(1)}%</h3>
                        </div>
                    </div>
                </div>
                <div className="native-card !p-4 flex items-center justify-between group col-span-2 lg:col-span-1">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shadow-sm"><Star size={20} /></div>
                        <div>
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Total Marks</p>
                            <h3 className="text-lg font-black text-slate-800">{myPerformance.totalObtained} <span className="text-[10px] text-slate-300">/ {myPerformance.totalMax}</span></h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="native-card !p-5">
                    <h3 className="text-sm font-black text-slate-800 mb-6 flex items-center uppercase tracking-widest">
                        <TrendingUp className="mr-2 text-blue-500" size={16} /> Progress Chart
                    </h3>
                    <div className="h-48 w-full mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={myPerformance.examResults}>
                                <defs>
                                    <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 8, fontWeight: 900, fill: '#94a3b8' }} hide />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 8, fontWeight: 900, fill: '#94a3b8' }} domain={[0, 100]} width={25} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-premium)', fontSize: '10px' }}
                                />
                                <Area type="monotone" dataKey="percentage" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorPerf)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="native-card !p-5">
                    <h3 className="text-sm font-black text-slate-800 mb-6 flex items-center uppercase tracking-widest">
                        <UserIcon className="mr-2 text-indigo-500" size={16} /> Student Bio
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: "DOB", val: student.dob, icon: Calendar, color: 'text-blue-500 bg-blue-50' },
                            { label: "Father", val: student.fatherName || 'Not Listed', icon: UserIcon, color: 'text-indigo-500 bg-indigo-50' },
                            { label: "Category", val: student.category, icon: Award, color: 'text-purple-500 bg-purple-50' },
                            { label: "Address", val: student.address, icon: MapPin, color: 'text-rose-500 bg-rose-50' },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                                <item.icon size={14} className={`${item.color.split(' ')[0]} mb-2`} />
                                <p className="text-[7px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{item.label}</p>
                                <p className="text-[11px] font-bold text-slate-800 truncate">{item.val || '-'}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    // --- VIEW: COURSES ---
    const renderCourses = () => (
        <div className="space-y-4 animate-fade-scale">
            <div className="flex justify-between items-end px-2">
                <div>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">My Journey</p>
                    <h1 className="text-2xl font-black text-slate-900">Enrolled Subjects</h1>
                </div>
                <div className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                    {mySubjects.length} Courses
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {mySubjects.map((sub: any, idx) => {
                    const iconObj = LEARNING_ICONS.find(i => sub.name.trim().toLowerCase().includes(i.label.toLowerCase())) || LEARNING_ICONS[idx % LEARNING_ICONS.length];
                    return (
                        <div key={sub.id} className="native-card !p-5 group hover:border-blue-200 transition-all relative overflow-hidden">
                            <div className={`absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br ${iconObj.color.replace('text-', 'from-').replace('400', '100')} to-transparent rounded-full opacity-20 group-hover:scale-110 transition-transform`}></div>

                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm border border-slate-50">
                                    <span className={`${iconObj.color} text-xl`}>{iconObj.icon}</span>
                                </div>
                                <h3 className="text-lg font-black text-slate-800 leading-tight mb-1">{sub.name}</h3>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5">{sub.shortCode || 'CORE'}</p>

                                <div className="flex items-center gap-2.5 pt-4 border-t border-slate-50">
                                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-[10px] shadow-sm">
                                        {sub.teacher?.name.charAt(0) || 'T'}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-[7px] font-black uppercase text-slate-400 tracking-widest">Instructor</p>
                                        <p className="text-[11px] font-bold text-slate-700 truncate">{sub.teacher?.name || 'Not Assigned'}</p>
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
        <div className="space-y-6 animate-fade-scale">
            <div className="px-2">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Academic Performance</p>
                <h1 className="text-2xl font-black text-slate-900">Scorecard Analysis</h1>
            </div>

            {myExams.length > 0 ? myExams.map((exam: any) => {
                // Calculate results for this specific exam
                let examMax = 0;
                let examObt = 0;
                const subjectsData = exam.subjectConfigs
                    .filter((c: any) => c.included)
                    .map((conf: any) => {
                        const sub = state.subjects.find((s: any) => s.id === conf.subjectId);
                        const mark = state.marks.find((m: any) => m.examId === exam.id && m.subjectId === conf.subjectId && m.studentId === student.id);

                        const te = mark?.teMark === 'A' ? 0 : parseInt(mark?.teMark || '0');
                        const ce = mark?.ceMark === 'A' ? 0 : parseInt(mark?.ceMark || '0');
                        const total = te + ce;
                        const max = (conf.maxTe || 0) + (conf.maxCe || 0);
                        const percent = max > 0 ? (total / max) * 100 : 0;

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
                    <div key={exam.id} className="native-card !p-0 overflow-hidden mb-4">
                        <div className="p-5 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-premium">
                                    <FileText size={20} />
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="font-black text-slate-800 text-sm truncate">{exam.name}</h3>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{subjectsData.length} Subjects</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <div className="text-right">
                                    <p className="text-[7px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Overall</p>
                                    <p className={`text-sm font-black ${isPass ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {examPercent.toFixed(1)}% <span className="bg-white px-1.5 py-0.5 rounded border border-slate-100 text-[10px] ml-1">{examGrade}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="divide-y divide-slate-50">
                            {subjectsData.map((row: any, idx: number) => (
                                <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-slate-800 text-xs truncate">{row.name}</p>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mt-1">TE: {row.te} • CE: {row.ce}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-xs font-black text-slate-800">{row.total}<span className="text-[9px] text-slate-300 ml-0.5">/{row.max}</span></p>
                                            <p className={`text-[8px] font-black ${row.isPass ? 'text-emerald-500' : 'text-rose-500'} uppercase`}>{row.isPass ? 'Pass' : 'Fail'}</p>
                                        </div>
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600 border border-slate-50">
                                            {row.grade}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }) : (
                <div className="native-card py-20 text-center text-slate-400 font-bold opacity-50">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={28} />
                    </div>
                    No exam records found.
                </div>
            )}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-0">
            {view === 'dashboard' && renderDashboard()}
            {view === 'courses' && renderCourses()}
            {view === 'grades' && renderGrades()}
        </div>
    );
};

export default StudentDashboard;
