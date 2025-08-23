"use client";
import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Download } from "lucide-react";

// Sample folk music data (replace with your actual MP3 files)
const folkSongs = [
  {
    id: "1",
    title: "Vanchipattu (Boat Song)",
    artist: "Traditional Kerala Folk",
    duration: "3:45",
    filename: "vanchipattu.mp3", // Place MP3 file in public/music/
    description: "Traditional boat song of Kerala fishermen, sung during monsoon season.",
    category: "Work Songs",
  },
  {
    id: "2", 
    title: "Thiruvathirakali",
    artist: "Women's Folk Ensemble",
    duration: "4:20",
    filename: "thiruvathirakali.mp3",
    description: "Classical dance-song performed by women during Thiruvathira festival.",
    category: "Festival Songs",
  },
  {
    id: "3",
    title: "Pallivalu Bhadravattakam",
    artist: "Temple Musicians",
    duration: "5:15",
    filename: "pallivalu.mp3", 
    description: "Ancient temple song dedicated to Lord Krishna, sung during dawn prayers.",
    category: "Devotional",
  },
  {
    id: "4",
    title: "Mappila Pattu",
    artist: "Malabar Folk Singers",
    duration: "4:02",
    filename: "mappila-pattu.mp3",
    description: "Traditional Mappila community songs from North Kerala with Arabic influences.",
    category: "Cultural Songs",
  },
  {
    id: "5",
    title: "Oppana Pattu",
    artist: "Wedding Folk Group",
    duration: "3:30",
    filename: "oppana-pattu.mp3",
    description: "Joyous wedding songs performed during Muslim matrimonial celebrations.",
    category: "Wedding Songs",
  },
  {
    id: "6",
    title: "Padayani Thottam",
    artist: "Ritual Performers",
    duration: "6:10",
    filename: "padayani-thottam.mp3",
    description: "Ritualistic song-dance performed in temples during Padayani festival.",
    category: "Ritual Songs",
  },
];

// Custom Toast Component
const Toast = ({ message, type, onClose }) => (
  <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
    type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
  }`}>
    <div className="flex items-center justify-between">
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="ml-3 text-white hover:opacity-75">
        ×
      </button>
    </div>
  </div>
);

// Custom Slider Component
const Slider = ({ value, max, step = 1, onValueChange, className = "" }) => {
  const percentage = (value / max) * 100;
  
  return (
    <div className={`relative h-2 bg-gray-200 rounded-full cursor-pointer ${className}`}>
      <div 
        className="absolute h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all"
        style={{ width: `${percentage}%` }}
      />
      <input
        type="range"
        min={0}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onValueChange(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div 
        className="absolute w-4 h-4 bg-white border-2 border-green-500 rounded-full shadow-md transform -translate-y-1 transition-all hover:scale-110"
        style={{ left: `calc(${percentage}% - 8px)` }}
      />
    </div>
  );
};

// Custom Button Component
const Button = ({ children, onClick, variant = "default", size = "default", className = "", disabled = false, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    default: "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-700 active:scale-95",
    ghost: "text-gray-700 hover:bg-gray-100 hover:text-green-600",
    outline: "border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Custom Card Component
const Card = ({ children, className = "", onClick, ...props }) => (
  <div 
    className={`bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 ${
      onClick ? 'cursor-pointer hover:border-green-300' : ''
    } ${className}`}
    onClick={onClick}
    {...props}
  >
    {children}
  </div>
);

const FolkMusic = () => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [toast, setToast] = useState(null);

  const audioRef = useRef(null);

  // Toast helper function
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Initialize audio when component mounts
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume / 100;
      
      // Audio event listeners
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });

      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });

      audioRef.current.addEventListener('ended', () => {
        playNextSong();
      });

      audioRef.current.addEventListener('error', () => {
        showToast("Could not load audio file. Please ensure MP3 files are in public/music/ folder.", 'error');
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Update volume when volume state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const playSong = (song, index) => {
    if (!audioRef.current) return;

    if (currentSong?.id === song.id && isPlaying) {
      pauseSong();
      return;
    }

    setCurrentSong(song);
    setCurrentIndex(index);
    audioRef.current.src = `/music/${song.filename}`;
    
    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
        showToast(`Now playing: ${song.title}`);
      })
      .catch(() => {
        showToast(`Could not play ${song.title}. Check if file exists at public/music/${song.filename}`, 'error');
      });
  };

  const pauseSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeSong = () => {
    if (audioRef.current && currentSong) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => showToast("Could not resume playback", 'error'));
    }
  };

  const playNextSong = () => {
    const nextIndex = (currentIndex + 1) % folkSongs.length;
    playSong(folkSongs[nextIndex], nextIndex);
  };

  const playPreviousSong = () => {
    const prevIndex = currentIndex === 0 ? folkSongs.length - 1 : currentIndex - 1;
    playSong(folkSongs[prevIndex], prevIndex);
  };

  const seekTo = (newTime) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const downloadSong = (song) => {
    const link = document.createElement('a');
    link.href = `/music/${song.filename}`;
    link.download = song.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloading ${song.title}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-18">
      {/* Toast */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-24xl sm:text-7xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Kerala Folk Music
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg sm:text-2xl">
            Listen to traditional Kerala folk songs and melodies passed down through generations.
          </p>
        </div>

        {/* Current Playing Card */}
        {currentSong && (
          <Card className="mb-8 p-8  border-green-200">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-lg">
                <Music className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {currentSong.title}
              </h3>
              <p className="text-gray-600 text-lg font-medium">{currentSong.artist}</p>
              <p className="text-gray-500 mt-3 max-w-md mx-auto leading-relaxed">
                {currentSong.description}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <Slider
                value={currentTime}
                max={duration}
                step={1}
                onValueChange={seekTo}
                className="mb-3"
              />
              <div className="flex justify-between text-sm text-gray-500 font-medium">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-6 mb-8">
              <Button
                variant="ghost"
                size="lg"
                onClick={playPreviousSong}
                className="p-3 rounded-full hover:bg-green-100"
              >
                <SkipBack className="h-6 w-6" />
              </Button>

              <Button
                onClick={isPlaying ? pauseSong : resumeSong}
                size="lg"
                className="p-4 rounded-full text-xl shadow-2xl hover:scale-105"
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8 ml-1" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="lg"
                onClick={playNextSong}
                className="p-3 rounded-full hover:bg-green-100"
              >
                <SkipForward className="h-6 w-6" />
              </Button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-4 max-w-xs mx-auto">
              <Volume2 className="h-5 w-5 text-gray-500" />
              <Slider
                value={volume}
                max={100}
                step={1}
                onValueChange={setVolume}
                className="flex-1"
              />
              <span className="text-sm text-gray-500 font-medium w-12 text-right">
                {volume}%
              </span>
            </div>
          </Card>
        )}

        {/* Songs List */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Traditional Songs Collection
          </h2>
          
          {folkSongs.map((song, index) => (
            <Card
              key={song.id}
              className={`p-6 transition-all duration-300 hover:scale-[1.02] ${
                currentSong?.id === song.id 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-xl' 
                  : 'hover:border-green-200'
              }`}
              onClick={() => playSong(song, index)}
            >
              <div className="flex items-center gap-6">
                {/* Play Button */}
                <Button
                  variant="ghost"
                  size="lg"
                  className="shrink-0 p-3 rounded-full hover:bg-green-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    playSong(song, index);
                  }}
                >
                  {currentSong?.id === song.id && isPlaying ? (
                    <Pause className="h-6 w-6 text-green-600" />
                  ) : (
                    <Play className="h-6 w-6 text-green-600 ml-0.5" />
                  )}
                </Button>

                {/* Song Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg text-gray-800 leading-tight">
                      {song.title}
                    </h3>
                    <span className="text-sm text-gray-500 font-medium ml-4">
                      {song.duration}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 font-medium mb-3">
                    {song.artist}
                  </p>
                  
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    {song.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-medium">
                      {song.category}
                    </span>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadSong(song);
                      }}
                      className="text-xs hover:bg-green-100 px-3 py-1.5"
                    >
                      <Download className="h-3 w-3 mr-1.5" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FolkMusic;