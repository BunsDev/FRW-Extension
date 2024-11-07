/* eslint-disable */

import React from 'react';
import { getIconColor } from './helper';

const DEFAULT_STYLE = {
  display: 'block',
};

const IconPlus = ({ size, color, style: _style, ...rest }) => {
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
        d="M548.408889 380.131556a42.666667 42.666667 0 1 0-85.333333 0.682666l85.333333-0.682666z m-83.285333 256.113777a42.666667 42.666667 0 1 0 85.333333-0.682666l-85.333333 0.682666zM379.392 464.554667a42.666667 42.666667 0 0 0-0.682667 85.333333l0.682667-85.333333zM634.140444 551.822222a42.666667 42.666667 0 0 0 0.682667-85.333333l-0.682667 85.333333zM907.832889 512A395.832889 395.832889 0 0 1 512 907.832889v85.333333A481.166222 481.166222 0 0 0 993.166222 512h-85.333333zM512 907.832889A395.832889 395.832889 0 0 1 116.167111 512h-85.333333A481.166222 481.166222 0 0 0 512 993.166222v-85.333333zM116.167111 512A395.832889 395.832889 0 0 1 512 116.167111v-85.333333A481.166222 481.166222 0 0 0 30.833778 512h85.333333zM512 116.167111A395.832889 395.832889 0 0 1 907.832889 512h85.333333A481.166222 481.166222 0 0 0 512 30.833778v85.333333z m-48.924444 264.647111l2.048 255.431111 85.333333-0.682666-1.991111-255.431111-85.333334 0.682666zM378.766222 549.831111l255.431111 2.048 0.682667-85.333333-255.431111-1.991111-0.682667 85.333333z"
        fill={getIconColor(color, 0, '#41CC5D')}
      />
    </svg>
  );
};

IconPlus.defaultProps = {
  size: 18,
};

export default IconPlus;
