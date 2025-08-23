"use client"
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Model configurations for the three dance forms
const MODEL_CONFIGS = [
  { name: 'Kathak', modelUrl: '/kathak.glb' },
  { name: 'Mohini', modelUrl: '/rotatingMohini.glb' },
  { name: 'Theyyam', modelUrl: '/rotatingTheyyam.glb' }
];

// Main App component
const App = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0fdf4' }}>
      {/* Navigation Bar */}
      <nav className="w-full px-8 py-4 bg-green-50 border-b border-green-100">
        <div className="max-w-7xl mx-auto flex items-center justify-end">
          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
              AR Experiences
            </button>
            <button className="text-green-700 hover:text-green-800 font-medium text-sm transition-colors">
              Restaurants
            </button>
            <button className="text-green-700 hover:text-green-800 font-medium text-sm transition-colors">
              Folk Music
            </button>
            <button className="text-green-700 hover:text-green-800 font-medium text-sm transition-colors">
              Profile
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* App Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-green-800 mb-3">Naattukadha</h1>
            <p className="text-xl text-green-600 font-light">Stories alive, through every lens</p>
          </div>
          
          {/* 3D Models Container */}
          <div className="w-full h-96 bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
            <ThreeDModel configs={MODEL_CONFIGS} />
          </div>
        </div>
      </div>
    </div>
  );
};

// The core 3D model component with fixed rotation and improved lighting
const ThreeDModel = ({ configs }) => {
  const mountRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previousMousePosition, setPreviousMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfafffe);

    // --- Camera Setup ---
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.z = 8;
    camera.lookAt(0, 0, 0); // Keep the camera focused on the center

    // --- Renderer Setup ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // --- Lighting Improvements (Studio-style three-point lighting) ---
    // Ambient light for general illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // Key light (main light source)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(5, 5, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.camera.left = -10;
    keyLight.shadow.camera.right = 10;
    keyLight.shadow.camera.top = 10;
    keyLight.shadow.camera.bottom = -10;
    scene.add(keyLight);
    
    // Fill light (to soften shadows)
    const fillLight = new THREE.DirectionalLight(0xffffff, 1);
    fillLight.position.set(-5, 5, 5);
    scene.add(fillLight);

    // Rim light (to define the silhouette)
    const rimLight = new THREE.DirectionalLight(0xffffff, 1);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);
    
    // --- Model Grouping and Animation Management ---
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    
    const mixers = [];
    const loader = new GLTFLoader();

    // Use a Promise.all to load all models in parallel
    const loadPromises = configs.map((config, index) => {
      return new Promise((resolve, reject) => {
        loader.load(config.modelUrl, (gltf) => {
          const loadedModel = gltf.scene;
          loadedModel.traverse((node) => {
            if (node.isMesh) {
              node.castShadow = true;
              node.receiveShadow = true;
            }
          });
          
          const spacing = 4;
          const totalWidth = (configs.length - 1) * spacing;
          const startX = -totalWidth / 2;

          const box = new THREE.Box3().setFromObject(loadedModel);
          const center = box.getCenter(new THREE.Vector3());
          loadedModel.position.sub(center);
          loadedModel.position.x += startX + index * spacing;
          
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          loadedModel.scale.setScalar(2.5 / maxDim); 

          if (gltf.animations && gltf.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(loadedModel);
            mixer.clipAction(gltf.animations[0]).play();
            mixers.push(mixer);
          }
          
          modelGroup.add(loadedModel);
          resolve();
        }, undefined, (error) => {
          console.error(`An error occurred while loading model at ${config.modelUrl}:`, error);
          reject(error);
        });
      });
    });

    // Handle loading state and errors
    Promise.all(loadPromises)
      .then(() => {
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });

    // --- Animation Loop ---
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();
      for (const mixer of mixers) {
        mixer.update(delta);
      }
      
      // Rotate the group of models slowly when not dragging
      if (!isDragging) {
        modelGroup.rotation.y += 0.005;
      }

      renderer.render(scene, camera);
    };

    // --- Mouse Event Handling for Fixed Rotation ---
    const handleMouseDown = (e) => {
      setIsDragging(true);
      setPreviousMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      // Directly rotate the group of models, no camera movement
      modelGroup.rotation.y += deltaX * 0.01;
      modelGroup.rotation.x += deltaY * 0.01;

      setPreviousMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    // --- Resize Handling ---
    const handleResize = () => {
      const parent = mountRef.current;
      if (parent) {
        camera.aspect = parent.clientWidth / parent.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(parent.clientWidth, parent.clientHeight);
      }
    };

    // --- Attach Event Listeners and Initial Calls ---
    const mountNode = mountRef.current;
    if (mountNode) {
      mountNode.addEventListener('mousedown', handleMouseDown);
      mountNode.addEventListener('touchstart', (e) => {
        handleMouseDown(e.touches[0]);
      });
      mountNode.addEventListener('touchmove', (e) => {
        handleMouseMove(e.touches[0]);
      });
      mountNode.addEventListener('touchend', handleMouseUp);
    }
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('resize', handleResize);

    animate();
    handleResize();

    // --- Cleanup ---
    return () => {
      if (mountNode) {
        mountNode.removeChild(renderer.domElement);
        mountNode.removeEventListener('mousedown', handleMouseDown);
        mountNode.removeEventListener('touchstart', (e) => {
          handleMouseDown(e.touches[0]);
        });
        mountNode.removeEventListener('touchmove', (e) => {
          handleMouseMove(e.touches[0]);
        });
        mountNode.removeEventListener('touchend', handleMouseUp);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      
      // Dispose of Three.js resources
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, [configs, isDragging, previousMousePosition]);

  return (
    <div className="h-full w-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
          <div className="text-green-600 text-lg font-light">Loading models...</div>
        </div>
      )}
      <div className="h-full w-full" ref={mountRef} />
    </div>
  );
};

export default App;