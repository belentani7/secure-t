/**
 * Cliente de almacenamiento temporal (stub)
 * Reemplazar por el SDK real (S3, R2 o Cloudinary) antes de producción.
 * Implementa la misma forma que espera download-handler.ts para que el
 * servidor sea ejecutable end-to-end mientras se decide el proveedor final.
 */
export const stubStorageClient = {
  async getSignedUrl(
    resourcePath: string,
    opts: { expiresIn: number; responseDisposition: string; responseFilename: string }
  ): Promise<string> {
    const expiresAt = Date.now() + opts.expiresIn * 1000;
    return `https://storage.example.invalid/${resourcePath}?filename=${encodeURIComponent(
      opts.responseFilename
    )}&expires=${expiresAt}`;
  },
};
