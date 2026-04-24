'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon, Upload, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface GalleryModalProps {
  onClose: () => void;
  onSelect: (url: string) => void;
}

export function GalleryModal({ onClose, onSelect }: GalleryModalProps) {
  const [activeTab, setActiveTab] = useState<'stock' | 'upload'>('stock');
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  
  // Estados para la subida a Supabase
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  // Plantillas por defecto
  const stockPhotos = [
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000", 
    "https://images.unsplash.com/photo-1577720643272-265f434884e0?q=80&w=1000", 
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000", 
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000", 
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1000", 
    "https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=1000", 
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1000", 
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000"  
  ];

  // Función para subir la foto al bucket 'gallery' de Supabase
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName);

      if (data.publicUrl) {
        setUploadedPhotos(prev => [data.publicUrl, ...prev]);
        setSelectedUrl(data.publicUrl);
        setActiveTab('stock');
      }
    } catch (error: any) {
      alert(`Error al subir la imagen: ${error.message}`);
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirm = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
    }
  };

  const allPhotos = [...uploadedPhotos, ...stockPhotos];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/80 backdrop-blur-sm p-4 md:p-6"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden flex flex-col h-[85vh] border border-zinc-200"
      >
        <div className="p-4 md:p-5 border-b border-zinc-200 flex justify-between items-center bg-zinc-50">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-lg">
              <ImageIcon className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-800 text-lg">Biblioteca de Medios</h3>
              <p className="text-xs text-zinc-500">Selecciona o sube una imagen para la invitación</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-200 rounded-full transition-colors text-zinc-500 hover:text-zinc-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-zinc-200 px-6">
          <button 
            onClick={() => setActiveTab('stock')}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'stock' ? 'border-amber-500 text-amber-600' : 'border-transparent text-zinc-500 hover:text-zinc-800'}`}
          >
            Galería de Imágenes
          </button>
          <button 
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'upload' ? 'border-amber-500 text-amber-600' : 'border-transparent text-zinc-500 hover:text-zinc-800'}`}
          >
            Subir Archivo
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-zinc-100/50 p-6 relative">
          
          {activeTab === 'stock' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allPhotos.map((url, index) => {
                const isSelected = selectedUrl === url;
                return (
                  <div 
                    key={index} 
                    onClick={() => setSelectedUrl(url)}
                    className={`relative aspect-square rounded-xl cursor-pointer overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md bg-zinc-200
                      ${isSelected ? 'ring-4 ring-amber-500 ring-offset-2 scale-[0.98]' : 'border border-zinc-200 hover:border-amber-300'}
                    `}
                  >
                    <img 
                      src={url} 
                      alt={`Medio ${index}`} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          className="absolute top-2 right-2 bg-white rounded-full shadow-lg"
                        >
                          <CheckCircle2 className="w-6 h-6 text-amber-500" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'upload' && (
            <div className={`h-full flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-white m-4 transition-colors ${isUploading ? 'border-amber-400 bg-amber-50/50' : 'border-zinc-300'}`}>
              
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-12 h-12 text-amber-600 mb-4 animate-spin" />
                  <h4 className="text-lg font-bold text-zinc-700">Subiendo a la nube...</h4>
                  <p className="text-sm text-zinc-500">Por favor espera un momento.</p>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-zinc-400 mb-4" />
                  <h4 className="text-lg font-bold text-zinc-700 mb-2">Sube tu propia imagen</h4>
                  <p className="text-sm text-zinc-500 mb-6 text-center max-w-sm">
                    Selecciona un archivo de tu computadora. (JPG o PNG, recomendado menos de 5MB).
                  </p>
                  
                  <div className="relative">
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white cursor-pointer relative z-10 pointer-events-none">
                      Seleccionar Archivo
                    </Button>
                    <input 
                      type="file" 
                      accept="image/png, image/jpeg, image/webp"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-zinc-200 bg-white flex justify-between items-center">
          <p className="text-xs text-zinc-500">
            {selectedUrl ? '1 imagen seleccionada' : 'Selecciona una imagen para continuar'}
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="text-zinc-600">
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={!selectedUrl}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors disabled:opacity-50"
            >
              Aplicar Imagen
            </Button>
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
}