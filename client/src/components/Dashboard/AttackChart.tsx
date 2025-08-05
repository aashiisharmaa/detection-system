import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Attack Statistics',
    },
  },
};

const labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];

const data = {
  labels: ['Decision Tree', 'KNN', 'Random Forest', 'SVM', 'Proposed Ensembled Model'],
  datasets: [
    {
      label: 'Accuracy',
      data: [0.9802996536520892, 0.9486170202502581, 0.9883360828919568, 0.884870674268955, 0.9821037500120595],
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    },
    {
      label: 'Precision (Macro Avg)',
      data: [0.9802976285147199, 0.9490980819436787, 0.9883494163520695, 0.8899326198573366, 0.9821140175018627],
      backgroundColor: 'rgba(153, 102, 255, 0.5)',
    },
    {
      label: 'Recall (Macro Avg)',
      data: [0.980308778026347, 0.948639328555546, 0.988347829693426, 0.8848804247212653, 0.982109030099128],
      backgroundColor: 'rgba(255, 159, 64, 0.5)',
    },
    {
      label: 'F1-Score (Macro Avg)',
      data: [0.9803006337876674, 0.9486844516427563, 0.9883341542251887, 0.883943575688849, 0.9820925802878238],
      backgroundColor: 'rgba(255, 205, 86, 0.5)',
    },
  ],
};

export const AttackChart = () => {
  return <Bar options={options} data={data} />;
};