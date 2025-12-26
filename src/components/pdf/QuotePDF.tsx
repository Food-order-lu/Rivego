'use client';

import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer';

// Types for quote data
export interface QuoteLineItem {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface QuoteData {
    quoteNumber: string;
    quoteDate: string;
    validUntil: string;
    // Company
    companyName: string;
    companyAddress: string;
    companyVat: string;
    companyEmail: string;
    // Client
    clientName: string;
    clientCompany: string;
    clientAddress: string;
    clientEmail: string;
    clientPhone?: string;
    clientVat?: string;
    // Service
    serviceName: string;
    planName: string;
    planDescription: string;
    // Line Items - separated
    oneTimeItems: QuoteLineItem[];
    monthlyItems: QuoteLineItem[];
    // Totals
    oneTimeTotal: number;
    monthlyTotal: number;
    vatRate: number;
    vatAmount: number;
    totalTtc: number;
    depositPercent: number;
    depositAmount: number;
    // Meta
    notes?: string;
    paymentTerms: string;
    signatureImage?: string;
    signedDate?: string;
}

// Styles matching the uploaded design
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 9,
        fontFamily: 'Helvetica',
        backgroundColor: '#FFFFFF',
    },
    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#1A3A5C',
    },
    logo: {
        fontSize: 24,
        fontFamily: 'Helvetica-Bold',
        color: '#1A3A5C',
    },
    logoSubtitle: {
        fontSize: 8,
        color: '#0D7377',
        letterSpacing: 2,
        marginTop: 2,
    },
    quoteInfo: {
        textAlign: 'right',
    },
    quoteTitle: {
        fontSize: 18,
        fontFamily: 'Helvetica-Bold',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    quoteNumber: {
        fontSize: 9,
        color: '#666666',
    },
    quoteDate: {
        fontSize: 8,
        color: '#666666',
        marginTop: 2,
    },

    // Parties section
    partiesSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    partyBox: {
        width: '48%',
        padding: 12,
        backgroundColor: '#F5F7FA',
        borderRadius: 4,
    },
    partyTitle: {
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        color: '#0D7377',
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    partyName: {
        fontSize: 11,
        fontFamily: 'Helvetica-Bold',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    partyDetail: {
        fontSize: 8,
        color: '#666666',
        marginBottom: 2,
    },

    // Service banner
    serviceBox: {
        padding: 12,
        backgroundColor: '#1A3A5C',
        borderRadius: 4,
        marginBottom: 15,
    },
    serviceName: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
        color: '#FFFFFF',
    },
    serviceDescription: {
        fontSize: 9,
        color: '#FFFFFF',
        opacity: 0.85,
        marginTop: 2,
    },

    // Section title
    sectionTitle: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: '#1A3A5C',
        marginBottom: 8,
        marginTop: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    // Table
    table: {
        marginBottom: 8,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#1A3A5C',
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    tableHeaderText: {
        color: '#FFFFFF',
        fontFamily: 'Helvetica-Bold',
        fontSize: 8,
        textTransform: 'uppercase',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    tableRowAlt: {
        backgroundColor: '#FAFAFA',
    },
    colDescription: { width: '50%' },
    colQty: { width: '15%', textAlign: 'center' },
    colPrice: { width: '17.5%', textAlign: 'right' },
    colTotal: { width: '17.5%', textAlign: 'right' },
    cellText: {
        fontSize: 9,
        color: '#333333',
    },
    cellTextBold: {
        fontSize: 9,
        color: '#333333',
        fontFamily: 'Helvetica-Bold',
    },

    // Table totals row
    tableTotalRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    tableTotalLabel: {
        fontSize: 9,
        color: '#666666',
        marginRight: 20,
    },
    tableTotalValue: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: '#1A3A5C',
    },
    monthlyTotalValue: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: '#0D7377',
    },

    // Bottom section
    bottomSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },

    // Terms on left
    termsSection: {
        width: '48%',
    },
    termsBox: {
        padding: 12,
        backgroundColor: '#F5F7FA',
        borderRadius: 4,
    },
    termsTitle: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: '#1A1A1A',
        marginBottom: 6,
    },
    termsText: {
        fontSize: 8,
        color: '#666666',
        lineHeight: 1.5,
    },

    // Totals on right
    totalsSection: {
        width: '48%',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    totalLabel: {
        fontSize: 9,
        color: '#666666',
    },
    totalValue: {
        fontSize: 9,
        color: '#333333',
        fontFamily: 'Helvetica-Bold',
    },
    grandTotalRow: {
        backgroundColor: '#1A3A5C',
        borderRadius: 4,
        marginTop: 4,
        paddingVertical: 10,
    },
    grandTotalLabel: {
        fontSize: 10,
        color: '#FFFFFF',
        fontFamily: 'Helvetica-Bold',
    },
    grandTotalValue: {
        fontSize: 14,
        color: '#FFFFFF',
        fontFamily: 'Helvetica-Bold',
    },
    depositRow: {
        backgroundColor: '#E8F4F4',
        borderRadius: 4,
        marginTop: 4,
    },
    depositLabel: {
        fontSize: 9,
        color: '#0D7377',
        fontFamily: 'Helvetica-Bold',
    },
    depositValue: {
        fontSize: 10,
        color: '#0D7377',
        fontFamily: 'Helvetica-Bold',
    },

    // Signature section
    signatureSection: {
        marginTop: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    signatureBox: {
        width: '45%',
    },
    signatureLabel: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: '#333333',
        marginBottom: 4,
    },
    signatureLine: {
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
        height: 40,
        marginBottom: 4,
    },
    signatureNote: {
        fontSize: 7,
        color: '#999999',
    },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 30,
        right: 30,
        textAlign: 'center',
        color: '#999999',
        fontSize: 7,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
});

// Quote PDF Document Component
export const QuotePDF = ({ data }: { data: QuoteData }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.logo}>RIVEGO</Text>
                    <Text style={styles.logoSubtitle}>T&M GROUP</Text>
                </View>
                <View style={styles.quoteInfo}>
                    <Text style={styles.quoteTitle}>DEVIS</Text>
                    <Text style={styles.quoteNumber}>N° {data.quoteNumber}</Text>
                    <Text style={styles.quoteDate}>Date: {data.quoteDate}</Text>
                    <Text style={styles.quoteDate}>Valide jusqu&apos;au: {data.validUntil}</Text>
                </View>
            </View>

            {/* Parties */}
            <View style={styles.partiesSection}>
                <View style={styles.partyBox}>
                    <Text style={styles.partyTitle}>De</Text>
                    <Text style={styles.partyName}>{data.companyName}</Text>
                    <Text style={styles.partyDetail}>{data.companyAddress}</Text>
                    <Text style={styles.partyDetail}>{data.companyEmail}</Text>
                </View>

                <View style={styles.partyBox}>
                    <Text style={styles.partyTitle}>À</Text>
                    <Text style={styles.partyName}>{data.clientCompany}</Text>
                    <Text style={styles.partyDetail}>{data.clientName}</Text>
                    <Text style={styles.partyDetail}>{data.clientAddress}</Text>
                    <Text style={styles.partyDetail}>{data.clientEmail}</Text>
                </View>
            </View>

            {/* Service Banner */}
            <View style={styles.serviceBox}>
                <Text style={styles.serviceName}>{data.serviceName} - {data.planName}</Text>
                <Text style={styles.serviceDescription}>{data.planDescription}</Text>
            </View>

            {/* One-Time Items Table */}
            <Text style={styles.sectionTitle}>Frais Uniques (Installation & Setup)</Text>
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, styles.colDescription]}>Description</Text>
                    <Text style={[styles.tableHeaderText, styles.colQty]}>Qté</Text>
                    <Text style={[styles.tableHeaderText, styles.colPrice]}>Prix Unit.</Text>
                    <Text style={[styles.tableHeaderText, styles.colTotal]}>Total</Text>
                </View>

                {data.oneTimeItems.map((item, index) => (
                    <View key={index} style={[styles.tableRow, index % 2 !== 0 ? styles.tableRowAlt : {}]}>
                        <Text style={[styles.cellText, styles.colDescription]}>{item.description}</Text>
                        <Text style={[styles.cellText, styles.colQty]}>{item.quantity}</Text>
                        <Text style={[styles.cellText, styles.colPrice]}>{item.unitPrice.toFixed(2)} €</Text>
                        <Text style={[styles.cellTextBold, styles.colTotal]}>{item.total.toFixed(2)} €</Text>
                    </View>
                ))}

                <View style={styles.tableTotalRow}>
                    <Text style={styles.tableTotalLabel}>Total Unique HT:</Text>
                    <Text style={styles.tableTotalValue}>{data.oneTimeTotal.toFixed(2)} €</Text>
                </View>
            </View>

            {/* Monthly Items Table */}
            <Text style={styles.sectionTitle}>Frais Mensuels (Récurrents)</Text>
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, styles.colDescription]}>Description</Text>
                    <Text style={[styles.tableHeaderText, styles.colQty]}>Qté</Text>
                    <Text style={[styles.tableHeaderText, styles.colPrice]}>Prix Unit.</Text>
                    <Text style={[styles.tableHeaderText, styles.colTotal]}>Total</Text>
                </View>

                {data.monthlyItems.map((item, index) => (
                    <View key={index} style={[styles.tableRow, index % 2 !== 0 ? styles.tableRowAlt : {}]}>
                        <Text style={[styles.cellText, styles.colDescription]}>{item.description}</Text>
                        <Text style={[styles.cellText, styles.colQty]}>{item.quantity}</Text>
                        <Text style={[styles.cellText, styles.colPrice]}>{item.unitPrice.toFixed(2)} €</Text>
                        <Text style={[styles.cellTextBold, styles.colTotal]}>{item.total.toFixed(2)} €</Text>
                    </View>
                ))}

                <View style={styles.tableTotalRow}>
                    <Text style={styles.tableTotalLabel}>Total Mensuel:</Text>
                    <Text style={styles.monthlyTotalValue}>{data.monthlyTotal.toFixed(2)} € / mois</Text>
                </View>
            </View>

            {/* Bottom Section: Terms + Totals */}
            <View style={styles.bottomSection}>
                {/* Terms */}
                <View style={styles.termsSection}>
                    <View style={styles.termsBox}>
                        <Text style={styles.termsTitle}>Conditions de paiement</Text>
                        <Text style={styles.termsText}>{data.paymentTerms}</Text>
                        <Text style={[styles.termsText, { marginTop: 8, fontStyle: 'italic' }]}>
                            TVA au taux de {data.vatRate}% comprise.
                        </Text>
                    </View>
                </View>

                {/* Totals */}
                <View style={styles.totalsSection}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Sous-total Unique HT</Text>
                        <Text style={styles.totalValue}>{data.oneTimeTotal.toFixed(2)} €</Text>
                    </View>

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>TVA ({data.vatRate}%)</Text>
                        <Text style={styles.totalValue}>{data.vatAmount.toFixed(2)} €</Text>
                    </View>

                    <View style={[styles.totalRow, styles.grandTotalRow]}>
                        <Text style={styles.grandTotalLabel}>TOTAL UNIQUE TTC</Text>
                        <Text style={styles.grandTotalValue}>{data.totalTtc.toFixed(2)} €</Text>
                    </View>

                    <View style={[styles.totalRow, styles.depositRow]}>
                        <Text style={styles.depositLabel}>Acompte {data.depositPercent}%</Text>
                        <Text style={styles.depositValue}>{data.depositAmount.toFixed(2)} €</Text>
                    </View>
                </View>
            </View>

            {/* Signature */}
            <View style={styles.signatureSection}>
                <View style={styles.signatureBox}>
                    <Text style={styles.signatureLabel}>Signature client</Text>
                    {data.signatureImage ? (
                        <View style={{ height: 40, marginBottom: 4 }}>
                            <Image src={data.signatureImage} style={{ height: 35, objectFit: 'contain' }} />
                        </View>
                    ) : (
                        <View style={styles.signatureLine} />
                    )}
                    {data.signedDate ? (
                        <Text style={styles.signatureNote}>Signé le {data.signedDate}</Text>
                    ) : (
                        <Text style={styles.signatureNote}>Date et signature &quot;Bon pour accord&quot;</Text>
                    )}
                </View>

                <View style={styles.signatureBox}>
                    <Text style={styles.signatureLabel}>Pour RIVEGO T&M Group</Text>
                    <View style={styles.signatureLine} />
                    <Text style={styles.signatureNote}>Commercial autorisé</Text>
                </View>
            </View>

            {/* Footer */}
            <Text style={styles.footer}>
                RIVEGO T&M Group | Luxembourg | formulaire@webvision.lu
            </Text>
        </Page>
    </Document>
);

// Utility to generate PDF blob
export const generateQuotePDF = async (data: QuoteData): Promise<Blob> => {
    const blob = await pdf(<QuotePDF data={data} />).toBlob();
    return blob;
};

export { pdf as PDFRenderer };
