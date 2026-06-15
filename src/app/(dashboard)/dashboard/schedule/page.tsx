'use client';

import { useState } from 'react';
import { APPOINTMENTS, CLIENTS } from '../coachData';
import { ChevronLeft, ChevronRight, Clock, Video, MapPin, User, Plus, X } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DURATIONS = ['30 min', '45 min', '60 min', '90 min'];

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  confirmed: { bg: '#f0fdf4', color: '#15803d', label: 'Confirmed' },
  pending:   { bg: '#fffbeb', color: '#a16207', label: 'Pending' },
  completed: { bg: 'var(--surface-muted)', color: 'var(--text-muted)', label: 'Completed' },
};

type AvailabilitySlot = { id: number; day: number; time: string; duration: string; type: 'online' | 'in-person' };

export default function SchedulePage() {
  const [currentMonth, setCurrentMonth] = useState(5); // June
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDay, setNewDay] = useState(1);
  const [newTime, setNewTime] = useState('');
  const [newDuration, setNewDuration] = useState('60 min');
  const [newType, setNewType] = useState<'online' | 'in-person'>('online');

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // Monday-indexed

  const appointmentDays = new Set(APPOINTMENTS.map((a) => a.day));
  const availabilityDays = new Set(availability.map((a) => a.day));
  const selectedAppointments = selectedDay ? APPOINTMENTS.filter((a) => a.day === selectedDay) : [];
  const selectedAvailability = selectedDay ? availability.filter((a) => a.day === selectedDay) : [];

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
    else setCurrentMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
    else setCurrentMonth((m) => m + 1);
  };

  const handleAddAvailability = () => {
    const time = newTime.trim();
    if (!time) return;
    setAvailability((prev) => [
      ...prev,
      { id: prev.length ? Math.max(...prev.map((s) => s.id)) + 1 : 1, day: newDay, time, duration: newDuration, type: newType },
    ]);
    setNewTime('');
    setShowAddForm(false);
  };

  const removeAvailability = (id: number) => {
    setAvailability((prev) => prev.filter((s) => s.id !== id));
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

      {/* View toggle + add availability */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
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
        <button
          onClick={() => setShowAddForm((s) => !s)}
          className="flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-lg text-white"
          style={{ background: 'var(--primary)' }}
        >
          {showAddForm ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Add availability</>}
        </button>
      </div>

      {/* Add availability form */}
      {showAddForm && (
        <div className="rounded-2xl p-5 space-y-4" style={{ background: 'var(--surface)' }}>
          <h2 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>New availability slot</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Day</label>
              <select
                value={newDay}
                onChange={(e) => setNewDay(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ background: 'var(--surface-muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                {Array.from({ length: daysInMonth }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>{MONTHS[currentMonth]} {i + 1}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Time</label>
              <input
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                placeholder="e.g. 2:00 PM"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ background: 'var(--surface-muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Duration</label>
              <select
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ background: 'var(--surface-muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                {DURATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Session type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as 'online' | 'in-person')}
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ background: 'var(--surface-muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <option value="online">Online</option>
                <option value="in-person">In-person</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleAddAvailability}
            className="text-sm font-semibold px-4 py-2.5 rounded-xl text-white"
            style={{ background: 'var(--primary)' }}
          >
            Add slot
          </button>
        </div>
      )}

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
                const hasAvailability = availabilityDays.has(day);
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
                    {!isSelected && (hasAppointment || hasAvailability) && (
                      <span className="absolute bottom-1 flex items-center gap-0.5">
                        {hasAppointment && (
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--primary)' }} />
                        )}
                        {hasAvailability && (
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#4f46e5' }} />
                        )}
                      </span>
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
              <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#4f46e5' }} />
                Open availability
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

                {selectedAvailability.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Your availability</h3>
                    <div className="space-y-3">
                      {selectedAvailability.map((slot) => (
                        <div key={slot.id} className="rounded-xl p-4 flex items-center justify-between gap-2"
                          style={{ background: 'var(--surface)', border: '1px dashed var(--border)' }}>
                          <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                            <span className="flex items-center gap-1"><Clock size={11} />{slot.time}</span>
                            <span>{slot.duration}</span>
                            {slot.type === 'online'
                              ? <span className="flex items-center gap-1"><Video size={11} />Online</span>
                              : <span className="flex items-center gap-1"><MapPin size={11} />In-person</span>
                            }
                          </div>
                          <button onClick={() => removeAvailability(slot.id)} aria-label="Remove availability" style={{ color: 'var(--text-muted)' }}>
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
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

          {availability.length > 0 && (
            <>
              <h3 className="font-semibold text-sm pt-2" style={{ color: 'var(--foreground)' }}>Your Availability</h3>
              {[...availability].sort((a, b) => a.day - b.day).map((slot) => (
                <div key={slot.id} className="rounded-2xl p-5 flex items-center gap-4"
                  style={{ background: 'var(--surface)', border: '1px dashed var(--border)' }}>
                  <div
                    className="w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-white"
                    style={{ background: '#4f46e5' }}
                  >
                    <span className="text-xs font-medium opacity-80">{MONTHS[currentMonth].slice(0, 3)}</span>
                    <span className="text-xl font-bold leading-none">{slot.day}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Open slot</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <span className="flex items-center gap-1"><Clock size={11} />{slot.time} · {slot.duration}</span>
                      {slot.type === 'online'
                        ? <span className="flex items-center gap-1"><Video size={11} />Online</span>
                        : <span className="flex items-center gap-1"><MapPin size={11} />In-person</span>
                      }
                    </div>
                  </div>
                  <button
                    onClick={() => removeAvailability(slot.id)}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg flex-shrink-0"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
