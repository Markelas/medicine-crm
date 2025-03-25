import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   ArcElement,
   Title,
   Tooltip,
   Legend,
} from 'chart.js';

// Регистрация необходимых компонентов
ChartJS.register(
   CategoryScale, // Для категориальной оси X
   LinearScale, // Линейная шкала Y
   PointElement, // Точки на графике
   LineElement, // Линии на графике
   ArcElement, // Для круговых диаграмм (PieChart)
   Title,
   Tooltip,
   Legend,
);

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import styles from './VaccinationStatsChart.module.scss';

export const VaccinationStatsChart = () => {
   const [chartData, setChartData] = useState(null);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const { data } = await axios.get(
               'http://localhost:5000/vaccination-stats',
            );
            const labels = data.map((entry) => entry.vaccineName);
            const counts = data.map((entry) => entry.totalVaccinated);

            setChartData({
               labels,
               datasets: [
                  {
                     label: 'Количество привитых',
                     data: counts,
                     // Используем мягкие пастельные цвета
                     backgroundColor: [
                        'rgb(133,204,230)', // светло-голубой
                        'rgba(144, 238, 144)', // светло-зеленый
                        'rgba(255, 239, 132)', // светло-желтый
                        'rgba(255, 182, 193)', // светло-розовый
                     ],
                  },
               ],
            });
         } catch (error) {
            console.error('Ошибка загрузки данных:', error);
         }
      };
      fetchData();
   }, []);

   if (!chartData) return <p>Загрузка...</p>;

   return (
      <div className={styles.root}>
         <h4 className={styles.title}>Количество привитых</h4>
         <Pie data={chartData} />
      </div>
   );
};
