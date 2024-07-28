import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Line, Polygon } from 'react-native-svg';

const RadarChart = ({ data, size = 300 }) => {
  const numAxes = data.length;
  const maxValue = Math.max(...data.map(d => d.value));
  const center = size / 2;
  const radius = size / 2.5;
  const angleSlice = (2 * Math.PI) / numAxes;

  const calculatePoint = (value, index) => {
    const adjustedValue = value < 1 ? 1 : value;
    const angle = index * angleSlice;
    const x = center + radius * (adjustedValue / maxValue) * Math.cos(angle);
    const y = center + radius * (adjustedValue / maxValue) * Math.sin(angle);
    return [x, y];
  };

  const points = data.map((d, i) => calculatePoint(d.value, i)).join(' ');

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      <Svg width={size} height={size}>
        {[...Array(5)].map((_, i) => {
          const scale = (i + 1) / 5;
          const polygonPoints = data.map((_, j) => calculatePoint(maxValue * scale, j)).join(' ');
          return (
            <Polygon
              key={i}
              points={polygonPoints}
              stroke="grey"
              strokeWidth="1"
              fill="none"
            />
          );
        })}
        {data.map((_, i) => {
          const [x, y] = calculatePoint(maxValue, i);
          return (
            <Line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="grey"
              strokeWidth="1"
            />
          );
        })}
        <Polygon points={points} fill="rgba(0, 128, 128, 0.6)" stroke="#008080" strokeWidth="2" />
        {data.map((d, i) => {
          const [x, y] = calculatePoint(d.value, i);
          return (
            <Circle
              key={i}
              cx={x}
              cy={y}
              r={4}
              fill="#008080"
            />
          );
        })}
      </Svg>
    </View>
  );
};

export default RadarChart;
