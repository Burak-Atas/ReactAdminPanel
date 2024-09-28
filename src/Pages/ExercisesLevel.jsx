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
      <ul>
        {exercises.map((name, index) => (
          <Link to={`/education/${name}`} key={index} className='block'>{name}</Link> // Her bir exercise name'i listele
        ))}
      </ul>
    </div>
  );
}
