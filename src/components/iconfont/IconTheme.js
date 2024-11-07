/* eslint-disable */

import React from 'react';
import { getIconColor } from './helper';

const DEFAULT_STYLE = {
  display: 'block',
};

const IconTheme = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg
      viewBox="0 0 1024 1024"
      width={size + 'px'}
      height={size + 'px'}
      style={style}
      {...rest}
    >
      <path
        d="M246.290963 35.688296A238.743704 238.743704 0 0 1 35.346963 422.874074 238.478222 238.478222 0 1 0 246.290963 35.726222zM922.472296 356.882963a40.391111 40.391111 0 1 0-57.116444-57.15437L808.201481 356.845037a40.391111 40.391111 0 1 0 57.154371 57.15437l57.116444-57.15437zM436.830815 728.215704a201.993481 201.993481 0 1 0 285.658074-285.658074L436.830815 728.177778zM836.759704 899.602963a40.391111 40.391111 0 1 0 57.15437-57.116444l-57.15437-57.116445a40.391111 40.391111 0 0 0-57.116445 57.116445l57.116445 57.15437zM408.272593 813.928296c15.777185 15.777185 15.777185 41.339259 0 57.154371l-57.154371 57.116444a40.391111 40.391111 0 0 1-57.116444-57.116444l57.116444-57.154371a40.391111 40.391111 0 0 1 57.154371 0zM596.423111 847.416889c22.300444 0 40.391111 18.052741 40.391111 40.391111v80.782222a40.391111 40.391111 0 1 1-80.782222 0v-80.782222c0-22.300444 18.052741-40.391111 40.391111-40.391111zM967.793778 637.610667a40.391111 40.391111 0 0 0 0-80.782223h-80.782222a40.391111 40.391111 0 1 0 0 80.782223h80.782222zM166.72237 811.349333a21.238519 21.238519 0 1 0 29.999408 29.999408L803.460741 234.647704a21.238519 21.238519 0 0 0-30.037334-30.037334L166.72237 811.349333z"
        fill={getIconColor(color, 0, '#FFDD32')}
      />
    </svg>
  );
};

IconTheme.defaultProps = {
  size: 18,
};

export default IconTheme;
