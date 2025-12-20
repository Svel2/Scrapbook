'use client'

import { useRef, useEffect } from 'react'
import { Group } from 'three'
import { Text } from '@react-three/drei'
import { gsap } from 'gsap'
import Decoration from './Decorations'

interface PostcardPageProps {
    position: [number, number, number]
    rotation: [number, number, number]
    isFlipped: boolean
    onFlip: () => void
    pageIndex: number
    title?: string
    sentMessage?: string
    toField?: string
    fromField?: string
}

export default function PostcardPage({
    position,
    rotation,
    isFlipped,
    onFlip,
    pageIndex,
    title = 'I Text a postcard',
    sentMessage = 'to long randa',
    toField = 'your tenna',
    fromField = ''
}: PostcardPageProps) {
    const pageRef = useRef<Group>(null)
    const backContentRef = useRef<Group>(null)

    useEffect(() => {
        if (pageRef.current) {
            gsap.to(pageRef.current.rotation, {
                y: isFlipped ? Math.PI : 0,
                duration: 0.8,
                ease: "power2.inOut"
            })
        }

        if (backContentRef.current) {
            gsap.to(backContentRef.current.rotation, {
                y: isFlipped ? 0 : Math.PI,
                duration: 0.8,
                ease: "power2.inOut"
            })
        }
    }, [isFlipped])

    const handleClick = (event: any) => {
        event.stopPropagation()
        onFlip()
    }

    // Vintage cream color palette
    const cardColor = '#FFF8F0'
    const textColor = '#5D4E37'

    return (
        <group position={position} rotation={rotation}>
            <group ref={pageRef} onClick={handleClick}>
                {/* Main card background */}
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[3.8, 4.8, 0.02]} />
                    <meshStandardMaterial color={cardColor} roughness={0.9} />
                </mesh>

                {/* Front Content */}
                <group position={[0, 0, 0.011]}>
                    {/* Red/white striped border - Top */}
                    <Decoration
                        type="postcardBorder"
                        position={[0, 2.25, 0.001]}
                        size={[3.8, 0.15, 0.002]}
                    />

                    {/* Red/white striped border - Bottom */}
                    <Decoration
                        type="postcardBorder"
                        position={[0, -2.25, 0.001]}
                        size={[3.8, 0.15, 0.002]}
                    />

                    {/* Title - "I Text a postcard" */}
                    <Text
                        position={[0, 1.8, 0.005]}
                        fontSize={0.22}
                        color={textColor}
                        anchorX="center"
                        anchorY="middle"
                        fontStyle="italic"
                    >
                        {title}
                    </Text>

                    {/* Hand-drawn illustration area (using box instead of circle for WebGL compatibility) */}
                    <mesh position={[-0.8, 0.3, 0.002]}>
                        <boxGeometry args={[1.7, 1.7, 0.003]} />
                        <meshStandardMaterial color="#E8C4C4" />
                    </mesh>
                    <mesh position={[-0.8, 0.3, 0.003]}>
                        <boxGeometry args={[1.6, 1.6, 0.002]} />
                        <meshStandardMaterial color="#F5E8E0" />
                    </mesh>
                    {/* Placeholder floral elements */}
                    <Text
                        position={[-0.8, 0.3, 0.005]}
                        fontSize={0.15}
                        color="#C9A9A9"
                        anchorX="center"
                        anchorY="middle"
                    >
                        ❀ ✿ ❁
                    </Text>
                    <Text
                        position={[-0.8, 0.1, 0.005]}
                        fontSize={0.12}
                        color="#C9A9A9"
                        anchorX="center"
                        anchorY="middle"
                    >
                        ✿ ❀ ✿
                    </Text>
                    <Text
                        position={[-0.8, 0.5, 0.005]}
                        fontSize={0.12}
                        color="#C9A9A9"
                        anchorX="center"
                        anchorY="middle"
                    >
                        ❁ ✿ ❁
                    </Text>

                    {/* Right side - Message area */}
                    {/* Stamp */}
                    <Decoration
                        type="stamp"
                        position={[1.35, 1.4, 0.005]}
                        size={[0.5, 0.6, 0.008]}
                        color="#F0E0E8"
                    />

                    {/* Postmark */}
                    <Decoration
                        type="postmark"
                        position={[1.0, 1.3, 0.008]}
                        size={[0.5, 0.5, 0.005]}
                    />

                    {/* "Sent" label */}
                    <Text
                        position={[0.8, 0.5, 0.005]}
                        fontSize={0.22}
                        color={textColor}
                        anchorX="center"
                        anchorY="middle"
                        fontStyle="italic"
                    >
                        Sent
                    </Text>

                    {/* Sent message line */}
                    <mesh position={[0.8, 0.25, 0.003]}>
                        <boxGeometry args={[1.6, 0.008, 0.001]} />
                        <meshStandardMaterial color="#C9B8A8" />
                    </mesh>
                    <Text
                        position={[0.8, 0.3, 0.005]}
                        fontSize={0.12}
                        color="#7D6E5E"
                        anchorX="center"
                        anchorY="middle"
                        fontStyle="italic"
                    >
                        {sentMessage}
                    </Text>

                    {/* Divider line */}
                    <mesh position={[0.1, 0, 0.003]} rotation={[0, 0, Math.PI / 2]}>
                        <boxGeometry args={[2.5, 0.01, 0.001]} />
                        <meshStandardMaterial color="#D9C8B8" />
                    </mesh>

                    {/* "To" field */}
                    <Text
                        position={[0.5, -0.5, 0.005]}
                        fontSize={0.14}
                        color={textColor}
                        anchorX="left"
                        anchorY="middle"
                        fontStyle="italic"
                    >
                        To
                    </Text>
                    <mesh position={[1.0, -0.7, 0.003]}>
                        <boxGeometry args={[1.4, 0.008, 0.001]} />
                        <meshStandardMaterial color="#C9B8A8" />
                    </mesh>
                    <Text
                        position={[1.0, -0.6, 0.005]}
                        fontSize={0.11}
                        color="#7D6E5E"
                        anchorX="center"
                        anchorY="middle"
                        fontStyle="italic"
                    >
                        {toField}
                    </Text>

                    {/* "From" field */}
                    <Text
                        position={[0.5, -1.1, 0.005]}
                        fontSize={0.14}
                        color={textColor}
                        anchorX="left"
                        anchorY="middle"
                        fontStyle="italic"
                    >
                        From
                    </Text>
                    <mesh position={[1.0, -1.3, 0.003]}>
                        <boxGeometry args={[1.4, 0.008, 0.001]} />
                        <meshStandardMaterial color="#C9B8A8" />
                    </mesh>
                    <Text
                        position={[1.0, -1.2, 0.005]}
                        fontSize={0.11}
                        color="#7D6E5E"
                        anchorX="center"
                        anchorY="middle"
                        fontStyle="italic"
                    >
                        {fromField}
                    </Text>
                </group>
            </group>

            {/* Back Content */}
            <group ref={backContentRef}>
                <group position={[0, 0, -0.011]} rotation={[0, Math.PI, 0]}>
                    <Text
                        position={[0, 1, 0.005]}
                        fontSize={0.25}
                        color={textColor}
                        anchorX="center"
                        anchorY="middle"
                    >
                        💌 Memories 💌
                    </Text>
                    <Text
                        position={[0, 0, 0.005]}
                        fontSize={0.15}
                        color="#7D6E5E"
                        anchorX="center"
                        anchorY="middle"
                        maxWidth={3}
                        textAlign="center"
                    >
                        Every moment is a treasure...
                    </Text>

                    {/* Back decorations */}
                    <Decoration
                        type="sticker"
                        position={[-1.2, -1.5, 0.01]}
                        color="#FFC8DD"
                        text="♥"
                        size={[0.4, 0.4, 0.01]}
                    />
                    <Decoration
                        type="sticker"
                        position={[1.2, -1.5, 0.01]}
                        color="#A2D2FF"
                        text="★"
                        size={[0.4, 0.4, 0.01]}
                    />
                </group>
            </group>
        </group>
    )
}
