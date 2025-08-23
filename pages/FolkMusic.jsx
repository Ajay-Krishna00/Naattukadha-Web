"use client";
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Download } from "lucide-react";
import { toast } from "sonner";

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

const FolkMusic = () => {
  const [currentSong, setCurrentSong] = useState<typeof folkSongs[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [currentIndex, setCurrentIndex] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

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
        toast.error("Could not load audio file. Please ensure MP3 files are in public/music/ folder.");
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
        toast.success(`Now playing: ${song.title}`);
      })
      .catch(() => {
        toast.error(`Could not play ${song.title}. Check if file exists at public/music/${song.filename}`);
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
        .catch(() => toast.error("Could not resume playback"));
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
      audioRef.current.currentTime = newTime[0];
      setCurrentTime(newTime[0]);
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
    toast.success(`Downloading ${song.title}`);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Kerala Folk Music
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Listen to traditional Kerala folk songs and melodies passed down through generations.
          </p>
        </div>

        {/* Current Playing Card */}
        {currentSong && (
          <Card className="mb-8 p-6 border-primary/20 shadow-card bg-gradient-primary/5">
            <div className="text-center mb-6">
              <div className="bg-gradient-kerala p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Music className="h-10 w-10 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-1">
                {currentSong.title}
              </h3>
              <p className="text-muted-foreground">{currentSong.artist}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {currentSong.description}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <Slider
                value={[currentTime]}
                max={duration}
                step={1}
                onValueChange={seekTo}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={playPreviousSong}
                className="hover:bg-primary/10"
              >
                <SkipBack className="h-5 w-5" />
              </Button>

              <Button
                onClick={isPlaying ? pauseSong : resumeSong}
                size="lg"
                className="bg-gradient-primary shadow-soft hover:shadow-card transition-all"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={playNextSong}
                className="hover:bg-primary/10"
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3 max-w-xs mx-auto">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={[volume]}
                max={100}
                step={1}
                onValueChange={(value) => setVolume(value[0])}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-8">
                {volume}%
              </span>
            </div>
          </Card>
        )}

        {/* Songs List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Traditional Songs Collection
          </h2>
          
          {folkSongs.map((song, index) => (
            <Card
              key={song.id}
              className={`p-4 border-primary/20 shadow-card hover:shadow-soft transition-all cursor-pointer ${
                currentSong?.id === song.id ? 'bg-primary/5 border-primary/40' : ''
              }`}
              onClick={() => playSong(song, index)}
            >
              <div className="flex items-center gap-4">
                {/* Play Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 hover:bg-primary/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    playSong(song, index);
                  }}
                >
                  {currentSong?.id === song.id && isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>

                {/* Song Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-foreground truncate">
                      {song.title}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {song.duration}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-1">
                    {song.artist}
                  </p>
                  
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {song.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {song.category}
                    </span>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadSong(song);
                      }}
                      className="text-xs hover:bg-primary/10"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Developer Instructions */}
        <Card className="mt-8 p-6 border-kerala-spice/30 bg-kerala-spice/5">
          <h3 className="font-semibold text-foreground mb-3">Developer Setup Instructions:</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>1. Audio Files:</strong> Place your MP3 files in the <code>public/music/</code> folder</p>
            <p><strong>2. File Names:</strong> Update the <code>filename</code> property in the <code>folkSongs</code> array to match your MP3 files</p>
            <p><strong>3. Metadata:</strong> Add proper song titles, artists, descriptions, and categories</p>
            <p><strong>4. Playlists:</strong> Create different categories or playlists for better organization</p>
            <p><strong>5. Streaming:</strong> For production, consider using a proper audio streaming service or CDN</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FolkMusic;