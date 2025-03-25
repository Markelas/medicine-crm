import React from 'react';
import { CasesTrendChart } from '../components/Math/CasesTrendChart';
import { VaccinationStatsChart } from '../components/Math/VaccinationStatsChart';
import { Statistic } from '../components/Math/Statistic';
import styles from './Home.module.scss';
import { VaccinationImpactChart } from '../components/Math/VaccinationImpactChart';
import { ForecastChart } from '../components/Math/ForecastVaccination';

export const Home = () => {
   return (
      <div>
         <h1>Анализ эпидемиологической ситуации</h1>
         <div className={styles.mainBox}>
            <CasesTrendChart />
            <VaccinationStatsChart />
            <Statistic />
            <VaccinationImpactChart />
            <ForecastChart />
         </div>
      </div>
   );
};
