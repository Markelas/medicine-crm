import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Legend,
} from 'chart.js';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import styles from './CasesTrendChart.module.scss';

ChartJS.register(
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Legend,
);

export const CasesTrendChart = () => {
   const [chartData, setChartData] = useState(null);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const { data } = await axios.get(
               'http://localhost:5000/cases-trend',
            );

            const months = [];
            const casesMap = new Map();

            data.forEach((entry) => {
               const key = `${entry._id.year}-${String(entry._id.month).padStart(2, '0')}`;
               casesMap.set(key, entry.cases);
            });

            // Добавляем все месяцы с 2024 года до текущего месяца (с учётом сдвига на 1 месяц)
            const today = new Date();
            const endYear = today.getFullYear();
            const endMonth = today.getMonth() + 1; // Месяц с учётом сдвига
            for (let year = 2024; year <= endYear; year++) {
               for (let month = 1; month <= 12; month++) {
                  if (year === endYear && month > endMonth) break; // Ограничиваем до текущего месяца
                  const key = `${year}-${String(month).padStart(2, '0')}`;
                  months.push(key);
               }
            }

            const cases = months.map((month) => casesMap.get(month) || 0);

            setChartData({
               labels: months, // Ось X: все месяцы
               datasets: [
                  {
                     label: 'Заболеваемость по месяцам',
                     data: cases,
                     borderColor: 'rgb(55, 97, 243)',
                     fill: false,
                     tension: 0.2, // Добавляет плавность линии
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
         <h4 className={styles.title}>Заболеваемость по месяцам</h4>
         <Line data={chartData} />
      </div>
   );
};
