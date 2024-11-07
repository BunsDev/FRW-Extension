/* eslint-disable */

import React from 'react';
import { getIconColor } from './helper';

const DEFAULT_STYLE = {
  display: 'block',
};

const IconAppStore = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M512 85.3248C276.9152 85.3248 85.3504 276.9152 85.3504 512c0 235.0848 191.5648 426.6752 426.6496 426.6752S938.6752 747.0848 938.6752 512c0-235.0848-191.5904-426.6752-426.6752-426.6752zM367.7952 672l-22.1952 39.2448c-5.5296 10.6752-16.64 16.2304-27.7248 16.2304-5.12 0-10.6752-1.28-15.7952-3.84-15.36-8.96-20.48-28.5952-11.9296-43.9552l22.1696-39.2448c8.5504-15.36 28.16-20.48 43.52-11.9552 15.36 8.96 20.9152 28.16 11.9552 43.52z m-79.7952-73.8048a32.256 32.256 0 0 1-32-32c0-17.5104 14.5152-32 32-32h84.9152l102.4-179.2-33.7152-58.88c-8.96-15.36-3.4048-34.9952 11.9552-43.52 15.36-8.96 34.9952-3.4304 43.52 11.9296L512 290.56l14.9504-26.0352c8.5248-15.36 28.16-20.8896 43.52-11.9296 15.36 8.5248 20.8896 28.16 11.9296 43.52l-135.68 238.08h100.7104c17.92 0 32 14.4896 32 32 0 17.4848-14.08 32-32 32H288z m448 0h-46.5152l44.8 81.92c8.5504 15.7696 2.56 34.9696-12.8 43.52-5.12 2.56-10.24 3.84-15.36 3.84-11.52 0-22.1696-5.9904-28.16-16.64l-145.0496-265.8304a31.8976 31.8976 0 0 1 12.8-43.52c15.36-8.5248 34.9696-2.56 43.52 12.8l65.28 119.9104h81.4848c17.92 0 32 14.4896 32 32 0 17.4848-14.08 32-32 32z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

IconAppStore.defaultProps = {
  size: 18,
};

export default IconAppStore;
