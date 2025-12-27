import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

interface ReactLogoMeshProps {
    mousePosition: { x: number; y: number };
}

function Stars() {
    const starsRef = useRef<THREE.Points>(null);

    const starsGeometry = useMemo(() => {
        const positions = new Float32Array(2000 * 3);
        for (let i = 0; i < 2000; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(positions, 3),
        );
        return geometry;
    }, []);

    useFrame(() => {
        if (starsRef.current) {
            starsRef.current.rotation.y += 0.0002;
        }
    });

    return (
        <points ref={starsRef} geometry={starsGeometry}>
            <pointsMaterial
                size={0.05}
                color="#ffffff"
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    );
}

function FloatingParticles() {
    const particlesRef = useRef<THREE.Points>(null);

    const particlesGeometry = useMemo(() => {
        const positions = new Float32Array(200 * 3);
        for (let i = 0; i < 200; i++) {
            const radius = 1.8 + Math.random() * 0.7;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(positions, 3),
        );
        return geometry;
    }, []);

    useFrame(({ clock }) => {
        if (particlesRef.current) {
            particlesRef.current.rotation.y = clock.getElapsedTime() * 0.05;
        }
    });

    return (
        <points ref={particlesRef} geometry={particlesGeometry}>
            <pointsMaterial
                size={0.03}
                color="#61DAFB"
                transparent
                opacity={0.8}
                sizeAttenuation
            />
        </points>
    );
}

function ReactAtomCore() {
    return (
        <mesh>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshPhongMaterial
                color="#61DAFB"
                emissive="#61DAFB"
                emissiveIntensity={0.5}
                shininess={100}
            />
        </mesh>
    );
}

function OrbitRing({
    rotationSpeed = 1,
    tiltX = 0,
    tiltZ = 0,
}: {
    rotationSpeed?: number;
    tiltX?: number;
    tiltZ?: number;
}) {
    const ringRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (ringRef.current) {
            ringRef.current.rotation.y = clock.getElapsedTime() * rotationSpeed;
        }
    });

    return (
        <mesh ref={ringRef} rotation={[tiltX, 0, tiltZ]}>
            <torusGeometry args={[1.2, 0.02, 16, 100]} />
            <meshPhongMaterial
                color="#61DAFB"
                emissive="#61DAFB"
                emissiveIntensity={0.3}
                transparent
                opacity={0.8}
                shininess={80}
            />
        </mesh>
    );
}

function ReactLogoMesh({ mousePosition }: ReactLogoMeshProps) {
    const groupRef = useRef<THREE.Group>(null);
    const mainGroupRef = useRef<THREE.Group>(null);
    const [scale, setScale] = useState(0);
    const targetScale = useRef(0);
    const startTime = useRef(Date.now());
    const autoRotation = useRef(0);

    useFrame(() => {
        if (!groupRef.current || !mainGroupRef.current) return;

        const elapsed = Date.now() - startTime.current;
        const duration = 2000;

        if (elapsed < duration) {
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            targetScale.current = eased;
            setScale(eased);
            mainGroupRef.current.scale.setScalar(eased);
        }

        // Auto-rotación continua
        autoRotation.current += 0.001;
        mainGroupRef.current.rotation.y = autoRotation.current;

        // Parallax suave con el mouse (sensibilidad reducida)
        const targetRotationX = mousePosition.y * 0.15;
        const targetRotationZ = mousePosition.x * 0.15;

        groupRef.current.rotation.x +=
            (targetRotationX - groupRef.current.rotation.x) * 0.05;
        groupRef.current.rotation.z +=
            (targetRotationZ - groupRef.current.rotation.z) * 0.05;
    });

    return (
        <group ref={groupRef}>
            <group ref={mainGroupRef} scale={scale}>
                {/* Núcleo central */}
                <ReactAtomCore />

                {/* 3 anillos orbitales con diferentes inclinaciones y velocidades */}
                <OrbitRing rotationSpeed={0.8} tiltX={Math.PI / 2} tiltZ={0} />
                <OrbitRing
                    rotationSpeed={0.6}
                    tiltX={Math.PI / 6}
                    tiltZ={Math.PI / 3}
                />
                <OrbitRing
                    rotationSpeed={0.7}
                    tiltX={-Math.PI / 6}
                    tiltZ={-Math.PI / 3}
                />

                {/* Glow para cada anillo */}
                {scale > 0.5 && (
                    <>
                        <mesh rotation={[Math.PI / 2, 0, 0]}>
                            <torusGeometry args={[1.2, 0.06, 16, 100]} />
                            <meshBasicMaterial
                                color="#61DAFB"
                                transparent
                                opacity={0.1}
                            />
                        </mesh>
                        <mesh rotation={[Math.PI / 6, 0, Math.PI / 3]}>
                            <torusGeometry args={[1.2, 0.06, 16, 100]} />
                            <meshBasicMaterial
                                color="#61DAFB"
                                transparent
                                opacity={0.1}
                            />
                        </mesh>
                        <mesh rotation={[-Math.PI / 6, 0, -Math.PI / 3]}>
                            <torusGeometry args={[1.2, 0.06, 16, 100]} />
                            <meshBasicMaterial
                                color="#61DAFB"
                                transparent
                                opacity={0.1}
                            />
                        </mesh>
                    </>
                )}
            </group>
            {scale > 0.5 && <FloatingParticles />}
        </group>
    );
}

interface ReactLogo3DSceneProps {
    mousePosition: { x: number; y: number };
}

export function ReactLogo3DScene({ mousePosition }: ReactLogo3DSceneProps) {
    return (
        <>
            <color attach="background" args={['#0D0D0D']} />
            <fog attach="fog" args={['#0D0D0D', 5, 15]} />

            <Stars />

            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 3, 5]} intensity={1.5} />
            <pointLight
                position={[-5, -3, -5]}
                intensity={0.8}
                color="#61DAFB"
            />
            <pointLight position={[0, 5, 0]} intensity={0.5} color="#61DAFB" />

            <ReactLogoMesh mousePosition={mousePosition} />
        </>
    );
}
