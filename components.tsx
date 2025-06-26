import React, { useState, useCallback, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { XIcon, UploadIcon, CheckCircleIcon, LightBulbIcon, ExclamationTriangleIcon } from './assets';
import { SpendingTipResponse } from './types';
import { getSpendingTip as fetchSpendingTip, importTransactions, parseCSVTransactions } from './services';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({ title, onClose, children, maxWidth = 'max-w-lg' }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className={`bg-neutral-000 rounded-lg shadow-popover w-full ${maxWidth} transform transition-all overflow-hidden`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h3 className="text-base font-medium text-navy">{title}</h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-navy transition-colors rounded-full p-1 hover:bg-neutral-100"
            aria-label="Close modal"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 sm:p-5">{children}</div>
      </div>
    </div>
  );
};

interface LoadingSpinnerProps { className?: string; size?: 'sm' | 'md' | 'lg'; }
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className, size = 'md' }) => {
  const sizeClasses = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' };
  return (
    <svg className={`animate-spin text-teal ${sizeClasses[size]} ${className || ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
};

const PIE_COLORS = ['#6F9F9F', '#1C2C65', '#5BAB9C', '#04102D', '#C5D6D6', '#E5F3EE', '#969BA7'];

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  return (
    <g>
      <text x={cx} y={cy - 5} dy={8} textAnchor="middle" fill={fill} className="font-medium text-sm">
        {payload.name}
      </text>
       <text x={cx} y={cy + 15} dy={8} textAnchor="middle" fill={fill} className="font-semibold text-lg">
        {`₹${value.toLocaleString()}`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cornerRadius={2}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 3}
        outerRadius={outerRadius + 6}
        fill={fill}
        cornerRadius={2}
      />
    </g>
  );
};

export const PieChartComponent: React.FC<{ data: { name: string; value: number }[], chartType?: 'pie' | 'bar' }> = ({ data, chartType = 'pie' }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback((_:any, index: number) => {
    setActiveIndex(index);
  }, []);

  if (!data || data.length === 0) {
    return <p className="text-center text-neutral-500 py-10 text-xs">No data for chart.</p>;
  }
  
  // For Bar chart
  if (chartType === 'bar') {
    const barData = [
        { name: 'Jan', ExpectedIncome: 1200 }, { name: 'Feb', ExpectedIncome: 1000 },
        { name: 'Mar', ExpectedIncome: 1500 }, { name: 'Apr', ExpectedIncome: 1300 },
        { name: 'May', ExpectedIncome: 1753 }, { name: 'Jun', ExpectedIncome: 1400 },
    ];
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 5, right: 0, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} vertical={false} stroke="#DADDE2" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6E7380' }} axisLine={{ stroke: '#DADDE2' }} tickLine={{ stroke: '#DADDE2' }} />
                <YAxis tick={{ fontSize: 10, fill: '#6E7380' }} axisLine={{ stroke: '#DADDE2' }} tickLine={{ stroke: '#DADDE2' }} />
                <Tooltip
                    cursor={{ fill: 'rgba(111,159,159,0.1)' }}
                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #DADDE2', borderRadius: '12px', boxShadow: '0 2px 6px rgba(4,16,45,0.06)', fontSize: '12px' }}
                    labelStyle={{ color: '#04102D', fontWeight: 500 }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, "Income"]}
                />
                <Bar dataKey="ExpectedIncome" radius={[2, 2, 0, 0]} barSize={20}>
                    {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.name === 'May' ? '#6F9F9F' : 'rgba(111,159,159,0.2)'} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={60} 
          outerRadius={90} 
          fill="#6F9F9F"
          dataKey="value"
          onMouseEnter={onPieEnter}
          paddingAngle={2}
          cornerRadius={2}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} strokeWidth={0} />
          ))}
        </Pie>
        <Tooltip 
            formatter={(value: number) => `₹${value.toFixed(2)}`} 
            wrapperClassName="!rounded-md !shadow-card !bg-neutral-000/80 !backdrop-blur-sm !border-neutral-200"
            contentStyle={{ borderRadius: '8px', fontSize: '12px' }} itemStyle={{padding:0}} labelStyle={{marginBottom:'2px', fontSize:'10px'}}
        />
        <Legend 
            iconSize={8} 
            iconType="circle"
            wrapperStyle={{ fontSize: '11px', paddingTop: '10px', color: '#6E7380' }} 
            verticalAlign="bottom"
            align="center"
            layout="horizontal"
            formatter={(value) => <span className="text-neutral-500">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

interface ImportModalContentProps { onClose: () => void; }
export const ImportModalContent: React.FC<ImportModalContentProps> = ({ onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<'pdf' | 'json' | 'csv'>('csv');
  const [password, setPassword] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) { 
      const selectedFile = event.target.files[0];
      setFile(selectedFile); 
      setFeedback(null);
      
      // Parse CSV for preview
      if (importType === 'csv') {
        try {
          const text = await selectedFile.text();
          const response = await parseCSVTransactions(text);
          setPreviewData(response.preview || []);
        } catch (error) {
          console.error('CSV parsing error:', error);
          setPreviewData([]);
        }
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) { 
      setFeedback({ type: 'error', message: 'Please select a file.' }); 
      return; 
    }
    
    setIsProcessing(true); 
    setFeedback(null);
    
    try {
      let transactions: any[] = [];
      
      if (importType === 'csv') {
        const text = await file.text();
        const response = await parseCSVTransactions(text);
        transactions = response.transactions;
      } else {
        // For PDF and JSON, we'll use mock data for now
        // In a real implementation, you'd parse these file types
        transactions = [
          {
            date: new Date().toISOString(),
            description: 'Sample Transaction',
            merchant: 'Sample Merchant',
            amount: 100.00,
            type: 'expense'
          }
        ];
      }
      
      if (transactions.length === 0) {
        setFeedback({ type: 'error', message: 'No valid transactions found in file.' });
        return;
      }
      
      const result = await importTransactions(transactions, `${importType.toUpperCase()} Import`);
      
      setFeedback({ 
        type: 'success', 
        message: `Imported ${file.name}. ${result.results.success.length} successful, ${result.results.errors.length} failed.` 
      });
      
      setTimeout(onClose, 2000);
      
    } catch (error: any) {
      console.error('Import error:', error);
      setFeedback({ 
        type: 'error', 
        message: `Failed to import ${file.name}: ${error.message}` 
      });
    } finally {
      setIsProcessing(false);
      if (feedback?.type === 'success') {
        setFile(null);
        setPassword('');
        setPreviewData([]);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="importType" className="block text-xs font-medium text-neutral-500 mb-1">Type</label>
        <select id="importType" value={importType} onChange={(e) => setImportType(e.target.value as any)}
          className="mt-1 block w-full pl-3 pr-8 py-2 text-sm border-neutral-200 focus:outline-none focus:ring-1 focus:ring-teal focus:border-teal rounded-md bg-neutral-000 text-navy shadow-sm">
          <option value="pdf">PDF Statement</option>
          <option value="json">JSON Export</option>
          <option value="csv">CSV File</option>
        </select>
      </div>

      <div>
        <label htmlFor="file" className="block text-xs font-medium text-neutral-500 mb-1">File</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-200 border-dashed rounded-md hover:border-teal transition-colors">
          <div className="space-y-1 text-center">
            <UploadIcon className="mx-auto h-12 w-12 text-neutral-400" />
            <div className="flex text-sm text-neutral-500">
              <label htmlFor="file-upload" className="relative cursor-pointer bg-neutral-000 rounded-md font-medium text-teal hover:text-teal/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal">
                <span>Upload a file</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept={importType === 'pdf' ? '.pdf' : importType === 'json' ? '.json' : '.csv,.txt'} />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-neutral-500">PDF, JSON, or CSV up to 10MB</p>
          </div>
        </div>
        {file && (
          <div className="mt-2 flex items-center text-sm text-neutral-500">
            <CheckCircleIcon className="w-4 h-4 text-success-green mr-2" />
            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}
      </div>

      {importType === 'pdf' && (
        <div>
          <label htmlFor="password" className="block text-xs font-medium text-neutral-500 mb-1">Password (if required)</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-neutral-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal focus:border-teal text-sm" placeholder="Enter PDF password" />
        </div>
      )}

      {previewData.length > 0 && (
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">Preview ({previewData.length} transactions)</label>
          <div className="mt-1 max-h-32 overflow-y-auto border border-neutral-200 rounded-md p-2 bg-neutral-050">
            <table className="w-full text-xs">
              <thead className="text-left">
                <tr className="text-neutral-500">
                  <th className="py-1">Date</th>
                  <th className="py-1">Description</th>
                  <th className="py-1 text-right">Amount</th>
                  <th className="py-1">Type</th>
                </tr>
              </thead>
              <tbody>
                {previewData.map((tx, index) => (
                  <tr key={index} className="border-t border-neutral-200">
                    <td className="py-1 text-neutral-600">{tx.date || 'N/A'}</td>
                    <td className="py-1 text-neutral-600 truncate max-w-24">{tx.description || tx.merchant || 'N/A'}</td>
                    <td className="py-1 text-right text-neutral-600">₹{tx.amount?.toFixed(2) || 'N/A'}</td>
                    <td className="py-1 text-neutral-600 capitalize">{tx.type || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {feedback && (
        <div className={`p-3 rounded-md text-sm ${feedback.type === 'success' ? 'bg-mint text-success-green' : 'bg-error-red/10 text-error-red'}`}>
          {feedback.type === 'success' ? <CheckCircleIcon className="w-4 h-4 inline mr-2" /> : <ExclamationTriangleIcon className="w-4 h-4 inline mr-2" />}
          {feedback.message}
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-3 border-t border-neutral-200">
        <button type="button" onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-navy bg-neutral-100 hover:bg-neutral-200 rounded-md shadow-sm transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={!file || isProcessing}
          className="px-5 py-2 text-sm font-medium text-neutral-000 bg-teal hover:bg-teal/80 disabled:bg-neutral-300 disabled:cursor-not-allowed rounded-md shadow-sm transition-colors flex items-center">
          {isProcessing ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Processing...
            </>
          ) : (
            'Import Transactions'
          )}
        </button>
      </div>
    </form>
  );
};

export const SpendingTip: React.FC = () => {
  const [tip, setTip] = useState<SpendingTipResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTip = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchSpendingTip();
      setTip(response);
    } catch (error) {
      console.error('Failed to fetch spending tip:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTip();
  }, [fetchTip]);

  if (isLoading) {
    return (
      <div className="bg-neutral-000 p-4 rounded-lg shadow-card">
        <div className="flex items-center">
          <LightBulbIcon className="w-5 h-5 text-teal mr-3" />
          <LoadingSpinner size="sm" />
          <span className="ml-2 text-sm text-neutral-500">Loading tip...</span>
        </div>
      </div>
    );
  }

  if (!tip) {
    return null;
  }

  return (
    <div className="bg-neutral-000 p-4 rounded-lg shadow-card">
      <div className="flex items-start">
        <LightBulbIcon className="w-5 h-5 text-teal mr-3 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-navy mb-1">Spending Tip</h4>
          <p className="text-sm text-neutral-500">{tip.tip}</p>
        </div>
      </div>
    </div>
  );
};
