import React, { useState, useEffect } from 'react';
import { Box, Button, Skeleton, Typography, Drawer, IconButton, TextField, ListItemIcon, ListItemText, Avatar, CardMedia } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useWallet } from 'ui/utils';
import { useHistory } from 'react-router-dom';
import popLock from 'ui/FRWAssets/svg/popLock.svg';
import popAdd from 'ui/FRWAssets/svg/popAdd.svg';
import iconCheck from 'ui/FRWAssets/svg/iconCheck.svg';
import selected from 'ui/FRWAssets/svg/selected.svg';
import {
  LLSpinner,
} from 'ui/FRWComponent';





const MoveCollectionSelect = ({ showMoveBoard, handleCloseIconClicked, handleCancelBtnClicked, handleAddBtnClicked, selectedCollection, setSelected, collectionList }) => {


  const usewallet = useWallet();
  const history = useHistory();
  const [filter, setFilter] = useState('');

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredCollectionList = collectionList.filter((obj) =>
    obj.CollectionName.toLowerCase().includes(filter.toLowerCase())
  );



  return (
    <Drawer
      anchor="bottom"
      sx={{ zIndex: '1600 !important' }}
      transitionDuration={300}
      open={showMoveBoard}
      PaperProps={{
        sx: { width: '100%', height: '479px', background: '#222', borderRadius: '18px 18px 0px 0px', },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', px: '20px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', height: '24px', margin: '20px 0', alignItems: 'center', }}>
          <Box sx={{ width: '40px' }}></Box>
          <Typography
            variant="body1"
            component="div"
            display="inline"
            color='text'
            sx={{ fontSize: '18px', textAlign: 'center', lineHeight: '24px', fontWeight: '700' }}
          >
            Select NFTs
          </Typography>
          <Box>
            <IconButton onClick={handleCancelBtnClicked}>
              <CloseIcon
                fontSize="medium"
                sx={{ color: 'icon.navi', cursor: 'pointer' }}
              />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', mb: '16px', mt: '16px', padding: '0 18px' }}>
          <TextField
            label="Filter"
            variant="outlined"
            value={filter}
            onChange={handleFilterChange}
            fullWidth
            sx={{ marginBottom: '16px' }}
          />

          {filteredCollectionList.map((obj, index) => (
            <Button onClick={() => setSelected(obj.id)} sx={{ width: '100%' }}>
              <Box sx={{ backgroundColor: '#2C2C2C', width: "100%", height: '64px', display: 'flex', overflow: 'hidden', justifyContent: 'space-between', borderRadius: '12px' }} key={index}>
                <CardMedia component="img" sx={{ width: '80px', height: '100%', display: 'inline', }} image={obj.logo} />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: '1', marginLeft: '16px', mt: '12px', height: '100%' }}>
                  <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{obj.CollectionName}</Typography>
                  <Typography sx={{ fontSize: '12px', fontWeight: 400 }}>{obj.NftCount} NFTs</Typography>
                </Box>
                <Box sx={{ height: '100%', width: '16px', marginRight: '24px', display: 'flex', alignItems: 'center' }}>
                  {selectedCollection === obj.id &&
                    <CardMedia component="img" sx={{ width: '16px', height: '16px', display: 'inline', }} image={selected} />
                  }
                </Box>

              </Box>
            </Button>
          ))}

        </Box>

      </Box>

    </Drawer>
  );
}

export default MoveCollectionSelect;