import React, { useState, useMemo } from 'react';
import type { Transaction, FixedDeposit } from '../types';
import Card from './ui/Card';
import { useTranslation } from '../contexts/LanguageContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './ui/Button';
import { motion } from 'framer-motion';

interface CalendarEvent {
    type: string;
    name: string;
    date: Date;
}

const Calendar: React.FC<{ transactions: Transaction[]; fds: FixedDeposit[] }> = ({ transactions, fds }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { t } = useTranslation();

  const financialEvents = useMemo(() => {
    const events: CalendarEvent[] = [];
    
    transactions.forEach(t => {
      if(t.type === 'expense') {
        const eventDate = new Date(t.date);
        eventDate.setUTCHours(0,0,0,0);
        events.push({ type: 'expense', name: t.name, date: eventDate });
      }
    });

    fds.forEach(fd => {
      const eventDate = new Date(fd.maturityDate);
      eventDate.setUTCHours(0,0,0,0);
      events.push({ type: 'fd', name: `FD Matures: ${fd.bankName}`, date: eventDate });
    });

    return events;
  }, [transactions, fds]);

  const eventsByDate = useMemo(() => {
    const eventMap: { [key: string]: CalendarEvent[] } = {};
    financialEvents.forEach(event => {
        const dateKey = event.date.toDateString();
        if(!eventMap[dateKey]) eventMap[dateKey] = [];
        eventMap[dateKey].push(event);
    });
    return eventMap;
  }, [financialEvents]);

  const selectedDateEvents = eventsByDate[selectedDate.toDateString()] || [];

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();
  
  const calendarDays = [];
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="border-r border-b border-[var(--border-subtle)]"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateKey = date.toDateString();
    const eventsForDay = eventsByDate[dateKey] || [];
    
    const isToday = new Date().toDateString() === dateKey;
    const isSelected = selectedDate.toDateString() === dateKey;

    calendarDays.push(
      <div 
        key={day} 
        className={`relative border-r border-b border-[var(--border-subtle)] p-1 sm:p-1.5 min-h-[60px] sm:min-h-[90px] flex flex-col cursor-pointer transition-colors duration-300 ${isSelected ? 'bg-[var(--accent-primary)]/20' : 'hover:bg-[var(--border-subtle)]/50'}`}
        onClick={() => setSelectedDate(date)}
      >
        <time dateTime={date.toISOString()} className={`font-bold text-xs self-start z-10 ${isToday ? 'bg-[var(--accent-primary)] text-[var(--icon-color-on-accent)] rounded-full h-5 w-5 flex items-center justify-center' : ''}`}>
          {day}
        </time>
        <div className="mt-1 flex flex-wrap gap-1">
            {eventsForDay.slice(0, 3).map((event, index) => (
                <motion.div 
                    key={index} 
                    className={`h-1.5 w-1.5 rounded-full ${event.type === 'expense' ? 'bg-[var(--accent-negative)]' : 'bg-[var(--accent-positive)]'}`} 
                    title={event.name}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                />
            ))}
        </div>
      </div>
    );
  }
  
  const changeMonth = (offset: number) => {
      setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">{t('calendar.title')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4 px-2">
                <Button variant="secondary" size="sm" onClick={() => changeMonth(-1)}><ChevronLeft /></Button>
                <h2 className="text-lg sm:text-xl font-bold text-center">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <Button variant="secondary" size="sm" onClick={() => changeMonth(1)}><ChevronRight /></Button>
            </div>
            <div className="grid grid-cols-7 border-t border-l border-[var(--border-subtle)]">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-bold p-2 border-r border-b border-[var(--border-subtle)] text-[var(--text-secondary)] text-[10px] sm:text-xs">{day}</div>
            ))}
            {calendarDays}
            </div>
        </Card>
        <Card>
            <h2 className="text-lg font-bold mb-4 border-b border-[var(--border-subtle)] pb-2">
                Events for {selectedDate.toLocaleDateString('default', { month: 'long', day: 'numeric' })}
            </h2>
            {selectedDateEvents.length > 0 ? (
                <ul className="space-y-3">
                    {selectedDateEvents.map((event, index) => (
                        <motion.li 
                            key={index} 
                            className="flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                        >
                            <div className={`mt-1.5 h-3 w-3 rounded-full flex-shrink-0 mr-3 ${event.type === 'expense' ? 'bg-[var(--accent-negative)]' : 'bg-[var(--accent-positive)]'}`}></div>
                            <div>
                                <p className="font-semibold text-[var(--text-primary)] text-sm">{event.name}</p>
                                <p className="text-xs text-[var(--text-secondary)] capitalize">{event.type === 'fd' ? 'FD Maturity' : 'Bill Payment'}</p>
                            </div>
                        </motion.li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-sm text-[var(--text-secondary)] pt-8">No events for this day.</p>
            )}
        </Card>
      </div>
    </div>
  );
};

export default Calendar;
