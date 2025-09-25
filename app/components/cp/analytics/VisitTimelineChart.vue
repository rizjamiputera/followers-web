<template>
    <div class="w-full h-full">
        <canvas ref="chartCanvas" class="w-full h-full"></canvas>
    </div>
</template>

<script lang="ts" setup>
import { Chart, registerables } from 'chart.js'
import type { TimelineDataPoint } from '~/stores/visit-analytics-store.ts'

// Register Chart.js components
Chart.register(...registerables)

interface Props {
    data: TimelineDataPoint[]
}

const props = defineProps<Props>()
const chartCanvas = ref<HTMLCanvasElement>()
let chart: Chart | null = null

const createChart = () => {
    if (!chartCanvas.value || !props.data) return

    // Destroy existing chart if it exists
    if (chart) {
        chart.destroy()
    }

    const ctx = chartCanvas.value.getContext('2d')
    if (!ctx) return

    // Prepare data for Chart.js
    const labels = props.data.map(item => {
        const date = new Date(item.timestamp)
        return date.toLocaleDateString('id-ID', {
            month: 'short',
            day: 'numeric'
        })
    })

    const visitsData = props.data.map(item => item.visits)
    const uniqueVisitorsData = props.data.map(item => item.uniqueVisitors)

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Total Visits',
                    data: visitsData,
                    borderColor: 'rgb(59, 130, 246)', // blue-500
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3,
                },
                {
                    label: 'Unique Visitors',
                    data: uniqueVisitorsData,
                    borderColor: 'rgb(16, 185, 129)', // emerald-500
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        boxWidth: 12,
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    cornerRadius: 6,
                    displayColors: true,
                    callbacks: {
                        title: function (context) {
                            if (context[0] && context[0].dataIndex !== undefined) {
                                const dataPoint = props.data[context[0].dataIndex]
                                if (dataPoint) {
                                    const date = new Date(dataPoint.timestamp)
                                    return date.toLocaleDateString('id-ID', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })
                                }
                            }
                            return ''
                        },
                        label: function (context) {
                            const value = context.parsed.y
                            const label = context.dataset.label || ''
                            return `${label}: ${value.toLocaleString()}`
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        },
                        maxTicksLimit: 10,
                        color: 'rgb(107, 114, 128)' // gray-500
                    }
                },
                y: {
                    display: true,
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(107, 114, 128, 0.1)', // gray-500 with opacity
                        display: true,
                        drawBorder: false
                    } as any,
                    ticks: {
                        font: {
                            size: 11
                        },
                        color: 'rgb(107, 114, 128)', // gray-500
                        callback: function (value) {
                            const num = value as number
                            if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
                            if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
                            return num.toString()
                        }
                    }
                }
            },
            elements: {
                point: {
                    radius: 3,
                    hoverRadius: 5
                }
            }
        }
    })
}

// Watch for data changes and recreate chart
watch(() => props.data, () => {
    nextTick(() => {
        createChart()
    })
}, { deep: true })

// Create chart on mount
onMounted(() => {
    nextTick(() => {
        createChart()
    })
})

// Cleanup on unmount
onUnmounted(() => {
    if (chart) {
        chart.destroy()
        chart = null
    }
})
</script>

<style scoped>
canvas {
    max-height: 100% !important;
}
</style>
