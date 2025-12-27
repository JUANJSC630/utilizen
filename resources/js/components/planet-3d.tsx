import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

interface PlanetMeshProps {
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

function PlanetWireframe() {
    const meshRef = useRef<THREE.Mesh>(null);
    const geometryRef = useRef<THREE.SphereGeometry>(null);
    const originalPositions = useRef<Float32Array | null>(null);
    const colorIndices = useRef<number[]>([]);
    const colorTimers = useRef<number[]>([]);

    const logoColors = useMemo(
        () => [
            new THREE.Color('#70D0FF'), // Cyan brillante
            new THREE.Color('#7B8EE5'), // Azul medio
            new THREE.Color('#5566D0'), // Azul profundo
            new THREE.Color('#B8A5E8'), // Morado lavanda
        ],
        [],
    );

    const { geometry, pointsGeometry } = useMemo(() => {
        const geo = new THREE.SphereGeometry(1, 32, 32);
        const edges = new THREE.EdgesGeometry(geo);

        geometryRef.current = geo;
        originalPositions.current =
            geo.attributes.position.array.slice() as Float32Array;

        // Extraer posiciones únicas de los edges para crear solo puntos en el wireframe
        const edgePositions = edges.attributes.position.array;
        const uniqueVertices = new Map<string, THREE.Vector3>();

        // Recolectar vértices únicos del wireframe
        for (let i = 0; i < edgePositions.length; i += 3) {
            const x = edgePositions[i];
            const y = edgePositions[i + 1];
            const z = edgePositions[i + 2];
            const key = `${x.toFixed(5)},${y.toFixed(5)},${z.toFixed(5)}`;

            if (!uniqueVertices.has(key)) {
                uniqueVertices.set(key, new THREE.Vector3(x, y, z));
            }
        }

        // Crear geometría de puntos solo con vértices del wireframe
        const vertexCount = uniqueVertices.size;
        const positions = new Float32Array(vertexCount * 3);
        const colors = new Float32Array(vertexCount * 3);

        colorIndices.current = new Array(vertexCount).fill(0);
        colorTimers.current = new Array(vertexCount).fill(0);

        let idx = 0;
        uniqueVertices.forEach((vertex) => {
            positions[idx * 3] = vertex.x;
            positions[idx * 3 + 1] = vertex.y;
            positions[idx * 3 + 2] = vertex.z;

            colorTimers.current[idx] = Math.random() * 60;

            // Empezar con 5% de puntos iluminados
            if (Math.random() < 0.05) {
                const colorIndex = Math.floor(
                    Math.random() * logoColors.length,
                );
                const color = logoColors[colorIndex];
                colors[idx * 3] = color.r;
                colors[idx * 3 + 1] = color.g;
                colors[idx * 3 + 2] = color.b;
            } else {
                colors[idx * 3] = 0;
                colors[idx * 3 + 1] = 0;
                colors[idx * 3 + 2] = 0;
            }

            idx++;
        });

        const pointsGeo = new THREE.BufferGeometry();
        pointsGeo.setAttribute(
            'position',
            new THREE.BufferAttribute(positions, 3),
        );
        pointsGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        return { geometry: geo, pointsGeometry: pointsGeo };
    }, [logoColors]);

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.001;
        }

        // Efecto líquido: deformar vértices del wireframe
        if (geometryRef.current && originalPositions.current) {
            const positions = geometryRef.current.attributes.position.array;
            const time = clock.getElapsedTime();

            for (let i = 0; i < positions.length; i += 3) {
                const x = originalPositions.current[i];
                const y = originalPositions.current[i + 1];
                const z = originalPositions.current[i + 2];

                // Calcular deformación usando funciones seno
                const angle = Math.atan2(z, x);
                const wave = Math.sin(time * 2 + angle * 3) * 0.08;
                const wave2 = Math.cos(time * 1.5 + y * 4) * 0.06;

                // Aplicar deformación
                const deformation = 1 + wave + wave2;
                positions[i] = x * deformation;
                positions[i + 1] = y * deformation;
                positions[i + 2] = z * deformation;
            }

            geometryRef.current.attributes.position.needsUpdate = true;
            geometryRef.current.computeVertexNormals();
        }

        // Animar colores de los puntos (muy lento)
        if (pointsGeometry) {
            const colors = pointsGeometry.attributes.color
                .array as Float32Array;
            const vertexCount = pointsGeometry.attributes.position.count;

            for (let i = 0; i < vertexCount; i++) {
                colorTimers.current[i]++;

                // Cada 240-480 frames, cambiar el color (muy lento y sutil)
                if (colorTimers.current[i] > 240 + Math.random() * 240) {
                    if (Math.random() < 0.03) {
                        // 3% de probabilidad - muy sutil
                        // Elegir color aleatorio del logo
                        const colorIndex = Math.floor(
                            Math.random() * logoColors.length,
                        );
                        colorIndices.current[i] = colorIndex;
                        const color = logoColors[colorIndex];

                        colors[i * 3] = color.r;
                        colors[i * 3 + 1] = color.g;
                        colors[i * 3 + 2] = color.b;
                    } else {
                        // Volver a negro (invisible)
                        colors[i * 3] = 0;
                        colors[i * 3 + 1] = 0;
                        colors[i * 3 + 2] = 0;
                    }
                    colorTimers.current[i] = 0;
                }
            }

            pointsGeometry.attributes.color.needsUpdate = true;
        }
    });

    return (
        <group>
            {/* Wireframe oculto - solo los puntos de colores son visibles */}

            {/* Mesh con puntos de colores solo en el wireframe */}
            <points ref={meshRef} scale={1.02} geometry={pointsGeometry}>
                <shaderMaterial
                    transparent={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    vertexShader={`
                        attribute vec3 color;
                        varying vec3 vColor;

                        void main() {
                            vColor = color;
                            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                            gl_PointSize = 8.0 * (300.0 / -mvPosition.z);
                            gl_Position = projectionMatrix * mvPosition;
                        }
                    `}
                    fragmentShader={`
                        varying vec3 vColor;

                        void main() {
                            float dist = length(gl_PointCoord - vec2(0.5));
                            if (dist > 0.5) discard;

                            float alpha = 1.0 - (dist / 0.5);
                            alpha = pow(alpha, 2.0);

                            gl_FragColor = vec4(vColor, alpha * 0.9);
                        }
                    `}
                />
            </points>
        </group>
    );
}

function FloatingParticles() {
    const particlesRef = useRef<THREE.Points>(null);

    const starTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            const centerX = 32;
            const centerY = 32;

            // Crear círculo con gradiente radial
            const gradient = ctx.createRadialGradient(
                centerX,
                centerY,
                0,
                centerX,
                centerY,
                32,
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 64, 64);
        }

        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }, []);

    const particlesGeometry = useMemo(() => {
        const positions = new Float32Array(300 * 3);
        const sizes = new Float32Array(300);

        for (let i = 0; i < 300; i++) {
            // Distribuir partículas en un rango más amplio para efecto de profundidad
            const radius = 1.3 + Math.random() * 2.5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);

            // Tamaños variables según distancia para efecto de profundidad
            sizes[i] = radius > 2.5 ? 0.08 : 0.04;
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(positions, 3),
        );
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
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
                size={0.08}
                color="#ffffff"
                map={starTexture}
                transparent
                opacity={0.7}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

function PlanetMesh({ mousePosition }: PlanetMeshProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);
    const [scale, setScale] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const targetScale = useRef(0);
    const startTime = useRef(Date.now());
    const autoRotation = useRef(0);
    const dragStart = useRef({ x: 0, y: 0 });
    const rotation = useRef({ x: 0, y: 0 });
    const { gl } = useThree();

    useEffect(() => {
        const handleGlobalPointerMove = (e: PointerEvent) => {
            if (!isDragging) return;

            const deltaX = e.clientX - dragStart.current.x;
            const deltaY = e.clientY - dragStart.current.y;

            rotation.current.y += deltaX * 0.01;
            rotation.current.x += deltaY * 0.01;

            dragStart.current = { x: e.clientX, y: e.clientY };
        };

        const handleGlobalPointerUp = () => {
            if (isDragging) {
                setIsDragging(false);
                autoRotation.current = rotation.current.y;
                if (gl.domElement) {
                    gl.domElement.style.cursor = 'grab';
                }
            }
        };

        if (isDragging) {
            window.addEventListener('pointermove', handleGlobalPointerMove);
            window.addEventListener('pointerup', handleGlobalPointerUp);
        }

        return () => {
            window.removeEventListener('pointermove', handleGlobalPointerMove);
            window.removeEventListener('pointerup', handleGlobalPointerUp);
        };
    }, [isDragging, gl]);

    useFrame(() => {
        if (!meshRef.current || !groupRef.current) return;

        const elapsed = Date.now() - startTime.current;
        const duration = 2000;

        if (elapsed < duration) {
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            targetScale.current = eased;
            setScale(eased);
            meshRef.current.scale.setScalar(eased);
        }

        // Auto-rotation (solo cuando no está siendo arrastrado)
        if (!isDragging) {
            autoRotation.current += 0.002;
            meshRef.current.rotation.y = autoRotation.current;

            // Parallax con el mouse (MUCHO más obvio)
            const targetRotationX = mousePosition.y * 0.3;
            const targetRotationZ = mousePosition.x * 0.3;

            groupRef.current.rotation.x +=
                (targetRotationX - groupRef.current.rotation.x) * 0.1;
            groupRef.current.rotation.z +=
                (targetRotationZ - groupRef.current.rotation.z) * 0.1;
        } else {
            // Cuando está siendo arrastrado, aplicar la rotación manual
            meshRef.current.rotation.y = rotation.current.y;
            meshRef.current.rotation.x = rotation.current.x;
        }
    });

    const handlePointerDown = (e: React.PointerEvent) => {
        e.stopPropagation();
        setIsDragging(true);
        dragStart.current = { x: e.clientX, y: e.clientY };
        if (gl.domElement) {
            gl.domElement.style.cursor = 'grabbing';
        }
    };

    const handlePointerOver = () => {
        if (gl.domElement) {
            gl.domElement.style.cursor = 'grab';
        }
    };

    const handlePointerOut = () => {
        if (gl.domElement) {
            gl.domElement.style.cursor = 'auto';
        }
    };

    return (
        <group ref={groupRef}>
            <mesh
                ref={meshRef}
                scale={scale}
                onPointerDown={handlePointerDown}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
            >
                <sphereGeometry args={[1, 70, 70]} />
                <meshBasicMaterial transparent opacity={0} />
            </mesh>
            {scale > 0.5 && <PlanetWireframe />}
            {scale > 0.5 && <FloatingParticles />}
        </group>
    );
}

interface Planet3DSceneProps {
    mousePosition: { x: number; y: number };
}

export function Planet3DScene({ mousePosition }: Planet3DSceneProps) {
    return (
        <>
            <color attach="background" args={['#0D0D0D']} />

            <Stars />

            <ambientLight intensity={0.2} />
            <directionalLight position={[5, 3, 5]} intensity={1.2} />

            <PlanetMesh mousePosition={mousePosition} />
        </>
    );
}
