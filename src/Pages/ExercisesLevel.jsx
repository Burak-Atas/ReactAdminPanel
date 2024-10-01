import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ExerciseServices from '../Services/ExerciseServices';

export default function ExercisesLevel() {
  const { id } = useParams(); // URL'den id parametresini al
  const [exercises, setExercises] = useState([]); // exercises state'i tanımla
  const exrs = new ExerciseServices();
  const numericId = parseInt(id.split('-')[1], 10); 

  useEffect(() => {
    // '-' karakterinden sonraki kısmı al ve integer'a çevir
    console.log(numericId);

    exrs.getExercise(numericId).then((response) => {
      // response içindeki tüm name değerlerini al ve state'e ata
      const names = response.data.map(exercise => exercise.name);
      setExercises(names);
      console.log(names); // Gelen isimleri konsolda göster
    }).catch(error => {
      console.error("Error fetching exercises:", error); // Hata kontrolü
    });
  }, [numericId, exrs]);

  return (
    <div>
      <div className="h-32 flex items-center">
        <h2 className="text-3xl font-semibold">{numericId}. Seviye  Egzersizleri </h2>
      </div>
      <ul className='flex items-center flex-wrap'>
      {exercises.map((name, index) => (
  <Link 
    to={`/education/${numericId}/${name}`} 
    key={index} 
    className='w-44 h-16 flex items-center justify-center   border border-gray-300 m-2'
  >
    {name}
  </Link>
))}

      </ul>
    </div>
  );
}
