import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import { Box, Typography, Drawer, Stack, Grid, CardMedia, IconButton, Button } from '@mui/material';
import React, { useState, useEffect, useCallback } from 'react';
import { Presets } from 'react-component-transition';
import { useHistory } from 'react-router-dom';

import StorageExceededAlert from '@/ui/FRWComponent/StorageExceededAlert';
import { ensureEvmAddressPrefix, isValidEthereumAddress } from '@/ui/utils/address';
import { MatchMediaType } from '@/ui/utils/url';
import { LLSpinner, FRWProfileCard, FRWDropdownProfileCard } from 'ui/FRWComponent';
import { useWallet } from 'ui/utils';

import IconFlow from '../../../../components/iconfont/IconFlow';

interface SendNFTConfirmationProps {
  isConfirmationOpen: boolean;
  data: any;
  handleCloseIconClicked: () => void;
  handleCancelBtnClicked: () => void;
  handleAddBtnClicked: () => void;
}

const MovefromParent = (props: SendNFTConfirmationProps) => {
  const wallet = useWallet();
  const history = useHistory();
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<number | null>(null);

  const [occupied, setOccupied] = useState(false);
  const [childWallets, setChildWallets] = useState({});
  const [selectedAccount, setSelectedChildAccount] = useState(null);

  const getPending = useCallback(async () => {
    const pending = await wallet.getPendingTx();
    if (pending.length > 0) {
      setOccupied(true);
    }
  }, [wallet]);

  const updateOccupied = useCallback(() => {
    setOccupied(false);
  }, []);

  const replaceIPFS = (url: string | null): string => {
    if (!url) {
      return '';
    }

    const lilicoEndpoint = 'https://gateway.pinata.cloud/ipfs/';

    const replacedURL = url
      .replace('ipfs://', lilicoEndpoint)
      .replace('https://ipfs.infura.io/ipfs/', lilicoEndpoint)
      .replace('https://ipfs.io/ipfs/', lilicoEndpoint)
      .replace('https://lilico.app/api/ipfs/', lilicoEndpoint);

    return replacedURL;
  };

  const sendNFT = async () => {
    // setSending(true);
    await moveNFTToFlow();
  };

  const returnFilteredCollections = (contractList, NFT) => {
    return contractList.filter((collection) => collection.name === NFT.collectionName);
  };

  const moveNFTToFlow = async () => {
    setSending(true);
    // setSending(true);
    const contractList = await wallet.openapi.getAllNftV2();
    const filteredCollections = returnFilteredCollections(contractList, props.data.nft);

    if (isValidEthereumAddress(selectedAccount!['address'])) {
      await moveNFTToEvm();
    } else {
      wallet
        .sendNFTtoChild(selectedAccount!['address'], '', props.data.nft.id, filteredCollections[0])
        .then(async (txID) => {
          wallet.listenTransaction(
            txID,
            true,
            `Move complete`,
            `You have moved 1 ${props.data.nft.collectionContractName} from linked account to your flow address. \nClick to view this transaction.`
          );
          props.handleCloseIconClicked();
          await wallet.setDashIndex(0);
          setSending(false);
          history.push('/dashboard?activity=1');
        })
        .catch((err) => {
          console.error('err ', err);
          setSending(false);
          setFailed(true);
        });
    }
  };

  const moveNFTToEvm = async () => {
    setSending(true);
    const identifier = props.data.contract.nftTypeId
      ? props.data.contract.nftTypeId
      : props.data.contract.flowIdentifier;
    wallet
      .batchBridgeNftToEvm(identifier, [props.data.nft.id])
      .then(async (txID) => {
        wallet.listenTransaction(
          txID,
          true,
          `Move complete`,
          `You have moved 1 ${props.data.nft.collectionContractName} to your evm address. \nClick to view this transaction.`
        );
        props.handleCloseIconClicked();
        await wallet.setDashIndex(0);
        setSending(false);
        history.push('/dashboard?activity=1');
      })
      .catch(() => {
        setSending(false);
        setFailed(true);
      });
  };

  const transactionDoneHandler = useCallback(
    (request) => {
      if (request.msg === 'transactionDone') {
        updateOccupied();
      }
      // Handle transaction error
      if (request.msg === 'transactionError') {
        setFailed(true);
        setErrorMessage(request.errorMessage);
        setErrorCode(request.errorCode);
      }
      return true;
    },
    [updateOccupied]
  );

  useEffect(() => {
    getPending();
    chrome.runtime.onMessage.addListener(transactionDoneHandler);

    return () => {
      chrome.runtime.onMessage.removeListener(transactionDoneHandler);
    };
  }, [getPending, props.data.contact, transactionDoneHandler]);

  const getChildResp = useCallback(async () => {
    const childresp = await wallet.checkUserChildAccount();
    const ewallet: any = await wallet.getEvmWallet();
    const emojires = await wallet.getEmoji();
    let evmAddress;
    if (ewallet.address) {
      evmAddress = ensureEvmAddressPrefix(ewallet.address);
    }
    let evmWallet = {};
    if (evmAddress) {
      evmWallet = {
        [evmAddress!]: {
          name: emojires[1].name,
          description: emojires[1].name,
          thumbnail: {
            url: emojires[1].emoji,
          },
        },
      };
    }

    // Merge wallet lists
    const walletList = { ...childresp, ...evmWallet };
    setChildWallets(walletList);
    const firstWalletAddress = Object.keys(walletList)[0];
    if (firstWalletAddress) {
      setSelectedChildAccount(walletList[firstWalletAddress]);
    }
  }, [wallet]);

  useEffect(() => {
    getChildResp();
  }, [getChildResp]);

  const renderContent = () => {
    const getUri = () => {
      return (
        <>
          {props.data.media &&
            (props.data.media.type !== MatchMediaType.VIDEO ? (
              <CardMedia
                sx={{ width: '72px', height: '72px', borderRadius: '8px' }}
                image={replaceIPFS(props.data.media.image)}
              />
            ) : (
              <>
                <video
                  loop
                  autoPlay
                  preload="auto"
                  style={{ width: '72px', height: 'auto', objectFit: 'cover', borderRadius: '8px' }}
                >
                  <source src={props.data.media.url} type="video/mp4" />
                </video>
              </>
            ))}
        </>
      );
    };

    const getMedia = () => {
      return (
        <>
          <video
            loop
            autoPlay
            playsInline
            preload="auto"
            style={{ width: '72px', height: 'auto', objectFit: 'cover', borderRadius: '8px' }}
          >
            <source src={props.data.media?.videoURL || undefined} type="video/mp4" />
          </video>
        </>
      );
    };
    return (
      <Box
        px="18px"
        sx={{
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
          flexDirection: 'column',
          display: 'flex',
        }}
      >
        <Grid
          container
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Grid item xs={1}></Grid>
          <Grid item xs={10}>
            <Typography variant="h1" align="center" py="14px" fontWeight="bold" fontSize="20px">
              {chrome.i18n.getMessage('Move')} NFT
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <IconButton onClick={props.handleCloseIconClicked}>
              <CloseIcon fontSize="medium" sx={{ color: 'icon.navi', cursor: 'pointer' }} />
            </IconButton>
          </Grid>
        </Grid>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: '16px',
          }}
        >
          <FRWProfileCard contact={props.data.userContact} />
          <Box sx={{ height: '8px' }}></Box>
          {selectedAccount && (
            <FRWDropdownProfileCard
              contact={selectedAccount}
              contacts={childWallets}
              setSelectedChildAccount={setSelectedChildAccount}
            />
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            mx: '25px',
            px: '14px',
            py: '16px',
            backgroundColor: '#181818',
            borderBottomRightRadius: '16px',
            borderBottomLeftRadius: '16px',
            mt: '-16px',
            mb: '42px',
          }}
        >
          <Stack direction="row" spacing={1}>
            {props.data.media &&
            props.data.media?.type === MatchMediaType.IMAGE &&
            !!props.data.media?.videoURL
              ? getMedia()
              : getUri()}
          </Stack>
          <Stack direction="column" spacing={1} sx={{ ml: '14px' }}>
            <Typography color="neutral.contrastText" sx={{ fontSize: '14px', fontWeight: '700' }}>
              {props.data.media && props.data.media?.title}
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center', marginTop: '0px !important' }}
            >
              <CardMedia
                sx={{ width: '20px', height: '20px', borderRadius: '20px' }}
                image={props.data.contract && props.data.contract.collectionSquareImage}
              />
              <Typography
                color="text.nonselect"
                sx={{ fontWeight: '400', display: 'inline-block' }}
              >
                {props.data.contract && props.data.contract.collectionContractName}
              </Typography>
              <span>
                <IconFlow size={12} style={{ margin: 'auto' }} />
              </span>
            </Stack>
          </Stack>
        </Box>

        <Box sx={{ flexGrow: 1 }} />
        {occupied && (
          <Presets.TransitionSlideUp>
            <Box
              sx={{
                width: '95%',
                backgroundColor: 'error.light',
                mx: 'auto',
                borderRadius: '12px 12px 0 0',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                py: '8px',
              }}
            >
              {/* <CardMedia style={{ color:'#E54040', width:'24px',height:'24px', margin: '0 12px 0' }} image={empty} />   */}
              <InfoIcon
                fontSize="medium"
                color="primary"
                style={{ margin: '0px 12px auto 12px' }}
              />
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '12px' }}>
                {chrome.i18n.getMessage('Your__address__is__currently__processing')}
              </Typography>
            </Box>
          </Presets.TransitionSlideUp>
        )}
        <Button
          onClick={sendNFT}
          disabled={sending || occupied}
          variant="contained"
          color="primary"
          size="large"
          sx={{
            height: '50px',
            borderRadius: '12px',
            textTransform: 'capitalize',
            display: 'flex',
            gap: '12px',
            mb: '33px',
          }}
        >
          {sending ? (
            <>
              <LLSpinner size={28} />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }} color="text.primary">
                {chrome.i18n.getMessage('Working_on_it')}
              </Typography>
            </>
          ) : (
            <>
              {failed ? (
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }} color="text.primary">
                  {chrome.i18n.getMessage('Transaction__failed')}
                </Typography>
              ) : (
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }} color="text.primary">
                  {chrome.i18n.getMessage('Move')}
                </Typography>
              )}
            </>
          )}
        </Button>
      </Box>
    );
  };

  return (
    <>
      <Drawer
        anchor="bottom"
        open={props.isConfirmationOpen}
        transitionDuration={300}
        PaperProps={{
          sx: {
            width: '100%',
            height: '457px',
            bgcolor: 'background.paper',
            borderRadius: '18px 18px 0px 0px',
          },
        }}
      >
        {renderContent()}
      </Drawer>
      <StorageExceededAlert open={errorCode === 1103} onClose={() => setErrorCode(null)} />
    </>
  );
};

export default MovefromParent;
