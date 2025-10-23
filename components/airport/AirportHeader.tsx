import React from 'react';
import { Airport } from '../../types';

interface AirportHeaderProps {
  airport: Airport;
}

const AirportHeader: React.FC<AirportHeaderProps> = ({ airport }) => {
  return (
    <header 
      className="relative h-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden"
    >
      <img 
        src={airport.imageUrl} 
        alt={`Vista aérea de ${airport.name}`}
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      <div className="relative h-full flex flex-col justify-end p-6 text-white">
        <h1 className="text-4xl font-bold drop-shadow-md">{airport.name}</h1>
        <p className="text-lg font-medium text-gray-200 drop-shadow-sm">{airport.iataCode} - {airport.location}</p>
      </div>
    </header>
  );
};

export default AirportHeader;
