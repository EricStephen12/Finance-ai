'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  DocumentArrowUpIcon,
  DocumentTextIcon,
  DocumentChartBarIcon,
  ArrowDownTrayIcon,
  CloudArrowUpIcon,
  ShieldCheckIcon,
  DocumentDuplicateIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'

interface UploadedFile {
  id: string
  name: string
  type: string
  size: number
  uploadDate: Date
  status: 'processing' | 'processed' | 'failed'
  insights?: {
    summary: string
    categories: string[]
    recommendations: string[]
  }
}

interface ProcessedData {
  id: string
  sourceFile: string
  type: 'report' | 'chart' | 'insights'
  format: 'pdf' | 'xlsx' | 'csv' | 'png'
  generatedDate: Date
  description: string
}

export default function OfflineDataVault() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [processedData, setProcessedData] = useState<ProcessedData[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    const newUploadedFiles: UploadedFile[] = files.map(file => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date(),
      status: 'processing'
    }))
    
    setUploadedFiles(prev => [...prev, ...newUploadedFiles])
    // Process files and generate insights
    await processFiles(newUploadedFiles)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    
    const files = Array.from(e.target.files)
    const newUploadedFiles: UploadedFile[] = files.map(file => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date(),
      status: 'processing'
    }))
    
    setUploadedFiles(prev => [...prev, ...newUploadedFiles])
    // Process files and generate insights
    await processFiles(newUploadedFiles)
  }

  const processFiles = async (files: UploadedFile[]) => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Update files with processed status and insights
    const processedFiles = files.map(file => ({
      ...file,
      status: 'processed' as const,
      insights: {
        summary: 'AI-generated summary of the financial data',
        categories: ['Income', 'Expenses', 'Investments'],
        recommendations: [
          'Consider increasing emergency fund',
          'Opportunity to optimize recurring expenses',
          'Potential tax deductions identified'
        ]
      }
    }))
    
    setUploadedFiles(prev => 
      prev.map(file => 
        processedFiles.find(p => p.id === file.id) || file
      )
    )

    // Generate processed data outputs
    const newProcessedData: ProcessedData[] = processedFiles.map(file => ([
      {
        id: Math.random().toString(36).substring(7),
        sourceFile: file.name,
        type: 'report',
        format: 'pdf',
        generatedDate: new Date(),
        description: 'Comprehensive financial analysis report'
      },
      {
        id: Math.random().toString(36).substring(7),
        sourceFile: file.name,
        type: 'chart',
        format: 'png',
        generatedDate: new Date(),
        description: 'Visual breakdown of spending categories'
      },
      {
        id: Math.random().toString(36).substring(7),
        sourceFile: file.name,
        type: 'insights',
        format: 'xlsx',
        generatedDate: new Date(),
        description: 'Detailed financial insights and recommendations'
      }
    ])).flat()

    setProcessedData(prev => [...prev, ...newProcessedData])
  }

  return (
    <div className="space-y-6 pt-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-xl p-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
              <ShieldCheckIcon className="h-6 w-6" />
              Offline Data Vault
            </h2>
            <p className="text-primary-100">
              Securely upload and process your financial data offline
            </p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-500'
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleFileDrop}
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <CloudArrowUpIcon className="h-12 w-12 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Upload Your Financial Data</h3>
            <p className="text-sm text-gray-500 mt-1">
              Drag and drop your files here, or click to select files
            </p>
          </div>
          <div className="flex justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <DocumentTextIcon className="h-4 w-4" /> Excel
            </span>
            <span className="flex items-center gap-1">
              <DocumentDuplicateIcon className="h-4 w-4" /> CSV
            </span>
            <span className="flex items-center gap-1">
              <PhotoIcon className="h-4 w-4" /> Images
            </span>
          </div>
          <div>
            <input
              type="file"
              multiple
              accept=".xlsx,.xls,.csv,.pdf,.png,.jpg,.jpeg"
              className="hidden"
              id="file-upload"
              onChange={handleFileSelect}
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 cursor-pointer"
            >
              Select Files
            </label>
          </div>
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Files</h3>
          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DocumentTextIcon className="h-6 w-6 text-gray-400" />
                    <div>
                      <h4 className="font-medium text-gray-900">{file.name}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(file.uploadDate).toLocaleDateString()} • {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <div className={`text-sm ${
                    file.status === 'processed' ? 'text-green-600' :
                    file.status === 'processing' ? 'text-amber-600' :
                    'text-red-600'
                  }`}>
                    {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                  </div>
                </div>
                {file.insights && (
                  <div className="mt-3 pl-9">
                    <div className="text-sm text-gray-600">{file.insights.summary}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {file.insights.categories.map((category, index) => (
                        <span key={index} className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Processed Data */}
      {processedData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Reports & Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {processedData.map((data) => (
              <motion.div
                key={data.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    data.type === 'report' ? 'bg-blue-100 text-blue-600' :
                    data.type === 'chart' ? 'bg-green-100 text-green-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {data.type === 'report' && <DocumentTextIcon className="h-5 w-5" />}
                    {data.type === 'chart' && <DocumentChartBarIcon className="h-5 w-5" />}
                    {data.type === 'insights' && <DocumentArrowUpIcon className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{data.description}</h4>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <ArrowDownTrayIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(data.generatedDate).toLocaleDateString()} • {data.format.toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Source: {data.sourceFile}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 