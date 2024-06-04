import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApproval, useWallet, formatAddress } from 'ui/utils';
import { isValidEthereumAddress } from 'ui/utils/address';
// import { CHAINS_ENUM } from 'consts';
import { ThemeProvider } from '@mui/system';
import { Stack, Box, Typography, Divider, CardMedia, Card } from '@mui/material';
import linkGlobe from 'ui/FRWAssets/svg/linkGlobe.svg';
import flowgrey from 'ui/FRWAssets/svg/flow-grey.svg';
import enableBg from 'ui/FRWAssets/image/enableBg.png';
import theme from 'ui/style/LLTheme';
import {
  LLPrimaryButton,
  LLSecondaryButton,
  LLSpinner,
  LLConnectLoading
} from 'ui/FRWComponent';

interface ConnectProps {
  params: any;
  // onChainChange(chain: CHAINS_ENUM): void;
  // defaultChain: CHAINS_ENUM;
}

const EthEnable = ({ params: { icon, name, origin } }: ConnectProps) => {
  const { state } = useLocation<{
    showChainsModal?: boolean;
  }>();
  const { showChainsModal = false } = state ?? {};
  const history = useHistory();
  const [, resolveApproval, rejectApproval] = useApproval();
  const { t } = useTranslation();
  const wallet = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const [appIdentifier, setAppIdentifier] = useState<string | undefined>(undefined);
  const [nonce, setNonce] = useState<string | undefined>(undefined)
  const [opener, setOpener] = useState<number | undefined>(undefined)
  const [defaultChain, setDefaultChain] = useState('FLOW');
  const [host, setHost] = useState('')
  const [title, setTitle] = useState('')
  const [msgNetwork, setMsgNetwork] = useState('testnet')
  const [isEvm, setIsEvm] = useState(false)
  const [currentNetwork, setCurrent] = useState('testnet')

  const [approval, setApproval] = useState(false)

  // TODO: replace default logo
  const [logo, setLogo] = useState('')
  const [evmAddress, setEvmAddress] = useState('')
  const init = async () => {
    wallet.switchNetwork('previewnet');
    setLogo(icon);
    const currentWallet = await wallet.getCurrentWallet();
    const res = await wallet.queryEvmAddress(currentWallet.address);
    setEvmAddress(res!);
    setIsEvm(isValidEthereumAddress(res));
    const site = await wallet.getSite(origin);
    const collectList: { name: string; logo_url: string }[] = [];
    const defaultChain = 'FLOW';
    const isShowTestnet = false;

    setDefaultChain(defaultChain);

    setIsLoading(false);
  };

  const createCoa = async () => {
    setIsLoading(true)

    wallet.createCoaEmpty().then(async (createRes) => {
      wallet.listenTransaction(createRes, true, chrome.i18n.getMessage('Domain__creation__complete'), `Your EVM on Flow address has been created. \nClick to view this transaction.`);

      setIsLoading(false);
    }).catch((err) => {
      console.log(err);
      setIsLoading(false);
    });
  }



  const transactionDoneHanlder = async (request) => {
    if (request.msg === 'transactionDone') {
      const currentWallet = await wallet.getCurrentWallet();
      const res = await wallet.queryEvmAddress(currentWallet.address);
      setEvmAddress(res!);
      setIsEvm(isValidEthereumAddress(res));

    }
    return true
  }

  useEffect(() => {

    chrome.runtime.onMessage.addListener(transactionDoneHanlder);

    return () => {
      chrome.runtime.onMessage.removeListener(transactionDoneHanlder)
    }
  }, []);

  const handleCancel = () => {
    rejectApproval('User rejected the request.');
  };

  const handleAllow = async () => {
    resolveApproval({
      defaultChain,
      signPermission: 'MAINNET_AND_TESTNET',
    });
  };

  useEffect(() => {
    init();
  }, []);

  const renderContent = () => (
    <Box sx={{ padingTop: '18px' }}>
      {isLoading ? <LLConnectLoading logo={logo} /> :
        (<Box sx={{
          margin: '0 18px 0px 18px',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '12px',
          height: '506px',
          background: 'linear-gradient(0deg, #121212, #11271D)'
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', margin: '0 18px', gap: '8px' }}>
            <Typography sx={{ textTransform: 'uppercase', fontSize: '18px' }} variant="body1" color="text.secondary">Evm on FLOW is not enabled</Typography>
            <CardMedia component="img" sx={{ width: '196px', height: '196px' }} image={enableBg} />
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 'bold',
                color: '#FFFFFF',
                textAlign: 'Montserrat',
                fontFamily: 'Inter',
                fontSize: '12px',
              }}
              color="error"
            >
              {chrome.i18n.getMessage('enable_the_path_to_evm_on_flow')}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 'normal', color: '#bababa', textAlign: 'left', fontSize: '12px' }}
              color="error"
            >
              {chrome.i18n.getMessage('manage_multi_assets_seamlessly')}
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />
          <Stack direction="row" spacing={1} sx={{ paddingBottom: '32px' }}>
            <LLSecondaryButton
              label={chrome.i18n.getMessage('Cancel')}
              fullWidth
              onClick={handleCancel}
            />
            {isEvm ?
              <LLPrimaryButton
                label={chrome.i18n.getMessage('Connect')}
                fullWidth
                type="submit"
                onClick={handleAllow}
              /> :
              <LLPrimaryButton
                label={chrome.i18n.getMessage('Enable')}
                fullWidth
                type="submit"
                onClick={createCoa}
              />

            }

            {/* {claiming ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: '5px' }}>
                <LLSpinner size={28} />
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 'bold' }}
                  color="background.paper"
                >
                  {chrome.i18n.getMessage('Working_on_it')}
                </Typography>
              </Box>
            ) : (
              <LLPrimaryButton
                label={chrome.i18n.getMessage('Enable')}
                fullWidth
                type="submit"
                onClick={createCoa}
              />
            )} */}
          </Stack>
        </Box>)}
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box>
        {renderContent()}
      </Box>
    </ThemeProvider>
  );
};

export default EthEnable;