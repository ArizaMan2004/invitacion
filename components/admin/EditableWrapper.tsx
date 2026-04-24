'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Pencil, Image as ImageIcon, MapPin, Type, Palette } from 'lucide-react';

interface EditableWrapperProps {
  children: React.ReactNode;
  onEdit: () => void;
  label: string;
  isEditing?: boolean;
  type?: 'image' | 'map' | 'text' | 'color';
}

export function EditableWrapper({ 
  children, 
  onEdit, 
  label, 
  isEditing = false, 
  type = 'image' 
}: EditableWrapperProps) {
  
  // Si estamos en la vista pública (invitado), no renderizamos ninguna herramienta
  if (!isEditing) {
    return <>{children}</>;
  }

  // Asignación de iconos dinámicos según lo que estemos editando
  const getIcon = () => {
    switch (type) {
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'map': return <MapPin className="w-4 h-4" />;
      case 'text': return <Type className="w-4 h-4" />;
      case 'color': return <Palette className="w-4 h-4" />;
      default: return <Pencil className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative group outline-none w-full h-full">
      
      {/* CONTENIDO PRINCIPAL 
        Se le añade un borde luminoso sutil (ring) al pasar el ratón para 
        indicar qué área exacta se va a modificar, sin tapar el centro.
      */}
      <div className="relative z-0 w-full h-full transition-all duration-200 ease-in-out group-hover:ring-2 group-hover:ring-amber-500/50 group-hover:rounded-sm">
        {children}
      </div>

      {/* BOTÓN FLOTANTE DE EDICIÓN 
        Ubicado en la esquina superior derecha (`top-2 right-2`).
        Permanece invisible (`opacity-0`) hasta que pasas el ratón (`group-hover:opacity-100`).
      */}
      <motion.button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation(); // Crucial: Evita que el clic active otras cosas detrás del botón
          onEdit();
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-2 right-2 z-[60] bg-white text-zinc-700 px-3 py-2 rounded-full shadow-lg border border-zinc-200 flex items-center gap-2 hover:bg-amber-500 hover:border-amber-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 cursor-pointer"
      >
        {getIcon()}
        <span className="text-[10px] font-bold uppercase tracking-wider">
          Editar {label}
        </span>
      </motion.button>
      
    </div>
  );
}