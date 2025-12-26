'use client';

import dynamic from 'next/dynamic';
import { QuotePDF, QuoteData } from '@/components/pdf/QuotePDF';

const PDFViewer = dynamic(
    () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
    {
        ssr: false,
        loading: () => <p>Loading PDF...</p>,
    }
);

// Sample data matching the new structure
const sampleData: QuoteData = {
    quoteNumber: 'DEV-202512-618',
    quoteDate: '22/12/2025',
    validUntil: '21/01/2026',
    companyName: 'RIVEGO Trade and Marketing Group S.à r.l.-S',
    companyAddress: '7, rue Jean-Pierre Sauvage, L-2514 Kirchberg',
    companyVat: 'LU35916651',
    companyEmail: 'formulaire@webvision.lu',
    clientName: 'Rivego trade & marketing group s.à r.l -s',
    clientCompany: 'Rivego trade & marketing group s.à r.l -s',
    clientAddress: '7, rue jean-pierre sauvage',
    clientEmail: 'contact@laterrazza.lu',
    serviceName: 'WebVision',
    planName: 'Business',
    planDescription: 'Site complet avec fonctionnalités avancées',
    oneTimeItems: [
        { description: 'Site Business', quantity: 1, unitPrice: 599, total: 599 },
        { description: 'Photos en présentiel', quantity: 1, unitPrice: 60, total: 60 },
        { description: 'Menu digital sur le site', quantity: 1, unitPrice: 40, total: 40 },
        { description: 'Site multi-langues', quantity: 1, unitPrice: 30, total: 30 },
        { description: 'Imprimante (reconditionné)', quantity: 1, unitPrice: 150, total: 150 },
        { description: 'Router pour imprimante', quantity: 1, unitPrice: 40, total: 40 },
    ],
    monthlyItems: [
        { description: 'Hébergement & Maintenance (mensuel)', quantity: 1, unitPrice: 25, total: 25 },
        { description: 'Système commande en ligne (mensuel)', quantity: 1, unitPrice: 60, total: 60 },
        { description: 'Retouche photos qualité studio (IA) (mensuel)', quantity: 1, unitPrice: 60, total: 60 },
        { description: 'Réservation de table (mensuel)', quantity: 1, unitPrice: 10, total: 10 },
        { description: 'Chatbot site web (mensuel)', quantity: 1, unitPrice: 25, total: 25 },
        { description: 'Traduction avis & affichage (mensuel)', quantity: 1, unitPrice: 9, total: 9 },
    ],
    oneTimeTotal: 919,
    monthlyTotal: 189,
    vatRate: 17,
    vatAmount: 156.23,
    totalTtc: 1075.23,
    depositPercent: 50,
    depositAmount: 537.62,
    paymentTerms: 'Acompte de 50% (537.62€) à la signature. Solde à la livraison.',
};

export default function PreviewQuotePage() {
    return (
        <div className="h-screen w-screen bg-gray-100 p-8">
            <h1 className="text-2xl font-bold mb-4">Aperçu du Devis (Template)</h1>
            <div className="h-[800px] w-full bg-white shadow-lg rounded-lg overflow-hidden">
                <PDFViewer width="100%" height="100%" className="border-none">
                    <QuotePDF data={sampleData} />
                </PDFViewer>
            </div>
        </div>
    );
}
