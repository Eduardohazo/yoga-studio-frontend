import React, { useEffect, useState } from 'react';
import { getSchedules } from '../../api/scheduleApi';
import ScheduleGrid from '../../components/schedule/ScheduleGrid';
import PageWrapper from '../../components/layout/PageWrapper';
import { format, addDays, startOfWeek } from 'date-fns';

const SchedulePage = () => {
 const [schedules, setSchedules] = useState([]);
 const [loading, setLoading] = useState(true);
 const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

 const load = async () => {
 setLoading(true);
 try {
 const from = format(weekStart, 'yyyy-MM-dd');
 const to = format(addDays(weekStart, 6), 'yyyy-MM-dd');
 const res = await getSchedules({ from, to });
 setSchedules(res.data.data);
 } catch { setSchedules([]); }
 finally { setLoading(false); }
 };

 useEffect(() => { load(); }, [weekStart]);

 return (
 <PageWrapper>
 <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
 <div>
 <h1 className="font-serif text-4xl font-bold text-gray-800 mb-1">Class Schedule</h1>
 <p className="text-gray-500">
 Week of {format(weekStart, 'MMM d')} – {format(addDays(weekStart, 6), 'MMM d, yyyy')}
 </p>
 </div>
 <div className="flex gap-2">
 <button onClick={() => setWeekStart(addDays(weekStart, -7))} className="btn-secondary px-4 py-2 text-sm">← Prev week</button>
 <button onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))} className="btn-secondary px-4 py-2 text-sm">Today</button>
 <button onClick={() => setWeekStart(addDays(weekStart, 7))} className="btn-secondary px-4 py-2 text-sm">Next week →</button>
 </div>
 </div>
 <ScheduleGrid schedules={schedules} loading={loading} onRefresh={load} />
 </PageWrapper>
 );
};

export default SchedulePage;