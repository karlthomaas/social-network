import { useDropzone } from 'react-dropzone';
import { Input } from '@/components/ui/input';
import { useEffect, memo } from 'react';

export const FileUpload = memo(({ callback }: { callback: (files: File[]) => void }) => {
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png'],
    },
  });

  useEffect(() => {
    if (acceptedFiles.length === 0) return;
    callback(acceptedFiles);
  }, [acceptedFiles, callback]);

  return (
    <div {...getRootProps()}>
      <div className='flex h-[100px] w-full flex-col space-y-3'>
        <div
          className='mt-2 flex h-full cursor-pointer items-center
              justify-center rounded-lg border-2 border-dashed border-input text-muted-foreground hover:bg-input hover:brightness-90 dark:hover:brightness-150'
          {...getRootProps()}
        >
          <Input {...getInputProps()} />
          {isDragActive ? (
            <>Drop files here</>
          ) : (
            <>
              <span className='mr-1 underline'>Click here</span> or drag and drop a image here.
            </>
          )}
        </div>
      </div>
    </div>
  );
});

FileUpload.displayName = 'FileUpload';
