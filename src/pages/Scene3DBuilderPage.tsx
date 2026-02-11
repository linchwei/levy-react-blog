import { useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  Grid,
  Box,
  Sphere,
  Cylinder,
  Cone,
  Torus,
} from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import {
  BoxIcon,
  CircleIcon,
  CylinderIcon,
  TriangleIcon,
  DonutIcon,
  Trash2Icon,
  MoveIcon,
  RotateCwIcon,
  MaximizeIcon,
  SaveIcon,
  FolderOpenIcon,
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

// Types
type ObjectType = 'box' | 'sphere' | 'cylinder' | 'cone' | 'torus'

interface SceneObject {
  id: string
  type: ObjectType
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  color: string
  visible: boolean
}

interface SceneState {
  objects: SceneObject[]
  backgroundColor: string
  gridVisible: boolean
  shadowsEnabled: boolean
}

// Default scene
const defaultScene: SceneState = {
  objects: [
    {
      id: '1',
      type: 'box',
      position: [0, 0.5, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: '#3b82f6',
      visible: true,
    },
  ],
  backgroundColor: '#1a1a2e',
  gridVisible: true,
  shadowsEnabled: true,
}

// 3D Object Component
function SceneObject3D({
  object,
  isSelected,
  onClick,
}: {
  object: SceneObject
  isSelected: boolean
  onClick: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(_state => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y += 0.01
    }
  })

  if (!object.visible) return null

  const commonProps = {
    ref: meshRef,
    position: object.position,
    rotation: object.rotation,
    scale: object.scale,
    onClick: (e: any) => {
      e.stopPropagation()
      onClick()
    },
    onPointerOver: () => setHovered(true),
    onPointerOut: () => setHovered(false),
  }

  const materialProps = {
    color: hovered ? '#ffffff' : object.color,
    emissive: isSelected ? object.color : '#000000',
    emissiveIntensity: isSelected ? 0.3 : 0,
  }

  switch (object.type) {
    case 'box':
      return (
        <Box {...commonProps} args={[1, 1, 1]}>
          <meshStandardMaterial {...materialProps} />
        </Box>
      )
    case 'sphere':
      return (
        <Sphere {...commonProps} args={[0.5, 32, 32]}>
          <meshStandardMaterial {...materialProps} />
        </Sphere>
      )
    case 'cylinder':
      return (
        <Cylinder {...commonProps} args={[0.5, 0.5, 1, 32]}>
          <meshStandardMaterial {...materialProps} />
        </Cylinder>
      )
    case 'cone':
      return (
        <Cone {...commonProps} args={[0.5, 1, 32]}>
          <meshStandardMaterial {...materialProps} />
        </Cone>
      )
    case 'torus':
      return (
        <Torus {...commonProps} args={[0.5, 0.2, 16, 100]}>
          <meshStandardMaterial {...materialProps} />
        </Torus>
      )
    default:
      return null
  }
}

// Scene Component
function Scene({
  objects,
  selectedId,
  onSelectObject,
  gridVisible,
  shadowsEnabled,
}: {
  objects: SceneObject[]
  selectedId: string | null
  onSelectObject: (id: string | null) => void
  gridVisible: boolean
  shadowsEnabled: boolean
}) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow={shadowsEnabled}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {gridVisible && <Grid infiniteGrid fadeDistance={50} fadeStrength={5} />}

      {objects.map(object => (
        <SceneObject3D
          key={object.id}
          object={object}
          isSelected={selectedId === object.id}
          onClick={() => onSelectObject(object.id)}
        />
      ))}

      <OrbitControls makeDefault />
    </>
  )
}

// Main Page Component
export function Scene3DBuilderPage() {
  const [scene, setScene] = useState<SceneState>(defaultScene)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [transformMode, setTransformMode] = useState<
    'translate' | 'rotate' | 'scale'
  >('translate')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const selectedObject = scene.objects.find(obj => obj.id === selectedId)

  // Add new object
  const addObject = (type: ObjectType) => {
    const newObject: SceneObject = {
      id: Date.now().toString(),
      type,
      position: [Math.random() * 4 - 2, 1, Math.random() * 4 - 2],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')}`,
      visible: true,
    }
    setScene(prev => ({
      ...prev,
      objects: [...prev.objects, newObject],
    }))
    setSelectedId(newObject.id)
    toast.success(`Added ${type}`)
  }

  // Delete object
  const deleteObject = (id: string) => {
    setScene(prev => ({
      ...prev,
      objects: prev.objects.filter(obj => obj.id !== id),
    }))
    if (selectedId === id) setSelectedId(null)
    toast.success('Object deleted')
  }

  // Duplicate object
  const duplicateObject = (id: string) => {
    const obj = scene.objects.find(o => o.id === id)
    if (!obj) return

    const newObject: SceneObject = {
      ...obj,
      id: Date.now().toString(),
      position: [obj.position[0] + 1, obj.position[1], obj.position[2] + 1],
    }
    setScene(prev => ({
      ...prev,
      objects: [...prev.objects, newObject],
    }))
    setSelectedId(newObject.id)
    toast.success('Object duplicated')
  }

  // Update object property
  const updateObject = (id: string, updates: Partial<SceneObject>) => {
    setScene(prev => ({
      ...prev,
      objects: prev.objects.map(obj =>
        obj.id === id ? { ...obj, ...updates } : obj
      ),
    }))
  }

  // Update transform
  const updateTransform = (
    id: string,
    axis: 'x' | 'y' | 'z',
    value: number
  ) => {
    const obj = scene.objects.find(o => o.id === id)
    if (!obj) return

    const key =
      transformMode === 'translate'
        ? 'position'
        : transformMode === 'rotate'
          ? 'rotation'
          : 'scale'
    const current = obj[key]
    const newTransform: [number, number, number] = [...current] as [
      number,
      number,
      number,
    ]
    const index = axis === 'x' ? 0 : axis === 'y' ? 1 : 2
    newTransform[index] = value

    updateObject(id, { [key]: newTransform })
  }

  // Save scene
  const saveScene = () => {
    const dataStr = JSON.stringify(scene, null, 2)
    const dataUri =
      'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    const exportFileDefaultName = `scene-${Date.now()}.json`
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    toast.success('Scene saved!')
  }

  // Load scene
  const loadScene = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = e => {
      try {
        const loadedScene = JSON.parse(e.target?.result as string)
        setScene(loadedScene)
        setSelectedId(null)
        toast.success('Scene loaded!')
      } catch {
        toast.error('Invalid scene file')
      }
    }
    reader.readAsText(file)
  }

  // Clear scene
  const clearScene = () => {
    if (confirm('Are you sure you want to clear the scene?')) {
      setScene({
        ...scene,
        objects: [],
      })
      setSelectedId(null)
      toast.success('Scene cleared')
    }
  }

  const objectIcons: Record<ObjectType, React.ReactNode> = {
    box: <BoxIcon className="w-4 h-4" />,
    sphere: <CircleIcon className="w-4 h-4" />,
    cylinder: <CylinderIcon className="w-4 h-4" />,
    cone: <TriangleIcon className="w-4 h-4" />,
    torus: <DonutIcon className="w-4 h-4" />,
  }

  const objectLabels: Record<ObjectType, string> = {
    box: 'Cube',
    sphere: 'Sphere',
    cylinder: 'Cylinder',
    cone: 'Cone',
    torus: 'Torus',
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">3D Scene Builder</h1>
              <p className="text-sm text-muted-foreground">
                Create and edit 3D scenes with ease
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={saveScene}>
                <SaveIcon className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <FolderOpenIcon className="w-4 h-4 mr-2" />
                Load
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={loadScene}
                className="hidden"
              />
              <Button variant="destructive" size="sm" onClick={clearScene}>
                <Trash2Icon className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Objects */}
        <div className="w-64 border-r bg-card overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold mb-3">Add Objects</h3>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {(Object.keys(objectIcons) as ObjectType[]).map(type => (
                <Button
                  key={type}
                  variant="outline"
                  size="sm"
                  onClick={() => addObject(type)}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                >
                  {objectIcons[type]}
                  <span className="text-xs">{objectLabels[type]}</span>
                </Button>
              ))}
            </div>

            <h3 className="font-semibold mb-3">Scene Objects</h3>
            <div className="space-y-2">
              {scene.objects.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No objects in scene
                </p>
              ) : (
                scene.objects.map(obj => (
                  <motion.div
                    key={obj.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedId === obj.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                    onClick={() => setSelectedId(obj.id)}
                  >
                    {objectIcons[obj.type]}
                    <span className="flex-1 text-sm capitalize">
                      {obj.type}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={e => {
                        e.stopPropagation()
                        updateObject(obj.id, { visible: !obj.visible })
                      }}
                    >
                      {obj.visible ? (
                        <EyeIcon className="w-3 h-3" />
                      ) : (
                        <EyeOffIcon className="w-3 h-3" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={e => {
                        e.stopPropagation()
                        duplicateObject(obj.id)
                      }}
                    >
                      <CopyIcon className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:text-destructive"
                      onClick={e => {
                        e.stopPropagation()
                        deleteObject(obj.id)
                      }}
                    >
                      <Trash2Icon className="w-3 h-3" />
                    </Button>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Center - 3D Canvas */}
        <div className="flex-1 relative">
          <Canvas
            shadows={scene.shadowsEnabled}
            camera={{ position: [5, 5, 5], fov: 50 }}
            style={{ background: scene.backgroundColor }}
            onClick={() => setSelectedId(null)}
          >
            <Scene
              objects={scene.objects}
              selectedId={selectedId}
              onSelectObject={setSelectedId}
              gridVisible={scene.gridVisible}
              shadowsEnabled={scene.shadowsEnabled}
            />
          </Canvas>

          {/* View Controls */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <div className="bg-card/90 backdrop-blur-sm rounded-lg p-2 flex items-center gap-2">
              <Switch
                checked={scene.gridVisible}
                onCheckedChange={checked =>
                  setScene(prev => ({ ...prev, gridVisible: checked }))
                }
              />
              <Label className="text-xs">Grid</Label>
            </div>
            <div className="bg-card/90 backdrop-blur-sm rounded-lg p-2 flex items-center gap-2">
              <Switch
                checked={scene.shadowsEnabled}
                onCheckedChange={checked =>
                  setScene(prev => ({ ...prev, shadowsEnabled: checked }))
                }
              />
              <Label className="text-xs">Shadows</Label>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 border-l bg-card overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold mb-4">Properties</h3>

            {selectedObject ? (
              <Tabs defaultValue="transform" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="transform">Transform</TabsTrigger>
                  <TabsTrigger value="material">Material</TabsTrigger>
                </TabsList>

                <TabsContent value="transform" className="space-y-4">
                  {/* Transform Mode */}
                  <div className="flex gap-1">
                    <Button
                      variant={
                        transformMode === 'translate' ? 'default' : 'outline'
                      }
                      size="sm"
                      className="flex-1"
                      onClick={() => setTransformMode('translate')}
                    >
                      <MoveIcon className="w-4 h-4 mr-1" />
                      Move
                    </Button>
                    <Button
                      variant={
                        transformMode === 'rotate' ? 'default' : 'outline'
                      }
                      size="sm"
                      className="flex-1"
                      onClick={() => setTransformMode('rotate')}
                    >
                      <RotateCwIcon className="w-4 h-4 mr-1" />
                      Rotate
                    </Button>
                    <Button
                      variant={
                        transformMode === 'scale' ? 'default' : 'outline'
                      }
                      size="sm"
                      className="flex-1"
                      onClick={() => setTransformMode('scale')}
                    >
                      <MaximizeIcon className="w-4 h-4 mr-1" />
                      Scale
                    </Button>
                  </div>

                  {/* Transform Controls */}
                  {(['x', 'y', 'z'] as const).map(axis => {
                    const key =
                      transformMode === 'translate'
                        ? 'position'
                        : transformMode === 'rotate'
                          ? 'rotation'
                          : 'scale'
                    const value =
                      selectedObject[key][
                        axis === 'x' ? 0 : axis === 'y' ? 1 : 2
                      ]
                    const min =
                      transformMode === 'scale'
                        ? 0.1
                        : transformMode === 'rotate'
                          ? 0
                          : -10
                    const max =
                      transformMode === 'scale'
                        ? 5
                        : transformMode === 'rotate'
                          ? 360
                          : 10
                    const step = transformMode === 'rotate' ? 1 : 0.1

                    return (
                      <div key={axis} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="uppercase text-xs font-bold text-muted-foreground">
                            {axis}
                          </Label>
                          <Input
                            type="number"
                            value={Number(value.toFixed(2))}
                            onChange={e =>
                              updateTransform(
                                selectedObject.id,
                                axis,
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-20 h-7 text-xs"
                            step={step}
                          />
                        </div>
                        <Slider
                          value={[value]}
                          min={min}
                          max={max}
                          step={step}
                          onValueChange={([v]) =>
                            updateTransform(selectedObject.id, axis, v)
                          }
                        />
                      </div>
                    )
                  })}
                </TabsContent>

                <TabsContent value="material" className="space-y-4">
                  {/* Color */}
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={selectedObject.color}
                        onChange={e =>
                          updateObject(selectedObject.id, {
                            color: e.target.value,
                          })
                        }
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <Input
                        value={selectedObject.color}
                        onChange={e =>
                          updateObject(selectedObject.id, {
                            color: e.target.value,
                          })
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* Preset Colors */}
                  <div className="space-y-2">
                    <Label>Presets</Label>
                    <div className="grid grid-cols-6 gap-1">
                      {[
                        '#ef4444',
                        '#f97316',
                        '#f59e0b',
                        '#84cc16',
                        '#22c55e',
                        '#10b981',
                        '#14b8a6',
                        '#06b6d4',
                        '#0ea5e9',
                        '#3b82f6',
                        '#6366f1',
                        '#8b5cf6',
                        '#a855f7',
                        '#d946ef',
                        '#ec4899',
                        '#f43f5e',
                        '#64748b',
                        '#94a3b8',
                      ].map(color => (
                        <button
                          key={color}
                          className="w-8 h-8 rounded-md border-2 border-transparent hover:border-primary transition-colors"
                          style={{ backgroundColor: color }}
                          onClick={() =>
                            updateObject(selectedObject.id, { color })
                          }
                        />
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BoxIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Select an object to edit its properties</p>
              </div>
            )}

            {/* Scene Settings */}
            <div className="mt-8 pt-6 border-t">
              <h4 className="font-semibold mb-4">Scene Settings</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={scene.backgroundColor}
                      onChange={e =>
                        setScene(prev => ({
                          ...prev,
                          backgroundColor: e.target.value,
                        }))
                      }
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <Input
                      value={scene.backgroundColor}
                      onChange={e =>
                        setScene(prev => ({
                          ...prev,
                          backgroundColor: e.target.value,
                        }))
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
