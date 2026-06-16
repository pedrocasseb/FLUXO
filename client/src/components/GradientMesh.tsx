import React from 'react';

export const GradientMesh: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-[650px] overflow-hidden z-0 pointer-events-none select-none">
      {/* Background canvas base */}
      <div className="absolute inset-0 bg-[#ffffff] opacity-100" />

      {/* Layered organic blobs */}
      <div className="absolute inset-0 opacity-85 filter blur-[100px] md:blur-[130px]">
        {/* Lemon (Orange Sherbet/Warm Cream) */}
        <div 
          className="absolute -top-[10%] left-[5%] w-[45%] h-[50%] rounded-full bg-[#f5e9d4] opacity-80 animate-blob-1"
          style={{ mixBlendMode: 'multiply' }}
        />

        {/* Sherbet Orange / Pink Accent */}
        <div 
          className="absolute top-[5%] left-[25%] w-[40%] h-[45%] rounded-full bg-[#9b6829] opacity-15 animate-blob-2"
          style={{ mixBlendMode: 'screen' }}
        />

        {/* Electric Indigo */}
        <div 
          className="absolute -top-[15%] left-[40%] w-[50%] h-[60%] rounded-full bg-[#533afd] opacity-35 animate-blob-3"
          style={{ mixBlendMode: 'multiply' }}
        />

        {/* Lavender / Violet */}
        <div 
          className="absolute top-[10%] left-[55%] w-[35%] h-[50%] rounded-full bg-[#b9b9f9] opacity-65 animate-blob-1"
          style={{ mixBlendMode: 'multiply' }}
        />

        {/* Ruby Pink */}
        <div 
          className="absolute -top-[5%] left-[70%] w-[40%] h-[50%] rounded-full bg-[#ea2261] opacity-25 animate-blob-2"
          style={{ mixBlendMode: 'multiply' }}
        />

        {/* Magenta */}
        <div 
          className="absolute top-[15%] left-[80%] w-[30%] h-[40%] rounded-full bg-[#f96bee] opacity-20 animate-blob-3"
          style={{ mixBlendMode: 'screen' }}
        />
      </div>

      {/* Elegant fade grid overlay to anchor the content */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 60%, rgba(255, 255, 255, 1) 100%)'
        }}
      />
    </div>
  );
};
