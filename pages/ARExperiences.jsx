"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Play, Pause, RotateCcw, MapPin, Info, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// AR.js will be loaded via CDN in index.html
// declare global {
//   interface Window {
//     AFRAME: any;
//   }
// }

const ARExperiences = () => {
  const [isARReady, setIsARReady] = useState(false);
  const [currentModel, setCurrentModel] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Sample AR models and their GPS locations (replace with actual data)
  const arExperiences = [
    {
      id: "kathakali",
      name: "Kathakali Dancer",
      location: "Kochi Cultural Center",
      lat: 9.9312,
      lng: 76.2673,
      description: "Traditional Kerala classical dance form with elaborate costumes and makeup",
      modelUrl: "/models/kathakali-dancer.glb", // Place your GLB file here
      audioUrl: "/audio/kathakali-narration.mp3", // Place your audio file here
    },
    {
      id: "spice-ship",
      name: "Historic Spice Ship",
      location: "Fort Kochi Harbor",
      lat: 9.9658,
      lng: 76.2419,
      description: "Ancient trading vessels that brought spices from Kerala to the world",
      modelUrl: "/models/spice-ship.glb",
      audioUrl: "/audio/spice-trade-history.mp3",
    },
    {
      id: "kerala-feast",
      name: "Traditional Sadya",
      location: "Kerala Heritage Museum",
      lat: 8.5241,
      lng: 76.9366,
      description: "Complete Kerala feast served on banana leaf with traditional items",
      modelUrl: "/models/kerala-sadya.glb",
      audioUrl: "/audio/sadya-explanation.mp3",
    },
  ];

  useEffect(() => {
    // Load A-Frame and AR.js from CDN
    loadARLibraries();
  }, []);

  const loadARLibraries = () => {
    // Check if A-Frame is already loaded
    if (window.AFRAME) {
      setIsARReady(true);
      return;
    }

    // Load A-Frame
    const aframeScript = document.createElement("script");
    aframeScript.src = "https://aframe.io/releases/1.4.0/aframe.min.js";
    aframeScript.onload = () => {
      // Load AR.js after A-Frame
      const arjsScript = document.createElement("script");
      arjsScript.src = "https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js";
      arjsScript.onload = () => {
        setIsARReady(true);
        toast.success("AR libraries loaded successfully!");
      };
      arjsScript.onerror = () => {
        toast.error("Failed to load AR.js library");
      };
      document.head.appendChild(arjsScript);
    };
    aframeScript.onerror = () => {
      toast.error("Failed to load A-Frame library");
    };
    document.head.appendChild(aframeScript);
  };

  const startARExperience = () => {
    if (!isARReady) {
      toast.error("AR libraries are still loading. Please wait.");
      return;
    }

    // Request camera permissions
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => {
        initializeARScene();
        toast.success("Camera access granted. Point your camera around to discover AR content!");
      })
      .catch(() => {
        toast.error("Camera access is required for AR experiences.");
      });
  };

  const initializeARScene = () => {
    // Create A-Frame scene for location-based AR
    const arContainer = document.getElementById("ar-container");
    if (!arContainer) return;

    arContainer.innerHTML = `
      <a-scene
        vr-mode-ui="enabled: false;"
        renderer="logarithmicDepthBuffer: true;"
        arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;"
        id="ar-scene"
      >
        <!-- Add lighting -->
        <a-light type="ambient" color="#404040" intensity="0.5"></a-light>
        <a-light type="directional" position="1 1 1" color="#ffffff" intensity="0.8"></a-light>

        <!-- GPS-based entities will be added dynamically -->
        ${arExperiences
          .map(
            (exp) => `
          <a-entity
            id="model-${exp.id}"
            gps-entity-place="latitude: ${exp.lat}; longitude: ${exp.lng};"
            gltf-model="url(${exp.modelUrl})"
            scale="5 5 5"
            animation="property: rotation; to: 0 360 0; loop: true; dur: 20000; easing: linear"
            visible="false"
            class="ar-model"
            data-name="${exp.name}"
            data-audio="${exp.audioUrl}"
          ></a-entity>
        `
          )
          .join("")}

        <!-- Camera with GPS -->
        <a-camera
          id="ar-camera"
          gps-camera
          rotation-reader
          wasd-controls-enabled="false"
          look-controls-enabled="false"
        ></a-camera>
      </a-scene>
    `;

    // Add click handlers for AR models
    setTimeout(() => {
      const models = document.querySelectorAll(".ar-model");
      models.forEach((model) => {
        model.addEventListener("click", () => {
          const modelName = model.getAttribute("data-name");
          const audioUrl = model.getAttribute("data-audio");
          setCurrentModel(modelName || "");
          playAudio(audioUrl || "");
          toast.success(`Viewing: ${modelName}`);
        });
      });
    }, 1000);
  };

  const playAudio = (audioUrl) => {
    if (audioElement) {
      audioElement.pause();
    }

    const audio = new Audio(audioUrl);
    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => {
      toast.error("Audio file not found. Please add your audio files to the public/audio folder.");
    };

    setAudioElement(audio);
    audio.play().catch(() => {
      toast.error("Could not play audio. Audio files should be placed in public/audio folder.");
    });
  };

  const toggleAudio = () => {
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            AR Cultural Experiences
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover Kerala's heritage through augmented reality. Point your camera to find 3D cultural models at specific locations.
          </p>
        </div>

        {/* Instructions Card */}
        <Card className="mb-8 p-6 border-primary/20 shadow-card">
          <div className="flex items-start gap-4">
            <Info className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">How to use AR Experiences:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Allow camera access when prompted</li>
                <li>• Visit the listed locations to see AR models</li>
                <li>• Tap on models to hear descriptions and stories</li>
                <li>• Walk around for 360° viewing experience</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* AR Control Panel */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button 
            onClick={startARExperience}
            className="bg-gradient-primary shadow-soft hover:shadow-card transition-all"
            size="lg"
          >
            <Camera className="mr-2 h-5 w-5" />
            {isARReady ? "Start AR Experience" : "Loading AR..."}
          </Button>

          {currentModel && (
            <div className="flex items-center gap-2">
              <Button
                onClick={toggleAudio}
                variant="outline"
                className="border-primary/30"
              >
                {isPlaying ? (
                  <Pause className="mr-2 h-4 w-4" />
                ) : (
                  <Play className="mr-2 h-4 w-4" />
                )}
                {isPlaying ? "Pause Audio" : "Play Audio"}
              </Button>
              <span className="text-sm text-muted-foreground">
                Current: {currentModel}
              </span>
            </div>
          )}
        </div>

        {/* AR Container */}
        <div 
          id="ar-container" 
          className="w-full h-[60vh] bg-muted rounded-lg border border-primary/20 mb-8 flex items-center justify-center"
        >
          <div className="text-center text-muted-foreground">
            <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>AR camera will appear here</p>
            <p className="text-sm mt-2">Click "Start AR Experience" to begin</p>
          </div>
        </div>

        {/* Available Experiences */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <h2 className="col-span-full text-2xl font-semibold text-foreground mb-4">
            Available AR Experiences
          </h2>
          
          {arExperiences.map((experience) => (
            <Card key={experience.id} className="p-6 border-primary/20 shadow-card hover:shadow-soft transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-gradient-primary p-2 rounded-lg">
                  <RotateCcw className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{experience.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" />
                    {experience.location}
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                {experience.description}
              </p>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <AlertCircle className="h-3 w-3" />
                <span>GPS: {experience.lat}, {experience.lng}</span>
              </div>
              
              <div className="mt-4 text-xs text-muted-foreground bg-muted p-2 rounded">
                <strong>Setup:</strong> Place your 3D model file at <code>{experience.modelUrl}</code> and audio at <code>{experience.audioUrl}</code>
              </div>
            </Card>
          ))}
        </div>

        {/* Developer Notes */}
        <Card className="mt-8 p-6 border-kerala-spice/30 bg-kerala-spice/5">
          <h3 className="font-semibold text-foreground mb-3">Developer Setup Instructions:</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>1. 3D Models:</strong> Place your .glb/.gltf files in the <code>public/models/</code> folder</p>
            <p><strong>2. Audio Files:</strong> Place your .mp3 narration files in the <code>public/audio/</code> folder</p>
            <p><strong>3. GPS Coordinates:</strong> Update the lat/lng values in the <code>arExperiences</code> array above</p>
            <p><strong>4. Testing:</strong> Use your phone's browser and visit the locations for full AR experience</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ARExperiences;