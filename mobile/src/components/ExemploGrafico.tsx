import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const generateDataForDay = () => {
  const labels = ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
  const data = Array.from({ length: labels.length }, () => Math.floor(Math.random() * (80 - 60 + 1)) + 60);
  return { labels, data };
};

const generateDataForWeek = () => {
  const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const data = Array.from({ length: labels.length }, () => Math.floor(Math.random() * (90 - 70 + 1)) + 70);
  return { labels, data };
};

const generateDataForMonth = () => {
  const labels = Array.from({ length: 30 }, (_, i) => `${i + 1}`);
  const data = Array.from({ length: labels.length }, () => Math.floor(Math.random() * (100 - 80 + 1)) + 80);
  return { labels, data };
};

const generateReport = (readings) => {
  const minReading = Math.min(...readings);
  const maxReading = Math.max(...readings);
  const averageReading = readings.reduce((acc, curr) => acc + curr, 0) / readings.length;

  const minReadingIndex = readings.indexOf(minReading);
  const maxReadingIndex = readings.indexOf(maxReading);

  const minReadingTime = minReadingIndex !== -1 ? minReadingIndex : null;
  const maxReadingTime = maxReadingIndex !== -1 ? maxReadingIndex : null;

  return {
    minReading,
    minReadingTime,
    maxReading,
    maxReadingTime,
    averageReading,
  };
};

const ChartExample = () => {
  const [selectedOption, setSelectedOption] = useState('day');
  const [report, setReport] = useState(null);
  const [chartData, setChartData] = useState(generateDataForDay());

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setReport(null); // Reset report when option changes
    switch (option) {
      case 'day':
        setChartData(generateDataForDay());
        break;
      case 'week':
        setChartData(generateDataForWeek());
        break;
      default:
        break;
    }
  };

  const handleGenerateReport = () => {
    const readings = chartData.data;
    const generatedReport = generateReport(readings);
    setReport(generatedReport);
  };

  const getDayFromIndex = (index) => {
    return chartData.labels[index];
  };

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 16 }}>
        <Button title="Dia" onPress={() => handleOptionChange('day')} />
        <Button title="Semana" onPress={() => handleOptionChange('week')} />
      </View>

      <View>
        <Text>Dados:</Text>
        <BarChart
  data={{
    labels: chartData.labels,
    datasets: [{ data: chartData.data }],
  }}
  width={350}
  height={220}
  yAxisLabel="BPM"
  chartConfig={{
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    min: 0, // Define o valor mínimo do eixo y como zero
    max: Math.max(...chartData.data) + 10, // Ajusta o valor máximo para dar espaço suficiente
    verticalLabelRotation: 30, // Rotaciona os rótulos do eixo y
  }}
  style={{
    marginVertical: 8,
    borderRadius: 16,
  }}
  onDataPointClick={({ value, dataset }) =>
    alert(`Valor: ${value}`)
  } // Mostra o valor exato ao clicar no ponto
/>
      </View>

      <Button title="Gerar Relatório" onPress={handleGenerateReport} />

      {report && (
        <View style={{ marginTop: 16 }}>
          <Text>Relatório:</Text>
          {selectedOption === 'day' ? (
            <>
              <Text>{`Menor leitura do dia: ${report.minReading} BPM - ${chartData.labels[report.minReadingTime]}`}</Text>
              <Text>{`Maior leitura do dia: ${report.maxReading} BPM - ${chartData.labels[report.maxReadingTime]}`}</Text>
              <Text>{`Média das leituras: ${report.averageReading.toFixed(2)} BPM`}</Text>
            </>
          ) : selectedOption === 'week' ? (
            <>
              <Text>{`Menor leitura da semana: ${report.minReading} BPM - ${getDayFromIndex(report.minReadingTime)}`}</Text>
              <Text>{`Maior leitura da semana: ${report.maxReading} BPM - ${getDayFromIndex(report.maxReadingTime)}`}</Text>
              <Text>{`Média das leituras: ${report.averageReading.toFixed(2)} BPM`}</Text>
            </>
          ) : null}
        </View>
      )}
    </View>
  );
};

export default ChartExample;
