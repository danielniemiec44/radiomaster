import React, { useEffect, useRef } from 'react';

const Player = () => {
    const playerRef = useRef(null);


    useEffect(() => {
        // Minimalny wygląd strony
        document.body.style.margin = '0';
        document.body.style.overflow = 'hidden';

        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);

        window.addEventListener('message', (event) => {
            if (event.data === 'play-now') {
                console.log('▶️ Rozpoczynam odtwarzanie natychmiast');
                playerRef.current?.playVideo();
            }
        });

        window.onYouTubeIframeAPIReady = () => {
            playerRef.current = new window.YT.Player('ytplayer', {
                height: '360',
                width: '640',
                videoId: 'gCYcHz2k5x0',
                playerVars: {
                    autoplay: 0,
                    controls: 0,
                    disablekb: 1, // wyłączenie skrótów klawiaturowych
                },
                events: {
                    onReady: () => {
                        console.log('🎬 Player gotowy');
                        window.opener?.postMessage('player-ready', '*');

                        // Sprawdzenie, czy playerRef.current istnieje
                        if (playerRef.current) {
                            const width = parseInt(playerRef.current.getIframe().clientWidth, 10) + 100;
                            // plus any other browser specific UI - auto detect additional height
                            const height = parseInt(playerRef.current.getIframe().clientHeight, 10) + 100;
                            window.resizeTo(width, height);
                            playerRef.current.getIframe().style.width = '100%';
                            playerRef.current.getIframe().style.height = '100vh';
                        }
                    },
                    onStateChange: (event) => {
                        if (event.data === window.YT.PlayerState.ENDED) {
                            console.log('⏹️ Utwór zakończony – wysyłam STOP');
                            window.opener?.postMessage('stop', '*');
                        }
                    },
                },
            });
        };

        // Obsługa zdalnego PLAY
        window.addEventListener('message', (event) => {
            if (event.data === 'play') {
                playerRef.current?.playVideo();
            }
        });


    }, []);


    return (
        <>
        <div id="ytplayer"></div>
        <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: "100%", zIndex: 1000, cursor: "none"}}></div>
        </>
            )
    ;
};

export default Player;
