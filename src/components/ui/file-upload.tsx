import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile?: File;
  className?: string;
  showCamera?: boolean;
}

export function FileUpload({ onFileSelect, onFileRemove, selectedFile, className, showCamera = true }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      onFileSelect(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onFileSelect]);

  const handleRemove = () => {
    setPreview(null);
    onFileRemove();
  };

  const handleCameraCapture = async () => {
    try {
      setIsCapturing(true);
      
      const image = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        width: 200,
        height: 200,
      });

      if (image.dataUrl) {
        // Convert data URL to File object
        const response = await fetch(image.dataUrl);
        const blob = await response.blob();
        const file = new File([blob], `crop-${Date.now()}.jpg`, { type: 'image/jpeg' });
        
        onFileSelect(file);
        setPreview(image.dataUrl);
      }
    } catch (error) {
      console.error('Error capturing image:', error);
      // Fallback for web or if camera fails - just show message
      alert('Camera not available. Please use the upload option instead.');
    } finally {
      setIsCapturing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false
  });

  if (selectedFile && preview) {
    return (
      <Card className={cn("relative overflow-hidden max-w-md mx-auto", className)}>
        <div className="relative">
          <img 
            src={preview} 
            alt="Selected crop" 
            className="w-full h-48 sm:h-64 object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-3 right-3 h-10 w-10 touch-manipulation"
            onClick={handleRemove}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-3 sm:p-4">
          <p className="text-sm text-muted-foreground truncate">
            {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      {...getRootProps()} 
      className={cn(
        "border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer max-w-md mx-auto touch-manipulation",
        isDragActive && "border-primary bg-accent/20",
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center p-6 sm:p-8 text-center">
        <div className="mb-4 p-4 bg-accent rounded-full">
          {isDragActive ? (
            <Upload className="h-8 w-8 text-primary animate-bounce" />
          ) : (
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        <h3 className="text-base sm:text-lg font-semibold mb-2">
          {isDragActive ? 'Drop your image here' : 'Capture or Upload Crop Image'}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 px-2">
          Take a photo with your camera or upload an existing image
        </p>
        <div className="flex gap-2 flex-col w-full sm:flex-row sm:w-auto">
          {showCamera && (
            <Button 
              variant="default" 
              onClick={(e) => {
                e.stopPropagation();
                handleCameraCapture();
              }}
              disabled={isCapturing}
              type="button"
              className="h-12 sm:h-10 touch-manipulation"
            >
              {isCapturing ? (
                <>
                  <Upload className="h-5 w-5 mr-2 animate-spin" />
                  Capturing...
                </>
              ) : (
                <>
                  <Camera className="h-5 w-5 mr-2" />
                  Take Photo
                </>
              )}
            </Button>
          )}
          <Button variant="outline" type="button" className="h-12 sm:h-10 touch-manipulation">
            <Upload className="h-5 w-5 mr-2" />
            Select Image
          </Button>
        </div>
      </div>
    </Card>
  );
}