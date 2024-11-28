import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import Confetti from '@/ui/FRWComponent/Confetti';
import SlideLeftRight from '@/ui/FRWComponent/SlideLeftRight';
import SlideRelative from '@/ui/FRWComponent/SlideRelative';
import { LLPinAlert } from 'ui/FRWComponent';
import { useWallet } from 'ui/utils';

import BackButtonIcon from '../../../../components/iconfont/IconBackButton';
import AllSet from '../AddRegister/AllSet';
import RegisterHeader from '../AddRegister/RegisterHeader';

import ProxyQr from './ProxyQr';
import SetPassword from './SetPassword';

enum Direction {
  Right,
  Left,
}

const ProxySync = () => {
  const history = useHistory();
  const wallet = useWallet();
  const [activeIndex, onChange] = useState(0);
  const [publickey, setPubkey] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [username, setUsername] = useState('');
  const [direction, setDirection] = useState(Direction.Right);
  const [accountKey, setAccountKey] = useState<any>(null);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);

  const getUsername = (username: string) => {
    setUsername(username.toLowerCase());
  };

  const loadView = useCallback(async () => {
    wallet
      .getCurrentAccount()
      .then((res) => {
        if (res) {
          history.push('/');
        }
      })
      .catch(() => {
        return;
      });
  }, [history, wallet]);
  const goNext = () => {
    setDirection(Direction.Right);
    if (activeIndex < 2) {
      onChange(activeIndex + 1);
    } else {
      window.close();
    }
  };

  const goBack = () => {
    setDirection(Direction.Left);
    if (activeIndex >= 1) {
      onChange(activeIndex - 1);
    } else {
      history.goBack();
    }
  };

  const page = (index) => {
    switch (index) {
      case 0:
        return (
          <ProxyQr
            handleClick={goNext}
            savedUsername={username}
            confirmMnemonic={setMnemonic}
            confirmPk={setPubkey}
            setUsername={getUsername}
            setAccountKey={setAccountKey}
            setDeviceInfo={setDeviceInfo}
          />
        );
      case 1:
        return (
          <SetPassword
            handleClick={goNext}
            mnemonic={mnemonic}
            publickey={publickey}
            username={username}
            setUsername={getUsername}
            accountKey={accountKey}
            deviceInfo={deviceInfo}
          />
        );
      case 2:
        return <AllSet handleClick={goNext} />;
      default:
        return <div />;
    }
  };

  useEffect(() => {
    loadView();
  }, [loadView]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'background.default',
          width: '100%',
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {activeIndex === 2 && <Confetti />}
        <RegisterHeader />

        <LLPinAlert open={activeIndex === 2} />

        <Box sx={{ flexGrow: 0.7 }} />
        {/* height why not use auto */}
        <Box
          sx={{
            height: '460px',
            backgroundColor: 'transparent',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              px: '60px',
              height: 'auto',
              width: 'auto',
              position: 'relative',
              borderRadius: '24px',
            }}
          >
            {activeIndex !== 4 && activeIndex !== 5 && (
              <IconButton onClick={goBack} size="small" sx={{ marginLeft: '-95px' }}>
                <BackButtonIcon color="#5E5E5E" size={27} />
              </IconButton>
            )}

            <SlideLeftRight show={true} direction={direction === Direction.Left ? 'left' : 'right'}>
              {page(activeIndex)}
            </SlideLeftRight>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }} />
      </Box>
    </>
  );
};

export default ProxySync;
