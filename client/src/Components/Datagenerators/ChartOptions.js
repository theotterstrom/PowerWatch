module.exports = (isMobile, yAxisLabel) => {
    return isMobile ? {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: "white",
                    font: {
                        size: window.innerWidth <= 767 ? 12 : 20,
                    },
                },
                position: 'top',
            },
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
                callbacks: {
                    title: (tooltipItems) => `Datum: ${tooltipItems[0].label}`,
                    label: (tooltipItem) => {
                        return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: "white",
                    maxRotation: 90,
                    minRotation: 90,
                    font: {
                        size: window.innerWidth <= 767 ? 12 : 20,
                    },
                }
            },
            y: {
                grid: {
                    display: true,
                },
                ticks: {
                    color: "white",
                    maxRotation: 90,
                    minRotation: 90,
                    font: {
                        size: window.innerWidth <= 767 ? 12 : 20,
                    },
                    callback: function (value) {
                        return `${value}`;
                    },
                }
            },
        },
        hover: {
            mode: 'index',
            intersect: false,
        }
    } : {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    color: "white",
                    font: {
                        size: window.innerWidth <= 1024 ? 20 : 12
                    }
                },
                position: 'top',
            },
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
                callbacks: {
                    title: (tooltipItems) => `Datum: ${tooltipItems[0].label}`,
                    label: (tooltipItem) => {
                        return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                    },
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: "white",
                    font: {
                        size: window.innerWidth <= 1024 ? 20 : 12
                    }

                },
                title: {
                    display: true,
                    text: 'Datum',
                    color: "white"
                },
            },
            y: {
                title: {
                    display: true,
                    text: yAxisLabel,
                    color: "white"
                },
                ticks: {
                    color: "white",
                    font: {
                        size: window.innerWidth <= 1024 ? 20 : 12
                    },
                    callback: function (value) {
                        return `${value}`;
                    },
                },
            },
        },
        hover: {
            mode: 'index',
            intersect: false,
        }
    };
};