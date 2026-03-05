import React from 'react';
import { Spin } from 'antd';
import type { SpinProps } from 'antd';

const stylesObject: SpinProps['styles'] = {
  indicator: {
    color: '#00d4ff',
  },
};

const Loading: React.FC = () => {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <Spin spinning size="large" styles={stylesObject} />
    </div>
  );
};

export default Loading;
