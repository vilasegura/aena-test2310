

import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import Card from '../components/ui/Card';

// --- Icon Components ---
// FIX: Explicitly type icon components with React.FC to help TypeScript inference for React.cloneElement.
const CategoryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><circle cx="24" cy="8" r="4"/><circle cx="12" cy="24" r="4"/><circle cx="36" cy="24" r="4"/><circle cx="12" cy="40" r="4"/><circle cx="36" cy="40" r="4"/><path d="M24 12v8m-8 4H16m4-4h8m8 4h-4M12 28v8m24-8v8"/></g></svg>
);
const AttributesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13H42" /><path d="M18 25H42" /><path d="M18 37H42" />
      <circle cx="8" cy="13" r="2" fill="currentColor" /><circle cx="8" cy="25" r="2" fill="currentColor" /><circle cx="8" cy="37" r="2" fill="currentColor" />
    </g>
  </svg>
);
const MappingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="6" width="12" height="12"/><rect x="30" y="6" width="12" height="12"/><rect x="6" y="30" width="12" height="12"/><rect x="30" y="30" width="12" height="12"/>
      <path d="M18 12h12M18 36h12M12 18v12M36 18v12"/>
    </g>
  </svg>
);
const ClipboardListIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 6H11C9.89543 6 9 6.89543 9 8V40C9 41.1046 9.89543 42 11 42H37C38.1046 42 39 41.1046 39 40V8C39 6.89543 38.1046 6 37 6H29" />
      <rect x="19" y="4" width="10" height="4" rx="1" stroke="none" fill="currentColor"/>
      <path d="M21 22h12" />
      <path d="M21 30h12" />
    </g>
  </svg>
);


// --- Reusable Components for this Page ---
const PageHeader = () => (
    <header className="relative h-48 md:h-56 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <img 
            src="https://images.unsplash.com/photo-1542438459-2236873b9512?q=80&w=1200&h=400&auto=format&fit=crop" 
            alt="Aeropuerto Adolfo Suárez Madrid-Barajas"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="relative h-full flex flex-col justify-between p-6 text-white">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold drop-shadow-md">Configuración de requisitos</h1>
                <p className="mt-2 text-md md:text-lg text-gray-200 drop-shadow-sm max-w-4xl">
                    En esta pantalla se configurarán las categorías, los atributos y su mapeo para definir los requisitos de información.
                </p>
            </div>
            <div className="w-full max-w-sm self-end">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-white bg-opacity-80 text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-opacity-100 focus:border-white focus:ring-white sm:text-sm"
                    />
                </div>
            </div>
        </div>
    </header>
);

// FIX: Updated the type of the 'icon' prop to be more specific, which allows React.cloneElement to correctly infer the props and apply the className.
const RequirementCard: React.FC<{ icon: React.ReactElement<React.SVGProps<SVGSVGElement>>; title: string; description: string; colorConfig: any; linkTo?: string; }> = ({ icon, title, description, colorConfig, linkTo }) => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 flex flex-col items-center text-center p-6 space-y-4 h-full hover:shadow-xl transition-shadow duration-300">
        <div className={`w-24 h-24 flex items-center justify-center rounded-lg bg-gray-100 ${colorConfig.icon}`}>
            {React.cloneElement(icon, { className: 'w-12 h-12' })}
        </div>
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 flex-grow min-h-[60px]">{description}</p>
        <div className="mt-auto w-full">
             {linkTo ? (
                <Link to={linkTo} className={`block w-full text-center font-semibold py-2 px-4 rounded-md border-2 transition-colors ${colorConfig.button}`}>
                    VER MÁS
                </Link>
            ) : (
                <button className={`w-full font-semibold py-2 px-4 rounded-md border-2 transition-colors ${colorConfig.button}`}>
                    VER MÁS
                </button>
            )}
        </div>
    </div>
);


const RequirementSection: React.FC<{ title: string; subtitle: string; color: 'green' | 'blue' | 'gray'; cardsData: any[] }> = ({ title, subtitle, color, cardsData }) => {
    const colorConfigs = {
        green: { icon: 'text-aena-green', button: 'border-aena-green text-aena-green hover:bg-green-50 focus:ring-2 focus:ring-green-300' },
        blue: { icon: 'text-sky-600', button: 'border-sky-600 text-sky-600 hover:bg-sky-50 focus:ring-2 focus:ring-sky-300' },
        gray: { icon: 'text-slate-600', button: 'border-slate-600 text-slate-600 hover:bg-slate-50 focus:ring-2 focus:ring-slate-300' }
    };
    const colorConfig = colorConfigs[color];

    return (
        <Card className="!shadow-none border">
            <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                <p className="mt-1 text-gray-500">{subtitle}</p>
            </div>
            <div className="p-6 bg-gray-50 grid grid-cols-1 md:grid-cols-3 gap-6">
                {cardsData.map(card => (
                    <RequirementCard 
                        key={card.title}
                        icon={card.icon}
                        title={card.title}
                        description={card.description}
                        colorConfig={colorConfig}
                        linkTo={card.linkTo}
                    />
                ))}
            </div>
        </Card>
    );
};

// --- Page Data ---
const sectionsData = [
    {
        title: 'Requisitos de Información BIM',
        subtitle: 'Requisitos de información',
        color: 'green',
        cards: [
            { icon: <CategoryIcon />, title: 'Categorías', description: 'Interfaz para llevar a cabo la modificación de las categorías de los requisitos de información BIM.', linkTo: '/requisitos/bim/categorias' },
            { icon: <AttributesIcon />, title: 'Atributos', description: 'Interfaz para llevar a cabo la modificación de los atributos de los requisitos de información BIM.', linkTo: '/requisitos/bim/atributos' },
            { icon: <MappingIcon />, title: 'Mapeo de Categorías y Atributos', description: 'Interfaz para llevar a cabo el mapeo de las categorías y atributos de los requisitos de información BIM.', linkTo: '/requisitos/bim/mapeo' }
        ]
    },
    {
        title: 'Requisitos de Información MAXIMO',
        subtitle: 'Requisitos de información',
        color: 'blue',
        cards: [
            { icon: <CategoryIcon />, title: 'Categorías', description: 'Interfaz para llevar a cabo la modificación de las categorías de los requisitos de información MAXIMO.' },
            { icon: <AttributesIcon />, title: 'Atributos', description: 'Interfaz para llevar a cabo la modificación de los atributos de los requisitos de información MAXIMO.' },
            { icon: <MappingIcon />, title: 'Mapeo de Categorías y Atributos', description: 'Interfaz para llevar a cabo el mapeo de las categorías y atributos de los requisitos de información MAXIMO.' }
        ]
    },
    {
        title: 'Requisitos de Información SAP',
        subtitle: 'Requisitos de información',
        color: 'gray',
        cards: [
            { icon: <CategoryIcon />, title: 'Categorías', description: 'Interfaz para llevar a cabo la modificación de las categorías de los requisitos de información SAP.' },
            { icon: <AttributesIcon />, title: 'Atributos', description: 'Interfaz para llevar a cabo la modificación de los atributos de los requisitos de información SAP.' },
            { icon: <MappingIcon />, title: 'Mapeo de Categorías y Atributos', description: 'Interfaz para llevar a cabo el mapeo de las categorías y atributos de los requisitos de información SAP.' }
        ]
    }
];

// --- Main Page Component ---
const InformationRequirementsPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Requisitos de Información' }]} />
            <PageHeader />
            <div className="space-y-8">
                {sectionsData.map(section => (
                    <RequirementSection
                        key={section.title}
                        title={section.title}
                        subtitle={section.subtitle}
                        color={section.color as 'green' | 'blue' | 'gray'}
                        cardsData={section.cards}
                    />
                ))}
                 <Card className="!shadow-none border">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold text-gray-800">Listado de Actuaciones</h2>
                        <p className="mt-1 text-gray-500">Consulta y gestión de actuaciones en la red de aeropuertos.</p>
                    </div>
                    <div className="p-6 bg-gray-50">
                        <Link to="/actuaciones" className="block bg-white rounded-lg shadow-md border border-gray-200 flex flex-col md:flex-row items-center p-6 space-y-4 md:space-y-0 md:space-x-6 h-full hover:shadow-xl transition-shadow duration-300 group">
                            <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center rounded-lg bg-gray-100 text-sky-600">
                                <ClipboardListIcon className="w-12 h-12" />
                            </div>
                            <div className="text-center md:text-left">
                                <h3 className="text-lg font-bold text-gray-800">Ver Actuaciones</h3>
                                <p className="text-sm text-gray-600 mt-1">Accede al listado completo de actuaciones para ver su estado y detalles.</p>
                                <span className="mt-4 inline-block font-semibold text-sky-600 group-hover:underline">
                                    Acceder al listado &rarr;
                                </span>
                            </div>
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default InformationRequirementsPage;