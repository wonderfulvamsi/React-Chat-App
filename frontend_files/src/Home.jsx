import React from 'react'
import { Box, Stack, Button, Model } from '@mui/material';
import Modal from '@mui/material/Modal';
import { Link } from 'react-router-dom';
import SideBar from './SideBar';
import Chat from './Chat';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import Roomcontext from './Roomcontext';
import Gochat from './Gochat'
import { Lock } from '@material-ui/icons';
import './App.css';
import { AddIcCall, CallEnd, Videocam } from "@material-ui/icons";
import Peer from 'peerjs';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

function Home({ socket }) {

    const { username } = useParams();
    const [gotoroom, setGotoroom] = useState('blabla');
    const [messageList, setMessageList] = useState([]);
    const [go, setGo] = useState(0);

    const [openLogout, setOpenLogout] = React.useState(false);
    const handleOpenLogout = () => setOpenLogout(true);
    const handleCloseLogout = () => setOpenLogout(false);


    const getMsgs = async (room) => {
        //fetching prev msgs
        try {
            await axios.get("http://localhost:5000/rooms/" + username + "/" + room + "/messages").then((res) => {
                setMessageList([...res.data]);
            });
        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(
        () => {
            async function updateSocketid() {
                //update Socketid
                socket.on('connect', async () => {
                    try {
                        await axios.put("http://localhost:5000/users/" + username + "/socketid", {
                            socketid: socket.id
                        })
                    }
                    catch (err) {
                        console.log(err)
                    }
                })
            }
            updateSocketid();
        }, [socket]);

    return (
        <>
            <div className="topbar">
                <h3 className='topbartext'>React Chat App</h3>
                <div className='logout' onClick={handleOpenLogout}><Lock />Logout</div>
            </div>
            <Stack direction="row" spacing={0} >
                <Roomcontext.Provider value={{ gotoroom, setGotoroom, getMsgs, messageList, setMessageList, go, setGo, }}>
                    <SideBar username={username} socket={socket} />
                    {go ? <Gochat username={username} socket={socket} /> : <Chat username={username} />}
                    <Modal
                        open={openLogout}
                        onClose={handleCloseLogout}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Stack direction="column" spacing={3} >
                                <h3>Are You Sure?</h3>
                                <div>See you soon!</div>
                                <Button variant="outlined" component={Link} to='/'>Yup</Button>
                            </Stack>
                        </Box>
                    </Modal>
                </Roomcontext.Provider>
            </Stack>
        </>
    )
}

export default Home