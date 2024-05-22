import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, Typography, Drawer, IconButton, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { CoinItem } from 'background/service/coinList';
import theme from '../../../style/LLTheme';
import { ThemeProvider } from '@mui/material/styles';
import TransferFrom from './TransferFrom';
import TransferTo from './TransferTo';
import MoveToken from './MoveToken'
import { useWallet } from 'ui/utils';
import { withPrefix } from 'ui/utils/address';
import IconSwitch from '../../../../components/iconfont/IconSwitch';
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


const Bridge = (props: TransferConfirmationProps) => {

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
  const [errorType, setErrorType] = useState<any>(null);
  const [exceed, setExceed] = useState(false);

  const setUserWallet = async () => {
    // const walletList = await storage.get('userWallet');
    setLoading(true);
    const wallet = await usewallet.getMainWallet();
    console.log('wallet ', wallet, props.data.tokenInfo)
    const network = await usewallet.getNetwork();
    setNetwork(network);
    setCurrentCoin(props.data.tokenInfo.symbol);
    // userWallet
    await setWallet(wallet);
    const data = await usewallet.getEvmAddress();
    setEvmAddress(data);
    const coinList = await usewallet.getCoinList()
    setCoinList(coinList);
    console.log('coinList ', coinList)
    const coinInfo = coinList.find(coin => coin.unit.toLowerCase() === props.data.tokenInfo.symbol.toLowerCase());
    setCoinInfo(coinInfo!);

    const info = await usewallet.getUserInfo(false);
    userContact.address = withPrefix(wallet) || '';
    userContact.avatar = info.avatar;
    userContact.contact_name = info.username;
    setUser(userContact);
    // const result = await usewallet.openapi.fetchTokenList(network);
    setLoading(false);
    return;
  };

  const moveToken = async () => {
    setLoading(true);
    console.log('amount ', amount)
    usewallet.bridgeToEvm(props.data.tokenInfo.address, props.data.tokenInfo.contractName, amount).then(async (createRes) => {
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
    const flowIdentifier = props.data.tokenInfo.flowIdentifier.split('.');
    const address = '0x' + flowIdentifier[1]
    const contractName = flowIdentifier[2]
    console.log('props.data ', props.data)
   
    usewallet.bridgeToFlow(address, contractName, amount).then(async (createRes) => {
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

  const handleMove = async () => {
    if (toEvm) {
      moveToken();
    } else {
      withDrawToken();
    }
  };

  const switchSide = async () => {
    const isChild = await usewallet.getActiveWallet();
    console.log('isChild ', isChild);
    setToEvm(isChild !== 'evm');
  };

  useEffect(() => {
    switchSide();
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
              Bridge Token
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
                // onClick={() => switchSide()}

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
            setCurrentCoin={setCurrentCoin}
          />
        }
      </Box>

      <Box sx={{ display: 'flex', gap: '8px', mx: '18px', mb: '35px', mt: '10px' }}>

        <Button
          onClick={() => { handleMove() }}
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
              'Bridge'
            }
          </Typography>
        </Button>
      </Box>
    </Drawer>
  );
}


export default Bridge;