'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
    CheckCircle,
    Download,
    FileText,
    Clock,
    Loader2,
    Smartphone,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { DocusealForm } from '@docuseal/react';

// Demo quote data - in production, this would come from a database/API
const demoQuote = {
    id: 'DEV-202412-001',
    createdAt: '18/12/2024',
    validUntil: '18/01/2025',
    status: 'pending',
    company: {
        name: 'RIVEGO Trade and Marketing Group S.à r.l.-S',
        address: '7, rue Jean-Pierre Sauvage, L-2514 Kirchberg',
        email: 'formulaire@webvision.lu',
    },
    client: {
        name: 'Jean Dupont',
        company: 'Restaurant Le Gourmet',
        address: '123 Rue de la Gare, L-1234 Luxembourg',
        email: 'contact@legourmet.lu',
        phone: '+352 123 456 789',
    },
    service: {
        name: 'WebVision',
        plan: 'Business',
        description: 'Site complet avec fonctionnalités avancées',
    },
    items: [
        { description: 'Site Business', quantity: 1, price: 599, total: 599 },
        { description: 'Hébergement & Maintenance (mensuel)', quantity: 1, price: 25, total: 25 },
    ],
    subtotal: 624,
    discountPercent: 0,
    discountAmount: 0,
    total: 624,
    monthlyTotal: 25, // Mock monthly total if needed
};

// Define Quote type locally if not imported or ensure flexible type
type Quote = typeof demoQuote;

export default function SignQuoteClient({ demoQuote: initialQuote }: { demoQuote?: Quote }) {
    const params = useParams();
    const quoteId = params.id as string;

    const [quote] = useState(initialQuote || demoQuote);
    const [signed, setSigned] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showMobileModal, setShowMobileModal] = useState(false);
    const [currentUrl, setCurrentUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentUrl(window.location.href);
        }
    }, []);

    // Using direct link as requested by user snippet
    const docuSealSrc = "https://docuseal.com/d/NaZif3BS7bNSkn";

    const handleSignComplete = (data: any) => {
        console.log('Signature completed:', data);

        setSigned(true);
        // In real app: call API to update quote status to "signed"
    };

    const handleDownloadContract = async () => {
        const { generateContractPDF } = await import('@/components/pdf/ContractPDF');

        // Calculate detailed financials
        const totalHt = quote.total;
        const vatRate = 0.17;
        const vatAmount = totalHt * vatRate;
        const totalTtc = totalHt + vatAmount;

        const monthlyHt = 25.00;
        const monthlyTtc = monthlyHt * 1.17;

        // Mock data mapping - in real app this comes from DB
        const contractData = {
            // Prestataire
            companyName: quote.company.name,
            companyAddress: quote.company.address,
            companyRcs: 'B225678', // Mock RCS
            companyVat: 'LU35916651',
            companyEmail: 'contact@rivego.lu',
            companyPhone: '+352 691 123 456',

            // Client
            clientType: 'Professionnel',
            clientCompany: quote.client.company,
            clientName: quote.client.name,
            clientAddress: quote.client.address,
            clientEmail: quote.client.email,
            clientPhone: '+352 691 999 999', // Mock phone
            clientVat: 'LU12345678', // Mock VAT

            // Service
            serviceName: quote.service.name,
            planName: quote.service.plan,
            planDescription: 'Site vitrine professionnel, responsive design, formulaire de contact, optimisation SEO de base.',

            // Financials
            oneTimeTotal: totalHt.toFixed(2),
            oneTimeAmountTtc: totalTtc.toFixed(2),
            monthlyAmount: monthlyHt.toFixed(2),
            monthlyAmountTtc: monthlyTtc.toFixed(2),

            // Discounts
            discountPercent: 0,
            discountEuros: 0,
            discountAmount: '0.00',

            // Payment Terms
            paymentTerms: 'Virement bancaire',
            depositPercentage: 20,
            depositAmount: (totalTtc * 0.20).toFixed(2),
            customPaymentTerms: undefined,

            // Meta
            contractNumber: quote.id,
            notes: 'Aucune note complémentaire.',
            signedDate: new Date().toLocaleDateString('fr-FR'),
            signatureImage: undefined, // DocuSeal handles signature visual in their doc, this is for our generated copy
        };

        const blob = await generateContractPDF(contractData);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contrat-${quote.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (signed) {
        return (
            <section className="min-h-screen flex items-center justify-center py-32 bg-gray-50">
                <div className="container mx-auto px-6 text-center max-w-lg">
                    <div className="inline-flex p-6 rounded-full bg-green-100 mb-8">
                        <CheckCircle size={64} className="text-green-600" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4 text-gray-900">Devis signé !</h1>
                    <p className="text-gray-600 text-lg mb-8">
                        Merci ! Votre devis N° {quote.id} a été signé avec succès via DocuSeal.
                        Vous recevrez une copie par email.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        <button onClick={handleDownloadContract} className="btn btn-primary">
                            <FileText size={20} />
                            Télécharger mon contrat
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen pt-32 pb-12 bg-gray-50">
            {showMobileModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowMobileModal(false)}>
                    <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-8 text-center" onClick={e => e.stopPropagation()}>
                        <div className="mb-6">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Smartphone size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Signer sur mobile</h3>
                            <p className="text-gray-500 mt-2">Scannez ce QR code pour ouvrir le contrat sur votre smartphone.</p>
                        </div>

                        <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-200 inline-block mb-6">
                            <QRCodeSVG value={currentUrl} size={200} />
                        </div>

                        <button
                            onClick={() => setShowMobileModal(false)}
                            className="w-full btn btn-secondary"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-6 max-w-4xl">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Signer votre devis</h1>
                        <p className="text-gray-500">Devis N° {quote.id}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowMobileModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
                        >
                            <Smartphone size={16} />
                            Signer sur mobile
                        </button>
                        <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium">
                            <Clock size={16} />
                            Expire le {quote.validUntil}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Simplified Recap */}
                    <div className="card h-fit">
                        <h2 className="text-xl font-semibold mb-6">Récapitulatif</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Client</span>
                                <span className="font-medium text-right">{quote.client.company}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Service</span>
                                <span className="font-medium">{quote.service.name} - {quote.service.plan}</span>
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex justify-between text-2xl font-bold text-[#0D7377]">
                                    <span>Total TTC</span>
                                    <span>{(quote.total * 1.17).toFixed(2)} €</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Dont TVA (17%) : {(quote.total * 0.17).toFixed(2)} €</p>
                            </div>
                        </div>
                    </div>

                    {/* DocuSeal Form */}
                    <div className="card min-h-[400px] flex items-center justify-center bg-white p-0 overflow-hidden relative">
                        {error && (
                            <div className="p-8 text-center text-red-500">
                                <p>Erreur: {error}</p>
                            </div>
                        )}

                        {!error && (
                            <div className="w-full h-full min-h-[600px]">
                                <DocusealForm
                                    src={docuSealSrc}
                                    email={quote.client.email}
                                    onComplete={handleSignComplete}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
