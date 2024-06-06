import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { styled } from '@mui/system';
import SwitchUnstyled, {
  switchUnstyledClasses,
} from '@mui/core/SwitchUnstyled';
import { makeStyles } from '@mui/styles';
import {
  Box,
  Typography,
  Checkbox,
  CardActionArea,
  Divider,
  FormControlLabel,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import { useWallet } from 'ui/utils';
import { storage } from '@/background/webapi';
import { LLHeader, LLPrimaryButton } from '@/ui/FRWComponent';
import { Presets } from 'react-component-transition';

const useStyles = makeStyles(() => ({
  arrowback: {
    borderRadius: '100%',
    margin: '8px',
  },
  iconbox: {
    position: 'sticky',
    top: 0,
    // width: '100%',
    backgroundColor: '#121212',
    margin: 0,
    padding: 0,
  },
  developerTitle: {
    zIndex: 20,
    textAlign: 'center',
    top: 0,
    position: 'sticky',
  },
  developerBox: {
    width: 'auto',
    height: 'auto',
    margin: '10px 20px',
    backgroundColor: '#282828',
    padding: '24px 20px',
    display: 'flex',
    flexDirection: 'row',
    borderRadius: '16px',
    alignContent: 'space-between',
  },

  gasBox: {
    width: '90%',
    margin: '10px auto',
    backgroundColor: '#282828',
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'row',
    borderRadius: '16px',
    alignContent: 'space-between',
    gap: '8px',
  },

  radioBox: {
    width: '90%',
    borderRadius: '16px',
    backgroundColor: '#282828',
    margin: '20px auto',
    // padding: '10px 24px',
  },
  checkboxRow: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'space-between',
    justifyContent: 'space-between',
    padding: '20px 24px',
    alignItems: 'center'
  },
  modeSelection: {
    width: '100%',
    height: '100%',
    padding: 0,
    margin: 0,
    borderRadius: '16px',
    '&:hover': {
      backgroundColor: '#282828',
    },
  },
}));

const orange = {
  500: '#41CC5D',
};

const grey = {
  400: '#BABABA',
  500: '#787878',
  600: '#5E5E5E',
};

const Root = styled('span')(
  ({ theme }) => `
    font-size: 0;
    position: relative;
    display: inline-block;
    width: 40px;
    height: 20px;
    // margin: 0;
    margin-left: auto;
    cursor: pointer;
  
    &.${switchUnstyledClasses.disabled} {
      opacity: 0.4;
      cursor: not-allowed;
    }
  
    & .${switchUnstyledClasses.track} {
      background: ${theme.palette.mode === 'dark' ? grey[600] : grey[400]};
      border-radius: 10px;
      display: block;
      height: 100%;
      width: 100%;
      position: absolute;
    }
  
    & .${switchUnstyledClasses.thumb} {
      display: block;
      width: 14px;
      height: 14px;
      top: 3px;
      left: 3px;
      border-radius: 16px;
      background-color: #fff;
      position: relative;
      transition: all 200ms ease;
    }
  
    &.${switchUnstyledClasses.focusVisible} .${switchUnstyledClasses.thumb} {
      background-color: ${grey[500]};
      box-shadow: 0 0 1px 8px rgba(0, 0, 0, 0.25);
    }
  
    &.${switchUnstyledClasses.checked} {
      .${switchUnstyledClasses.thumb} {
        left: 22px;
        top: 3px;
        background-color: #fff;
      }
  
      .${switchUnstyledClasses.track} {
        background: ${orange[500]};
      }
    }
  
    & .${switchUnstyledClasses.input} {
      cursor: inherit;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      opacity: 0;
      z-index: 1;
      margin: 0;
    }
    `
);

const DeveloperMode = () => {
  const usewallet = useWallet();
  const classes = useStyles();
  const history = useHistory();
  const [modeOn, setModeOn] = useState(false);
  const [evmOn, setEvmOn] = useState(true);
  const [currentNetwork, setNetwork] = useState('mainnet');
  const [currentMonitor, setMonitor] = useState('flowscan');

  const [loading, setLoading] = useState(false);

  const [isSandboxEnabled, setSandboxEnabled] = useState(false);

  const [showError, setShowError] = useState(false);

  const loadNetwork = async () => {
    const network = await usewallet.getNetwork();
    // const crescendo = await usewallet.checkCrescendo();
    // if (crescendo.length > 0) {
    //   setSandboxEnabled(true);
    // }
    const previewnet = await usewallet.checkPreviewnet() || [];
    console.log('previewnet ', previewnet)
    if (previewnet.length > 0) {
      setSandboxEnabled(true);
    }

    setNetwork(network);
  };

  const loadMonitor = async () => {
    const monitor = await usewallet.getMonitor();
    setMonitor(monitor);
  };

  const loadDeveloperMode = async () => {
    const developerMode = await storage.get('developerMode');
    if (developerMode) {
      setModeOn(developerMode);
    }
  };

  useEffect(() => {
    loadDeveloperMode();
    loadNetwork();
    loadMonitor();
  }, []);

  const switchNetwork = async (network: string) => {
    // if (network === 'crescendo' && !isSandboxEnabled) {
    //   return;
    // }
    if (network === 'previewnet' && !isSandboxEnabled) {
      return;
    }

    setNetwork(network);
    usewallet.switchNetwork(network);

    if (currentNetwork !== network) {
      // TODO: replace it with better UX
      window.location.reload();
    }
  };

  const switchMonitor = async (domain: string) => {
    setMonitor(domain);
    usewallet.switchMonitor(domain);
  };

  const switchDeveloperMode = async () => {
    setModeOn(!modeOn);
    storage.set('developerMode', !modeOn);
    // window.location.reload();
    // if (modeOn == true) {
    //   switchNetwork('mainnet')
    // } else {
    //   window.location.reload();
    // }
  };

  // const switchEVMMode = async () => {
  //   setEvmOn(!evmOn);
  //   storage.set('evmMode', !evmOn);
  //   window.location.reload();
  // };

  const enableSandbox = async () => {
    setLoading(true)
    try {
      const { data } = await usewallet.createFlowSandboxAddress('previewnet');
      await usewallet.pollingTrnasaction(data, 'previewnet')
      await usewallet.refreshUserWallets();
      const previewnet = await usewallet.checkPreviewnet() || [];
      if (previewnet.length > 0) {
        setSandboxEnabled(true);
      }
      await switchNetwork('previewnet')
      // await usewallet.setDashIndex(0);
      // history.push('/dashboard?activity=1');
    } finally {
      setLoading(false)
    }
  };

  const handleErrorClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowError(false);
  };

  const enableButton = () => {
    if (loading) {
      return (<CircularProgress size={18} color="primary" />)
    }

    return (
      <LLPrimaryButton
        onClick={enableSandbox}
        sx={{
          backgroundColor: '#CCAF21',
          padding: '2px 3px',
          fontSize: '12px',
          color: '#000',
          fontWeight: '600',
          borderRadius: '30px',
          textTransform: 'initial',
        }}
        label={chrome.i18n.getMessage('Enable')}
      />
    )
  }

  return (
    <div className="page">
      <LLHeader
        title={chrome.i18n.getMessage('Developer__Settings')}
        help={false}
      />

      <Box className={classes.developerBox}>
        <Typography
          variant="body1"
          color="neutral.contrastText"
          style={{ weight: 600 }}
        >
          {chrome.i18n.getMessage('Developer__Mode')}
        </Typography>
        <SwitchUnstyled
          checked={modeOn}
          component={Root}
          onChange={() => {
            switchDeveloperMode();
          }}
        />
      </Box>

      <Presets.TransitionFade>
        {modeOn && (
          <Box sx={{ pb: '20px' }}>
            <Typography
              variant="h6"
              color="neutral.contrastText"
              sx={{
                weight: 500,
                marginLeft: '18px',
              }}
            >
              {chrome.i18n.getMessage('Switch__Network')}
            </Typography>
            <Box className={classes.radioBox}>
              <CardActionArea
                className={classes.modeSelection}
                onClick={() => switchNetwork('mainnet')}
              >
                <Box className={classes.checkboxRow}>
                  <FormControlLabel
                    label={chrome.i18n.getMessage('Mainnet')}
                    control={
                      <Checkbox
                        size="small"
                        icon={<CircleOutlinedIcon />}
                        checkedIcon={<CheckCircleIcon color="primary" />}
                        value="mainnet"
                        checked={currentNetwork === 'mainnet'}
                        onChange={() => switchNetwork('mainnet')}
                      />
                    }
                  />

                  {currentNetwork === 'mainnet' && (
                    <Typography
                      component="div"
                      variant="body1"
                      color="text.nonselect"
                      sx={{ margin: 'auto 0' }}
                    >
                      {chrome.i18n.getMessage('Selected')}
                    </Typography>
                  )}
                </Box>
              </CardActionArea>

              <Divider sx={{ width: '90%', margin: '0 auto' }} />

              <CardActionArea
                className={classes.modeSelection}
                onClick={() => switchNetwork('testnet')}
              >
                <Box className={classes.checkboxRow}>
                  <FormControlLabel
                    label={chrome.i18n.getMessage('Testnet')}
                    control={
                      <Checkbox
                        size="small"
                        icon={<CircleOutlinedIcon />}
                        checkedIcon={
                          <CheckCircleIcon sx={{ color: '#FF8A00' }} />
                        }
                        value="testnet"
                        checked={currentNetwork === 'testnet'}
                        onChange={() => switchNetwork('testnet')}
                      />
                    }
                  />

                  {currentNetwork === 'testnet' && (
                    <Typography
                      component="div"
                      variant="body1"
                      color="text.nonselect"
                      sx={{ margin: 'auto 0' }}
                    >
                      {chrome.i18n.getMessage('Selected')}
                    </Typography>
                  )}
                </Box>
              </CardActionArea>

              <Divider sx={{ width: '90%', margin: '0 auto' }} />

              {/* <CardActionArea className={classes.modeSelection} onClick={()=>switchNetwork('crescendo')}>
              <Box className={classes.checkboxRow}>
                <FormControlLabel
                  label={chrome.i18n.getMessage('Crescendo')}
                  control={
                    <Checkbox
                      size='small'
                      icon={<CircleOutlinedIcon />}
                      checkedIcon={<CheckCircleIcon sx={{color:'#CCAF21'}} />}
                      value='crescendo'
                      checked={currentNetwork==='crescendo'}
                      onChange={()=>switchNetwork('crescendo')}
                    />
                  }
                  disabled={!isSandboxEnabled}
                />

                {isSandboxEnabled && currentNetwork==='crescendo' && <Typography component='div' variant='body1' color='text.nonselect' sx={{margin: 'auto 0'}}>{chrome.i18n.getMessage('Selected')}</Typography>}
                {!isSandboxEnabled && <LLPrimaryButton onClick={enableSandbox} sx={{backgroundColor: '#CCAF21', padding: '2px 3px', fontSize: '12px', color: '#000', fontWeight: '600', borderRadius: '30px', textTransform: 'initial'}} label={chrome.i18n.getMessage('Enable')}/> }
              </Box>
            </CardActionArea> */}
              <CardActionArea
                className={classes.modeSelection}
                onClick={() => switchNetwork('previewnet')}
              >
                <Box className={classes.checkboxRow}>
                  <FormControlLabel
                    label={chrome.i18n.getMessage('Previewnet')}
                    control={
                      <Checkbox
                        size="small"
                        icon={<CircleOutlinedIcon />}
                        checkedIcon={
                          <CheckCircleIcon sx={{ color: '#CCAF21' }} />
                        }
                        value="previewnet"
                        checked={currentNetwork === 'previewnet'}
                        onChange={() => switchNetwork('previewnet')}
                      />
                    }
                    disabled={!isSandboxEnabled}
                  />

                  {isSandboxEnabled && currentNetwork === 'previewnet' && (
                    <Typography
                      component="div"
                      variant="body1"
                      color="text.nonselect"
                      sx={{ margin: 'auto 0' }}
                    >
                      {chrome.i18n.getMessage('Selected')}
                    </Typography>
                  )}
                  {!isSandboxEnabled && (
                    enableButton()
                  )}
                </Box>
              </CardActionArea>
            </Box>

            <Typography
              variant="h6"
              color="neutral.contrastText"
              sx={{
                weight: 500,
                marginLeft: '18px',
              }}
            >
              {chrome.i18n.getMessage('Transaction__Monitor')}
            </Typography>
            <Box className={classes.radioBox}>
              <CardActionArea
                className={classes.modeSelection}
                onClick={() => switchMonitor('flowscan')}
              >
                <Box className={classes.checkboxRow}>
                  <FormControlLabel
                    label={chrome.i18n.getMessage('Flowdiver')}
                    control={
                      <Checkbox
                        size="small"
                        icon={<CircleOutlinedIcon />}
                        checkedIcon={<CheckCircleIcon color="primary" />}
                        value="flowscan"
                        checked={currentMonitor === 'flowscan'}
                        onChange={() => switchMonitor('flowscan')}
                      />
                    }
                  />

                  {currentMonitor === 'flowscan' && (
                    <Typography
                      component="div"
                      variant="body1"
                      color="text.nonselect"
                      sx={{ margin: 'auto 0' }}
                    >
                      {chrome.i18n.getMessage('Selected')}
                    </Typography>
                  )}
                </Box>
              </CardActionArea>

              <Divider sx={{ width: '90%', margin: '0 auto' }} />

              <CardActionArea
                className={classes.modeSelection}
                onClick={() => switchMonitor('source')}
              >
                <Box className={classes.checkboxRow}>
                  <FormControlLabel
                    label={chrome.i18n.getMessage('Flow__view__source')}
                    control={
                      <Checkbox
                        size="small"
                        icon={<CircleOutlinedIcon />}
                        checkedIcon={<CheckCircleIcon color="inherit" />}
                        value="flowViewSource"
                        checked={currentMonitor === 'source'}
                        onChange={() => switchMonitor('source')}
                      />
                    }
                  />

                  {currentMonitor === 'source' && (
                    <Typography
                      component="div"
                      variant="body1"
                      color="text.nonselect"
                      sx={{ margin: 'auto 0' }}
                    >
                      {chrome.i18n.getMessage('Selected')}
                    </Typography>
                  )}
                </Box>
              </CardActionArea>
            </Box>

            {/* <Typography
              variant="h6"
              color="neutral.contrastText"
              sx={{
                weight: 500,
                marginLeft: '18px',
              }}
            >
              Other
            </Typography>
            <Box className={classes.developerBox}>
              <Typography
                variant="body1"
                color="neutral.contrastText"
                style={{ weight: 600 }}
              >
                EVM on Flow
              </Typography>
              <SwitchUnstyled
                checked={evmOn}
                component={Root}
                onChange={() => {
                  switchEVMMode();
                }}
              />
            </Box> */}
          </Box>
        )}
      </Presets.TransitionFade>
    </div>
  );
};

export default DeveloperMode;
