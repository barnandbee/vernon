'use client';

import { useState } from 'react';
import OrgPrivacyNote from '@/components/OrgPrivacyNote';
import { ChevronLeft, ChevronRight, Clock, Video, MapPin, Plus, User, CheckCircle2 } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

type Session = {
  id: number; day: number; title: string; coach: string;
  time: string; duration: string; type: 'online' | 'in-person';
  status: 'confirmed' | 'pending' | 'completed';
  notes?: string;
};

const SESSIONS: Session[] = [
  { id: 1, day: 12, title: 'Career Strategy Session', coach: 'Sarah Mitchell', time: '10:00 AM', duration: '60 min', type: 'online', status: 'confirmed', notes: 'Bring your 6-month plan notes' },
  { id: 2, day: 14, title: 'Career Goals Review', coach: 'James Park', time: '2:00 PM', duration: '45 min', type: 'online', status: 'confirmed' },
  { id: 3, day: 19, title: 'Interview Prep Session', coach: 'Sarah Mitchell', time: '11:00 AM', duration: '60 min', type: 'in-person', status: 'pending' },
  { id: 4, day: 25, title: 'Monthly Check-in', coach: 'James Park', time: '3:30 PM', duration: '30 min', type: 'online', status: 'confirmed' },
  { id: 5, day: 3, title: 'Onboarding Review', coach: 'Sarah Mitchell', time: '9:00 AM', duration: '45 min', type: 'online', status: 'completed' },
];

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  confirmed: { bg: '#f0fdf4', color: '#15803d', label: 'Confirmed' },
  pending:   { bg: '#fffbeb', color: '#a16207', label: 'Pending' },
  completed: { bg: 'var(--surface-muted)', color: 'var(--text-muted)', label: 'Completed' },
};

const COACHES = [
  { name: 'Sarah Mitchell', role: 'Career Strategy & Leadership', avatar: 'SM', available: true },
  { name: 'James Park', role: 'Career Transitions & Branding', avatar: 'JP', available: true },
];

const AVAILABLE_SLOTS = [
  { coach: 'Sarah Mitchell', day: 16, time: '9:00 AM', duration: '60 min' },
  { coach: 'Sarah Mitchell', day: 16, time: '11:00 AM', duration: '60 min' },
  { coach: 'James Park', day: 17, time: '2:00 PM', duration: '45 min' },
  { coach: 'James Park', day: 18, time: '10:00 AM', duration: '60 min' },
];

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(5); // June
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // Monday-indexed

  const sessionDays = new Set(SESSIONS.map((s) => s.day));
  const selectedSessions = selectedDay ? SESSIONS.filter((s) => s.day === selectedDay) : [];
  const availableOnDay = selectedDay ? AVAILABLE_SLOTS.filter((s) => s.day === selectedDay) : [];

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
    else setCurrentMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
    else setCurrentMonth((m) => m + 1);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Coaching Calendar</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Manage and book sessions with your coaches
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium"
          style={{ background: 'var(--primary)' }}
        >
          <Plus size={16} />
          Book a Session
        </button>
      </div>

      <OrgPrivacyNote shared="that you have upcoming or completed coaching sessions — not session notes" />

      {/* View toggle */}
      <div className="flex items-center gap-2">
        {(['calendar', 'list'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all"
            style={view === v
              ? { background: 'var(--primary)', color: '#fff' }
              : { background: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }
            }
          >
            {v === 'calendar' ? 'Calendar View' : 'List View'}
          </button>
        ))}
      </div>

      {view === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar grid */}
          <div className="lg:col-span-2 rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-5">
              <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100" style={{ color: 'var(--text-muted)' }}>
                <ChevronLeft size={18} />
              </button>
              <h2 className="font-bold text-base" style={{ color: 'var(--foreground)' }}>
                {MONTHS[currentMonth]} {currentYear}
              </h2>
              <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100" style={{ color: 'var(--text-muted)' }}>
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-xs font-medium pb-2" style={{ color: 'var(--text-muted)' }}>{d}</div>
              ))}
            </div>

            {/* Calendar cells */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const hasSession = sessionDays.has(day);
                const hasAvailable = AVAILABLE_SLOTS.some((s) => s.day === day);
                const isSelected = selectedDay === day;
                const isToday = day === 9 && currentMonth === 5 && currentYear === 2026;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(isSelected ? null : day)}
                    className="aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-medium transition-all relative"
                    style={isSelected
                      ? { background: 'var(--primary)', color: '#fff' }
                      : isToday
                      ? { background: '#e8f4f8', color: 'var(--primary)' }
                      : { color: 'var(--foreground)' }
                    }
                  >
                    {day}
                    {hasSession && !isSelected && (
                      <span
                        className="absolute bottom-1 w-1.5 h-1.5 rounded-full"
                        style={{ background: 'var(--primary)' }}
                      />
                    )}
                    {!hasSession && hasAvailable && !isSelected && (
                      <span
                        className="absolute bottom-1 w-1.5 h-1.5 rounded-full"
                        style={{ background: '#10b981' }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: 'var(--primary)' }} />
                Booked session
              </div>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#10b981' }} />
                Available slots
              </div>
            </div>
          </div>

          {/* Side panel */}
          <div className="space-y-4">
            {selectedDay ? (
              <>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
                  {MONTHS[currentMonth]} {selectedDay}
                </h3>

                {selectedSessions.length > 0 && (
                  <div className="space-y-3">
                    {selectedSessions.map((s) => {
                      const st = STATUS_STYLE[s.status];
                      return (
                        <div key={s.id} className="rounded-xl p-4" style={{ background: 'var(--surface)' }}>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{s.title}</p>
                            <span className="text-xs px-2 py-0.5 rounded-lg font-medium flex-shrink-0"
                              style={{ background: st.bg, color: st.color }}>
                              {st.label}
                            </span>
                          </div>
                          <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>with {s.coach}</p>
                          <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                            <span className="flex items-center gap-1"><Clock size={11} />{s.time}</span>
                            <span>{s.duration}</span>
                            {s.type === 'online'
                              ? <span className="flex items-center gap-1"><Video size={11} />Online</span>
                              : <span className="flex items-center gap-1"><MapPin size={11} />In-person</span>
                            }
                          </div>
                          {s.notes && (
                            <p className="text-xs mt-2 italic" style={{ color: 'var(--text-muted)' }}>{s.notes}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {availableOnDay.length > 0 && (
                  <div>
                    <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Available Slots</p>
                    <div className="space-y-2">
                      {availableOnDay.map((slot, i) => (
                        <div key={i} className="rounded-xl p-3 flex items-center justify-between"
                          style={{ background: '#f0fdf4' }}>
                          <div>
                            <p className="text-xs font-medium" style={{ color: '#15803d' }}>{slot.time} · {slot.duration}</p>
                            <p className="text-xs" style={{ color: '#166534' }}>{slot.coach}</p>
                          </div>
                          <button className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                            style={{ background: '#16a34a' }}>
                            Book
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedSessions.length === 0 && availableOnDay.length === 0 && (
                  <div className="rounded-xl p-4 text-center" style={{ background: 'var(--surface)' }}>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No sessions on this day</p>
                    <button className="text-xs mt-2 font-medium" style={{ color: 'var(--primary)' }}>
                      Request a session
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div>
                <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Your Coaches</h3>
                <div className="space-y-3">
                  {COACHES.map((c) => (
                    <div key={c.name} className="rounded-xl p-4 flex items-start gap-3"
                      style={{ background: 'var(--surface)' }}>
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                        style={{ background: 'var(--primary)' }}
                      >
                        {c.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{c.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{c.role}</p>
                        {c.available && (
                          <span className="inline-flex items-center gap-1 text-xs mt-1.5" style={{ color: '#15803d' }}>
                            <CheckCircle2 size={11} /> Available
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs mt-3 text-center" style={{ color: 'var(--text-muted)' }}>
                  Tap a date to view or book sessions
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* List view */
        <div className="space-y-3">
          {SESSIONS.sort((a, b) => a.day - b.day).map((s) => {
            const st = STATUS_STYLE[s.status];
            return (
              <div key={s.id} className="rounded-2xl p-5 flex items-center gap-4" style={{ background: 'var(--surface)' }}>
                <div
                  className="w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-white"
                  style={{ background: s.status === 'completed' ? 'var(--text-muted)' : 'var(--primary)' }}
                >
                  <span className="text-xs font-medium opacity-80">{MONTHS[currentMonth].slice(0, 3)}</span>
                  <span className="text-xl font-bold leading-none">{s.day}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{s.title}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <User size={11} style={{ color: 'var(--text-muted)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.coach}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span className="flex items-center gap-1"><Clock size={11} />{s.time} · {s.duration}</span>
                    {s.type === 'online'
                      ? <span className="flex items-center gap-1"><Video size={11} />Online</span>
                      : <span className="flex items-center gap-1"><MapPin size={11} />In-person</span>
                    }
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-lg font-medium flex-shrink-0"
                  style={{ background: st.bg, color: st.color }}>
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
