import React, { useRef, useState, useEffect } from 'react'
import { Bar } from 'react-chartjs-2'
import { PDFDocument, rgb } from 'pdf-lib'
import { saveAs } from 'file-saver'
import html2canvas from 'html2canvas'
import fontkit from '@pdf-lib/fontkit'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)
const PDFGenerator = ({ selectedUser, formData }) => {
  const chart1Ref = useRef(null)
  const chart2Ref = useRef(null)
  const [showCharts, setShowCharts] = useState(false)
  const [pdfReady, setPdfReady] = useState(false)

  const generatePDF = async () => {
    try {
      // Var olan PDF'i yükle
      const existingPdfBytes = await fetch('/Report_Final.pdf').then((res) => {
        if (!res.ok) {
          throw new Error('PDF dosyası yüklenemedi')
        }
        return res.arrayBuffer()
      })

      const pdfDoc = await PDFDocument.load(existingPdfBytes)

      // Özel yazı tipini yükle
      pdfDoc.registerFontkit(fontkit)
      const fontBytes = await fetch('/Roboto-Bold.ttf').then((res) =>
        res.arrayBuffer()
      )
      const customFont = await pdfDoc.embedFont(fontBytes)

      const pages = pdfDoc.getPages()
      const firstPage = pages[0]
      const { width, height } = firstPage.getSize()

      // Öğrenci bilgileri ekleme
      firstPage.drawText(`Adı Soyadı: ${selectedUser.name}`, {
        x: 50,
        y: height - 100,
        size: 12,
        font: customFont,
        color: rgb(0, 0, 0),
      })
      firstPage.drawText(`Seviye: ${selectedUser.level}`, {
        x: 50,
        y: height - 120,
        size: 12,
        font: customFont,
        color: rgb(0, 0, 0),
      })
      firstPage.drawText(`Kurs Başlama Tarihi: ${selectedUser.startDate}`, {
        x: 350,
        y: height - 100,
        size: 12,
        font: customFont,
        color: rgb(0, 0, 0),
      })
      firstPage.drawText(`Kurs Bitiş Tarihi: ${selectedUser.endDate}`, {
        x: 350,
        y: height - 120,
        size: 12,
        font: customFont,
        color: rgb(0, 0, 0),
      })
      firstPage.drawText(`${selectedUser.teacher}`, {
        x: 265,
        y: height - 815,
        size: 12,
        font: customFont,
        color: rgb(0, 0, 0),
      })
      firstPage.drawText(
        `Egzersiz Tamamlama Oranı: %${formData.exerciseCompletionRateStart}`,
        {
          x: 50,
          y: height - 140,
          size: 12,
          font: customFont,
          color: rgb(0, 0, 0),
        }
      )
      // Tabloyu ekleme
      const tableYPosition = height - 200
      const tableData = [
        ['                 Değer', 'Başlangıç', 'Bitiş'],
        [
          'Sesli Okuma Hızı (Kelime/dk)',
          formData.readingSpeedStart,
          formData.readingSpeedEnd,
        ],
        [
          'Sessiz Okuma Hızı (Kelime/dk)',
          formData.silentReadingSpeedStart,
          formData.silentReadingSpeedEnd,
        ],
        [
          'Anlama Oranı (%)',
          formData.comprehensionRateStart,
          formData.comprehensionRateEnd,
        ],
        [
          'Okuma Hızı Artış Oranı (%)',
          formData.readingSpeedIncreaseRateStart,
          formData.readingSpeedIncreaseRateEnd,
        ],
      ]

      // Tablo stili
      const cellPadding = 10
      const borderWidth = 1
      const borderColor = rgb(0, 0, 0)

      // Sütun genişlikleri
      const columnWidths = [200, 100, 100]

      let tableWidth = columnWidths.reduce((sum, width) => sum + width, 0)
      let tableHeight =
        tableData.length * 20 + (tableData.length - 1) * cellPadding * 2

      // Tablonun x koordinatına eklenecek değer (pozitif değer sağa, negatif değer sola kaydırır)
      let tableXOffset = 10 // Örnek: tabloyu 50 piksel sağa kaydırır

      let x = 80 + tableXOffset // x koordinatını güncelle
      let y = tableYPosition

      // Tablo çizimi (sadece dış çerçeve)
      firstPage.drawRectangle({
        x: x,
        y: y - tableHeight,
        width: tableWidth,
        height: tableHeight,
        borderWidth: borderWidth,
        borderColor: borderColor,
      })

      // Dikey çizgiler
      // İlk dikey çizgi (Değer sütununun sonu)
      firstPage.drawLine({
        start: { x: x + columnWidths[0], y: y - tableHeight },
        end: { x: x + columnWidths[0], y: y },
        thickness: borderWidth,
        color: borderColor,
      })

      // İkinci dikey çizgi (Başlangıç sütununun sonu)
      firstPage.drawLine({
        start: {
          x: x + columnWidths[0] + columnWidths[1],
          y: y - tableHeight + 40,
        },
        end: { x: x + columnWidths[0] + columnWidths[1], y: y },
        thickness: borderWidth,
        color: borderColor,
      })

      let textXOffset = 10 // Örnek: metinleri 10 piksel sağa kaydırır

      tableData.forEach((row, rowIndex) => {
        let currentX = x

        row.forEach((cell, cellIndex) => {
          // Hücre çizimi
          firstPage.drawText(cell.toString(), {
            x: currentX + cellPadding + textXOffset, // x koordinatına ofset ekle
            y: y - cellPadding,
            size: 10,
            font: customFont,
            color: rgb(0, 0, 0),
          })

          currentX += columnWidths[cellIndex]
        })

        // Yatay çizgi çizimi (son satır hariç)
        if (rowIndex < tableData.length - 1) {
          firstPage.drawLine({
            start: { x: x, y: y - 20 },
            end: { x: x + tableWidth, y: y - 20 },
            thickness: borderWidth,
            color: borderColor,
          })
        }

        y -= 20 + cellPadding * 2
      })
      // Eğitici Görüşü ekleme
      firstPage.drawText(`Eğitici Görüşü`, {
        x: 250,
        y: y - 230,
        size: 12,
        font: customFont,
        color: rgb(0, 0, 0),
        style: 'underline',
      })
      firstPage.drawText(formData.instructorComments, {
        x: 50,
        y: y - 270,
        size: 10,
        font: customFont,
        color: rgb(0, 0, 0),
      })

      // Grafiklerin canvas görüntüsünü al ve PDF'e ekle
      const addChartToPDF = async (chartRef, yOffset, x) => {
        const canvas = await html2canvas(chartRef.current)
        const imgData = canvas.toDataURL('image/png')
        const img = await pdfDoc.embedPng(imgData)
        const imgDims = img.scale(0.4) // Grafik boyutunu küçült
        firstPage.drawImage(img, {
          x: x,
          y: yOffset,
          width: imgDims.width,
          height: imgDims.height,
        })
      }

      await addChartToPDF(chart1Ref, y - 160, 70)
      await addChartToPDF(chart2Ref, y - 160, 330)

      // PDF dosyasını kaydetme
      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      saveAs(blob, 'Report.pdf')
    } catch (error) {
      console.error('PDF oluşturma hatası:', error)
    }
  }

  useEffect(() => {
    if (showCharts) {
      // Grafikler gösterildikten sonra PDF hazır duruma getir
      setTimeout(() => {
        setPdfReady(true)
      }, 1000) // 1 saniye bekleme süresi, grafiklerin tamamen render edilmesi için
    } else {
      setPdfReady(false)
    }
  }, [showCharts])

  const chartData1 = {
    labels: ['Başlangıç', 'Bitiş'],
    datasets: [
      {
        label: 'Sessiz Okuma Hızı Artışı',
        data: [
          formData.silentReadingSpeedStart,
          formData.silentReadingSpeedEnd,
        ],
        backgroundColor: 'rgba(75,192,192,0.6)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  }

  const chartData2 = {
    labels: ['Başlangıç', 'Bitiş'],
    datasets: [
      {
        label: 'Anlama Oranı Artışı',
        data: [formData.comprehensionRateStart, formData.comprehensionRateEnd],
        backgroundColor: 'rgba(153,102,255,0.6)',
        borderColor: 'rgba(153,102,255,1)',
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="overflow-auto">
      <button
        onClick={generatePDF}
        className={`mt-4 bg-blue-500 text-white py-2 px-4 rounded ${
          !pdfReady ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={!pdfReady}
      >
        PDF Oluştur
      </button>
      <button
        onClick={() => setShowCharts(!showCharts)}
        className="mt-4 bg-green-500 text-white py-2 px-4 rounded ml-4"
      >
        {showCharts ? 'Grafikleri Kapat' : 'Grafikleri Gör'}
      </button>

      {showCharts && (
        <div className="relative flex flex-row">
          <div ref={chart1Ref} style={{ width: '50%', height: '150px' }}>
            <Bar data={chartData1} />
          </div>

          <div
            ref={chart2Ref}
            style={{ width: '50%', height: '150px' }}
            className="mt-4"
          >
            <Bar data={chartData2} />
          </div>
        </div>
      )}
    </div>
  )
}

export default PDFGenerator
