// This file contains Three.js utilities for the 3D human model

import * as THREE from 'three';
// Fix for OrbitControls import
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { getSeverityColor } from '../constants';

export interface Organ {
  id: string;
  name: string;
  description: string;
  position: { x: number; y: number; z: number };
  normalColor: string;
  size: number;
}

export interface HotSpot {
  organId: string;
  position: { x: number; y: number; z: number };
  severity: number;
  mesh?: THREE.Mesh;
}

export interface ModelState {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  model: THREE.Group;
  organs: Map<string, THREE.Mesh>;
  hotspots: HotSpot[];
  isLoaded: boolean;
}

// Create a basic Scene, Camera, Renderer, and Controls
export function createScene(container: HTMLDivElement): ModelState {
  // Create scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x121C2E);

  // Create camera
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 2.5;

  // Create renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Create controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxDistance = 5;
  controls.minDistance = 1;
  
  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  // Add directional light
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(1, 1, 1);
  scene.add(dirLight);
  
  // Create empty group for the model
  const model = new THREE.Group();
  scene.add(model);
  
  return {
    scene,
    camera,
    renderer,
    controls,
    model,
    organs: new Map(),
    hotspots: [],
    isLoaded: false
  };
}

// Create a more realistic human model to match the reference image
export function createHumanModel(modelState: ModelState): void {
  const { scene, model } = modelState;
  
  // Create a more anatomically accurate human model
  // Create head
  const headGeometry = new THREE.SphereGeometry(0.12, 32, 32);
  const headMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x00E5FF,
    transparent: true,
    opacity: 0.35,
    metalness: 0.2,
    roughness: 0.3,
    emissive: 0x00E5FF,
    emissiveIntensity: 0.2,
    side: THREE.DoubleSide
  });
  
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.set(0, 0.7, 0);
  model.add(head);
  
  // Create neck
  const neckGeometry = new THREE.CylinderGeometry(0.05, 0.07, 0.1, 16);
  const neck = new THREE.Mesh(neckGeometry, headMaterial);
  neck.position.set(0, 0.6, 0);
  model.add(neck);
  
  // Create torso
  const torsoGeometry = new THREE.CylinderGeometry(0.15, 0.12, 0.5, 16);
  const torsoMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x00E5FF,
    transparent: true,
    opacity: 0.3,
    metalness: 0.2,
    roughness: 0.3,
    emissive: 0x00E5FF,
    emissiveIntensity: 0.2,
    side: THREE.DoubleSide
  });
  
  const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
  torso.position.set(0, 0.35, 0);
  model.add(torso);
  
  // Create lower torso
  const lowerTorsoGeometry = new THREE.CylinderGeometry(0.12, 0.11, 0.15, 16);
  const lowerTorso = new THREE.Mesh(lowerTorsoGeometry, torsoMaterial);
  lowerTorso.position.set(0, 0.05, 0);
  model.add(lowerTorso);
  
  // Create arms
  const armGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.35, 16);
  
  // Right arm
  const rightArm = new THREE.Mesh(armGeometry, torsoMaterial);
  rightArm.position.set(0.2, 0.35, 0);
  rightArm.rotation.z = Math.PI / 2.5;
  model.add(rightArm);
  
  // Right forearm
  const rightForeArm = new THREE.Mesh(armGeometry, torsoMaterial);
  rightForeArm.position.set(0.35, 0.2, 0);
  rightForeArm.rotation.z = Math.PI / 1.5;
  model.add(rightForeArm);
  
  // Left arm
  const leftArm = new THREE.Mesh(armGeometry, torsoMaterial);
  leftArm.position.set(-0.2, 0.35, 0);
  leftArm.rotation.z = -Math.PI / 2.5;
  model.add(leftArm);
  
  // Left forearm
  const leftForeArm = new THREE.Mesh(armGeometry, torsoMaterial);
  leftForeArm.position.set(-0.35, 0.2, 0);
  leftForeArm.rotation.z = -Math.PI / 1.5;
  model.add(leftForeArm);
  
  // Create legs
  const thighGeometry = new THREE.CylinderGeometry(0.06, 0.05, 0.4, 16);
  
  // Right thigh
  const rightThigh = new THREE.Mesh(thighGeometry, torsoMaterial);
  rightThigh.position.set(0.07, -0.2, 0);
  rightThigh.rotation.z = -Math.PI / 15;
  model.add(rightThigh);
  
  // Right lower leg
  const calfGeometry = new THREE.CylinderGeometry(0.05, 0.04, 0.4, 16);
  const rightCalf = new THREE.Mesh(calfGeometry, torsoMaterial);
  rightCalf.position.set(0.08, -0.6, 0);
  model.add(rightCalf);
  
  // Left thigh
  const leftThigh = new THREE.Mesh(thighGeometry, torsoMaterial);
  leftThigh.position.set(-0.07, -0.2, 0);
  leftThigh.rotation.z = Math.PI / 15;
  model.add(leftThigh);
  
  // Left lower leg
  const leftCalf = new THREE.Mesh(calfGeometry, torsoMaterial);
  leftCalf.position.set(-0.08, -0.6, 0);
  model.add(leftCalf);
  
  // Add a subtle, transparent skeletal structure for the ribcage
  const ribcageGeometry = new THREE.SphereGeometry(0.14, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  const ribcageMaterial = new THREE.MeshBasicMaterial({
    color: 0x00E5FF,
    transparent: true,
    opacity: 0.1,
    wireframe: true
  });
  
  const ribcage = new THREE.Mesh(ribcageGeometry, ribcageMaterial);
  ribcage.position.set(0, 0.35, 0);
  ribcage.scale.set(1, 0.7, 0.5);
  model.add(ribcage);
  
  // Add spine
  const spineGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.7, 8);
  const spineMaterial = new THREE.MeshBasicMaterial({
    color: 0x00E5FF,
    transparent: true,
    opacity: 0.2
  });
  
  const spine = new THREE.Mesh(spineGeometry, spineMaterial);
  spine.position.set(0, 0.3, -0.02);
  model.add(spine);
  
  // Add pelvic area
  const pelvisGeometry = new THREE.TorusGeometry(0.1, 0.03, 8, 12, Math.PI);
  const pelvis = new THREE.Mesh(pelvisGeometry, ribcageMaterial);
  pelvis.position.set(0, 0, 0);
  pelvis.rotation.x = Math.PI / 2;
  model.add(pelvis);
  
  // Add base circle glow
  const baseGeometry = new THREE.CircleGeometry(0.2, 32);
  const baseMaterial = new THREE.MeshBasicMaterial({
    color: 0x00E5FF,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide
  });
  
  const baseCircle = new THREE.Mesh(baseGeometry, baseMaterial);
  baseCircle.position.set(0, -0.8, 0);
  baseCircle.rotation.x = -Math.PI / 2;
  model.add(baseCircle);
  
  // Add glow effect around the model
  const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.15, 1.6, 16);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0x00E5FF,
    transparent: true,
    opacity: 0.07,
    side: THREE.BackSide
  });
  
  const glowMesh = new THREE.Mesh(bodyGeometry, glowMaterial);
  glowMesh.position.set(0, 0, 0);
  glowMesh.scale.multiplyScalar(1.2);
  model.add(glowMesh);
  
  // Add scanning lines effect (vertical moving line)
  const scanLineGeometry = new THREE.PlaneGeometry(0.5, 0.01);
  const scanLineMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide
  });
  
  const scanLine = new THREE.Mesh(scanLineGeometry, scanLineMaterial);
  scanLine.position.set(0, 0, 0);
  model.add(scanLine);
  
  // Animate the scan line
  const animateScanLine = () => {
    scanLine.position.y = 0.8 * Math.sin(Date.now() * 0.001) - 0.1;
    requestAnimationFrame(animateScanLine);
  };
  
  animateScanLine();
  
  modelState.isLoaded = true;
}

// Add organs to the model
export function addOrgans(modelState: ModelState, organs: Organ[]): void {
  const { model } = modelState;
  
  organs.forEach(organ => {
    const sphereGeometry = new THREE.SphereGeometry(organ.size, 16, 16);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color(organ.normalColor),
      transparent: true,
      opacity: 0.6,
      emissive: new THREE.Color(organ.normalColor),
      emissiveIntensity: 0.3
    });
    
    const organMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    organMesh.position.set(organ.position.x, organ.position.y, organ.position.z);
    organMesh.userData = { organId: organ.id };
    
    model.add(organMesh);
    modelState.organs.set(organ.id, organMesh);
  });
}

// Update organ appearance based on severity
export function updateOrganSeverity(modelState: ModelState, organId: string, severity: number): void {
  const organMesh = modelState.organs.get(organId);
  
  if (organMesh) {
    const severityColor = getSeverityColor(severity);
    const material = organMesh.material as THREE.MeshPhongMaterial;
    
    material.color.set(severityColor);
    material.emissive.set(severityColor);
    material.emissiveIntensity = 0.3 + (severity / 10) * 0.7;
    material.opacity = 0.4 + (severity / 10) * 0.6;
    
    // Add or update hotspot
    addOrUpdateHotspot(modelState, organId, severity);
  }
}

// Add or update a hotspot at an organ
function addOrUpdateHotspot(modelState: ModelState, organId: string, severity: number): void {
  const { model, organs, hotspots } = modelState;
  const organMesh = organs.get(organId);
  
  if (!organMesh) return;
  
  // Check if hotspot already exists
  const existingHotspotIndex = hotspots.findIndex(h => h.organId === organId);
  
  if (existingHotspotIndex >= 0) {
    // Update existing hotspot
    const hotspot = hotspots[existingHotspotIndex];
    
    if (hotspot.mesh) {
      model.remove(hotspot.mesh);
    }
    
    // Only show hotspots for severity > 0
    if (severity > 0) {
      const newMesh = createHotspotMesh(severity);
      newMesh.position.copy(organMesh.position);
      model.add(newMesh);
      
      hotspots[existingHotspotIndex] = {
        ...hotspot,
        severity,
        mesh: newMesh
      };
    } else {
      // Remove hotspot if severity is 0
      hotspots.splice(existingHotspotIndex, 1);
    }
  } else if (severity > 0) {
    // Create new hotspot
    const newMesh = createHotspotMesh(severity);
    newMesh.position.copy(organMesh.position);
    model.add(newMesh);
    
    hotspots.push({
      organId,
      position: { 
        x: organMesh.position.x, 
        y: organMesh.position.y, 
        z: organMesh.position.z 
      },
      severity,
      mesh: newMesh
    });
  }
}

// Create a hotspot mesh based on severity
function createHotspotMesh(severity: number): THREE.Mesh {
  const severityColor = getSeverityColor(severity);
  
  const geometry = new THREE.SphereGeometry(0.03, 16, 16);
  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(severityColor),
    transparent: true,
    opacity: 0.8
  });
  
  const mesh = new THREE.Mesh(geometry, material);
  
  // Animate the pulse effect
  const pulse = () => {
    const scale = 1 + 0.2 * Math.sin(Date.now() * 0.003);
    mesh.scale.set(scale, scale, scale);
    requestAnimationFrame(pulse);
  };
  
  pulse();
  
  return mesh;
}

// Check if an object was clicked with raycaster
export function getClickedOrgan(modelState: ModelState, event: MouseEvent): string | null {
  const { camera, renderer, model, organs } = modelState;
  
  // Calculate mouse position in normalized device coordinates
  const rect = renderer.domElement.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  
  // Create raycaster and use Vector2 for mouse position
  const raycaster = new THREE.Raycaster();
  const mousePosition = new THREE.Vector2(x, y);
  raycaster.setFromCamera(mousePosition, camera);
  
  // Get intersected objects
  const intersects = raycaster.intersectObjects(model.children, true);
  
  if (intersects.length > 0) {
    // Find the clicked organ
    for (const intersect of intersects) {
      const userData = intersect.object.userData;
      
      if (userData && userData.organId) {
        return userData.organId;
      }
    }
  }
  
  return null;
}

// Resize handler
export function handleResize(modelState: ModelState, container: HTMLDivElement): void {
  const { camera, renderer } = modelState;
  
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  
  renderer.setSize(container.clientWidth, container.clientHeight);
}

// Animation loop
export function startAnimationLoop(modelState: ModelState): void {
  const { scene, camera, renderer, controls } = modelState;
  
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  
  animate();
}

// Clean up
export function cleanup(modelState: ModelState): void {
  const { renderer } = modelState;
  
  renderer.dispose();
  
  // Remove the canvas element
  if (renderer.domElement && renderer.domElement.parentNode) {
    renderer.domElement.parentNode.removeChild(renderer.domElement);
  }
}
