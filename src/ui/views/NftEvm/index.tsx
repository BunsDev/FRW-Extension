import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Box, ButtonBase, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/system';
import { TabPanel, TabsList, Tabs, Tab } from '@mui/base';
import { buttonUnstyledClasses } from '@mui/core/ButtonUnstyled';
import { tabClasses } from '@mui/base/Tab';
import { useWallet } from 'ui/utils';
import { storage } from '@/background/webapi';
import GridTab from './GridTab';
import ListTab from './ListTab';
import EditNFTAddress from './EditNFTAddress';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';

const NftEvm = () => {
  const wallet = useWallet();

  const [address, setAddress] = useState<string | null>('');
  const [value, setValue] = useState(0);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState<boolean>(false);
  const [nftCount, setCount] = useState<number>(0);
  const [accessible, setAccessible] = useState<any>([]);
  const [isActive, setIsActive] = useState(true);
  const [nftList, setNftList] = useState<any>(null);
  const gridRef = useRef<any>(null);
  const listRef = useRef<any>(null);

  useEffect(() => {
    fetchPreferedTab();
    loadNFTs();
    requestCadenceNft();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    storage.set('PreferredNFT', newValue);
  };

  const requestCadenceNft = async () => {
    const activeChild = await wallet.getActiveWallet();
    if (activeChild === 'evm') {
      const evmNftResult = await wallet.reqeustEvmNft();
      const tokensWithNfts = evmNftResult.filter(token => token.nftIds && token.nftIds.length > 0);
      const nftresult = await convertToNftCatalogModel(tokensWithNfts);
      console.log(tokensWithNfts, ' tokensWithNfts[0].collection.id');
      setNftList(nftresult);
    } else {
      const cadenceResult = await wallet.requestCadenceNft();
      const collection = await wallet.requestCollectionInfo(cadenceResult[0].collection.id);
      const resultData = await convertToReactComponent(collection); 3
      setNftList(resultData);
    }






  };

  const convertToNftCatalogModel = (data) => {
    return data.flatMap(item =>
      item.nfts.map(nft => ({
        id: nft.id,
        name: nft.name,
        description: '',
        thumbnail: nft.thumbnail,
        externalURL: item.tokenURI,
        contractEvmAddress: item.address,
        contractAddress: '0x' + item.flowIdentifier.split('.')[1],
        collectionID: item.flowIdentifier,
        collectionName: item.name,
        collectionContractName: item.flowIdentifier.split('.')[2],
        collectionDescription: '',
        collectionSquareImage: item.logoURI,
        collectionBannerImage: '',
        collectionExternalURL: '',
        royalties: [],
        traits: [],
        postMedia: {
          image: nft.thumbnail,
          isSvg: false,
          description: '',
          title: nft.name,
        },
      }))
    );
  }

  const convertToReactComponent = (data) => {
    const { nfts } = data;

    return nfts.map(nft => ({
      id: nft.id,
      name: nft.name,
      description: nft.description,
      thumbnail: nft.thumbnail,
      externalURL: nft.externalURL,
      contractAddress: nft.contractAddress,
      collectionID: nft.collectionID,
      collectionName: nft.collectionName,
      collectionContractName: nft.collectionContractName,
      collectionDescription: nft.collectionDescription,
      collectionSquareImage: nft.collectionSquareImage,
      collectionBannerImage: nft.collectionBannerImage,
      collectionExternalURL: nft.collectionExternalURL,
      royalties: nft.royalties.cutInfos.map(cutInfo => ({
        receiver: cutInfo.receiver,
        cut: cutInfo.cut,
        description: cutInfo.description
      })),
      traits: nft.traits,
      postMedia: {
        image: nft.postMedia.image,
        isSvg: nft.postMedia.isSvg,
        description: nft.postMedia.description,
        title: nft.postMedia.title
      }
    }));
  }


  const loadNFTs = async () => {
    const isChild = await wallet.getActiveWallet();
    const address = await wallet.getCurrentAddress();
    // const flowCoins = fetchRemoteConfig.flowCoins();

    console.log('address ', address);
    if (isChild) {
      const nftResult = await wallet.checkAccessibleNft(address);
      if (nftResult) {
        setAccessible(nftResult);
      }
      setIsActive(false);
    } else {
      setIsActive(true);
    }
    // setAddress(address);
    setAddress(address);
  }

  const fetchPreferedTab = async () => {
    const tab = await storage.get('PreferredNFT');
    if (tab) { setValue(tab); }
  }

  const refreshButtonClicked = () => {
    if (value === 0) gridRef?.current?.reload();
    if (value === 1) listRef?.current?.reload();
  }


  const colors = {
    20: '#ffffff',
    100: '#FAFAFA',
    900: '#111111',
    1000: '#000000'
  };

  const StyledTab = styled(Tab)`
    font-family: IBM Plex Sans, sans-serif;
    color: '#111111';
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: bold;
    background-color: '#FAFAFA';
    width: '52px';
    height: '24px';
    padding: 6px 13px;
    margin: 0;
    border: none;
    border-radius: 8px;
    display: flex;
    justify-content: center;

    &:hover {
      background-color: '#000000';
    }

    &:focus {
      color: #fff;
      background-color: '#000000';
      border-radius: 8px;
    }

    &.${tabClasses.selected} {
      background-color: ${colors[900]};
      color: ${colors[20]};
      padding: 2px 13px;
    }

    &.${buttonUnstyledClasses.disabled} {
      opacity: 0.24;
      cursor: not-allowed;
    }
`;

  const TabPanelStyle = styled(TabPanel)`
    width: 100%;
  `;

  const TabsListStyle = styled(TabsList)`
    background-color: '#FAFAFA';
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    align-content: space-between;
    padding: 4px;
  `;

  return (
    <div className="page" id="scrollableTab">
      <Tabs value={value} onChange={handleChange}>
        <Box sx={{ display: 'flex', flexDirection: 'row', px: '18px', py: '10px', gap: '8px', alignItems: 'center' }}>

          <Tooltip title={chrome.i18n.getMessage('Refresh')} arrow>
            <ButtonBase sx={{ flexGrow: 1, justifyContent: 'flex-start' }} onClick={refreshButtonClicked}>
              <Typography component='div' variant='h5'>{nftCount > 0 ? `${nftCount} NFTs` : 'NFT'}</Typography>
              <IconButton
                aria-label="close"
                color="primary"
                size="small"
              >
                <ReplayRoundedIcon fontSize="inherit" />
              </IconButton>
            </ButtonBase>
          </Tooltip>

          <TabsListStyle
            sx={{ backgroundColor: 'rgb(250, 250, 250, 0.24)', width: '120px', height: '36px', padding: '0px' }}>
            <StyledTab sx={
              {
                zIndex: 12,
                backgroundColor: 'rgba(250, 250, 250, 0)',
                '&:focus': { backgroundColor: '#000000', color: '#FFFFFF', padding: '2px 13px' }
              }
            }>{chrome.i18n.getMessage('Grid')}</StyledTab>
            <StyledTab sx={
              {
                zIndex: 12,
                backgroundColor: 'rgba(250, 250, 250, 0)',
                '&:focus': { backgroundColor: '#000000', color: '#FFFFFF', padding: '2px 13px' },
              }
            }>{chrome.i18n.getMessage('List')}</StyledTab>
          </TabsListStyle>
          <Box component='span'>
            <Button
              component={Link}
              to='/dashboard/nested/add_list'
              variant='contained'
              color='secondary'
              sx={{
                width: '46px',
                height: '35px',
                borderRadius: '12px',
                minWidth: '46px',
                padding: '6px 9px',
                zIndex: 12,
                opacity: '0.24',
              }}
            >
              <Typography color='#111111'
                sx={{
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  textTransform: 'none'
                }}
              >
                {chrome.i18n.getMessage('Add')}
              </Typography>
            </Button>
          </Box>
        </Box>

        {process.env.NODE_ENV !== 'production' &&
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              width: '90%',
              margin: '10px auto 0 auto',
              backgroundColor: '#2E2E2E',
              borderRadius: '12px',
              justifyContent: 'space-between',
              padding: '5px 12px'
            }}>
            <Box>
              <Typography component='div' color='neutral.contrastText' sx={{ fontSize: '11px' }}>
                {chrome.i18n.getMessage('For__testing__purpose__only')}
              </Typography>
              <Typography display='inline' color='neutral.contrastText' sx={{ fontSize: '11px' }}>
                {chrome.i18n.getMessage('Showing__NFT__under')}
                <span>{' '}</span></Typography>
              <Typography color='primary' display='inline' sx={{ fontSize: '12px' }}>{address}</Typography>
            </Box>
            <Button
              variant='contained'
              color='primary'
              sx={{
                width: '63px',
                borderRadius: '12px',
                color: '#000000',
                height: '30px',
                textTransform: 'none',
                fontSize: '10px',
                fontWeight: 700,
                alignSelf: 'center'
              }}
              onClick={() => {
                setIsAddAddressOpen(true);
              }}
            >{chrome.i18n.getMessage('Change')}</Button>
          </Box>
        }

        <EditNFTAddress
          isAddAddressOpen={isAddAddressOpen}
          handleCloseIconClicked={() => setIsAddAddressOpen(false)}
          handleCancelBtnClicked={() => setIsAddAddressOpen(false)}
          handleAddBtnClicked={() => {
            wallet.clearNFT();
            setIsAddAddressOpen(false);
            gridRef!.current.reload();
            listRef!.current?.reload();
          }}
          setAddress={setAddress}
          address={address!}
          isEdit={isEdit}
        />

        <TabPanelStyle value={0} sx={{ width: '100%' }} id="scrollableTab">
          {nftList &&
            <GridTab
              setCount={setCount}
              data={{ ownerAddress: address }}
              ref={gridRef}
              accessible={accessible}
              isActive={isActive}
              nftList={nftList}
            />
          }
        </TabPanelStyle>
        <TabPanelStyle value={1} sx={{ width: '100%' }}>
          <ListTab
            setCount={setCount}
            data={{ ownerAddress: address }}
            ref={listRef}
            accessible={accessible}
            isActive={isActive}
            nftList={nftList}
          />
        </TabPanelStyle>
      </Tabs>
    </div>
  );
};

export default NftEvm;