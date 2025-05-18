// UploadMultiple.tsx
'use client'

import { useRef } from 'react'

type UploadMultipleProps = {
  onFilesSelected: (files: FileList) => void
}

const UploadMultiple = ({ onFilesSelected }: UploadMultipleProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = () => {
    const files = fileInputRef.current?.files
    if (files) {
      onFilesSelected(files)
    }
  }

  return (
    <div>
      <input
        type='file'
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className='block'
      />
    </div>
  )
}

export default UploadMultiple
