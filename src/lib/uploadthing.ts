import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { fileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<fileRouter>();
export const UploadDropzone = generateUploadDropzone<fileRouter>();
