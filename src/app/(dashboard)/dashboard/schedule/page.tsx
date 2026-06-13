'use client';

import { useState } from 'react';
import { APPOINTMENTS, CLIENTS } from '../coachData';
import { ChevronLeft, ChevronRight, Clock, Video, MapPin, User } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  confirmed: { bg: '#f0fdf4', color: '#15803d', label: 'Confirmed' },
  pending:   { bg: '#fffbeb', color: '#a16207', label: 'Pending' },
  completed: { bg: 'var(--surface-muted)', color: 'var(--text-muted)', label: 'Completed' },
};

export default function SchedulePage() {
  const [currentMonth, setCurrentMonth] = useState(5); // June
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // Monday-indexed

  const appointmentDays = new Set(APPOINTMENTS.map((a) => a.day));
  const selectedAppointments = selectedDay ? APPOINTMENTS.filter((a) => a.day === selectedDay) : [];

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
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Schedule</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          See every upcoming session this month
        </p>
      </div>

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
                const hasAppointment = appointmentDays.has(day);
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
                    {hasAppointment && !isSelected && (
                      <span
                        className="absolute bottom-1 w-1.5 h-1.5 rounded-full"
                        style={{ background: 'var(--primary)' }}
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
                Scheduled session
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

                {selectedAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {selectedAppointments.map((a) => {
                      const st = STATUS_STYLE[a.status];
                      return (
                        <div key={a.id} className="rounded-xl p-4" style={{ background: 'var(--surface)' }}>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{a.title}</p>
                            <span className="text-xs px-2 py-0.5 rounded-lg font-medium flex-shrink-0"
                              style={{ background: st.bg, color: st.color }}>
                              {st.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            <User size={11} style={{ color: 'var(--text-muted)' }} />
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{a.clientName}</p>
                          </div>
                          <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                            <span className="flex items-center gap-1"><Clock size={11} />{a.time}</span>
                            <span>{a.duration}</span>
                            {a.type === 'online'
                              ? <span className="flex items-center gap-1"><Video size={11} />Online</span>
                              : <span className="flex items-center gap-1"><MapPin size={11} />In-person</span>
                            }
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-xl p-4 text-center" style={{ background: 'var(--surface)' }}>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No sessions on this day</p>
                  </div>
                )}
              </>
            ) : (
              <div>
                <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Your Clients</h3>
                <div className="space-y-3">
                  {CLIENTS.map((c) => (
                    <div key={c.id} className="rounded-xl p-4 flex items-center gap-3"
                      style={{ background: 'var(--surface)' }}>
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: c.color }}
                      >
                        {c.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate" style={{ color: 'var(--foreground)' }}>{c.name}</p>
                        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>Next: {c.nextSession}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs mt-3 text-center" style={{ color: 'var(--text-muted)' }}>
                  Tap a date to view that day&apos;s sessions
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* List view */
        <div className="space-y-3">
          {[...APPOINTMENTS].sort((a, b) => a.day - b.day).map((a) => {
            const st = STATUS_STYLE[a.status];
            return (
              <div key={a.id} className="rounded-2xl p-5 flex items-center gap-4" style={{ background: 'var(--surface)' }}>
                <div
                  className="w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-white"
                  style={{ background: a.status === 'completed' ? 'var(--text-muted)' : 'var(--primary)' }}
                >
                  <span className="text-xs font-medium opacity-80">{MONTHS[currentMonth].slice(0, 3)}</span>
                  <span className="text-xl font-bold leading-none">{a.day}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{a.title}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <User size={11} style={{ color: 'var(--text-muted)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{a.clientName}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span className="flex items-center gap-1"><Clock size={11} />{a.time} · {a.duration}</span>
                    {a.type === 'online'
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
