import { useRef, useState } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';

import { uploadWebsiteMedia } from '@/api/websiteAdmin.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

interface UploadMediaProps {
  value?: string;
  label?: string;
  description?: string;
  onChange?: (url: string) => void;
  disabled?: boolean;
}

const formatFileSize = (bytes: number) => {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  if (bytes >= 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${bytes} bytes`;
};

const UploadMedia: React.FC<UploadMediaProps> = ({ value, label = 'Upload media asset', description, onChange, disabled = false }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();
  const [isDragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileSize, setFileSize] = useState<number | null>(null);

  const handleFile = async (file: File | null) => {
    if (!file || disabled) {
      return;
    }

    setUploading(true);
    setFileSize(file.size);

    try {
      const result = await uploadWebsiteMedia(file);
      onChange?.(result.url);
      setFileSize(result.size ?? file.size);
      toast({ title: 'Media uploaded', description: result.filename ?? result.url });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to upload file';
      toast({ title: 'Upload failed', description: message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = event.target.files ?? [];
    void handleFile(file ?? null);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    if (disabled) {
      return;
    }
    event.preventDefault();
    setDragging(false);
    const [file] = Array.from(event.dataTransfer.files ?? []);
    void handleFile(file ?? null);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    if (disabled) {
      return;
    }
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    if (disabled) {
      return;
    }
    setDragging(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">{label}</CardTitle>
        <CardDescription>
          {description ?? 'Drag & drop an image or browse to upload. The generated URL will be saved to the CMS block.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition ${
            disabled
              ? 'cursor-not-allowed border-border/40 bg-muted/30 opacity-70'
              : isDragging
                ? 'border-primary/60 bg-primary/5'
                : 'border-border/60'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onClick={() => {
            if (!disabled) {
              inputRef.current?.click();
            }
          }}
          onKeyDown={(event) => {
            if (disabled) {
              return;
            }
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          aria-label="Upload media"
          aria-disabled={disabled}
        >
          {uploading ? (
            <Loader2 className="mb-2 h-6 w-6 animate-spin text-primary" />
          ) : (
            <ImagePlus className="mb-2 h-6 w-6 text-muted-foreground" />
          )}
          <p className="text-sm font-medium text-foreground">
            {disabled ? 'Uploads disabled for your role' : uploading ? 'Uploading…' : 'Drop image or click to upload'}
          </p>
          <p className="text-xs text-muted-foreground">JPEG, PNG, WebP up to 10 MB</p>
          <Input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleInputChange}
            disabled={disabled || uploading}
          />
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            type="button"
            disabled={uploading || disabled}
            onClick={() => inputRef.current?.click()}
          >
            Browse files
          </Button>
        </div>

        {value ? (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Current asset</p>
            <div className="overflow-hidden rounded-lg border bg-background">
              <img src={value} alt="Uploaded asset" className="h-48 w-full object-cover" />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{value}</span>
              {fileSize ? <span>{formatFileSize(fileSize)}</span> : null}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default UploadMedia;
