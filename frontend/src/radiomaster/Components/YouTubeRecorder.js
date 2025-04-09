import React, { useEffect, useRef, useState } from 'react';

const YouTubeRecorder = () => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const playerWindow = useRef(null);
  const chunks = useRef([]);

  // Obsługa wiadomości z playera
  useEffect(() => {
    window.addEventListener('message', (event) => {
      if (event.data === 'stop') {
        console.log('⏹️ STOP z playera – kończę nagrywanie');
        stopRecording();
      } else if (event.data === 'player-ready') {
        console.log('✅ Player gotowy');
      }
    });

    return () => {
      window.removeEventListener('message', () => {});
    };
  }, []);

  // ✅ Najpierw użytkownik wyraża zgodę
  const handleUserConsent = async () => {
    if (playerWindow.current && !playerWindow.current.closed) {
      alert('Player już otwarty.');
      return;
    }

    // 1. Otwórz popup z playerem
    playerWindow.current = window.open(
        '/player',
        'ytplayerWindow',
        'width=800,height=600'
    );

    if (!playerWindow.current) {
      alert('❌ Nie udało się otworzyć playera.');
      return;
    }

    try {
      // 3. Start nagrywania
      startRecording();
      console.log('🎙️ Nagrywanie wystartowało');

      // 4. Wymuś natychmiastowe odpalenie playera przez postMessage
      playerWindow.current?.postMessage('play-now', '*');

    } catch (err) {
      console.error('❌ Błąd przy nagrywaniu:', err);
    }
  };




  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      const canRecordVp9 = MediaRecorder.isTypeSupported('video/webm;codecs=vp9');
      const recorderOptions = canRecordVp9
          ? {mimeType: 'video/webm;codecs=vp9'}
          : {};

      const newMediaRecorder = new MediaRecorder(stream, recorderOptions);
      chunks.current = [];

      newMediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data); // poprawione użycie push
        }
      };

      newMediaRecorder.onstop = () => {
        stopRecording();
      };

      setMediaRecorder(newMediaRecorder); // użycie settera stanu
      newMediaRecorder.start();
      console.log('🎙️ Nagrywanie rozpoczęte');

      // Wyślij PLAY do playera
      playerWindow.current?.postMessage('play', '*');
    } catch (err) {
      console.error('❌ Błąd przy uzyskaniu streamu:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    const canRecordVp9 = MediaRecorder.isTypeSupported('video/webm;codecs=vp9');
    const blob = new Blob(chunks.current, {
      type: canRecordVp9 ? "video/webm;codecs=vp9" : "video/webm"
    });

    let reader = new FileReader();
    reader.onload = function(event) {
      const blobDataUrl = event.target.result;

      const a = document.createElement('a');
      a.href = blobDataUrl;
      a.download = 'nagranie.webm';
      a.click();
      console.log('✅ Zapisano nagranie!');
    };

    reader.readAsDataURL(blob);
  };

  return (
      <div>
        <h2>🎧 YouTube Recorder – nagrywanie automatyczne</h2>
        <p>Najpierw kliknij poniższy przycisk, aby wyrazić zgodę na otwarcie okna.</p>
        <button onClick={handleUserConsent}>
          ✅ Zezwól na otwarcie okna i rozpocznij
        </button>
      </div>
  );
};

export default YouTubeRecorder;
