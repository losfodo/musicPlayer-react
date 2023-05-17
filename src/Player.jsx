import React, {useState, useEffect, useRef} from 'react'
import {
    styled, Typography, Slider,
    Paper, Stack, Box
} from '@mui/material';//biblioteca simples, personalizável e acessível de componentes React


// #region ------------ ICONS ---------
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';

import PauseIcon from '@mui/icons-material/Pause';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import FastForwardIcon from '@mui/icons-material/FastForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
// #endregion ------------ ICONS ---------

// #region ------- Tracts -------------------------------------------------------
import machineGirls from './music/California Reflection Dreams - Machine Girls [2012].mp3';
import Gorillaz from './music/Gorillaz - On Melancholy Hill (lyrics).mp3';
import Lana from './music/Lana Del Rey - Video Games (Album Version Remastered).mp3';
import Cigarettes from './music/Sweet - Cigarettes After Sex.mp3';
// import music from './music';/*colocar futuramente como um array de musicas */

// #endregion ---------------------------------------------------------------

// #region -------- Styled Components -----------------------------------------
const Div = styled('div')(({theme}) => ({//Criando os estilos de componentes. css por js
    backgroundColor: 'black',
    height:'100vh',
    width:'100vw',
    paddingTop: theme.spacing(30)//da um espaçamento para baixo pra nao ficar totalemente no topo
}))

const CustomPaper = styled(Paper)(({theme}) => ({//usando o mui/material do react biblioteca,, uma area quase uma div onde vai ficar tudo dentro
    backgroundColor: '#901872',//parte rosa poderia ser tbm #4c4c4c
    marginLeft: theme.spacing(6),//vai mais a direita
    marginRight: theme.spacing(6),//mais a esquerda 
    padding: theme.spacing(2)
}))

const PSlider = styled(Slider)(({theme, ...props}) => ({//parametro recebe Slider mui/material
    color: 'lime',
    height: 2,
    '&:hover': {//ao passar o mouse
        cursor: 'auto', //manter o cursor normal
    },
    '& .MuiSlider-thumb': {
        width: '13px',
        height: '13px',
        display: props.thumbless ? 'none' : 'block', //remove o ponto onde esta a barra de slide
    }
}))
// #endregion ---------------------------------------------------------------


const playlist = [machineGirls, Gorillaz, Lana, Cigarettes];//*coloca as musicas em um array


export default function Player() {//A função player é principal percorre toda aplicação javascript
    const audioPlayer = useRef()//useRef é um gancho que permite criar diretamente uma referência ao elemento DOM no componente funcional

    const [index, setIndex] = useState(0);

    const [currentSong] = useState(playlist[index]);//coloca no state a playlist array com as musicas
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(10);
    const [mute, setMute] = useState(false);

    const [elapsed, setElapsed] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if(audioPlayer){
            audioPlayer.current.volume = volume / 100;
            // audioPlayer.current.currentTime = elapsed;//nao funcionou para deslizar na musica 
        }


        if(isPlaying){
            setInterval(() => {
                const _duration = Math.floor(audioPlayer?.current?.duration);
                const _elapsed = Math.floor(audioPlayer?.current?.currentTime);

                setDuration(_duration);
                setElapsed(_elapsed);
            }, 100);
        }

    }, [
        volume, isPlaying, elapsed
    ]);

    function formatTime(time) {
        if(time && !isNaN(time)){
            const minutes = Math.floor(time / 60) < 10 ? `0${Math.floor(time / 60)}` : Math.floor(time / 60);
            const seconds = Math.floor(time % 60) < 10 ? `0${Math.floor(time % 60)}` : Math.floor(time % 60);

            return `${minutes}:${seconds}`;
        }
        return '00:00';
    }

    const togglePlay = () => {
        if(!isPlaying) {
            audioPlayer.current.play()
        }else {
            audioPlayer.current.pause()
        }
        setIsPlaying(prev => !prev)
    }

    const toggleForward = () => {
        audioPlayer.current.currentTime += 10;
    }

    const toggleBackward = () => {
        audioPlayer.current.currentTime -= 10;
    }

    const toggleSkipForward = () => {//clicar na proxima musica
        if(index >= playlist.length - 1) {
            setIndex(0);
            audioPlayer.current.src = playlist[0];
            // audioPlayer.current.play();//toca a musica ao trocar de musica
            if(!isPlaying) {
                audioPlayer.current.pause()
            }else {
                audioPlayer.current.play()
            }
        } else {
            setIndex(prev => prev + 1);
            audioPlayer.current.src = playlist[index + 1];
            // audioPlayer.current.play();
            if(!isPlaying) {
                audioPlayer.current.pause()
            }else {
                audioPlayer.current.play()
            }
        }
    }

    const toggleSkipBackward = () => {//clicar na musica anterior
        if(index > 0) {
            setIndex(prev => prev - 1);
            audioPlayer.current.src = playlist[index - 1];
            // audioPlayer.current.play();
            if(!isPlaying) {
                audioPlayer.current.pause()
            }else {
                audioPlayer.current.play()
            }
        }
    }
    
    function VolumeBtns(){
        return mute
            ? <VolumeOffIcon sx={{color: 'lime', '&:hover': {color: 'white'}}} onClick={() => setMute(!mute)} />/*icone hover passa mouse fica branco..*/
            : volume <= 20 ? <VolumeMuteIcon sx={{color: 'lime', '&:hover': {color: 'white'}}} onClick={() => setMute(!mute)} />
            : volume <= 75 ? <VolumeDownIcon sx={{color: 'lime', '&:hover': {color: 'white'}}} onClick={() => setMute(!mute)} />
            : <VolumeUpIcon sx={{color: 'lime', '&:hover': {color: 'white'}}} onClick={() => setMute(!mute)} />
    }

    return (//Tudo o que é retornável
        <Div>
            <audio src={currentSong} ref={audioPlayer} muted={mute} />
            <CustomPaper>
            <CustomPaper> {playlist[index]} </CustomPaper>
                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>{/*onde ficaram os controles internamente*/}
                    <Stack direction='row' spacing={1} 
                        sx={{//sx permite adicionar qualquer CSS válido a um elemento, enquanto usa valores de seu tema para manter os estilos consistentes
                            display: 'flex',
                            justifyContent: 'flex-start',
                            width: '25%',
                            alignItems: 'center'
                        }}
                    >
                        <VolumeBtns  />{/*icone de volume e logica função*/}

                        <PSlider min={0} max={100} value={volume}
                            onChange={(e, v) => setVolume(v)}
                        />{/*icone de aumentar e diminuir o volume função*/}
                    </Stack>{/*Stack cobre a area de volume*/}

                    <Stack direction='row' spacing={1}
                        sx={{
                            display: 'flex',
                            width: '40%',
                            alignItems: 'center'
                        }}>{/*Stack cobre toda a parte dos botoes play pause e outros*/}
                        <SkipPreviousIcon 
                            sx={{
                                color: 'lime', 
                                '&:hover': {color: 'white'}
                            }} 
                            onClick={toggleSkipBackward} disabled={true}/>{/*icone voltar musica logica*/}
                        <FastRewindIcon sx={{color: 'lime', '&:hover': {color: 'white'}}} onClick={toggleBackward}/>

                        {!isPlaying
                            ?   <PlayArrowIcon fontSize={'large'} sx={{color: 'lime', '&:hover': {color: 'white'}}} onClick={togglePlay}/>
                            :   <PauseIcon fontSize={'large'} sx={{color: 'lime', '&:hover': {color: 'white'}}} onClick={togglePlay}/>
                        }


                        <FastForwardIcon sx={{color: 'lime', '&:hover': {color: 'white'}}} onClick={toggleForward} />
                        <SkipNextIcon sx={{color: 'lime', '&:hover': {color: 'white'}}} onClick={toggleSkipForward}/>
                    </Stack>

                    <Stack sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }} />
                </Box>
                <Stack spacing={1} direction='row' sx={{
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <Typography sx={{color: 'lime'}}>{formatTime(elapsed)}</Typography>{/*onde fica tempo de duração inicial do tempo de musica 00:00*/}
                    {/*<PSlider thumbless="true" value={elapsed} max={duration}/>{/*linha de tempo da musica em si, max={duration}*/}
                    <PSlider thumbless="true" value={elapsed} min={0} max={duration} onChange={(e, s) => setElapsed(s)}/>
                    <Typography sx={{color: 'lime'}}>{formatTime(duration - elapsed)}</Typography>{/**/}
                </Stack>
            </CustomPaper>
        </Div>
    )
}
