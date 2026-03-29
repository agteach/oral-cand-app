"use client";

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Charts({ patients }: any) {
    const total = patients.length;

    const positive = patients.filter((p: any) => p.oralCandidiasis).length;
    const negative = total - positive;

    const pieData = [
        { name: "Positive", value: positive },
        { name: "Negative", value: negative },
    ];

    const artYes = patients.filter((p: any) => p.artInitiated).length;
    const artNo = total - artYes;

    const barData = [
        { name: "ART Yes", value: artYes },
        { name: "ART No", value: artNo },
    ];

    const COLORS = ["#3B82F6", "#EF4444"];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

            {/* Pie Chart */}
            <div className="bg-white p-4 shadow rounded">
                <h3 className="mb-2 font-semibold">Candidiasis Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie data={pieData} dataKey="value" outerRadius={80}>
                            {pieData.map((_, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="bg-white p-4 shadow rounded">
                <h3 className="mb-2 font-semibold">ART Coverage</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={barData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#10B981" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
}