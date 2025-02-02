import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Title } from "chart.js";

const verticalLinePlugin = {
    id: 'verticalLinePlugin',
    beforeDraw: (chart) => {
        const toolTip = document.getElementById("chartjs-tooltip")
        if (chart.tooltip._active && chart.tooltip._active.length) {
            const ctx = chart.ctx;
            const activePoint = chart.tooltip._active[0];
            const x = activePoint.element.x;
            const topY = chart.scales.y.top;
            const bottomY = chart.scales.y.bottom;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, topY);
            ctx.lineTo(x, bottomY);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'gray';
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.restore();
            if (toolTip) {
                toolTip.style.display = "block"
            }
        } else if (toolTip) {
            toolTip.style.display = "none"
        }
    },
};

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend, verticalLinePlugin);

const LineChart = ({ lineData }) => {
    const [chartOptions, setChartOptions] = useState({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: "white",
                    font: {
                        size: 12,
                    },
                },
                position: 'top',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                enabled: false,
                position: 'nearest',
                external: function (context) {
                    let tooltipEl = document.getElementById('chartjs-tooltip');
                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-tooltip';
                        tooltipEl.style.position = 'absolute';
                        tooltipEl.style.background = 'rgba(0, 0, 0, 0.9)';
                        tooltipEl.style.color = 'white';
                        tooltipEl.style.padding = '20px';
                        tooltipEl.style.borderRadius = '8px';
                        tooltipEl.style.pointerEvents = 'none';
                        tooltipEl.style.fontSize = "14px";
                        tooltipEl.style.whiteSpace = "nowrap"
                        tooltipEl.style.transform = 'translateX(-50%) translateY(-80%)';
                        tooltipEl.style.maxWidth = "350px"
                        tooltipEl.style.minWidth = "350px";
                        tooltipEl.style.zIndex = 10000;
                        document.body.appendChild(tooltipEl);
                    }
                    const tooltipModel = context.tooltip;
                    if (tooltipModel.opacity === 0) {
                        tooltipEl.style.opacity = "0";
                        return;
                    }
                    tooltipEl.style.opacity = "1";

                    let tooltipText = `<div class="d-flex container-fluid text-center justify-content-center">${tooltipModel.title[0]}</div>`;
                    if (tooltipModel.dataPoints) {
                        tooltipModel.dataPoints.forEach(point => {
                            const unit = ["real", "average"].some(word => point.dataset.label.includes(word)) ? "SEK" : point.dataset.label.toLowerCase().includes("temp") ? "C" : "W"
                            tooltipText += `
                            <div style="display: flex; align-items: center; gap: 5px; white-space: nowrap; " class="row">
                                <div class="col">
                                <span style="width: 10px; height: 10px; background: ${point.dataset.borderColor}; display: inline-block; border-radius: 50%;"></span>&nbsp;${point.dataset.label}:
                                </div>
                                <div class="col text-end">
                                ${point.raw} ${unit}
                                </div>
                            </div>
                         `;
                        });
                    }

                    tooltipEl.innerHTML = tooltipText;
                    let toolTipWidth = 350;
                    const position = context.chart.canvas.getBoundingClientRect();
                    const newPostion = position.left + window.pageXOffset + tooltipModel.caretX;
                    tooltipEl.style.top = position.top + window.pageYOffset + 'px';
                    const maximumRight = "-" + toolTipWidth / 2;
                    const maximumLeft = toolTipWidth / 2;

                    if (newPostion + toolTipWidth / 2 + 20 < window.innerWidth && newPostion > toolTipWidth / 2) {
                        tooltipEl.style.left = newPostion + 'px';
                    } else if (newPostion + toolTipWidth / 2 + 20 < window.innerWidth && newPostion > maximumLeft) {
                        tooltipEl.style.left = toolTipWidth / 2 + "px";
                    } else if (newPostion > toolTipWidth / 2 && newPostion) {
                        tooltipEl.style.right = "-" + toolTipWidth / 2 + "px";
                    };
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: true,
                },
                ticks: {
                    color: "white",
                    maxRotation: window.innerWidth <= 767 ? 90 : 45,
                    minRotation: window.innerWidth <= 767 ? 90 : 0,
                    font: {
                        size: 12,
                    },
                },
                title: {
                    display: true,
                    text: 'Datum',
                    color: "white"
                },
            },
            y: {
                grid: {
                    display: true,
                },
                title: {
                    display: window.innerWidth <= 767 ? false : true,
                    text: lineData.lineDataProp.datasets[0]?.label.includes("real") ? "SEK" : "W",
                    color: "white"
                },
                ticks: {
                    color: "white",

                    font: {
                        size: 12,
                    },
                }
            },
        },
    });
    useEffect(() => {
        const handleResize = () => {
            const toolTip = document.getElementById("chartjs-tooltip")
            if (toolTip) {
                toolTip.style.display = "none"
            }
            setChartOptions((prevOptions) => ({
                ...prevOptions,
                scales: {
                    ...prevOptions.scales,
                    x: {
                        ...prevOptions.scales.x,
                        ticks: {
                            ...prevOptions.scales.x.ticks,
                            maxRotation: window.innerWidth <= 767 ? 90 : 45,
                            minRotation: window.innerWidth <= 767 ? 90 : 0,
                        },
                    },
                    y: {
                        ...prevOptions.scales.y,
                        title: {
                            display: window.innerWidth <= 767 ? false : true
                        }
                    }
                },
            }));
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const { lineDataProp } = lineData;
    return (
        <div className="p-4 shadow-lg rounded-xl chartContainer" >
            <div style={{ height: "100%" }}>
                <Line data={lineDataProp} options={chartOptions} />
            </div>
        </div>
    );
};

export default LineChart;