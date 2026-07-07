import { IconButton, Toolbar, Typography, Button, Box } from '@mui/material'
import React, {  useState } from 'react'
import FlexBetween from './FlexBetween'
import MenuIcon from '@mui/icons-material/Menu';
import { useStateValue } from '../StateProvider';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/srivv_osa_logo.png'

function Navbar({isSidebarOpen, setSidebarOpen }) {
  const [anchorEl,setAnchorEl]=useState(null);
  const isOpen=Boolean(anchorEl);
  const [{staffName1,staffName2,schoolName},dispatch]=useStateValue();
  const navigate=useNavigate();

  function handleClose(e){
    if(!staffName1&&!staffName2){
      alert("Please fill the staff contact information from the Sidebar")
    }else{
      dispatch({ type:'logout' })
      navigate("/signIn");
    }
  }

  function handleClick(e){
    return setAnchorEl(e.currentTarget);
  }

  return (
    <div>
      <Toolbar sx={{
        display:'flex',
        justifyContent: "space-between",
        background: 'rgba(20, 10, 5, 0.75)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)'
      }}>
        <FlexBetween>
          <IconButton onClick={()=>setSidebarOpen(!isSidebarOpen)}>
            <MenuIcon sx={{color:'white'}}/>
          </IconButton>
          <Typography fontWeight={"bold"}
            sx={{color: "White", fontSize:"50px", marginLeft:'25px', fontFamily: `'nevis', sans-serif`}}>
            VINTERBASH 2026
          </Typography>
        </FlexBetween>

        <FlexBetween gap="1.5rem">
          <FlexBetween>
            <Box component="img"
              alt='profile'
              src={logo}
              height={"100px"}
              width="100px"
              sx={{objectFit:"cover"}} />
            <Button onClick={handleClick} sx={{
              display:"flex",
              justifyContent:"space-between",
              alignItems:'center',
              textTransform:"none",
              gap:"1rem"
            }}>
              <Typography fontWeight={"bold"} fontSize={"0.9rem"} sx={{color: "white"}}>
                {schoolName}
              </Typography>
            </Button>
            <Button onClick={handleClose} sx={{
              color:'white',
              backgroundColor:'transparent',
              border:'3px solid white',
              borderColor:'white',
              fontFamily: `'nevis', sans-serif`,
              fontWeight:'600',
              fontSize:'15px',
              '&:hover': { backgroundColor: '#f0f0f0', color:'black' }
            }}>Log Out</Button>
          </FlexBetween>
        </FlexBetween>
      </Toolbar>
    </div>
  )
}

export default Navbar