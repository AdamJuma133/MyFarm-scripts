import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Share2, Copy, Download, Mail, MessageCircle, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ScanData {
  id: string;
  disease_name: string;
  crop_type: string | null;
  confidence: number | null;
  created_at: string;
  scan_type: string | null;
  image_url?: string | null;
  treatment_recommendations?: string[] | null;
}

interface ShareScanDialogProps {
  scan: ScanData;
  children?: React.ReactNode;
}

export function ShareScanDialog({ scan, children }: ShareScanDialogProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const getScanSummary = () => {
    const date = new Date(scan.created_at).toLocaleDateString();
    const isHealthy = scan.scan_type === 'healthy' || scan.disease_name === 'Healthy';
    
    let summary = `🌾 MyFarm Scan Report\n`;
    summary += `━━━━━━━━━━━━━━━━━\n`;
    summary += `📅 Date: ${date}\n`;
    if (scan.crop_type) summary += `🌱 Crop: ${scan.crop_type}\n`;
    summary += `🔬 Result: ${isHealthy ? '✅ Healthy' : `⚠️ ${scan.disease_name}`}\n`;
    if (scan.confidence) summary += `📊 Confidence: ${Math.round(scan.confidence)}%\n`;
    
    if (!isHealthy && scan.treatment_recommendations?.length) {
      summary += `\n💊 Treatment Recommendations:\n`;
      scan.treatment_recommendations.forEach((rec, i) => {
        summary += `${i + 1}. ${rec}\n`;
      });
    }
    
    summary += `\n━━━━━━━━━━━━━━━━━\n`;
    summary += `Analyzed with MyFarm AI`;
    
    return summary;
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getScanSummary());
      setCopied(true);
      toast.success(t('share.copied', 'Copied to clipboard'));
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error(t('share.copyFailed', 'Failed to copy'));
    }
  };

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MyFarm Scan Report',
          text: getScanSummary(),
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error(t('share.shareFailed', 'Failed to share'));
        }
      }
    } else {
      handleCopyToClipboard();
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent('MyFarm Scan Report');
    const body = encodeURIComponent(getScanSummary());
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(getScanSummary());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const generatePDF = async () => {
    setExporting(true);
    try {
      // Create a simple HTML content for the PDF
      const date = new Date(scan.created_at).toLocaleDateString();
      const isHealthy = scan.scan_type === 'healthy' || scan.disease_name === 'Healthy';
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>MyFarm Scan Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px; }
            .info-row { margin: 15px 0; padding: 10px; background: #f3f4f6; border-radius: 8px; }
            .label { font-weight: bold; color: #374151; }
            .healthy { color: #16a34a; font-weight: bold; }
            .diseased { color: #dc2626; font-weight: bold; }
            .recommendations { margin-top: 20px; }
            .recommendations h3 { color: #374151; }
            .recommendations ol { padding-left: 20px; }
            .recommendations li { margin: 8px 0; }
            .footer { margin-top: 40px; text-align: center; color: #9ca3af; font-size: 12px; }
            ${scan.image_url ? '.scan-image { max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0; }' : ''}
          </style>
        </head>
        <body>
          <h1>🌾 MyFarm Scan Report</h1>
          
          ${scan.image_url ? `<img src="${scan.image_url}" alt="Scan image" class="scan-image" />` : ''}
          
          <div class="info-row">
            <span class="label">📅 Date:</span> ${date}
          </div>
          
          ${scan.crop_type ? `
          <div class="info-row">
            <span class="label">🌱 Crop:</span> ${scan.crop_type}
          </div>
          ` : ''}
          
          <div class="info-row">
            <span class="label">🔬 Result:</span> 
            <span class="${isHealthy ? 'healthy' : 'diseased'}">
              ${isHealthy ? '✅ Healthy' : `⚠️ ${scan.disease_name}`}
            </span>
          </div>
          
          ${scan.confidence ? `
          <div class="info-row">
            <span class="label">📊 Confidence:</span> ${Math.round(scan.confidence)}%
          </div>
          ` : ''}
          
          ${!isHealthy && scan.treatment_recommendations?.length ? `
          <div class="recommendations">
            <h3>💊 Treatment Recommendations</h3>
            <ol>
              ${scan.treatment_recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ol>
          </div>
          ` : ''}
          
          <div class="footer">
            <p>Report generated by MyFarm AI</p>
            <p>© ${new Date().getFullYear()} MyFarm - Empowering farmers with AI technology</p>
          </div>
        </body>
        </html>
      `;

      // Open print dialog with the content
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        
        // Wait for images to load before printing
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }
      
      toast.success(t('share.pdfReady', 'PDF ready for download'));
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error(t('share.pdfFailed', 'Failed to generate PDF'));
    } finally {
      setExporting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="h-10 touch-manipulation">
            <Share2 className="h-4 w-4 mr-2" />
            {t('share.share', 'Share')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('share.shareResults', 'Share Scan Results')}</DialogTitle>
          <DialogDescription>
            {t('share.shareDescription', 'Share this scan report with other farmers or export as PDF')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Preview */}
          <div className="p-3 bg-muted rounded-lg text-sm font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
            {getScanSummary()}
          </div>

          {/* Share buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={handleCopyToClipboard}
              className="h-11 touch-manipulation"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  {t('share.copied', 'Copied!')}
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  {t('share.copy', 'Copy')}
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleShareNative}
              className="h-11 touch-manipulation"
            >
              <Share2 className="h-4 w-4 mr-2" />
              {t('share.share', 'Share')}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleEmailShare}
              className="h-11 touch-manipulation"
            >
              <Mail className="h-4 w-4 mr-2" />
              {t('share.email', 'Email')}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleWhatsAppShare}
              className="h-11 touch-manipulation"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          </div>

          {/* Export PDF */}
          <Button
            onClick={generatePDF}
            disabled={exporting}
            className="w-full h-11 touch-manipulation"
          >
            {exporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t('share.generating', 'Generating...')}
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                {t('share.exportPDF', 'Export as PDF')}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}