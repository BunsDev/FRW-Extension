import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, Typography, Drawer, IconButton, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { CoinItem } from 'background/service/coinList';
import theme from '../../style/LLTheme';
import { ThemeProvider } from '@mui/material/styles';
import TransferFrom from './TransferFrom';
import TransferTo from './TransferTo';
import MoveToken from './MoveToken'
import { useWallet } from 'ui/utils';
import { withPrefix } from 'ui/utils/address';
import IconSwitch from '../../../components/iconfont/IconSwitch';
import {
  LLSpinner,
} from 'ui/FRWComponent';
import { Contact } from 'background/service/networkModel';
import wallet from '@/background/controller/wallet';


interface TransferConfirmationProps {
  isConfirmationOpen: boolean;
  data: any;
  handleCloseIconClicked: () => void;
  handleCancelBtnClicked: () => void;
  handleAddBtnClicked: () => void;
}


const Move = (props: TransferConfirmationProps) => {

  enum ENV {
    Mainnet = 'mainnet',
    Testnet = 'testnet'
  }
  enum Error {
    Exceed = 'Insufficient balance',
    Fail = 'Cannot find swap pair'
  }

  // declare enum Strategy {
  //   GitHub = 'GitHub',
  //   Static = 'Static',
  //   CDN = 'CDN'
  // }
  const userContact = {
    address: '',
    id: 0,
    contact_name: '',
    avatar: '',
    domain: {
      domain_type: 999,
      value: '',
    },
  } as unknown as Contact;

  const flowToken = {
    'name': 'Flow',
    'address': {
      'mainnet': '0x1654653399040a61',
      'testnet': '0x7e60df042a9c0868',
      'crescendo': '0x7e60df042a9c0868'
    },
    'contract_name': 'FlowToken',
    'storage_path': {
      'balance': '/public/flowTokenBalance',
      'vault': '/storage/flowTokenVault',
      'receiver': '/public/flowTokenReceiver'
    },
    'decimal': 8,
    'icon': 'https://raw.githubusercontent.com/Outblock/Assets/main/ft/flow/logo.png',
    'symbol': 'flow',
    'website': 'https://www.onflow.org'
  }
  const empty: CoinItem = {
    coin: '',
    unit: '',
    balance: 0,
    price: 0,
    change24h: 0,
    total: 0,
    icon: '',
  }

  const usewallet = useWallet();
  const history = useHistory();
  const [userWallet, setWallet] = useState<any>(null);
  const [currentCoin, setCurrentCoin] = useState<string>('flow');
  const [coinList, setCoinList] = useState<CoinItem[]>([]);
  const [selectTokenOpen, setSelectToken] = useState(false);
  // const [exceed, setExceed] = useState(false);
  const [amount, setAmount] = useState<string | undefined>('');
  // const [validated, setValidated] = useState<any>(null);
  const [userInfo, setUser] = useState<Contact>(userContact);
  const [network, setNetwork] = useState('mainnet');
  const [evmAddress, setEvmAddress] = useState('');
  const [coinInfo, setCoinInfo] = useState<CoinItem>(empty);
  const [secondAmount, setSecondAmount] = useState('0.0');
  const [isLoading, setLoading] = useState<boolean>(false);
  const [toEvm, setToEvm] = useState<boolean>(true);
  const [evmBalance, setEvmBalance] = useState('0.0');
  const [errorType, setErrorType] = useState<any>(null);
  const [exceed, setExceed] = useState(false);

  const setUserWallet = async () => {
    // const walletList = await storage.get('userWallet');
    setLoading(true);
    const token = await usewallet.getCurrentCoin();
    const wallet = await usewallet.getCurrentWallet();
    console.log('wallet ', wallet)
    const network = await usewallet.getNetwork();
    setNetwork(network);
    setCurrentCoin(token);
    // userWallet
    await setWallet(wallet);
    const coinList = await usewallet.getCoinList()
    setCoinList(coinList);
    console.log('coinList ', coinList, token)
    const coinInfo = coinList.find(coin => coin.unit.toLowerCase() === token.toLowerCase());
    setCoinInfo(coinInfo!);

    const info = await usewallet.getUserInfo(false);
    userContact.address = withPrefix(wallet.address) || '';
    userContact.avatar = info.avatar;
    userContact.contact_name = info.username;
    setUser(userContact);
    // const result = await usewallet.openapi.fetchTokenList(network);
    if (network === 'previewnet') {
      usewallet.queryEvmAddress(wallet.address).then(async (res) => {
        console.log('resultresultresult ', res);
        setEvmAddress(res);
        const balance = await usewallet.getBalance(res);
        console.log('balance balance balance ', balance);
        setEvmBalance(balance);
      }).catch((err) => {
        console.log('resultresultresult err', err)
      });
    }
    setLoading(false);
    return;
  };

  const moveToken = async () => {
    setLoading(true);
    usewallet.transferFlowEvm(evmAddress, amount).then(async (createRes) => {
      usewallet.listenTransaction(createRes, true, 'Transfer to EVM complete', `Your have moved ${amount} Flow to your EVM address ${evmAddress}. \nClick to view this transaction.`);
      await usewallet.setDashIndex(0);
      history.push('/dashboard?activity=1');
      console.log('transferFlowEvm , ', createRes)
      setLoading(false);
    }).catch((err) => {
      console.log(err);
      setLoading(false);
    });
  };

  const withDrawToken = async () => {
    setLoading(true);
    usewallet.withdrawFlowEvm(amount, userWallet.address).then(async (createRes) => {
      usewallet.listenTransaction(createRes, true, 'Transfer to EVM complete', `Your have moved ${amount} Flow to your EVM address ${evmAddress}. \nClick to view this transaction.`);
      await usewallet.setDashIndex(0);
      history.push('/dashboard?activity=1');
      console.log('transferFlowEvm , ', createRes)
      setLoading(false);
    }).catch((err) => {
      console.log(err);
      setLoading(false);
    });
  };

  const handleMove = async ()=> {
    if (toEvm) {
      moveToken();
    } else {
      withDrawToken();
    }
  };

  const switchSide = () => {
    const toEvmType = toEvm
    setToEvm(!toEvmType);
  };

  useEffect(() => {
    setUserWallet();
  }, [])


  return (
    <Drawer
      anchor="bottom"
      open={props.isConfirmationOpen}
      transitionDuration={300}
      PaperProps={{
        sx: { width: '100%', height: 'auto', background: '#222', borderRadius: '18px 18px 0px 0px' },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', px: '16px' }}>
        <Box
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            display: 'flex'
          }}
        >
          <Box sx={{ width: '40px' }}></Box>
          <Box>
            <Typography sx={{ fontWeight: '700', fontSize: '14px' }}>
              Move Token
            </Typography>
          </Box>
          <Box onClick={props.handleCancelBtnClicked}>
            <IconButton>
              <CloseIcon
                fontSize="medium"
                sx={{ color: 'icon.navi', cursor: 'pointer' }}
              />
            </IconButton>
          </Box>
        </Box>
        {userWallet &&
          (toEvm ?
            <TransferFrom
              wallet={userWallet}
              userInfo={userInfo}
            />
            :
            <TransferTo
              wallet={evmAddress}
              userInfo={userInfo}
            />
          )
        }
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', my: '-21px', zIndex: '99' }}>
          {isLoading ?
            <Box sx={{ borderRadius: '28px', backgroundColor: '#000', width: '28px', height: '28px' }}>
              <LLSpinner size={28} />
            </Box>
            :
            <Box sx={{ width: '100%', height: '28px', display: 'flex', justifyContent: 'center', }}>
              <Button
                onClick={() => switchSide()}

                sx={{ minWidth: '28px', borderRadius: '28px', padding: 0, }}
              >
                <IconSwitch color={'#41CC5D'} size={28} style={{ borderRadius: '28px', border: '3px solid #000' }} />
              </Button>
            </Box>
          }
        </Box>
        {evmAddress &&

          (toEvm ?
            <TransferTo
              wallet={evmAddress}
              userInfo={userInfo}
            />
            :
            <TransferFrom
              wallet={userWallet}
              userInfo={userInfo}
            />
          )
        }
      </Box>

      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', mx: '18px', mb: '35px', mt: '10px' }}>
        {coinInfo.unit &&
          <MoveToken
            coinList={coinList}
            amount={amount}
            setAmount={setAmount}
            secondAmount={secondAmount}
            setSecondAmount={setSecondAmount}
            exceed={exceed}
            setExceed={setExceed}
            coinInfo={coinInfo}
            toEvm={toEvm}
            evmBalance={evmBalance}
            setCurrentCoin={setCurrentCoin}
          />
        }
      </Box>

      <Box sx={{ display: 'flex', gap: '8px', mx: '18px', mb: '35px', mt: '10px' }}>

        <Button
          onClick={() => { handleMove() }}
          // disabled={true}
          variant="contained"
          color="success"
          size="large"
          sx={{
            height: '48px',
            flexGrow: 1,
            borderRadius: '8px',
            textTransform: 'capitalize',
          }}
          disabled={Number(amount) <= 0 || errorType || isLoading}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 'bold' }}
            color="text.primary"
          >
            {errorType ?
              errorType :
              'Move'
            }
          </Typography>
        </Button>
      </Box>
    </Drawer>
  );
}


export default Move;