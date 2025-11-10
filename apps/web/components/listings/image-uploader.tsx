'use client'

import React, { useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase/client'

interface ImageUploaderProps {
  listingId?: string
  maxImages?: number
  onImagesChange?: (images: UploadedImage[]) => void
  existingImages?: UploadedImage[]
}

export interface UploadedImage {
  id: string
  url: string
  file?: File
  isUploading?: boolean
  progress?: number
  error?: string
}

export function ImageUploader({
  listingId,
  maxImages = 10,
  onImagesChange,
  existingImages = []
}: ImageUploaderProps) {
  const [images, setImages] = useState<UploadedImage[]>(existingImages)
  const [isDragging, setIsDragging] = useState(false)

  // Handle file selection
  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const remainingSlots = maxImages - images.length
    if (remainingSlots <= 0) {
      alert(`Maximum ${maxImages} images allowed`)
      return
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots)
    
    // Validate files
    const validFiles = filesToUpload.filter(file => {
      const isValidType = file.type.startsWith('image/')
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB
      
      if (!isValidType) {
        alert(`${file.name} is not an image file`)
        return false
      }
      if (!isValidSize) {
        alert(`${file.name} is too large (max 5MB)`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    // Create preview images
    const newImages: UploadedImage[] = validFiles.map(file => ({
      id: `temp-${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(file),
      file,
      isUploading: true,
      progress: 0
    }))

    setImages(prev => [...prev, ...newImages])

    // Upload files
    for (const image of newImages) {
      if (image.file) {
        await uploadImage(image)
      }
    }
  }, [images.length, maxImages])

  // Upload image to Supabase Storage
  const uploadImage = async (image: UploadedImage) => {
    if (!image.file) return

    try {
      const fileExt = image.file.name.split('.').pop()
      const fileName = `${listingId || 'temp'}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `listings/${fileName}`

      // Simulate progress (Supabase doesn't provide upload progress)
      updateImageProgress(image.id, 30)

      const { data, error } = await supabase.storage
        .from('listing-images')
        .upload(filePath, image.file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      updateImageProgress(image.id, 70)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('listing-images')
        .getPublicUrl(filePath)

      updateImageProgress(image.id, 100)

      // Update image with actual URL
      setImages(prev => prev.map(img => 
        img.id === image.id 
          ? { ...img, url: publicUrl, isUploading: false, progress: 100 }
          : img
      ))

      // Notify parent component
      const updatedImages = images.map(img => 
        img.id === image.id 
          ? { ...img, url: publicUrl, isUploading: false }
          : img
      )
      onImagesChange?.(updatedImages)

    } catch (error) {
      console.error('Upload error:', error)
      setImages(prev => prev.map(img => 
        img.id === image.id 
          ? { ...img, isUploading: false, error: 'Upload failed' }
          : img
      ))
    }
  }

  // Update upload progress
  const updateImageProgress = (imageId: string, progress: number) => {
    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, progress } : img
    ))
  }

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])

  // Remove image
  const handleRemoveImage = async (imageId: string) => {
    const image = images.find(img => img.id === imageId)
    if (!image) return

    // If image is uploaded to Supabase, delete it
    if (image.url.includes('supabase')) {
      try {
        const filePath = image.url.split('/').slice(-2).join('/')
        await supabase.storage
          .from('listing-images')
          .remove([filePath])
      } catch (error) {
        console.error('Delete error:', error)
      }
    }

    // Remove from state
    const updatedImages = images.filter(img => img.id !== imageId)
    setImages(updatedImages)
    onImagesChange?.(updatedImages)
  }

  // Reorder images
  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newImages = [...images]
    const [removed] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, removed)
    setImages(newImages)
    onImagesChange?.(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <input
          type="file"
          id="image-upload"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={images.length >= maxImages}
        />
        
        <label 
          htmlFor="image-upload" 
          className={`cursor-pointer ${images.length >= maxImages ? 'cursor-not-allowed' : ''}`}
        >
          <svg 
            className="mx-auto h-12 w-12 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 mt-1">
            PNG, JPG, WEBP up to 5MB ({images.length}/{maxImages} images)
          </p>
        </label>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div 
              key={image.id} 
              className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100"
            >
              {/* Image */}
              <img
                src={image.url}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Upload Progress */}
              {image.isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-white text-sm">{image.progress}%</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {image.error && (
                <div className="absolute inset-0 bg-red-500 bg-opacity-75 flex items-center justify-center">
                  <p className="text-white text-sm">{image.error}</p>
                </div>
              )}

              {/* Actions Overlay */}
              {!image.isUploading && !image.error && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleRemoveImage(image.id)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Cover Badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  Cover
                </div>
              )}

              {/* Position Badge */}
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Instructions */}
      {images.length > 0 && (
        <p className="text-sm text-gray-500 text-center">
          The first image will be used as the cover photo. Drag to reorder (coming soon).
        </p>
      )}
    </div>
  )
}
