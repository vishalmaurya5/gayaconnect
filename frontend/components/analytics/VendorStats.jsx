'use client'

import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function VendorStats() {
  const data = {
    labels: ['Restaurants', 'Repair', 'Hotels', 'Shopping', 'Education', 'Medical'],
    datasets: [
      {
        label: 'Active Vendors',
        data: [45, 32, 18, 56, 24, 30],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(20, 184, 166, 0.8)',
        ],
        borderRadius: 8,
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  }

  return (
    <div className="h-64">
      <Bar data={data} options={options} />
    </div>
  )
}
