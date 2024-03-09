import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, ThemeProvider } from '@mui/system';
import { IconButton, Typography, Button, Snackbar, Alert } from '@mui/material';
import BackButtonIcon from '../../../components/iconfont/IconBackButton';
import IconGoogleDrive from '../../../components/iconfont/IconGoogleDrive';
import theme from '../../style/LLTheme';
import RegisterHeader from '../Register/RegisterHeader';
import ImportRecoveryPhrase from './ImportRecoveryPhrase';
import AllSet from '../AddRegister/AllSet';
import RecoverPassword from './RecoverPassword';
import Particles from 'react-tsparticles';
import { LLPinAlert, LLSpinner } from 'ui/FRWComponent';
import {
  ComponentTransition,
  AnimationTypes,
} from 'react-component-transition';
import { useWallet } from 'ui/utils';
import options from './options';
import { storage } from 'background/webapi';

enum Direction {
  Right,
  Left,
}

const AddAccount = () => {
  const history = useHistory();
  const wallets = useWallet();
  const [activeIndex, onChange] = useState(0);
  const [mnemonic, setMnemonic] = useState('');
  const [pk, setPk] = useState('');
  const [username, setUsername] = useState('');
  const [errMessage, setErrorMessage] = useState(chrome.i18n.getMessage('No__backup__found'));
  const [showError, setShowError] = useState(false);
  const [direction, setDirection] = useState(Direction.Right);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState(null);

  const loadTempPassword = async () => {
    const temp = await storage.get('tempPassword');
    if (temp) {
      setPassword(temp);
    }
  };

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

  const getGoogle = async () => {
    setLoading(true);

    try {
      const accounts = await wallets.loadBackupAccounts();
      if (accounts.length > 0) {
        history.push({
          pathname: '/add/google',
          state: {
            accounts: accounts,
          },
        });
      } else {
        setShowError(true)
        setErrorMessage(chrome.i18n.getMessage('No__backup__found'))
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
      setShowError(true)
      setErrorMessage(chrome.i18n.getMessage('Something__is__wrong'))
      setLoading(false);
    }
  }

  const handleErrorClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowError(false);
  };

  useEffect(() => {
    loadTempPassword();
  }, []);

  const page = (index) => {
    switch (index) {
      case 0:
        return <ImportRecoveryPhrase handleClick={goNext} confirmMnemonic={setMnemonic} confirmPk={setPk} setUsername={setUsername} />;
      case 1:
        return <RecoverPassword handleClick={goNext} mnemonic={mnemonic} pk={pk} username={username} tempPassword={password} />;
      case 2:
        return <AllSet handleClick={goNext} />;
      default:
        return <div />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'background.default',
          height: 'auto',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {activeIndex == 2 && (
          <Particles
            // @ts-expect-error customized options
            options={options}
          />
        )}

        <LLPinAlert open={activeIndex == 2} />

        <RegisterHeader />
        <Box sx={{ flexGrow: 1 }} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: 720,
            marginTop: '80px',
            height: 'auto',
            transition: 'all .3s ease-in-out',
            borderRadius: '24px',
            boxShadow: '0px 24px 24px rgba(0,0,0,0.36)',
            overflow: 'hidden',
            backgroundColor: 'background.paper',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              // height: '56px',
              // backgroundColor: '#404040',
              padding: '24px 24px 0px 24px',
            }}
          >
            <IconButton onClick={goBack} size="small">
              <BackButtonIcon color="#5E5E5E" size={27} />
            </IconButton>

            <div style={{ flexGrow: 1 }}></div>

            <Typography
              variant="body1"
              sx={{ color: '#5E5E5E', alignSelf: 'end', lineHeight: '37px', fontWeight: '700', fontSize: '16px' }}
            >
              {chrome.i18n.getMessage('STEP')} {activeIndex + 1}/3
            </Typography>
          </Box>

          <ComponentTransition
            enterAnimation={
              direction === Direction.Left
                ? AnimationTypes.slideLeft.enter
                : AnimationTypes.slideRight.enter
            }
            exitAnimation={
              direction === Direction.Left
                ? AnimationTypes.slideRight.exit
                : AnimationTypes.slideLeft.exit
            }
            animateContainer={true}
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            {page(activeIndex)}
          </ComponentTransition>
        </Box>

        {activeIndex === 0 &&
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              backgroundColor: 'background.paper',
              px: '24px',
              py: '18px',
              marginBottom: '15px',
              borderRadius: '12px',
              textTransform: 'none',
              boxShadow: '0px 24px 24px rgba(0,0,0,0.36)',
              mt: '36px'
            }}
            onClick={getGoogle}
            startIcon={
              loading ? <LLSpinner size={20} /> : <IconGoogleDrive />
            }
          >
            <Typography
              variant="body1"
              color="text.primary"
            >
              {chrome.i18n.getMessage('Restore__Backup__from__Google__Drive')}
            </Typography>
          </Button>
        }
        <Box sx={{ flexGrow: 1 }} />
        <Snackbar open={showError} autoHideDuration={6000} onClose={handleErrorClose}>
          <Alert onClose={handleErrorClose} variant="filled" severity="error" sx={{ width: '100%' }}>
            {errMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default AddAccount;
