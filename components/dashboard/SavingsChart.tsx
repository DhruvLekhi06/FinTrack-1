import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Transaction } from '../../types';

interface SavingsChartProps {
    transactions: Transaction[];
}

const SavingsChart: React.FC<SavingsChartProps> = ({ transactions }) => {
    const savingsData = useMemo(() => {
        const monthlyData: { [key: string]: { income: number, expense: number } } = {};

        transactions.forEach(t => {
            const month = new Date(t.date).toLocaleString('default', { month: 'short' });
            if (!monthlyData[month]) {
                monthlyData[month] = { income: 0, expense: 0 };
            }
            if (t.type === 'income') {
                monthlyData[month].income += t.amount;
            } else {
                monthlyData[month].expense += t.amount;
            }
        });

        const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
            return new Date(`1 ${a} 2024`).getMonth() - new Date(`1 ${b} 2024`).getMonth();
        });

        return sortedMonths.map(month => ({
            name: month,
            Net: monthlyData[month].income - monthlyData[month].expense
        }));
    }, [transactions]);
    
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={savingsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} >
                <defs>
                    <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickFormatter={(value) => `₹${Number(value).toLocaleString('en-IN', { notation: 'compact' })}`} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'var(--surface-primary)',
                        borderColor: 'var(--border-subtle)',
                        color: 'var(--text-primary)',
                        borderRadius: '0.75rem',
                    }}
                    formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                />
                <Area type="monotone" dataKey="Net" stroke="var(--accent-primary)" strokeWidth={3} fill="url(#savingsGradient)" />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default SavingsChart;