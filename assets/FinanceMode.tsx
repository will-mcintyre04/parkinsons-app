import React from 'react';
import Svg, { Defs, G, Mask, Path, Rect } from 'react-native-svg';

export default function FinanceModeIcon(props) {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40" fill="none" {...props}>
      <Defs>
        <Mask
          id="mask0_23_1904"
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={40}
          height={40}
        >
          <Rect width={40} height={40} fill="#DED7CD" />
        </Mask>
      </Defs>
      <G mask="url(#mask0_23_1904)">
        <Path
          d="M13.6433 21.3607V10.1174H17.8804V21.3607L15.767 19.3395L13.6433 21.3607ZM21.8737 24.6516V3.24365H26.1108V20.4145L21.8737 24.6516ZM5.39119 29.4891V17.0191H9.62828V25.252L5.39119 29.4891ZM5.32703 35.2778L15.812 24.7928L21.9358 30.1345L34.1645 17.8953H30.6024V15.0791H38.972V23.4316H36.1558V19.8695L22.0491 33.9762L15.9358 28.6516L9.30994 35.2778H5.32703Z"
          fill="#DED7CD"
        />
      </G>
    </Svg>
  );
}
