// YouTubeRecorder.js
import React, { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

function YouTubeRecorder({ onRecordComplete }) {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);

  const ffmpegRef = useRef(new FFmpeg());
  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const recordedChunksRef = useRef([]);

  // Ładowanie FFmpeg przy inicjalizacji komponentu
  useEffect(() => {
    const loadFFmpeg = async () => {
      try {
        setLoading(true);
        // Określamy ścieżki do plików wymaganych przez FFmpeg
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd';
        await ffmpegRef.current.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
        setFfmpegLoaded(true);
      } catch (error) {
        console.error('Błąd podczas ładowania FFmpeg:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFFmpeg().then(() => {
        console.log('FFmpeg załadowany');
    });
  }, []);

  async function setupAudioWorklet(audioContext, stream) {
    await audioContext.audioWorklet.addModule(`worklet-processor.js`);
    const node = new AudioWorkletNode(audioContext, `my-worklet-processor`);
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(node);
    node.connect(audioContext.destination);
    return node;
  }

  const startRecording = async () => {
    recordedChunksRef.current = [];
    setAudioUrl(null);

    // Otwieramy nowe okno synchronicznie
    if (!window.playerWindow || window.playerWindow.closed) {
      window.playerWindow = await window.open(
          '/player',
          'PlayerWindow',
          'width=800,height=600'
      );

      if (!window.playerWindow) {
        alert('Popup został zablokowany. Proszę włączyć wyskakujące okna dla tej strony.');
        return;
      }
    }

    try {
      // Opóźnienie, aby dać czas na pełne załadowanie okna
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Przechwycenie ekranu/okna z dźwiękiem
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      // Wyciągamy tylko ścieżkę audio ze strumienia
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        alert('Nie wykryto ścieżki audio. Upewnij się, że współdzielenie systemu audio jest włączone.');
        stream.getTracks().forEach(track => track.stop());
        return;
      }

      mediaStreamRef.current = stream;

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);

      // Używamy ScriptProcessorNode
      const processor = setupAudioWorklet(audioContext, stream);
      processorRef.current = processor;



      source.connect(processor);
      processor.connect(audioContext.destination);

      // 4. Wymuś natychmiastowe odpalenie playera przez postMessage
      window.playerWindow.postMessage('play-now', '*');


      setRecording(true);

    } catch (error) {
      console.error('Błąd podczas rozpoczynania nagrywania:', error);
      alert('Wystąpił błąd podczas rozpoczynania nagrywania. ' + error);
    }
  };

  const stopRecording = async () => {
    setRecording(false);

    if (processorRef.current) {
      processorRef.current.disconnect();
    }

    // Pobierz rzeczywistą częstotliwość próbkowania przed zamknięciem kontekstu
    const actualSampleRate = audioContextRef.current ? audioContextRef.current.sampleRate : 44100;


    if (audioContextRef.current) {
      await audioContextRef.current.close();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    // Łączymy fragmenty do jednego bufora
    const chunks = recordedChunksRef.current;
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const mergedBuffer = new Float32Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      mergedBuffer.set(chunk, offset);
      offset += chunk.length;
    }

    // Konwertujemy Float32Array do ArrayBuffer
    const buffer = new ArrayBuffer(mergedBuffer.length * 4);
    const view = new DataView(buffer);
    mergedBuffer.forEach((value, index) =>
        view.setFloat32(index * 4, value, true)
    );
    const pcmBlob = new Blob([buffer], { type: 'application/octet-stream' });

    setLoading(true);

    try {
      const pcmData = await pcmBlob.arrayBuffer();

      // Używamy nowego API do pisania do pliku
      await ffmpegRef.current.writeFile('input.raw', new Uint8Array(pcmData));

      // Uruchamiamy FFmpeg z parametrami - dodatkowo jakość YouTube
      await ffmpegRef.current.exec([
        '-f', 'f32le',
        '-ar', actualSampleRate.toString(),
        '-ac', '1',
        '-i', 'input.raw',
        '-c:a', 'pcm_s16le',
        '-f', 'wav',
        'output.wav'
      ]);


      // Odczytujemy wynikowy plik
      const data = await ffmpegRef.current.readFile('output.wav');
      const generatedBlob = new Blob([data.buffer], { type: 'audio/wav' });
      const url = URL.createObjectURL(generatedBlob);
      setAudioUrl(url);

      if (onRecordComplete) {
        onRecordComplete(url);
      }

      // Aktualizujemy zawartość otwartego okna
      if (window.playerWindow && !window.playerWindow.closed) {
        window.playerWindow.document.body.innerHTML = `
          <html>
            <head>
              <title>Player</title>
              <style>
                html, body {
                  margin: 0;
                  padding: 0;
                  height: 100%;
                  background-color: #000;
                }
                video {
                  display: block;
                  width: 100%;
                  height: 100%;
                }
              </style>
            </head>
            <body>
              <video controls autoplay src="${url}"></video>
            </body>
          </html>
        `;
        window.playerWindow.document.close();
      }
    } catch (error) {
      console.error('Błąd podczas przetwarzania audio:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div>
        <h2>YouTube Recorder</h2>
        {!recording && !loading && (
            <button onClick={startRecording} disabled={!ffmpegLoaded}>
              {ffmpegLoaded ? 'Start Recording' : 'Ładowanie FFmpeg...'}
            </button>
        )}
        {recording && (
            <button onClick={stopRecording}>Stop Recording</button>
        )}
        {loading && <p>Processing audio…</p>}
        {audioUrl && (
            <div>
              <p>Recording complete!</p>
              <a href={audioUrl} download="output.wav">Download Recording</a>
            </div>
        )}
      </div>
  );
}

export default YouTubeRecorder;