import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile?: File;
  className?: string;
}

export function FileUpload({ onFileSelect, onFileRemove, selectedFile, className }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false
  });

  if (selectedFile && preview) {
    return (
      <Card className={cn("relative overflow-hidden", className)}>
        <div className="relative">
          <img 
            src={preview} 
            alt="Selected crop" 
            className="w-full h-64 object-cover"
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
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
        "border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer",
        isDragActive && "border-primary bg-accent/20",
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 p-4 bg-accent rounded-full">
          {isDragActive ? (
            <Upload className="h-8 w-8 text-primary animate-bounce" />
          ) : (
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {isDragActive ? 'Drop your image here' : 'Upload Crop Image'}
        </h3>
        <p className="text-muted-foreground mb-4">
          Drag and drop or click to select an image of your crop
        </p>
        <Button variant="outline">
          Select Image
        </Button>
      </div>
    </Card>
  );
}