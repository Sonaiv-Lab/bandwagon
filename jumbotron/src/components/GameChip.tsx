import React from 'react';
import {
  View,
} from 'react-native';

import Svg, {Path} from 'react-native-svg';

export const GameChip = ({
  colorL = '#c7c7c7',
  colorR = '#c7c7c7',
}: {
  colorL: string;
  colorR: string;
}) => {
  return (
    <View style={[{alignItems: 'center', justifyContent: 'center'}]}>
      <Svg height="12" width="100%" viewBox="0 0 55 12">
      <Path
          d="M20.0195 12H2.42856C1.32401 12 0.428591 11.1045 0.428558 10V2C0.428558 0.895431 1.32399 1.61069e-08 2.42856 0H31.5195L25.7695 6L20.0195 12Z"
          fill={colorL}
        />
        <Path
          d="M52.4286 0C53.5331 0 54.4286 0.895431 54.4286 2V10C54.4285 11.1045 53.5331 12 52.4286 12H25.5L31.2495 6L36.999 0H52.4286Z"
          fill={colorR}
        />
      </Svg>
    </View>
  );
};