import React from 'react';
import {
    ResponsiveContainer,
    ComposedChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
    Area
} from 'recharts';

interface SignalChartProps {
    data: any[];
    entry: number;
    tp: number;
    sl: number;
    direction: 'long' | 'short';
}

export const SignalChart = ({ data, entry, tp, sl, direction }: SignalChartProps) => {
    // Determine domain padding
    const prices = data.map(d => d.price);
    const minPrice = Math.min(...prices, sl, entry, tp) * 0.995;
    const maxPrice = Math.max(...prices, sl, entry, tp) * 1.005;

    return (
        <div className="w-full h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data}>
                    <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis
                        dataKey="time"
                        stroke="#475569"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        minTickGap={30}
                    />
                    <YAxis
                        domain={[minPrice, maxPrice]}
                        stroke="#475569"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        width={60}
                        tickFormatter={(val) => val.toFixed(2)}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#0f172a",
                            borderColor: "#334155",
                            color: "#f8fafc",
                            borderRadius: "8px",
                            fontSize: "12px",
                        }}
                        itemStyle={{ color: '#fff' }}
                        labelStyle={{ color: '#94a3b8' }}
                    />

                    {/* Price Area */}
                    <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#6366f1"
                        fillOpacity={1}
                        fill="url(#colorPrice)"
                        strokeWidth={2}
                    />

                    {/* Entry Line */}
                    <ReferenceLine y={entry} stroke="#fbbf24" strokeDasharray="3 3" label={{ value: 'ENTRY', fill: '#fbbf24', fontSize: 10, position: 'right' }} />

                    {/* TP Line */}
                    <ReferenceLine y={tp} stroke="#10b981" label={{ value: 'TP', fill: '#10b981', fontSize: 10, position: 'right' }} />

                    {/* SL Line */}
                    <ReferenceLine y={sl} stroke="#f43f5e" label={{ value: 'SL', fill: '#f43f5e', fontSize: 10, position: 'right' }} />

                </ComposedChart>
            </ResponsiveContainer>
        </div>
    )
}
