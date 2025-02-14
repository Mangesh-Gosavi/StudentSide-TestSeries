import React, { useRef, useEffect, useState } from "react";
import Chart from "chart.js/auto";
import { useParams } from "react-router-dom";
import StudentResult from "../../services/studentResult";
import "./Chart.css";

const StudentResultChart = () => {
    const [studentId] = useState("shriya");
    const { testId } = useParams();
    const [studentResults, setStudentResults] = useState([]);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await StudentResult.getstudentreports();
                console.log("Fetched Results:", response);
                const newdata = response.filter((item) => item.TestId === testId && item.StudentId === studentId);
                setStudentResults(newdata || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchResults();
    }, [testId, studentId]);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy(); // Destroy previous chart instance
        }

        if (studentResults.length === 0) return;

        const sortedResults = [...studentResults].sort((a, b) => a.TimeTaken - b.TimeTaken);

        // Calculate cumulative time for X and Y in minutes
        let cumulativeTime = 0;
        const cumulativeTimes = [];
        const labels = [];
        const pointColors = []; // Store colors for correct/wrong answers

        sortedResults.forEach((item, index) => {
            // Y-axis progression
            cumulativeTime += item.TimeTaken / 60;
            cumulativeTimes.push(cumulativeTime);
            // Convert seconds to minutes x axis
            labels.push(`Q${index + 1} (${Math.floor(item.TimeTaken)} sec)`);

            // Assign color based on correctness
            pointColors.push(item.Status === "Correct" ? "green" : "red");
        });

        const ctx = chartRef.current.getContext("2d");
        chartInstance.current = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Cumulative Time Progression (Minutes)",
                        data: cumulativeTimes,
                        borderColor: "blue",
                        backgroundColor: "rgba(0, 0, 255, 0.2)",
                        pointBackgroundColor: pointColors, // Change color dynamically
                        pointBorderColor: "black",
                        pointRadius: 6,
                        tension: 0.4,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { 
                        display: true,
                        labels: {
                            font: {
                                size: 30, // Set font size for legend
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            title: (tooltipItem) => tooltipItem[0].label,
                            label: (tooltipItem) => {
                                const index = tooltipItem.dataIndex;
                                const item = sortedResults[index];
                                return `Q${index + 1}: ${item.Question}\n Time Taken: ${item.TimeTaken} sec\n Status: ${item.Status}`;
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        title: { 
                            display: true, 
                            text: "Time Taken per Question(Minutes)",
                            font: {
                                size: 30, // Set font size for X-axis title
                            }
                        },
                        ticks: {
                            autoSkip: false,
                            maxRotation: 45,
                            minRotation: 45,
                        },
                    },
                    y: {
                        title: { 
                            display: true, 
                            text: "Total Time Spent (Minutes)",
                            font: {
                                size: 30, // Set font size for Y-axis title
                            }
                        },
                        min: 0,
                        max: cumulativeTimes[cumulativeTimes.length], // Scale Y-axis to max cumulative time
                    },
                },
            },
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [studentResults]);

    return (
        <div style={{width:"100%" , height:"100%"}}> 
            <div className="chartdashboard">
                <div className="chart-container">
                    <h2 className="chart-title">Student Results for Test: {testId}</h2>
                    <div className="canvas-container">
                        <canvas ref={chartRef} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentResultChart;
