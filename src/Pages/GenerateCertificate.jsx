import React, { useEffect, useState } from 'react'
import { PDFDocument, rgb } from 'pdf-lib'
import { saveAs } from 'file-saver'
import UserServices from '../Services/UserServices'

const GenerateCertificate = () => {
  const [selectedStudent, setSelectedStudent] = useState('')
  const [students, setStudents] = useState([])


  const usr = new UserServices();
  useEffect(() => {
    usr
      .getUser()
      .then((response) => {
        
        setStudents(response.data)
        console.log(response.data.added)


      })
      .catch((error) => {
        console.error('Error fetching users:', error)
      })
  }, [])
  


  const handleGenerateCertificate = async () => {
    if (!selectedStudent) {
      alert('Please select a student')
      return
    }

    try {
      const response = await fetch('Certificate.pdf')
      if (!response.ok) {
        throw new Error('Failed to fetch the PDF file')
      }

      const existingPdfBytes = await response.arrayBuffer()

      const pdfDoc = await PDFDocument.load(existingPdfBytes)
      const pages = pdfDoc.getPages()
      const firstPage = pages[0]
      const { width, height } = firstPage.getSize()

      const selectedStudentData = students.find(
        (student) => student.name === selectedStudent
      )
      const studentName = selectedStudentData.name.toUpperCase()
      console.log(studentName)
      
      const instructorName = selectedStudentData.added.toUpperCase()
      console.log(instructorName)

      const yOffsetStudent = -20
      const yOffsetInstructor = -253
      firstPage.drawText(studentName, {
        x: width / 2 - 130,
        y: height / 2 + yOffsetStudent,
        size: 30,
        color: rgb(0, 0, 0),
      })

      firstPage.drawText(instructorName, {
        x: width / 2 + 10,
        y: height / 2 + yOffsetInstructor,
        size: 15,
        color: rgb(0, 0, 0),
      })

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const fileName = `${studentName}_${instructorName}_Certificate.pdf`
      saveAs(blob, fileName)
    } catch (error) {
      console.error('Error generating certificate:', error)
      alert('An error occurred while generating the certificate.')
    }
  }

  return (
    <div className="h-full w-full">
      <div className="h-32 flex items-center justify-between">
        <header className="text-3xl font-semibold">SERTİFİKA OLUŞTURMA</header>
      </div>
      <select
        value={selectedStudent}
        onChange={(e) => setSelectedStudent(e.target.value)}
      >
        <option value="">Select a student</option>
        {students.map((student, index) => (
          <option key={index} value={student.name}>
            {student.name}
          </option>
        ))}
      </select>
      <div className="flex items-center justify-center">
        <button
          className="mt-16 bg-blue-400 p-3 text-white rounded-xl"
          onClick={handleGenerateCertificate}
        >
          Sertifikayı Oluştur
        </button>
      </div>
    </div>
  )
}

export default GenerateCertificate
