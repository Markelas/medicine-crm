import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bubble } from 'react-chartjs-2';
import styles from './VaccinationImpactChart.module.scss';

export const VaccinationImpactChart = () => {
   const [chartData, setChartData] = useState(null);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const { data } = await axios.get(
               'http://localhost:5000/vaccination-impact',
            );

            if (Array.isArray(data) && data.length > 0) {
               setChartData({
                  datasets: data.map((disease) => ({
                     label: disease.diseaseName,
                     data: [
                        {
                           x: disease.vaccinationRate, // Уровень вакцинации (%)
                           y: disease.cases, // Количество заболевших
                           r: Math.max(disease.cases / 2, 5), // Размер пузыря
                        },
                     ],
                     backgroundColor: getRandomColor(),
                  })),
               });
            } else {
               console.error('Нет данных для отображения');
            }
         } catch (error) {
            console.error('Ошибка загрузки данных:', error);
         }
      };
      fetchData();
   }, []);

   const getRandomColor = () => {
      const colors = ['red', 'blue', 'green', 'purple', 'orange'];
      return colors[Math.floor(Math.random() * colors.length)];
   };

   if (!chartData) return <p>Загрузка...</p>;

   return (
      <div className={styles.root}>
         <h4 className={styles.title}>
            Диаграмма рассеяния, с зависимостью заболеваемости и уровня
            вакцинации
         </h4>
         <Bubble
            data={chartData}
            options={{
               scales: {
                  x: {
                     title: { display: true, text: 'Уровень вакцинации (%)' },
                     min: 0,
                     max: 100,
                  },
                  y: {
                     title: { display: true, text: 'Количество заболевших' },
                     min: 0,
                  },
               },
            }}
         />
      </div>
   );
};
