import React from 'react';
import { Link } from 'react-router-dom';
import { Actuacion } from '../../types';

const formatDateToDMY = (dateString: string | null | undefined): string => {
    if (!dateString || !/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
        return dateString || '';
    }
    const [year, month, day] = dateString.split('T')[0].split('-');
    return `${day}-${month}-${year}`;
};

const StatusLabel: React.FC<{ status: Actuacion['status'] }> = ({ status }) => {
    const statusStyles: Record<Actuacion['status'], string> = {
        'En progreso': 'bg-blue-200 text-blue-800 ring-blue-600/20',
        'Completada': 'bg-green-200 text-green-800 ring-green-600/20',
        'En espera': 'bg-yellow-200 text-yellow-800 ring-yellow-600/20',
        'Cancelada': 'bg-red-200 text-red-800 ring-red-600/20',
    };

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ring-1 ring-inset ${statusStyles[status]}`}>
            {status}
        </span>
    );
};


const ActionHeader: React.FC<{ actuacion: Actuacion }> = ({ actuacion }) => {
    return (
        <header className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{actuacion.name}</h1>
                    <div className="mt-2 flex items-center text-gray-500 text-sm gap-4">
                        <Link to={`/airport/${actuacion.airportId}`} className="flex items-center gap-1 hover:text-aena-green">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                           <span>{actuacion.airportName}</span>
                        </Link>
                        <span className="flex items-center gap-1">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
                           <span>Tipo: {actuacion.type}</span>
                        </span>
                    </div>
                </div>
                <div className="flex-shrink-0">
                    <StatusLabel status={actuacion.status} />
                </div>
            </div>
             <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-end text-sm text-gray-600 gap-x-6 gap-y-2">
                <div className="font-medium">
                    Fecha de Inicio: <span className="text-gray-800">{formatDateToDMY(actuacion.startDate)}</span>
                </div>
                <div className="font-medium">
                    Fecha de Fin: <span className="text-gray-800">{formatDateToDMY(actuacion.endDate)}</span>
                </div>
            </div>
        </header>
    );
};

export default ActionHeader;