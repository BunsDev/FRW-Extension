/* eslint-disable */

import React from 'react';
import { getIconColor } from './helper';

const DEFAULT_STYLE = {
  display: 'block',
};

const IconMax = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg
      viewBox="0 0 1763 1024"
      width={size + 'px'}
      height={size + 'px'}
      style={style}
      {...rest}
    >
      <path
        d="M0 512a512 512 0 0 1 512-512h739.555556a512 512 0 1 1 0 1024H512a512 512 0 0 1-512-512z"
        fill={getIconColor(color, 0, '#787878')}
      />
      <path
        d="M353.336889 268.913778h75.776l131.697778 321.649778h4.835555l131.754667-321.649778h75.719111V682.666667h-59.392V383.260444h-3.811556l-122.026666 298.780445h-49.265778L416.597333 383.089778h-3.868444V682.666667H353.336889V268.913778zM949.361778 689.493333c-19.683556 0-37.432889-3.584-53.361778-10.865777-15.872-7.395556-28.444444-18.090667-37.774222-32.142223-9.102222-13.994667-13.710222-31.175111-13.710222-51.484444 0-17.521778 3.356444-31.914667 10.069333-43.235556a74.524444 74.524444 0 0 1 27.306667-26.851555c11.434667-6.599111 24.234667-11.605333 38.4-14.961778a381.724444 381.724444 0 0 1 43.235555-7.68l45.226667-5.233778c11.605333-1.536 20.024889-3.868444 25.258666-7.111111 5.233778-3.242667 7.850667-8.476444 7.850667-15.758222V472.746667c0-17.635556-4.949333-31.288889-14.904889-40.96-9.841778-9.728-24.519111-14.563556-44.088889-14.563556-20.309333 0-36.352 4.551111-48.071111 13.539556-11.548444 8.874667-19.569778 18.773333-24.007111 29.696l-56.775111-12.970667a109.226667 109.226667 0 0 1 29.468444-45.624889c13.084444-11.719111 28.103111-20.195556 45.056-25.486222 16.952889-5.347556 34.816-8.078222 53.532445-8.078222 12.401778 0 25.543111 1.479111 39.424 4.494222 13.994667 2.844444 27.079111 8.078222 39.196444 15.758222 12.231111 7.623111 22.243556 18.602667 30.094223 32.881778 7.793778 14.165333 11.719111 32.540444 11.719111 55.182222V682.666667h-58.993778v-42.439111H1041.066667a86.072889 86.072889 0 0 1-17.578667 23.04 93.297778 93.297778 0 0 1-30.094222 18.773333 116.736 116.736 0 0 1-44.032 7.509333z m13.084444-48.412444c16.725333 0 31.004444-3.356444 42.894222-9.955556 11.946667-6.542222 21.048889-15.189333 27.249778-25.827555 6.314667-10.808889 9.500444-22.300444 9.500445-34.531556V530.773333a31.459556 31.459556 0 0 1-12.515556 6.030223 195.128889 195.128889 0 0 1-20.821333 4.664888l-22.812445 3.413334c-7.395556 0.967111-13.653333 1.706667-18.602666 2.446222a149.617778 149.617778 0 0 0-32.142223 7.452444 55.182222 55.182222 0 0 0-23.04 15.132445 37.888 37.888 0 0 0-8.476444 25.884444c0 14.961778 5.518222 26.282667 16.611556 33.962667 11.036444 7.509333 25.088 11.264 42.211555 11.264zM1230.620444 372.337778l68.494223 120.832 69.063111-120.832h66.104889L1337.457778 527.530667 1435.079111 682.666667h-66.104889l-69.859555-115.939556L1229.368889 682.666667h-66.275556l96.540445-155.136-95.345778-155.192889h66.275556z"
        fill={getIconColor(color, 1, '#E6E6E6')}
      />
    </svg>
  );
};

IconMax.defaultProps = {
  size: 18,
};

export default IconMax;
