import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Desactiva la generación de sourcemaps en producción
    sourcemap: false,
    // No calcular tamaños Brotli para cada archivo (ahorra memoria)
    brotliSize: false,
    // Apunta a un target razonable para no generar código excesivamente complejo
    target: 'es2015',
    // Usa esbuild para minificar (más rápido y menos hog de RAM que terser)
    minify: 'esbuild',
    // Ajusta el warning si un chunk supera cierto tamaño (no detiene el build)
    chunkSizeWarningLimit: 1000
    // Si necesitas marcar ciertas dependencias como externas (p.ej. html2canvas, jspdf)
    // y cargarlas por CDN en el index.html, descomenta esta sección:
    /*
    rollupOptions: {
      external: [
        'html2canvas',
        'jspdf'
      ]
    }
    */
  }
})
